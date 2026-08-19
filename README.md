# Antara & Shubham wedding invitation

## Run locally

1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env` only if you are using an external RSVP form URL.
4. Run `npm run dev` and open the local address shown.

## Personalise

All wedding content is in `src/data/wedding.js`: names, parents, date, schedule, venue, photos, map, music and RSVP settings. Items marked **PLACEHOLDER** should be replaced before sharing.

### RSVP options

The included RSVP form is a polished local demo by default. Set `rsvp.formAction` to a Formspree/Google Forms endpoint (and optionally `VITE_RSVP_FORM_ACTION` in `.env`) to post submissions there. Match your provider's expected field names if needed.

### Music

Put a licensed instrumental audio file at `public/music/wedding-ambient.mp3` and set `music.src` in the config. Music only starts after the guest opens the envelope, respecting browser autoplay rules.

## Deploy

### Vercel

Push this folder to GitHub, import it at vercel.com, select the Vite framework preset, and deploy. Add `VITE_RSVP_FORM_ACTION` in Project Settings → Environment Variables if applicable.

### Netlify

Push to GitHub, select **Add new site → Import an existing project**, and use build command `npm run build` and publish directory `dist`. Add the same environment variable in Site configuration if required.
