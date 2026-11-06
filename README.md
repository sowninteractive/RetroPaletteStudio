# Retro Palette & Design Token Studio

## Run locally
```
npm install
npm run dev
```

## Deploy to GitHub Pages
1. Create a GitHub repo and push this project to the `main` branch.
2. In the repo go to Settings > Pages and set Source to "GitHub Actions".
3. Push again (or run the workflow from the Actions tab). The site appears at `https://<user>.github.io/<repo>/`.

The build uses a relative base path, so it works under any repo name. No other config is needed.

## Import
One hex per line (.hex/.txt, Lospec style) or a PNG (top 8 colors), assigned to tokens in list order.
