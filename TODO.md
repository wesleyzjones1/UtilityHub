# UtilityHub — Your Setup Checklist

This is a list of **things only you can do** (accounts, settings, assets). The code is
built, tested (814 passing), and deploying automatically on every push to `main`.

For most items, once you finish the manual part you can just **tell Claude the value**
(a URL, a token, a logo file) and it will wire the code for you.

Legend: ⏱ = rough time · 🔴 required · 🟡 recommended · ⚪ optional

---

## 1. 🔴 Confirm the site is actually live  ·  ⏱ 2 min

1. Open your repo on GitHub → **Actions** tab.
2. Confirm the latest **“Deploy to GitHub Pages”** run has a green check.
3. Go to **Settings → Pages**. Under “Build and deployment”, **Source** must be
   **“GitHub Actions”** (not “Deploy from a branch”). If it isn’t, change it and
   re-run the workflow (Actions → latest run → “Re-run all jobs”).
4. Visit the URL shown on the Pages settings screen
   (it will look like `https://wesleyzjones1.github.io/UtilityHub/`).

✅ Done when the live URL loads and you can open a tool.

---

## 2. 🟡 Set up your support / payment account  ·  ⏱ 15 min

This is the “get paid” step. Pick **one** to start (you can add more later). The
Support button on the site shows whichever you configure.

**Recommended for speed: Ko-fi** (no platform fee on donations, pays out via PayPal/Stripe)
1. Go to <https://ko-fi.com> → **Sign up**.
2. Pick your page name → your page becomes `https://ko-fi.com/wesleyzjones1`.
3. Go to **Settings → Payments** and connect **PayPal** *or* **Stripe**
   (this is the bank/payout connection — have your bank or PayPal login ready).
4. Copy your page URL: `https://ko-fi.com/YOURNAME`.

**Alternative: Buy Me a Coffee** — <https://buymeacoffee.com> → sign up → connect
Stripe/PayPal → your URL is `https://buymeacoffee.com/YOURNAME`.

**Alternative: GitHub Sponsors** (best “dev cred”, slower to approve)
1. Go to <https://github.com/sponsors> → **Get started** → select your account.
2. Fill in your profile and **set up Stripe payouts** (bank details + a tax form
   W-9/W-8 — this is the payment account part).
3. Create at least one sponsor tier → submit for approval.
4. Your URL becomes `https://github.com/sponsors/YOURNAME`.

✅ Done when you have a working donation URL. **→ Then do step 3.**

---

## 3. ✅ Turn on the donation button  ·  DONE

Your Ko-fi page (`https://ko-fi.com/wesleyzjones1`) is now wired in as the
built-in default, so the **♥ Support** button shows the Ko-fi option out of the box.

Optional overrides (no code change needed) — add any of these as repo variables
under **Settings → Secrets and variables → Actions → Variables**:

- `VITE_KOFI_URL` → overrides the default Ko-fi link
- `VITE_BMAC_URL` → `https://buymeacoffee.com/YOURNAME`
- `VITE_SPONSORS_URL` → `https://github.com/sponsors/YOURNAME`

Adding `VITE_BMAC_URL` or `VITE_SPONSORS_URL` shows those buttons alongside Ko-fi.

---

## 4. 🟡 Get found & measure traffic  ·  ⏱ 20 min

Your goal is traffic, so get indexed and start counting visitors.

**Google Search Console** (free)
1. Go to <https://search.google.com/search-console> → **Add property** →
   **URL prefix** → paste your live URL.
2. Choose the **HTML tag** verification method and copy the `<meta>` tag it gives you.
3. **→ Paste that meta tag to Claude** — it will add it to `index.html` and redeploy.
4. After it verifies, in Search Console open **Sitemaps** and submit: `sitemap.xml`.

**Bing Webmaster Tools** (free, 5 min) — <https://www.bing.com/webmasters> → add your
site → you can **import directly from Google Search Console** in one click.

**Analytics — pick one** (privacy-friendly, fits the brand):
- **Cloudflare Web Analytics** (free, cookieless) — <https://www.cloudflare.com/web-analytics/>
  → add site → copy the token/snippet → **paste it to Claude** to install.
- or **GoatCounter** (free, open source) — <https://www.goatcounter.com>.

✅ Done when Search Console is verified and analytics is recording visits.

---

## 5. ⚪ Use your own .com domain  ·  ⏱ 20 min + DNS wait

(See the name shortlist discussed separately. Skip if you’re happy on the github.io URL.)

1. Buy the domain at a registrar (Namecheap, Cloudflare Registrar, or Porkbun).
2. Repo → **Settings → Pages → Custom domain** → type your domain → **Save**
   (this auto-creates a `CNAME` file in the repo).
3. At your registrar’s DNS settings, add records:
   - **Apex domain** (`yourname.com`): four `A` records →
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **www**: a `CNAME` record → `wesleyzjones1.github.io`
4. Back in Settings → Pages, wait for the check, then tick **Enforce HTTPS**.
5. **→ Tell Claude your final domain** so it can update the sitemap, robots.txt,
   and social-preview URLs to match.

✅ Done when your `.com` loads the site over HTTPS.

---

## 6. ⚪ Polish app icons for full “Install app”  ·  ⏱ 10 min

Offline already works; this just makes the installed icon crisp on every device.

1. Create a square **512×512 PNG** of your logo (any image tool, or Canva).
2. Go to <https://realfavicongenerator.net> (or <https://www.pwabuilder.com/imageGenerator>),
   upload it, and download the generated PNG set.
3. **→ Send Claude the PNG files** (especially `pwa-192x192.png` and `pwa-512x512.png`)
   — it will drop them in `public/` and point the manifest at them.

✅ Done when installing the app shows your logo instead of the default mark.

---

## 7. ⚪ Earn from ads (only if you want them)  ·  ⏱ varies

The site currently shows a non-paying “Advertisement” placeholder that users can hide
for free. To make it real revenue:
1. Apply to an ad network — **Google AdSense** (<https://adsense.google.com>, needs
   approval and some traffic first) or **EthicalAds** (dev-friendly, privacy-safe).
2. Once approved, **→ give Claude the ad snippet/slot ID** to wire into the ad slot.

Note: real ads slightly conflict with the “private, no-tracking” positioning. Donations
(steps 2–3) are the lower-friction, on-brand path. Your call.

---

### Quick handoff summary — what to bring back to Claude
- ✅ A donation URL (step 2) → it confirms the button works.
- ✅ The Search Console **meta tag** (step 4) → it adds + redeploys.
- ✅ An analytics **token/snippet** (step 4) → it installs.
- ✅ Your final **domain** (step 5) → it updates site URLs.
- ✅ Your **logo PNGs** (step 6) → it wires the icons.
