<div align="center">

# 🚀 DevJournal

### A Full-Stack AI-Powered Developer Productivity Platform

Track your coding journey, manage goals, write journals, organize resources, save code snippets, and gain AI-powered insights—all in one place.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)
![Express](https://img.shields.io/badge/Express.js-4-black)

</div>

---

## 📖 Overview

DevJournal is a modern full-stack web application designed to help developers organize their learning journey and improve productivity.

Instead of managing notes, goals, resources, and code snippets across multiple platforms, DevJournal provides a centralized workspace with AI-assisted features to help developers stay organized and focused.

---

# ✨ Features

## 📔 Smart Journal

- Create and manage daily developer journals
- Rich markdown support
- Track coding progress
- Organize entries chronologically

---

## 🎯 Goal Management

- Create learning goals
- Track completion status
- Organize short-term and long-term objectives
- Monitor progress visually

---

## 🗺️ Learning Roadmaps

- Create personalized learning roadmaps
- Organize topics into structured milestones
- Track roadmap completion

---

## 📚 Resource Library

Save and organize:

- Documentation
- YouTube tutorials
- Articles
- GitHub repositories
- Learning resources

---

## 💻 Code Snippets

- Save reusable code snippets
- Organize snippets by language
- Quick searching and retrieval

---

## 📊 Analytics Dashboard

Visual insights including:

- Productivity statistics
- Journal activity
- Goal completion
- Learning progress
- Developer activity overview

---

## 🤖 AI Features

Powered by **Google Gemini AI**

- AI-assisted writing
- Smart suggestions
- Developer productivity assistance
- Intelligent content generation

---

## 🔐 Authentication

- JWT Authentication
- Secure Password Hashing
- Cookie-based Authentication
- Protected Routes

---

# 🛠 Tech Stack

## Frontend

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- DaisyUI
- Recharts
- Motion

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Helmet
- CORS
- Express Rate Limit

---

## AI

- Google Gemini API

---

## Cloud

- Cloudinary (Media Storage)

---

# 📂 Project Structure

```
DevJournal/
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── db.ts
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   └── assets/
│
├── dist/
├── server.ts
├── package.json
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/DEVJOURNAL.git

cd DEVJOURNAL
```

---

## Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

JWT_REFRESH_SECRET=your_refresh_secret

GEMINI_API_KEY=your_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
```

---

## Run Development Server

```bash
npm run dev
```

---

## Build Project

```bash
npm run build
```

---

## Run Production Server

```bash
npm start
```

---

# 📡 API Routes

| Route | Description |
|--------|-------------|
| `/api/auth` | Authentication |
| `/api/journal` | Journal Management |
| `/api/goals` | Goals |
| `/api/resources` | Learning Resources |
| `/api/snippets` | Code Snippets |
| `/api/roadmaps` | Learning Roadmaps |
| `/api/analytics` | Analytics |
| `/api/health` | Health Check |

---

# 🔒 Security

- JWT Authentication
- Password Hashing using bcrypt
- HTTP Security Headers (Helmet)
- Rate Limiting
- Secure Cookies
- Environment Variables

---

# 🚀 Deployment

This application can be deployed on:

- Render
- Railway
- DigitalOcean
- AWS EC2
- Azure App Service

---

# 📸 Screenshots

> Add screenshots here after deployment.

Example:

```
screenshots/

Home.png

Dashboard.png

Journal.png

Analytics.png
```

---

# 📈 Future Enhancements

- AI Learning Recommendations
- Dark / Light Themes
- Real-time Notifications
- Collaborative Journals
- Calendar Integration
- Markdown Editor
- GitHub Integration
- Coding Activity Tracking
- Daily Streak System

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Priyanshu Mudgal**

MCA Student — National Institute of Technology Kurukshetra

GitHub: https://github.com/Priyan5huMudgal

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a Star!

Made with ❤️ by Priyanshu Mudgal

</div>
