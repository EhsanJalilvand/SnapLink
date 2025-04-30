## 📌 SnapLink — Simple, Fast & Multilingual URL Shortener

**Live Demo:** 🌐 [https://snaplink.ink](https://snaplink.ink)

SnapLink is a lightweight, multilingual, and scalable URL shortening service built with **Node.js**, **MongoDB**, and clean **MVC architecture**. It offers essential link management features for both personal and commercial use.

---

## 📦 Features

- ✅ Shorten URLs instantly  
- ✅ Full multilingual support via dynamic headers (no URL changes needed)  
- ✅ Google OAuth login  
- ✅ Secure email notifications for password resets and signup confirmations  
- ✅ Stats tracking for links  
- ✅ Clean RESTful API structure  
- ✅ Dockerized for easy deployment  

---

## 🌐 Multilingual System

SnapLink supports multiple languages by detecting language via the `Accept-Language` HTTP header or custom meta tags, without changing the URL structure.  
This makes it lightweight and user-friendly for international audiences.

---

## 📂 Installation & Run

1️⃣ Clone the repository:
```bash
git clone https://github.com/EhsanJalilvand/SnapLink.git
cd SnapLink
```

2️⃣ Install dependencies:
```bash
npm install
```

3️⃣ Create `.env` file:

```
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://admin:admin@localhost:27017/snaplink
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 📧 Gmail Email Configuration

To send emails via personal Gmail:

1. Enable **2-Step Verification**
2. Create an **App Password**
3. Use that app password as `EMAIL_PASS` in your `.env`

[Guide: Create an App Password](https://support.google.com/accounts/answer/185833)

---

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **OAuth consent screen** and set **Authorized Redirect URIs**:  
   `https://snaplink.ink/auth/google/callback` (for production)  
   `http://localhost:3000/auth/google/callback` (for local)

4. Create **OAuth client ID**  
5. Add the keys to `.env`

---

## 🐳 Docker Support

**Dockerfile**
```Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

**Build & Run**
```bash
docker build -t snaplink .
docker run -d -p 3000:3000 --env-file .env --name snaplink-app snaplink
```

Now visit: [http://localhost:3000](http://localhost:3000)

---

## 📌 Notes

- Compatible with **MongoDB Atlas** for cloud deployment  
- Clean **MVC pattern** for scalability  
- Codebase is clean and documented

