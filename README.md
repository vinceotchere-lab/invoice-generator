# NAJERA Invoice Generator

A small, static, no-backend invoice generator built with React + Vite.
Fill in your business info, client details, and line items, watch the
invoice update live, and download it as a polished PDF — no server, no
database, all in the browser.

## Features

- Editable business settings (defaults to NAJERA's info, but works for
  any business)
- Client / bill-to details
- Repeatable line items (add/remove), with live-calculated amounts
- Auto-calculated subtotal, deposit deduction, tax, and total due
- One-click PDF download (via `jsPDF` + `jspdf-autotable`)
- Autosaves your in-progress invoice to `localStorage` (nothing is sent
  anywhere — it's 100% client-side)
- Responsive: form + live preview stack vertically on small screens

## Running locally

Requires [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Building for production

```bash
npm run build
```

This outputs a static site to the `dist/` folder, which you can host
anywhere that serves static files (GitHub Pages, Netlify, Vercel, S3, etc.).

## Deploying to GitHub Pages

**1. Push this project to a GitHub repository.**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

**2. Set the Vite `base` path to match your repo name.**

Open `vite.config.js` and make sure `base` matches how you're deploying:

- Deploying to `https://<your-username>.github.io/<your-repo-name>/`
  (a normal project repo) → set `base: "/<your-repo-name>/"`
- Deploying to `https://<your-username>.github.io/` directly (a repo
  literally named `<your-username>.github.io`) → set `base: "/"`

**3. Deploy using the included script (easiest):**

```bash
npm install
npm run deploy
```

This builds the app and pushes the `dist/` folder to a `gh-pages` branch
using the `gh-pages` package (already in `devDependencies`).

**4. Turn on GitHub Pages for that branch:**

Go to your repo on GitHub → **Settings** → **Pages** → under "Build and
deployment", set **Source** to "Deploy from a branch", branch `gh-pages`,
folder `/ (root)` → **Save**.

GitHub will give you a live URL within a minute or two, typically:

```
https://<your-username>.github.io/<your-repo-name>/
```

### Alternative: GitHub Actions (auto-deploy on every push)

If you'd rather have GitHub rebuild and redeploy automatically whenever
you push to `main`, you can instead use a GitHub Actions workflow with
the official `actions/deploy-pages` action, and set Pages' source to
"GitHub Actions" instead of a branch. This isn't included by default here
to keep the project simple — ask if you'd like this added.

## Project structure

```
najera-invoice-generator/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx              # top-level state + layout
│   ├── index.css            # all styling (design tokens at the top)
│   ├── components/
│   │   ├── Section.jsx        # collapsible form section
│   │   ├── Field.jsx          # labeled input/textarea
│   │   ├── LineItemsEditor.jsx
│   │   └── InvoicePreview.jsx # live invoice preview
│   └── utils/
│       ├── calculations.js  # subtotal/tax/total math
│       ├── storage.js       # localStorage persistence
│       ├── defaultState.js  # default form values
│       └── pdfGenerator.js  # builds and downloads the PDF
```

## Notes

- All data lives only in your browser (`localStorage`). Nothing is
  uploaded anywhere — this is intentional for a small personal business
  tool handling client contact info.
- If you enter bank/account details for payment, consider whether you
  want that printed on every invoice PDF, or sent to clients separately
  through a more secure channel.
- The "Clear all data and start over" button wipes the saved invoice
  from your browser's local storage — it does not affect any PDFs you've
  already downloaded.
