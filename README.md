<div align="center">

<img src="imgs/homelogo.png" alt="SkillSwap logo" width="96">

# SkillSwap

**Learn a new skill a little at a time, with short tasks and video lessons.**

### [🔗 Live demo](https://en0gsh1.github.io/skilswap/)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?logo=chartdotjs&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?logo=githubpages&logoColor=white)

</div>

---

## What it is

SkillSwap is a learning site where you pick a skill (cooking, basketball, computing, guitar and more) and learn it step by step: through tasks every few days, every week, or by watching video lessons.

Everything runs in the browser. No backend, no build step.

## Features

- 📚 **Courses and video lessons**: written courses plus embedded video lessons
- 💳 **Free and Premium plans**: checkout with Stripe (test mode) and discount coupons
- 👤 **Account page**: saved courses and past purchases
- 📊 **Admin dashboard**: subscribers, visits, revenue and conversion charts, with data export
- 💬 **Help chat**: a chat widget that answers common questions
- 🌍 **English and Albanian**: switch language on any page
- 🌙 **Light and dark mode**
- 📜 **Legal pages**: privacy, cookies, terms and data security

## Run it locally

Nothing to install. Clone it and serve the folder:

```bash
git clone https://github.com/en0gsh1/skilswap.git
cd skilswap
python -m http.server 8000
```

Then open http://localhost:8000.

## Project structure

```
├── index.html           Home
├── courses.html         Courses
├── video-courses.html   Video lessons
├── pricing.html         Plans
├── checkout.html        Checkout (Stripe)
├── account.html         User account
├── dashboard.html       Admin dashboard
├── css/                 One stylesheet per page
├── js/                  Page logic, coupons, chat, translations
└── imgs/, videos/       Media
```

## Note

This is a demo project. Payments run in Stripe's test mode, so no real money is charged, and user data is saved in the browser (localStorage) instead of on a server.

---

<div align="center">
Made by <a href="https://github.com/en0gsh1">Eno Gashi</a>
</div>
