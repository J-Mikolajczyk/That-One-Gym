# 🏋️ That One Gym

**That One Gym** is a web application that helps users find gyms based on the equipment they want to train with. Whether you're looking for a power rack, a belt squat machine, or calibrated plates, this app helps lifters locate the perfect gym — verified by the strength community.

> ⚠️ This project is a **work in progress** and under active development. Features are being added weekly.

---

## ✨ Features

- 🔍 Search gyms by name, city, or ZIP
- 🏋️ Filter gyms by equipment (e.g., deadlift platform, hack squat, etc.)
- ✅ Equipment lists are **user-verified** for accuracy
- 👤 Gym submission restricted to logged-in users
- 📍 Map-based search *(planned)*

---

## 🧰 Tech Stack

| Tech         | Purpose                     |
|--------------|-----------------------------|
| Next.js      | Frontend & API              |
| TypeScript   | Type safety                 |
| PostgreSQL   | Relational DB               |
| Prisma       | Database ORM                |
| NextAuth.js  | Authentication              |
| Tailwind CSS | Styling                     |
| Netlift      | Hosting                     |

---

## 🚧 Project Structure (WIP)
/app
/auth → NextAuth routes
/gyms → Gym pages (add, view, etc.)
/api/search-gyms → Search API
/public/images → Backgrounds, logos
/lib → Prisma, auth config


---

## 🛠️ Local Development

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/that-one-gym.git
cd that-one-gym
### 2. Install dependencies
```bash
npm install
### 3. Set Up Environment Variables
Create a ```bash .env ``` file in the root

