# Gunakan image Node.js sebagai base image
FROM node:20

# Instal SQLite
RUN apt-get update && apt-get install -y sqlite3

# Buat direktori kerja untuk aplikasi
WORKDIR /app

# Salin kode frontend dan backend ke direktori kerja
COPY app/backend ./backend
COPY app/frontend ./frontend

# Instal dependencies backend
RUN cd backend && npm install

# Instal dependencies frontend
RUN cd frontend && npm install

# Ekspose port yang akan digunakan oleh aplikasi
EXPOSE 3000
EXPOSE 5000

# Instal PM2 untuk menjalankan beberapa aplikasi
RUN npm install -g pm2

# Salin file proses PM2
COPY ecosystem.config.js .

# Jalankan server backend dan frontend menggunakan PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
