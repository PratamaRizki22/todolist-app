# Gunakan image Node.js sebagai base image
FROM node:20

# Instal SQLite
RUN apt-get update && apt-get install -y sqlite3

# Buat direktori kerja untuk aplikasi
WORKDIR /app

# Salin kode frontend dan backend ke direktori kerja
COPY backend ./backend
COPY frontend ./frontend

# Instal dependencies backend
RUN cd backend && npm install

# Bangun aplikasi frontend
RUN cd frontend && npm install && npm run build

# Salin hasil build frontend ke direktori backend public
RUN cp -r frontend/build backend/public

# Ekspose port yang akan digunakan oleh aplikasi
EXPOSE 5000

# Jalankan server backend
CMD ["node", "backend/index.js"]
