# InTime ⏰

A web-based task management and collaboration platform for teams and individuals. Team leaders assign tasks with deadlines to their teams, while members can also manage personal tasks outside of team projects. Supports multiple team memberships and real-time team chat.

## ✨ Features

- **Task management** — create, assign, and track tasks with deadlines and priorities
- **Team projects** — team leaders assign tasks to members across multiple teams
- **Real-time chat** — in-app team communication powered by Socket.IO
- **Kanban board & calendar** — visualize tasks by status or by date
- **Push notifications** — stay on top of deadlines and updates
- **Profile & stats** — progress tracking with D3-powered charts
- **Authentication** — sign up, sign in, OTP verification, and password reset flows

## 🛠 Tech Stack

- **React 18** with React Router
- **Redux Toolkit** for state management
- **Socket.IO** for real-time chat
- **Material UI (MUI)** + custom CSS
- **D3.js** for charts
- **Axios** for REST API integration

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm start

# Build for production
npm run build
```

The app runs at `http://localhost:3000`.

## 📂 Project Structure

```
src/
├── apis/        # API layer (Axios)
├── components/  # Reusable UI components
├── features/    # Feature modules
├── hooks/       # Custom React hooks
├── pages/       # Route pages (Tasks, Projects, Chat, Calendar, ...)
├── redux/       # Redux Toolkit store & slices
└── css/         # Stylesheets
```

## 👤 Author

**Abdallah Taha** — Frontend Developer
[LinkedIn](https://www.linkedin.com/in/abdallah-taha-456950299/) · [GitHub](https://github.com/AbdallahAhmedHamda)
