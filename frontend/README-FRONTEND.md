# URL Shortener Frontend

React + Vite frontend for the URL Shortener project.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

Default API configuration:

```env
VITE_API_URL=http://localhost:5000
VITE_SHORTEN_ENDPOINT=/shorten
```

The API call is isolated in `src/api.js`. If the teammate's backend uses a different endpoint or request field, change only that file after confirming the backend contract.
