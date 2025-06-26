# English Quest

**English Quest** is an interactive English learning platform designed to make language acquisition engaging, effective, and accessible. By combining gamified learning experiences with AI-powered assistance, English Quest transforms traditional education into an immersive journey.

---

## 🚀 Key Features

- **Interactive Lessons**  
  Engage with a diverse range of exercises including vocabulary drills, fill-in-the-blank challenges, and listening comprehension tasks.

- **Gamified Learning System**  
  Stay motivated through our heart-based life system, daily streak tracking, and a global leaderboard for competitive learners.

- **AI Chat Tutor**  
  Receive instant feedback and assistance from an intelligent chat tutor powered by AI.

- **Flexible Subscription Plans**  
  Choose the plan that best fits your learning style:
    - **Free:** Limited lesson access with advertisements.
    - **Support:** Expanded content access with ads removed.
    - **Premium:** Unlimited access to all lessons and premium features, including unrestricted AI tutor support.

- **Secure Payment Integration**  
  Subscribe safely through integrated [VNPAY](https://vnpay.vn/) checkout.

- **User Authentication & Progress Tracking**  
  Monitor your learning journey and review your progress over time.

---

## 🛠️ Tech Stack

### Frontend
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### Backend
- [ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet)
- [MongoDB](https://www.mongodb.com/)

---

## 📦 Getting Started

Follow these steps to set up the project locally:

### Prerequisites

Ensure the following are installed on your machine:
- [Node.js](https://nodejs.org/)
- [.NET SDK](https://dotnet.microsoft.com/download)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Goatt69/english-quest.git
   ```
   
   ```bash
   cd english-quest
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Set up the backend:**

   Clone and follow the setup instructions from the backend repository: https://github.com/Goatt69/Image_English

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Visit [http://localhost:3000](http://localhost:3000)

---

## 🌱 Contributing

We welcome contributions from the community!

To contribute:

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add AmazingFeature'
   ```
4. Push to GitHub
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

---

## 📁 Project Structure

```
english_quest/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js route-based pages
│   ├── components/          # Reusable UI and logic components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # API and utility functions
│   ├── stores/              # Zustand store for state management
│   ├── style/               # Global and modular styles
│   └── types/               # TypeScript definitions
├── package.json             # Frontend dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── next.config.ts           # Next.js configuration
└── README.md                # Project overview
```

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.
