// Rodillian Runners — Calendar widget
// Fetches a public ICS feed from Google Calendar and renders a single month
// with prev/next navigation. No framework, no auth, ~3KB.

(function () {
  const root = document.getElementById('rodillian-calendar');
  if (!root) return;

  const ICS_URL = root.dataset.icsUrl || '/calendar.ics';
  const TITLE = root.dataset.calendarTitle || 'Calendar';

  // --- ICS parsing ---
  // Minimal parser: extracts VEVENT blocks and the fields we care about.
  // Handles RRULE expansion for monthly/yearly recurring events.
  function parseICS(text) {
    const events = [];
    const blocks = text.split('BEGIN:VEVENT').slice(1);
    for (const block of blocks) {
      const ev = {};
      const end = block.indexOf('END:VEVENT');
      const body = end >= 0 ? block.slice(0, end) : block;
      const lines = body.split(/\r?\n/);
      for (const line of lines) {
        const colon = line.indexOf(':');
        if (colon < 0) continue;
        const key = line.slice(0, colon).split(';')[0];
        const val = line.slice(colon + 1);
        if (key === 'SUMMARY') ev.summary = val;
        else if (key === 'DESCRIPTION') ev.description = val;
        else if (key === 'LOCATION') ev.location = val;
        else if (key === 'STATUS') ev.status = val;
        else if (key === 'DTSTART') {
          ev.start = parseDate(line.slice(colon + 1));
        } else if (key === 'DTEND') {
          ev.end = parseDate(line.slice(colon + 1));
        } else if (key === 'RRULE') {
          ev.rrule = line.slice(colon + 1);
        } else if (key === 'EXDATE') {
          ev.exdates = ev.exdates || [];
          ev.exdates.push(parseDate(line.slice(colon + 1)));
        }
      }
      if (ev.start) events.push(ev);
    }
    return events;
  }

  function parseDate(raw) {
    // Match either YYYYMMDD or YYYYMMDDTHHMMSS, optional Z suffix, optional TZID before colon
    const m = raw.match(/(\d{8})(?:T(\d{6}))?(Z)?/);
    if (!m) return null;
    const [, date, time, utc] = m;
    const y = +date.slice(0, 4);
    const mo = +date.slice(4, 6) - 1;
    const d = +date.slice(6, 8);
    if (!time) return new Date(y, mo, d);
    const hh = +time.slice(0, 2);
    const mm = +time.slice(2, 4);
    const ss = +time.slice(4, 6);
    if (utc) return new Date(Date.UTC(y, mo, d, hh, mm, ss));
    return new Date(y, mo, d, hh, mm, ss);
  }

  function expandRecurring(event, rangeStart, rangeEnd) {
    if (!event.rrule) {
      return [event];
    }
    const out = [];
    const rule = {};
    event.rrule.split(';').forEach(p => {
      const [k, v] = p.split('=');
      if (k && v) rule[k] = v;
    });
    const freq = rule.FREQ;
    const interval = parseInt(rule.INTERVAL || '1', 10);
    const byday = rule.BYDAY ? rule.BYDAY.split(',') : null;
    const until = rule.UNTIL ? parseDate(rule.UNTIL) : null;

    if (freq === 'MONTHLY' && byday) {
      // BYDAY with MONTHLY: nth weekday of the month (e.g. 3TU = third Tuesday)
      const nthMap = { '1': 0, '2': 1, '3': 2, '4': 3, '-1': -1 };
      const dayMap = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
      const spec = byday[0];
      const nth = nthMap[spec.replace(/[A-Z]+/, '')];
      const day = dayMap[spec.replace(/[-0-9]/g, '')];
      const originalDay = event.start.getDay();
      // Anchor on the original event's month/year so we have a sensible start
      let cur = new Date(event.start.getFullYear(), event.start.getMonth(), 1);
      const safety = 600; // ~50 years max
      let i = 0;
      while (i < safety) {
        const occurrence = nthWeekdayOf(cur.getFullYear(), cur.getMonth(), day, nth);
        if (occurrence >= event.start) {
          const ex = (event.exdates || []).some(exd => sameDay(exd, occurrence));
          if (!ex && occurrence <= rangeEnd && (!until || occurrence <= until)) {
            const occ = Object.assign({}, event, { start: occurrence });
            out.push(occ);
          }
        }
        cur.setMonth(cur.getMonth() + interval);
        if (occurrence > rangeEnd && (!until || cur > until)) break;
        i++;
      }
    } else if (freq === 'WEEKLY') {
      // Weekly recurrence, same day-of-week as DTSTART
      let cur = new Date(event.start);
      cur.setHours(0, 0, 0, 0);
      const safety = 500;
      let i = 0;
      while (cur <= rangeEnd && i < safety) {
        if (cur >= event.start && cur <= rangeEnd) {
          if (!until || cur <= until) out.push(Object.assign({}, event, { start: new Date(cur) }));
        }
        cur.setDate(cur.getDate() + 7 * interval);
        i++;
      }
    } else if (freq === 'YEARLY') {
      let cur = new Date(event.start);
      const safety = 50;
      let i = 0;
      while (cur <= rangeEnd && i < safety) {
        if (cur <= rangeEnd) out.push(Object.assign({}, event, { start: new Date(cur) }));
        cur.setFullYear(cur.getFullYear() + interval);
        i++;
      }
    }
    return out;
  }

  function nthWeekdayOf(year, monthIdx, weekday, nth) {
    const first = new Date(year, monthIdx, 1);
    const firstDow = first.getDay();
    let day = 1 + ((7 + weekday - firstDow) % 7);
    if (nth >= 0) day += nth * 7;
    else {
      // Last occurrence: start from end of month
      const last = new Date(year, monthIdx + 1, 0).getDate();
      const lastDow = new Date(year, monthIdx, last).getDay();
      day = last - ((7 + lastDow - weekday) % 7);
    }
    return new Date(year, monthIdx, day);
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  // --- Render ---
  let allEvents = [];
  let currentMonth = new Date();
  currentMonth.setDate(1);

  function render() {
    const monthStart = new Date(currentMonth);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const monthName = currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    const rangeStart = new Date(currentMonth);
    rangeStart.setMonth(rangeStart.getMonth() - 1);
    const rangeEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 2, 0);

    const expanded = [];
    for (const ev of allEvents) {
      expanded.push(...expandRecurring(ev, rangeStart, rangeEnd));
    }
    const monthEvents = expanded
      .filter(ev => ev.start >= monthStart && ev.start <= monthEnd)
      .sort((a, b) => a.start - b.start);

    const canGoBack = true; // unlimited past navigation
    const canGoForward = currentMonth < new Date(new Date().getFullYear() + 2, 0, 1);

    let html = `
      <nav class="calendar-nav" aria-label="Calendar navigation">
        <button id="cal-prev"${canGoBack ? '' : ' disabled'}>‹ Previous</button>
        <h2>${monthName}</h2>
        <button id="cal-next"${canGoForward ? '' : ' disabled'}>Next ›</button>
      </nav>
    `;

    if (monthEvents.length === 0) {
      html += `<div class="calendar-empty">No events scheduled this month. Check back later, or see upcoming months →</div>`;
    } else {
      html += `<ul class="calendar-events">`;
      for (const ev of monthEvents) {
        const cancelled = ev.status === 'CANCELLED';
        const when = ev.start.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
        const time = ev.start.getHours() !== 0 || ev.start.getMinutes() !== 0
          ? ev.start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          : '';
        const where = ev.location ? `<p class="event-where">📍 ${escapeHtml(ev.location)}</p>` : '';
        const desc = ev.description ? `<div class="event-desc">${ev.description.replace(/\n/g, '<br>')}</div>` : '';
        html += `
          <li class="calendar-event${cancelled ? ' cancelled' : ''}">
            <h3>${cancelled ? 'Cancelled: ' : ''}${escapeHtml(ev.summary || 'Untitled event')}</h3>
            <p class="event-when">🕒 ${when}${time ? ' at ' + time : ''}</p>
            ${where}
            ${desc}
          </li>
        `;
      }
      html += `</ul>`;
    }

    root.innerHTML = html;

    document.getElementById('cal-prev').addEventListener('click', () => {
      currentMonth.setMonth(currentMonth.getMonth() - 1);
      render();
    });
    document.getElementById('cal-next').addEventListener('click', () => {
      currentMonth.setMonth(currentMonth.getMonth() + 1);
      render();
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --- Boot ---
  root.innerHTML = '<div class="calendar-loading">Loading calendar…</div>';

  fetch(ICS_URL)
    .then(r => r.ok ? r.text() : Promise.reject(new Error('HTTP ' + r.status)))
    .then(text => {
      allEvents = parseICS(text);
      render();
    })
    .catch(err => {
      root.innerHTML = `
        <div class="calendar-empty">
          <p>Could not load the calendar right now.</p>
          <p style="font-size: 0.85rem; margin-top: 0.5rem;">${escapeHtml(err.message)}</p>
          <p style="font-size: 0.85rem; margin-top: 0.5rem;">
            Try the <a href="https://calendar.google.com/calendar/ical/6jcd9u7log0u6clot6kduuntms%40group.calendar.google.com/public/basic.ics">raw ICS feed</a>
            or the Google Calendar directly.
          </p>
        </div>
      `;
    });
})();
