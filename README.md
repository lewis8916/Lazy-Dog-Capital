# Lazy Dog Capital

Modern, awards-style marketing site for Lazy Dog Capital — a hard money lender for real estate investors. Built with Next.js 14 (App Router) and Tailwind CSS.

## Stack
- Next.js 14 + React 18 (App Router, JSX)
- Tailwind CSS with custom brand palette
- Poppins via `next/font/google`
- `lucide-react` icons, `framer-motion` ready

## Brand palette
| Token | Hex |
|---|---|
| `teal` (primary) | `#21413A` |
| `teal-dark` | `#1a2f29` |
| `cream` | `#F3EDE1` |
| `cream-light` | `#f9f6f2` |
| `bronze` (accent) | `#C9962F` |

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure
```
app/
  layout.jsx       # Poppins + global metadata
  page.jsx         # Section composition
  globals.css      # Tailwind + brand utilities
components/
  Navbar.jsx
  Hero.jsx
  Products.jsx
  WhyChooseUs.jsx
  Testimonials.jsx
  FAQ.jsx
  ApplicationForm.jsx
  Footer.jsx
```

The application form is wired to a simulated submit (`setTimeout`) — swap the body of `onSubmit` in `components/ApplicationForm.jsx` for your real endpoint (e.g. an API route at `app/api/apply/route.js`).
