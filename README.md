# 🧠 PsyConnect: Your Safe Space on Campus
**A Full-Stack Mental Wellness Platform for College Students**

PsyConnect is a production-ready mental health ecosystem designed to provide students with anonymous peer support, professional resources, and AI-driven wellness tools.

---

## 🚀 Live Demo
**Visit the platform:** [https://psyconnect-kappa.vercel.app](https://psyconnect-kappa.vercel.app)

---

## 🛠️ The Tech Stack (The "Modern Web" Suite)
This project uses a high-performance architecture designed for scalability and real-time interaction.

* **Frontend:** Next.js 14/15 (App Router) with Tailwind CSS for a responsive, modern UI.
* **Backend:** Next.js Serverless Functions (API Routes).
* **Database:** PostgreSQL hosted on **Supabase**.
* **ORM:** **Prisma** (configured with a high-speed Transaction Pooler for Serverless environments).
* **Authentication:** **NextAuth.js** with secure session management and encrypted credentials.
* **Deployment:** **Vercel** (utilizing custom build-phase overrides for Prisma schema generation).
* **AI Microservice:** Python/Flask (Mood Detection & Stress Prediction models).

---

## ✨ Key Features
* **👥 Peer-to-Peer Forum:** Anonymized community discussions for students to share experiences.
* **👨‍⚕️ Specialist Directory:** Browse and message verified mental health mentors and specialists.
* **📚 Resource Hub:** Curated academic and wellness materials filtered by category (Anxiety, Sleep, etc.).
* **📈 Stress Predictor:** Integrated AI models to help students track their mental wellbeing.
* **💬 Real-time Messaging:** Secure conversation channels between students and mentors.

---

## 🏗️ Technical Highlights & Implementation
During development, several complex infrastructure challenges were solved:
* **Database Connectivity:** Implemented **Prisma Transaction Pooling (Port 6543)** to handle high-concurrency requests in a serverless environment.
* **Build Optimization:** Configured custom Vercel build commands to ensure seamless Prisma client generation and static page pre-rendering.
* **Security:** Implemented **NextAuth** with strict environment variable syncing for production-grade security handshakes.

---

## 💻 Local Setup
1. **Clone the repo:** `git clone https://github.com/soham-nandi-016/PsyConnect.git`
2. **Install dependencies:** `npm install`
3. **Setup Environment:** Create a `.env` file with your Supabase and NextAuth credentials.
4. **Database Sync:** `npx prisma generate`
5. **Seed Data:** `npx prisma db seed`
6. **Run Dev:** `npm run dev`

---

## 🎓 Academic Context
Developed as a **Third Year (TE) Mini-Project**, focusing on the intersection of Full-Stack Development, Mental Wellness, and Green IT principles.