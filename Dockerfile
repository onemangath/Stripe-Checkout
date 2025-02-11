# ใช้ Node.js เวอร์ชัน 20
FROM node:22

# ตั้งค่าโฟลเดอร์ทำงานใน Container
WORKDIR /app

# คัดลอก package.json และติดตั้ง dependencies
COPY package.json package-lock.json ./
RUN npm install

# คัดลอกไฟล์โค้ดทั้งหมด
COPY . .

# เปิดพอร์ต 3000
EXPOSE 3000

# คำสั่งรันเซิร์ฟเวอร์
CMD ["node", "server.js"]
