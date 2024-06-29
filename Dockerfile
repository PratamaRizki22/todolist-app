FROM node:20

RUN rm -rf /var/lib/apt/lists/* /var/lib/dpkg/info/*

RUN apt-get update \
    && apt-get install -y --reinstall dpkg

RUN dpkg --clear-avail \
    && apt-get update


RUN apt-get update && apt-get install -y sqlite3

WORKDIR /app

COPY app/backend ./backend
COPY app/frontend ./frontend

RUN cd backend && npm install

RUN cd frontend && npm install

RUN npm install -g serve

RUN npm install -g pm2


# EXPOSE 3000
# EXPOSE 5000


# Salin file proses PM2
COPY ecosystem.config.js .

# Jalankan server backend dan frontend menggunakan PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
