# 🏋️ That One Gym

**That One Gym** is a web application that helps users find gyms based on the equipment they want to train with. Whether you're looking for a power rack, a belt squat machine, or calibrated plates, this app helps lifters locate the perfect gym — verified by the strength community.

> ⚠️ This project is a **work in progress** and under active development. Features are being added weekly.

---

## ✨ Features

- 🔍 Search gyms by name, city, or ZIP
- 🏋️ Filter gyms by equipment (e.g., deadlift platform, hack squat, etc.)
- ✅ Equipment lists are **user-verified** for accuracy
- 👤 Gym submission restricted to logged-in users
- 📸 Gym listings can include community photos and reviews *(planned)*
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
| Netlify      | Hosting                     |

---

## 🚧 Project Structure (WIP)

```
/app
  /auth                → NextAuth routes
  /gyms                → Gym pages (add, view, etc.)
  /api/search-gyms     → Search API
/public/images         → Backgrounds, logos
/lib                   → Prisma, auth config
```

---

## 🛠️ Local Development

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/that-one-gym.git
cd that-one-gym
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
NEXTAUTH_SECRET=someRandomSecret
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (optional)
GITHUB_ID=...
GITHUB_SECRET=...
```

### 4. Run the App
```bash
npx prisma db push   # or migrate dev
npm run dev
```

---

## 🧪 Current Progress

- [x] Landing page with background image and search bar
- [x] Gym autocomplete with dropdown suggestions
- [x] "Add a gym" prompt (login required)
- [ ] Equipment filtering
- [ ] Gym claim & verification
- [ ] Photo uploads
- [ ] Map view with PostGIS or Maps API
- [ ] Public user profiles

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- Inspired by lifters who have wasted too many drop-ins at commercial gyms with no squat rack
- Background image generated with DALL·E
- Built with Next.js

---
