<div align="center">

# 🚀 DevJournal

### A Full-Stack Developer Productivity & Learning Management Platform

DevJournal is a modern web application built for developers to organize their learning journey, document daily progress, manage goals, save useful resources, store reusable code snippets, and monitor productivity through an interactive dashboard.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-4-black?style=for-the-badge&logo=express"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
</p>

### 🌐 Live Demo

**https://devjournal-hq11.onrender.com**

</div>

---

# 📖 About DevJournal

Developers often use multiple applications to maintain notes, track learning goals, bookmark useful resources, save code snippets, and monitor their progress. Switching between different tools can interrupt workflow and make learning difficult.

**DevJournal** solves this problem by providing a centralized workspace where developers can manage everything related to their learning and productivity from a single dashboard.

The application enables users to maintain personal journals, create learning goals, organize educational resources, build learning roadmaps, save reusable code snippets, and visualize their progress through interactive analytics. It is designed with a clean, responsive interface to provide a seamless experience across desktop and mobile devices.

---

# ✨ Features

## 🔐 Authentication

- Secure user registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected API routes
- Persistent user sessions

---

## 📔 Journal Management

- Create personal developer journals
- Edit existing journal entries
- Delete journals
- Organize learning notes
- Track daily coding progress

---

## 🎯 Goal Management

- Create personal learning goals
- Track progress
- Update goal status
- Mark goals as completed
- Organize short-term and long-term objectives

---

## 🗺️ Learning Roadmaps

- Create customized learning roadmaps
- Organize milestones
- Track roadmap completion
- Manage learning plans efficiently

---

## 📚 Resource Library

Store and organize:

- Documentation
- Articles
- Tutorials
- GitHub repositories
- Learning references
- Useful links

---

## 💻 Code Snippet Manager

- Save reusable code snippets
- Organize snippets by language
- Quickly search saved snippets
- Manage frequently used code

---

## 📊 Analytics Dashboard

Visualize your productivity through:

- Journal statistics
- Goal completion statistics
- Learning activity overview
- Interactive charts
- Progress tracking

---

## 📱 Responsive Design

- Mobile-friendly interface
- Responsive layouts
- Modern UI using Tailwind CSS and DaisyUI
- Smooth user experience across all devices

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
- JWT Authentication
- bcrypt
- Helmet
- CORS
- Express Rate Limiting

---

## Development Tools

- Git
- GitHub
- VS Code
- npm

---

# 📂 Project Structure

```text
DEVJOURNAL
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── db.ts
│   └── utils/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── assets/
│   ├── context/
│   └── utils/
│
├── public/
├── server.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/Priyan5huMudgal/DEVJOURNAL.git

cd DEVJOURNAL
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a **.env** file in the project root.

```env
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

JWT_REFRESH_SECRET=your_refresh_secret

NODE_ENV=development
```

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to generate access tokens |
| `JWT_REFRESH_SECRET` | Secret key used to generate refresh tokens |
| `NODE_ENV` | Application environment (`development` or `production`) |

---

## Run Development Server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

## Build the Project

```bash
npm run build
```

---

## Run Production Server

```bash
npm start
```

---

# 📡 API Endpoints

| Endpoint | Description |
|-----------|-------------|
| `/api/auth` | User Authentication |
| `/api/journal` | Journal Management |
| `/api/goals` | Goal Management |
| `/api/roadmaps` | Roadmap Management |
| `/api/resources` | Resource Management |
| `/api/snippets` | Code Snippet Management |
| `/api/analytics` | Analytics Dashboard |
| `/api/health` | Server Health Check |

---

# 🔒 Security

- JWT Authentication
- Password Hashing using bcrypt
- HTTP Security Headers (Helmet)
- CORS Protection
- Rate Limiting
- Environment Variable Configuration

---

# 🌐 Live Application

**Application:** https://devjournal-hq11.onrender.com

---

# 📈 Future Enhancements

- 🌙 Dark / Light Theme
- 📅 Calendar Integration
- 🔔 Notifications & Reminders
- 📝 Rich Markdown Editor
- 📌 Tags & Categories
- 📥 Import & Export Journals
- 🔍 Advanced Search & Filtering
- 🏆 Daily Learning Streaks
- 📈 Advanced Productivity Insights
- 🔗 GitHub Activity Integration

---

# 📸 Screenshots

> Screenshots will be added soon.

```
screenshots/
│
├── Home.png
├── Login.png
├── Dashboard.png
├── Journal.png
├── Goals.png
├── Resources.png
├── Snippets.png
└── Analytics.png
```

---

# 🚀 Deployment

The application is deployed on Render.

**Live URL:**

https://devjournal-hq11.onrender.com

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add feature"
```

4. Push the branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Priyanshu Mudgal**

Master of Computer Applications (MCA)

National Institute of Technology Kurukshetra

GitHub: **https://github.com/Priyan5huMudgal**

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star!

Made with ❤️ by **Priyanshu Mudgal**

</div>
