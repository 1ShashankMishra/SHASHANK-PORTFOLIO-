# Shashank Mishra — Portfolio Website

A premium, fully responsive personal portfolio for a B.Tech Computer Science
Engineering (Artificial Intelligence) student — built with plain HTML5, CSS3,
and vanilla JavaScript (no frameworks, no build step).

**Live demo:** _add your GitHub Pages link here after deploying_

---

## Overview

This site is designed to double as a placement-ready portfolio and an
academic dashboard: alongside the usual hero/about/projects sections, it
includes an editable **Semester Results** tracker and a **Fees Dashboard**,
so all of a student's academic and financial records live in one place.

The visual direction is a dark, glassmorphic UI with blue/cyan gradients, an
animated canvas "neural network" in the hero, and JetBrains Mono used for
anything data-like (grades, fees, terminal-style section labels) — a nod to
the CS/AI subject matter.

---

## Features

- Sticky, transparent-to-solid navbar with active-section highlighting and a mobile hamburger menu
- Dark theme (default) with a light-mode toggle
- Animated gradient/aurora background, floating particles-style canvas, cursor glow
- Loading screen, scroll progress bar, smooth scrolling, scroll-reveal animations
- Hero with animated typing effect, download résumé / contact CTAs, animated social icons
- About section with an animated timeline, count-up stats, and interest tags
- Skills section with animated progress bars (Programming, Web Dev, AI, Tools)
- Vertical Education timeline (School → Intermediate → College/University)
- **Semester Results Dashboard**: editable SGPA/CGPA/percentage per semester (1–8), status badges, per-semester marksheet upload/view/download, overall CGPA ring, and a live CGPA trend chart drawn in pure JS/canvas
- **Fees Dashboard**: editable tuition/hostel/exam/other/scholarship per semester with auto-calculated totals and remaining balance, color-coded payment status (paid/partial/pending), circular payment-progress ring, receipt upload/download, and payment history log
- Animated, tilt-on-hover project cards with GitHub/Live Demo links
- Certificate gallery with a fullscreen modal preview and an "add certificate" upload
- Résumé preview card with view/download/upload
- Contact form with custom client-side validation, plus a contact-info panel and map placeholder
- Footer with quick links, social icons, wave divider, and a back-to-top button
- Semantic HTML, SEO meta tags, Open Graph/Twitter cards, favicon, `prefers-reduced-motion` support, lazy-loaded images

> **Note on data:** Grade edits, fee edits, and uploaded files (marksheets,
> receipts, résumé, certificates) are held in memory only for the current
> page load — nothing is saved to a database or browser storage. Wire this
> up to a backend if you need the edits to persist.

---

## Folder Structure

```
portfolio/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── images/       # profile photo, project screenshots, certificates, OG image
    ├── icons/        # favicon, apple-touch-icon
    └── resume/       # Shashank_Mishra_Resume.pdf
```

---

## Getting Started

1. **Clone or download** this repository.
2. Add your own files into `assets/`:
   - `assets/images/profile.jpg` — your photo
   - `assets/images/project-1.jpg` … `project-4.jpg` — project screenshots
   - `assets/images/cert-1.jpg` … `cert-3.jpg` — certificate scans
   - `assets/images/resume-preview.jpg` — a preview image of your résumé
   - `assets/images/og-cover.jpg` — social-share preview image
   - `assets/icons/favicon.png`, `assets/icons/apple-touch-icon.png`
   - `assets/resume/Shashank_Mishra_Resume.pdf` — your actual résumé
3. Open `index.html` in a browser — no build tools, package managers, or servers required.
4. Edit the placeholder text in `index.html` (education institute names, grades, fee amounts, contact details, social links) to match your real information.

### Local development server (optional)

Opening the file directly works fine, but if you want live-reload while editing:

```bash
# Python 3
python -m http.server 8000

# or Node.js
npx serve .
```

Then visit `http://localhost:8000`.

---

## Deploying to GitHub Pages

1. Push this project to a GitHub repository.
2. Go to **Settings → Pages** in your repository.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Choose the `main` branch and `/ (root)` folder, then click **Save**.
5. GitHub will publish your site at:
   ```
   https://<your-username>.github.io/<repository-name>/
   ```
6. Update the `og:url` and `canonical` meta tags in `index.html` with this final URL.

---

## Technologies Used

| Layer      | Technology                              |
|------------|------------------------------------------|
| Structure  | HTML5 (semantic markup)                  |
| Styling    | CSS3 (custom properties, Grid, Flexbox)  |
| Behavior   | Vanilla JavaScript (ES6+)                |
| Fonts      | Space Grotesk, Inter, JetBrains Mono (Google Fonts) |
| Charts     | Native `<canvas>` (no chart library)      |
| Hosting    | GitHub Pages (or any static host)        |

No frameworks, UI kits, or bundlers are used, by design.

---

## Screenshots

_Add screenshots of your deployed site here once available:_

| Home | Semester Results | Fees Dashboard |
|------|-------------------|----------------|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## Future Improvements

- Connect the Semester Results and Fees dashboards to a real backend/database so edits and uploads persist
- Add authentication so only the site owner can edit grades/fees, with a read-only public view
- Blog / articles section
- Dark/light theme preference memory via backend user settings
- Automated Lighthouse/accessibility checks in CI
- Internationalization (multi-language support)

---

## License

This project is released under the [MIT License](https://opensource.org/licenses/MIT).
You are free to use, modify, and distribute it for personal or educational purposes.

---

**Author:** Shashank Mishra
B.Tech Computer Science Engineering (Artificial Intelligence)
