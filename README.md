# ZZ Games

Live at https://zz-games.github.io/site/ (GitHub Pages, `main` branch, root folder).

## Pages
- `index.html`: home (Games, Music, Movies, TV)
- `games.html`: the full game list
- `play.html`: the game player
- `music.html`: music player (keeps playing across the site, pauses while a movie or show plays)
- `watch.html`: movies and TV (TMDB info, video servers in `sources.js`)
- `request.html`: request a game
- `gamble.html`: hidden ZZ-Gamble page, opened by typing **SS** in the search box

## Add or edit a game
Open `games.js`. Each game is one line:

```js
{ title: "Slope", category: "Arcade", repo: "Slope", url: "https://zz-games.github.io/site/games/slope/", image: "covers/slope.jpg" },
```

- **url**: where the game loads from. Most games are copied into this repo's `games/` folder, so the link is `https://zz-games.github.io/site/games/NAME/`.
- **repo**: the game's repo on github.com/ZZ-games. If there's no url, the site loads `https://zz-games.github.io/REPO/` (GitHub Pages must be on in that repo).
- **image**: cover picture in the `covers/` folder.
- **featured / hot / new / pick**: put the game in the spotlight, Hot row, New row or Top picks.

New games go at the end of the list.

## Where the games live
Most games are in the `games/` folder. Geometry Dash Lite, Moto Road Rash 3D and the newer .io/sports games (Basket Champs, Axis Football League, Ping Pong Go!, Bloons TD 4, Gun Mayhem, Nitro Knights.io, Trains.io, WormEat.io, GoTet.io, Dots.io) load from their own repos on the ZZ-games account.
