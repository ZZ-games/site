# ZZ Games

## Add or edit a game
Open `games.js`. Each game is one line:

```js
{ title: "Slope", category: "Arcade", repo: "Slope", url: "", image: "" },
```

- **repo** – the repo's name on github.com/ZZ-games. The site turns it into `https://zz-games.github.io/Slope/` (capital letters matter, so copy the name exactly).
- **url** – or paste any full link instead (use this for games hosted somewhere else).
- **image** – optional. Put a picture in the `images` folder and write `"images/slope.png"`. If you leave it blank, the site makes a colorful cover.
- **featured: true** – shows that game in the big banner at the top.

## Put it online (free)
**Option A – GitHub Pages (easiest):** In this repo go to **Settings → Pages**, set Source to "Deploy from a branch", pick `main` and `/ (root)`, and save. In a minute the site is live at https://zz-games.github.io/zz-games-site/

**Option B – Cloudflare Pages or Netlify (nicer URL, custom domain):** Sign in at pages.cloudflare.com or netlify.com with GitHub, pick the `zz-games-site` repo, leave the build settings empty, and deploy.

Either way, every change pushed to this repo updates the live site by itself.

## Saves
Games save their progress in the player's browser. The site also remembers recently played games and shows them under "Jump back in".
