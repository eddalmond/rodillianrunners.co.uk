# Two-stage build for Rodillian Runners static site.
# Stage 1: Hugo extended (SCSS support) builds the site from source
# Stage 2: nginx-alpine serves the pre-built static files
#
# Build triggers: scripts/fetch-calendar.sh pre-fetches Google Calendar ICS
# to avoid CORS issues at runtime.

# --- Stage 1: Hugo builder ---
FROM peaceiris/hugo:v0.145.0-full AS builder

WORKDIR /src

# peaceiris/hugo is Debian-based (Alpine apk would fail). bash+curl usually present,
# but ensure just in case the base image is minimal.
RUN apt-get update -qq && apt-get install -y --no-install-recommends bash curl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy source — order matters for Docker layer caching
# 1. Theme (changes rarely)
COPY themes/ /src/themes/
# 2. Config and content (changes more often)
COPY hugo.toml /src/
COPY content/ /src/content/
COPY data/ /src/data/
COPY scripts/ /src/scripts/
# 3. Project-level static/ (currently only the Sveltia CMS admin shell
#    at static/admin/). Theme static assets live at themes/rodillian/static/.
#    Do not add layouts/, assets/, i18n/ here — those directories are
#    intentionally absent (empty in git, would break the COPY).
COPY static/ /src/static/

# Pre-fetch the Google Calendar ICS feed (avoids CORS at runtime)
RUN bash scripts/fetch-calendar.sh

# Build the site with minification
RUN hugo --minify --cleanDestinationDir

# --- Stage 2: nginx runtime ---
FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Copy built site from builder
COPY --from=builder /src/public/ /usr/share/nginx/html/

# Hugo writes files with restrictive perms (0600); nginx runs as 'nginx' user
# so it can't read them. Fix perms so all files are world-readable.
RUN find /usr/share/nginx/html -type f -exec chmod 0644 {} \;
RUN find /usr/share/nginx/html -type d -exec chmod 0755 {} \;

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
