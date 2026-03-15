# GuideAI — Your Personal Study Assistant

GuideAI is a fullstack AI-powered tutoring application that helps students and learners understand any topic through structured, conversational explanations.

Built by **Chinonso Faithful Chinatuka**

---

## What It Does

When you ask GuideAI about any topic, it responds with a consistent educational structure:

1. **Definition** — A clear explanation of what the topic is
2. **Simple Explanation** — A beginner-friendly breakdown
3. **Real Life Example** — A practical, relatable example
4. **Key Points** — A summary of the most important things to remember

You can then ask follow-up questions and GuideAI will respond directly without repeating the full structure — just like a real tutor.

---

## Features

- Structured AI responses for any topic
- Full conversation history — ask follow-up questions freely
- Chat persists across page refreshes (localStorage)
- Markdown rendering for formatted responses
- Copy button on every AI response
- Typing indicator while AI is generating
- Dark / Light / System theme support
- Theme persists across sessions
- Clear chat button
- Mobile-friendly layout
- Enter to send, Shift+Enter for new line
- Auto-resizing input textarea

---

## Tech Stack

### Frontend

- React 18
- Tailwind CSS v4
- ReactMarkdown + Tailwind Typography
- Vite

### Backend

- Node.js
- Express
- GitHub AI Inference API (GPT-4o-mini)
- Azure AI Inference SDK
- dotenv

---

## Project Structure

```
GuideAI/
├── backend/
│   ├── index.js
│   ├── package.json
│   └── .env          # not committed
│
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── StudyInput.jsx
│   │   └── StudyResponse.jsx
│   ├── context/
│   │   ├── ChatContext.jsx
│   │   └── ThemeContext.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
│   └── guideai-logo.png
│
├── index.html
├── package.json
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A GitHub Personal Access Token with access to GitHub Models

### 1. Clone the repository

```bash
git clone https://github.com/chinatukachinonsofaithful/guideai.git
cd guideai
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Set up environment variables

Create a `.env` file inside the `backend` folder:

```
GITHUB_TOKEN=your_github_token_here
PORT=5000
```

### 5. Start the backend

```bash
cd backend
npm run dev
```

### 6. Start the frontend

```bash
# In a separate terminal, from the project root
npm run dev
```

### 7. Open the app

Visit `http://localhost:5173` in your browser.

---

## Deployment

- **Frontend:** Deployed on [Vercel](https://vercel.com)
- **Backend:** Deployed on [Render](https://render.com)

---

## Developer

**Chinonso Faithful Chinatuka**  
GitHub: [@chinatukachinonsofaithful](https://github.com/chinatukachinonsofaithful)

---
