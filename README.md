<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Caravan — A calmer way to manage project signals

Caravan helps people who are overwhelmed by constant alerts, fragmented project context, and juggling multiple apps. It surfaces the things that matter, reduces noise, and reunites conversations with the work they relate to.

Who this is for
- Folks tired of chasing notifications and losing context across tools.
- Project leads who want a single, gentle hub for signals and decisions.
- Small teams who need a lightweight, private place to capture project state.

What Caravan does
- Collects and groups project signals so you see context, not just noise.
- Lets users sign in with Google to keep identity simple and secure.
- Ships as a small Next.js app you can run locally or deploy to AI Studio.

Get started (2 minutes)

1. Install dependencies:

```bash
npm install
```

2. Make a local env copy and edit only the values you need:

```bash
cp .env.example .env.local
# edit .env.local and set APP_URL (http://localhost:3000 for local dev) and GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET
```

3. Run locally:

```bash
npm run dev
```

Open `http://localhost:3000` — you should be able to sign in with Google if you configured OAuth credentials.

Minimal env keys
- `APP_URL` — origin for callbacks (local dev: `http://localhost:3000`)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — required for Google sign-in
- `GEMINI_API_KEY` — optional (only if using Gemini features)

Google OAuth — the essentials (short)

1. In Google Cloud Console, create an OAuth client (APIs & Services → Credentials → Create → OAuth client ID → Web application).
2. Add these redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (local dev)
   - `https://YOUR_PRODUCTION_URL/api/auth/google/callback` (production)
3. Copy the Client ID and Secret into `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`.
4. (Admin) If you’re on Google Workspace and want users to sign in without extra prompts, an admin can trust the app in the Admin console (Security → API Controls → App access control).

Where to look in the code
- OAuth endpoints: `app/api/auth/google/url/route.ts` and `app/api/auth/google/callback/route.ts`
- Environment template: `.env.example`
