# 🔌 Next.js WebSocket Chat App

A clean and modern real-time chat application built with **Next.js** and **WebSockets**. Since WebSockets can't be handled via traditional API routes in Next.js, this project demonstrates how to implement a **custom WebSocket server** alongside a Next.js frontend.

> 🌟 Perfect for learning how to integrate WebSockets with Next.js in a scalable and efficient way.

---

## 🚀 Features

- 📡 WebSocket server separated from Next.js API routes
- 🧑‍🤝‍🧑 Join dynamic rooms with unique user IDs
- 💬 Real-time communication between multiple users
- 🛠️ Easy local development setup
- 🌐 URL-based room and user management

---

## 🔧 Commands

| Command             | Description                        |
|---------------------|------------------------------------|
| `yarn dev`          | Starts the Next.js development server on `http://localhost:3000` |
| `yarn dev:socket`   | Starts the WebSocket server on `ws://localhost:3001` |

> 💡 Make sure to run **both servers** for the app to function correctly.

---

## 🧑‍💻 Usage

To connect to a chat room, simply visit the app with the following URL pattern:





### Rules:

- Users must share the **same `roomId`** to chat with each other.
- Each user should have a **unique `userId`** within a room.
- If two users join the same `roomId` with different `userId`s, they can chat in real-time.

---


---

## 📦 Tech Stack

- [Next.js](https://nextjs.org/)
- [Node.js](https://nodejs.org/)
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- Yarn

---

## 📸 Screenshots

> _You can add screenshots or gifs here for better visual reference._

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the app, feel free to fork the repo and submit a pull request.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

## 🌍 Author

Made with 💜 by **Muhammad Ahmed AKA Khalizero**

