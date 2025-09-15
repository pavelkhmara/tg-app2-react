# React Frontend for a Telegram Web App

Demo: [visit @react_node_web_app_bot](https://t.me/react_node_web_app_bot)

## Backend
Backend repo: [backend](https://github.com/pavelkhmara/tg-app2-nodejs)

## 🚀 Overview

- **Static bundle:** Built with `npm run build` and served by [`serve`](https://www.npmjs.com/package/serve)
- **API:** Uses the [Telegram Web Apps API](https://core.telegram.org/bots/webapps) (`window.Telegram.WebApp`)
- **Main button:** On click, posts selected items to `POST /web-data`

---

## 🛠️ Tech Stack

- **React** (CRA/Vite compatible)
- [`serve`](https://www.npmjs.com/package/serve) (static hosting)
- [PM2](https://pm2.keymetrics.io/) (process manager)
- [Nginx](https://nginx.org/) (reverse proxy, TLS termination)

---

## ⚡ Quick Start (Local)

```bash
git clone <repo-url>
cd tg-app2-react
npm install
npm start               # if dev script exists

# or build & serve
npm run build
npx serve -s build -l 8001
```

---

## 🔗 Calling the Backend (Recommended)

**Use a relative path** so requests go to the same domain over HTTPS:

```js
fetch('/web-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```

- This avoids mixed content and CORS issues.
- Lets Nginx route `/web-data` to the backend.

**If you need a full URL, expose it via env (CRA example):**

```env
BACKEND_API_URL=<your-domain.com>  # Telegram web-apps allow https ONLY
```

```js
const API_URL = process.env.BACKEND_API_URL || '';
fetch(`${API_URL}/web-data`, { ... });
```

> **Note:** CRA only injects variables prefixed with `BACKEND_`, and you must rebuild after changing `.env`.

---

## 🏗️ Build & Run (Production)

```bash
npm run build
pm2 start "serve -s build -l 8001" --name tg-webapp-frontend
pm2 save
pm2 logs tg-webapp-frontend
```

---

## 🌐 Nginx (Paired with Backend)

- **Frontend:** Proxied from `/` to port `8001`
- **API:** Proxied from `/web-data` to `8000` (see Backend README for the full server block)

**If you prefer Nginx to serve static files directly (no `serve`):**

```nginx
location / {
    root /srv/tg-web-app/frontend/tg-app2-react/build;
    try_files $uri /index.html;
}
```

> Use this SPA pattern if you rely on client-side routes like `/form`.

---

## 🤖 Telegram Web App Notes

- **Open the app via a HTTPS URL** (e.g., `https://<your-domain.com>`)
- In your bot’s `/start` handler, use:

**Inline keyboard:**
```js
{ web_app: { url: 'https://<your-domain.com>' } }
```

**Reply keyboard:**
```js
{ web_app: { url: 'https://<your-domain.com>/form' } }
```

---

## 🐞 Troubleshooting

- **Clicking main button does nothing:**  
  Verify you subscribe/unsubscribe correctly:
  ```js
  useEffect(() => {
    tg.onEvent('mainButtonClicked', onSendData);
    return () => tg.offEvent('mainButtonClicked', onSendData);
  }, [onSendData, tg]);
  ```

- **404 on `/form` when reloading:**  
  Static server doesn’t know client routes.  
  Either use `HashRouter` or switch to the Nginx `try_files` SPA setup above.

- **Mixed content:**  
  Never post to `http://IP:PORT` from an HTTPS page.  
  Use `/web-data` or `https://<domain>`.

---

## 🙏 Credits

This frontend was created by following and adapting the YouTube tutorial:  
[https://www.youtube.com/watch?v=MzO-0IYkZMU](https://www.youtube.com/watch?v=MzO-0IYkZMU)