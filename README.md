# Deshbani & DTV – Advertising Order Calculator

A single-page, no-dependency web form where advertisers pick newspaper, TV and digital ads, see their price and package discount update live, and send the order to Deshbani by e-mail (or copy it as text).

## Features
- Live price summary with package discounts (10% – 40%)
- Newspaper (colour / B&W), DTV broadcast and digital media rates in USD
- "Every issue" or specific-month newspaper runs
- Order saved in `sessionStorage` so a refresh doesn't lose it
- One-click `mailto:` order and "Copy order text"
- Responsive, mobile sticky total bar

## Project structure
```
.
├── index.html
├── css/style.css
├── js/app.js          # rates, discount tiers, order logic
├── assets/logo.png
└── .github/workflows/pages.yml
```

## Run locally
Open `index.html` in a browser, or:
```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploy on GitHub Pages
1. Push this repo to GitHub (branch `main`).
2. **Settings → Pages → Source: GitHub Actions** (the included workflow deploys automatically on every push).
   - Alternative: Source = "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Your site will be live at `https://<username>.github.io/<repo-name>/`.

## Updating prices
Edit the `CAT` (rates) and `TIERS` (discounts) objects at the top of `js/app.js`.
The recipient e-mail is the `mailto:` address in the same file.

## Contact
1578 Broadway St. 1st Floor, Buffalo, NY-14212 · (716) 235-8349 · (917) 345-8780 · deshbani21@gmail.com
