// ============================================================
//  ZZ GAMES — your game list
//  To add a game: copy a line, change the title, paste the link.
//
//  title    – name shown on the card
//  category – Racing, Sports, Arcade, Action, Puzzle, Retro, Other
//  repo     – the name of the game's repo on github.com/ZZ-games
//             (the site turns it into https://zz-games.github.io/REPO/)
//  user     – only if the repo is on a different GitHub account, e.g. "zz126j"
//  url      – OR paste a full link instead (any site) — url wins if both are set
//  image    – optional cover image, e.g. "images/slope.png"
//             (leave "" and the site makes a colorful cover for you)
//  featured – true puts it in the rotating spotlight at the top (pick a few)
//  hot      – true gives it a HOT badge and a spot in the Hot row
//  pick     – true puts it in the "Top picks" box next to the spotlight (pick 3)
//  new      – true gives it a NEW badge and a spot in the New row
//  tags     – extra search words, e.g. "gd" for Geometry Dash
//  versions – optional list of { label, url } to let players pick a version (see Retro Bowl)
// ============================================================

const SITE = {
  name: "ZZ Games",
  githubUser: "ZZ-games",
  requestFormUrl: "https://forms.gle/dwiUv1H8pbPhJFhm8", // old form (backup)
  // The "Request a game" page sends answers to your Google Form.
  // entry = the id of a paragraph question in that form, like "entry.123456789"
  // Games in the games/ folder that aren't in this copy of the site load from here instead
  
  // TMDB Read Access Token (v3 auth) for Movies/TV — https://www.themoviedb.org/settings/api
  tmdbToken: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjVlODY4NzM0YmQxMWIxYjY3NzU5YjJmMjE1ZDNiNyIsIm5iZiI6MTc5NDg2MzY3NC43MDgsInN1YiI6IjZhZmI3MjNhZjI3YTQyYmJhMTI3NTJiNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4_0LOJOSQAiyq1HRnzvWhe1to5amc3yfem1BI0OKIE8",
  requestForm: {
    formId: "1FAIpQLSfksIhmSJWLb5yaeU3DiJLbKBItyC2tnGHBCvFPN_bd6VfPdA",
    entry: "entry.366340186",
  },
};

const GAMES = [
  { title: "Tung Tung Kart", category: "Racing", user: "ZZ-Interactives", repo: "Tung-Tung-Kart", url: "https://tung-tung-kart.netlify.app/", image: "covers/tung-tung-kart.jpg", hot: true },

  { title: "Minecraft", category: "Action", repo: "EaglerCraft", url: "https://zz-games.github.io/site/games/eaglercraft/?v=20261028", image: "covers/minecraft.jpg", featured: true, hot: true, tags: "mc eaglercraft" },
  { title: "Slope", category: "Arcade", repo: "Slope", url: "https://zz-games.github.io/site/games/slope/", image: "covers/slope.jpg", hot: true, pick: true },
  { title: "Geometry Dash Lite", category: "Arcade", repo: "geometry-dash", url: "https://zz-games.github.io/geometry-dash/", image: "covers/geometry-dash-lite.jpg", tags: "gd" },
  { title: "Stickman Hook", category: "Arcade", repo: "Stickman-Hook", url: "https://zz-games.github.io/site/games/stickman-hook/", image: "covers/stickman-hook.jpg" },
  { title: "Block Blasts", category: "Puzzle", repo: "Block-Blast", url: "https://zz-games.github.io/site/games/block-blast/", image: "covers/block-blasts.jpg" },
  { title: "Redline Rush", category: "Racing", repo: "Redline-Rush", url: "https://zz-games.github.io/site/games/redline-rush/", image: "covers/redline-rush.jpg", featured: true, new: true },
  { title: "Basket Random", category: "Sports", repo: "Basket-Random", url: "https://zz-games.github.io/site/games/basket-random/", image: "covers/basket-random.jpg" },
  { title: "Cluster Rush", category: "Arcade", user: "zz126j", repo: "Cluster-Rush", url: "https://zz-games.github.io/site/games/cluster-rush/", image: "covers/cluster-rush.jpg" },
  { title: "Drive Mad", category: "Racing", repo: "drive-mad", url: "https://zz-games.github.io/site/games/drive-mad/", image: "covers/drive-mad.jpg" },
  { title: "Table Tennis World Tour", category: "Sports", repo: "Table-Tennis-World-Tour", url: "https://zz-games.github.io/site/games/table-tennis-world-tour/", image: "covers/table-tennis-world-tour.jpg" },
  { title: "Retro Bowl", category: "Sports", repo: "retro-bowl", url: "https://zz-games.github.io/site/games/retro-bowl/", image: "covers/retro-bowl.jpg", featured: true, hot: true, tags: "rb football", pick: true,
    versions: [
      { label: "Normal", url: "https://zz-games.github.io/site/games/retro-bowl/" },
      { label: "Hacked", url: "https://zz-games.github.io/site/games/retro-bowl-glitched/", note: "999 coaching credits and free upgrades. Saves separately from Normal." },
    ] },
  { title: "Retro Bowl College", category: "Sports", repo: "Retro-Bowl-College", url: "https://zz-games.github.io/site/games/retro-bowl-college/", image: "covers/retro-bowl-college.jpg" },
  { title: "Slow Roads", category: "Racing", repo: "slow-roads", url: "https://zz-games.github.io/site/games/slow-roads/", image: "covers/slow-roads.jpg" },
  { title: "Surf Rush", category: "Arcade", repo: "Surf-Rush", url: "https://zz-games.github.io/site/games/surf-rush/", image: "covers/surf-rush.jpg", new: true, featured: true, tags: "surf slope ball endless" },
  { title: "ZZ Craft", category: "Puzzle", user: "ZZ-games", repo: "ZZ-craft", url: "https://zz-games.github.io/ZZ-craft/", image: "covers/zz-craft.jpg", tags: "infinite craft combine elements" },
  { title: "Soccer Random", category: "Sports", repo: "Soccer-Random", url: "https://zz-games.github.io/site/games/soccer-random/", image: "covers/soccer-random-2.jpg" },
  { title: "Volley Random", category: "Sports", repo: "Volley-Random", url: "https://zz-games.github.io/site/games/volley-random/", image: "covers/volley-random-2.jpg" },
  { title: "Boxing Random", category: "Sports", repo: "Boxing-Random", url: "https://zz-games.github.io/site/games/boxing-random/", image: "covers/boxing-random-2.jpg" },
  { title: "Krillion", category: "Puzzle", repo: "Open-Krillion.io", url: "https://zz-games.github.io/site/games/krillion/", image: "covers/krillion.jpg" },
  { title: "Summer Rider", category: "Racing", user: "zz126j", repo: "SummerRider", url: "https://zz-games.github.io/site/games/summerrider/", image: "covers/summer-rider.jpg" },
  { title: "Snow Rider", category: "Racing", user: "zz126j", repo: "SnowRider", url: "https://zz-games.github.io/site/games/snowrider/", image: "covers/snow-rider.jpg" },
  { title: "Ragdoll Archers", category: "Action", repo: "RagdollArchers", url: "https://zz-games.github.io/site/games/ragdollarchers/", image: "covers/ragdoll-archers.jpg" },
  { title: "Rooftop Run", category: "Arcade", repo: "Rooftop-Run", url: "https://zz-games.github.io/site/games/rooftop-run/", image: "covers/rooftop-run.jpg" },
  { title: "Moto Road Rash 3D", category: "Racing", repo: "MotoRoadRash3D", url: "https://zz-games.github.io/MotoRoadRash3D/", image: "covers/moto-road-rash-3d.jpg" },
  { title: "Survival Race", category: "Racing", repo: "Survival-Race", url: "https://zz-games.github.io/site/games/survival-race/", image: "covers/survival-race.jpg" },
  { title: "PolyTrack", category: "Racing", repo: "polytrack2", url: "https://zz-games.github.io/site/games/polytrack2/", image: "covers/polytrack.jpg" },
  { title: "Drift Boss", category: "Racing", repo: "Drift-Boss", url: "https://zz-games.github.io/site/games/drift-boss/", image: "covers/drift-boss.jpg", imagePos: "8% center", hot: true },
  { title: "Subway Surfers", category: "Arcade", repo: "subway-surfers", url: "https://zz-games.github.io/site/games/subway-surfers/", image: "covers/subway-surfers.jpg", hot: true, pick: true },
  { title: "Apple Worm", category: "Puzzle", repo: "Apple-Worm", url: "https://zz-games.github.io/site/games/apple-worm/", image: "covers/apple-worm.jpg" },
  { title: "Escape Road", category: "Racing", repo: "Escape-Road", url: "https://zz-games.github.io/site/games/escape-road/", image: "covers/escape-road.jpg" },
  { title: "Hole.io", category: "Arcade", repo: "Hole.io", url: "https://zz-games.github.io/site/games/hole-io/", image: "covers/hole-io.jpg" },
  { title: "Dunk Shot", category: "Sports", repo: "Dunk-Shot", url: "https://zz-games.github.io/site/games/dunk-shot/", image: "covers/dunk-shot.jpg" },
  { title: "Moto X3M", category: "Racing", repo: "MotoX3M", url: "https://zz-games.github.io/site/games/motox3m/", image: "covers/moto-x3m.jpg" },
  { title: "Fly the Plane", category: "Arcade", user: "zz126j", repo: "Fly-the-plane", url: "https://zz-games.github.io/site/games/fly-the-plane/", image: "covers/fly-the-plane.jpg" },
  { title: "Among Us", category: "Action", repo: "Among-Us", url: "https://zz-games.github.io/site/games/among-us/", image: "covers/among-us.jpg" },
  { title: "Super Liquid Soccer", category: "Sports", repo: "Super-Liquid-Soccer", url: "https://zz-games.github.io/site/games/super-liquid-soccer/", image: "covers/super-liquid-soccer.jpg" },
  { title: "Wrestle Bros", category: "Sports", repo: "WrestleBros", url: "https://zz-games.github.io/site/games/wrestlebros/", image: "covers/wrestle-bros.jpg" },
  { title: "Ramp Car vs Police", category: "Racing", user: "zz126j", repo: "Ramp-Car-vs-Police", url: "https://zz-games.github.io/site/games/ramp-car-vs-police/", image: "covers/ramp-car-vs-police.jpg" },
  { title: "Basketball Stars", category: "Sports", repo: "Basketball-Stars", url: "https://zz-games.github.io/site/games/basketball-stars/", image: "covers/basketball-stars.jpg", hot: true },
  { title: "Draw Climber", category: "Puzzle", repo: "Draw-Climber", url: "https://zz-games.github.io/site/games/draw-climber/", image: "covers/draw-climber.jpg" },
  { title: "Blaze Drifter", category: "Racing", repo: "Blaze-Drifters-", url: "https://zz-games.github.io/site/games/blaze-drifters/", image: "covers/blaze-drifter.jpg" },
  { title: "Mad Pursuit", category: "Racing", user: "zz126j", repo: "Mad-Pursuit", url: "https://zz-games.github.io/site/games/mad-pursuit/", image: "covers/mad-pursuit.jpg" },
  { title: "Football Bros", category: "Sports", repo: "FootballBros", url: "https://zz-games.github.io/site/games/footballbros/", image: "covers/football-bros.jpg" },
  { title: "Soccer Bros", category: "Sports", repo: "SoccerBros", url: "https://zz-games.github.io/site/games/soccerbros/", image: "covers/soccer-bros.jpg" },
  { title: "Baseball Bros", category: "Sports", repo: "BaseballBros", url: "https://zz-games.github.io/site/games/baseballbros/", image: "covers/baseball-bros.jpg" },
  { title: "Google Snake", category: "Retro", repo: "Snake-Game-Goog", url: "https://zz-games.github.io/site/games/snake-game-goog/1.3/", image: "covers/google-snake.jpg" },
  { title: "Sky Race 3D", category: "Racing", repo: "Sky-Race-3d", url: "https://zz-games.github.io/site/games/sky-race-3d/", image: "covers/sky-race-3d.jpg" },
  { title: "Stack Ball", category: "Arcade", repo: "Stack-Ball-io", url: "https://zz-games.github.io/site/games/stack-ball-io/", image: "covers/stack-ball.jpg" },
  { title: "Google Doodle Baseball", category: "Retro", repo: "Google-Doodle-Baseball", url: "https://zz-games.github.io/site/games/google-doodle-baseball/", image: "covers/google-doodle-baseball.jpg" },
  { title: "Mr. Car Racer", category: "Racing", repo: "Mr-Car-Racer", url: "https://zz-games.github.io/site/games/mr-car-racer/", image: "covers/mr-car-racer.jpg" },
  { title: "Blackjack", category: "Other", repo: "Blackjack", url: "https://zz-games.github.io/site/games/blackjack/", image: "covers/blackjack.jpg" },
  { title: "Stickman Duel", category: "Action", repo: "StickmanDuel", url: "https://zz-games.github.io/site/games/stickmanduel/", image: "covers/stickman-duel.jpg" },
  { title: "Bad Piggies", category: "Puzzle", repo: "Bad-Piggies", url: "https://zz-games.github.io/site/games/bad-piggies/", image: "covers/bad-piggies.jpg" },
  { title: "Golf Battle", category: "Sports", repo: "Golf-Battle", url: "https://zz-games.github.io/site/games/golf-battle/", image: "covers/golf-battle.jpg" },
  { title: "Jetski Race", category: "Racing", repo: "Jetski-Race", url: "https://zz-games.github.io/site/games/jetski-race/", image: "covers/jetski-race.jpg" },
  { title: "Tall.io", category: "Arcade", repo: "tall-io", url: "https://zz-games.github.io/site/games/tall-io/", image: "covers/tall-io.jpg" },
  { title: "Crazy Plane Landing", category: "Arcade", repo: "Crazy-Plane-Landing", url: "https://zz-games.github.io/site/games/crazy-plane-landing/", image: "covers/crazy-plane-landing.jpg" },
  { title: "Five Nights at Freddy's", category: "Action", repo: "FNAF", url: "https://zz-games.github.io/site/games/fnaf/", image: "covers/five-nights-at-freddy-s.jpg", tags: "fnaf" },
  { title: "Money Rush", category: "Arcade", repo: "Money-Rush", url: "https://zz-games.github.io/site/games/money-rush/", image: "covers/money-rush.jpg" },
  { title: "Grass Mowing Simulator", category: "Other", repo: "Stone-Grass-Mowing-Simulator", url: "https://zz-games.github.io/site/games/stone-grass-mowing-simulator/", image: "covers/grass-mowing-simulator.jpg" },
  { title: "Elytra Flight", category: "Arcade", repo: "Elytra-Flight", url: "https://zz-games.github.io/site/games/elytra-flight/", image: "covers/elytra-flight.jpg" },
  { title: "Crazy Motorcycle", category: "Racing", repo: "Crazy-Motercycle", url: "https://zz-games.github.io/site/games/crazy-motercycle/", image: "covers/crazy-motorcycle.jpg" },
  { title: "Crossy Road", category: "Arcade", repo: "Crossy-Road", url: "https://zz-games.github.io/site/games/crossy-road/", image: "covers/crossy-road.jpg" },
  { title: "Suika Game", category: "Puzzle", repo: "Suika-game", url: "https://zz-games.github.io/site/games/suika-game/", image: "covers/suika-game.jpg" },
  { title: "Dune Dash", category: "Racing", repo: "Dune-Dash", url: "https://zz-games.github.io/site/games/dune-dash/", image: "covers/dune-dash.jpg" },
  { title: "Cut the Rope", category: "Puzzle", repo: "CutTheRope", url: "https://zz-games.github.io/site/games/cuttherope/", image: "covers/cut-the-rope.jpg" },
  { title: "Tanuki Sunset", category: "Racing", repo: "Tanuki-Sunset", url: "https://zz-games.github.io/site/games/tanuki-sunset/", image: "covers/tanuki-sunset.jpg" },
  { title: "Angry Birds", category: "Puzzle", repo: "Angry-Birds", url: "https://zz-games.github.io/site/games/angry-birds/", image: "covers/angry-birds.jpg" },
  { title: "Icy Purple Head", category: "Puzzle", repo: "Icy-Purple-Head", url: "https://zz-games.github.io/site/games/icy-purple-head/", image: "covers/icy-purple-head.jpg" },
  { title: "BitLife", category: "Other", repo: "bitlife", url: "https://zz-games.github.io/site/games/bitlife/", image: "covers/bitlife.jpg" },
  { title: "Poly Billiards", category: "Sports", user: "zz126j", repo: "Poly-Billiards", url: "https://zz-games.github.io/site/games/poly-billiards/", image: "covers/poly-billiards.jpg" },
  { title: "Tower Crash 3D", category: "Arcade", repo: "Tower-Crash-3d", url: "https://zz-games.github.io/site/games/tower-crash-3d/", image: "covers/tower-crash-3d.jpg" },
  { title: "Highway Traffic 3D", category: "Racing", repo: "HighwayTraffic3D", url: "https://zz-games.github.io/site/games/highwaytraffic3d/", image: "covers/highway-traffic-3d.jpg" },
  { title: "OvO", category: "Arcade", repo: "OvO", url: "https://zz-games.github.io/site/games/ovo/", image: "covers/ovo.jpg" },
  { title: "Paper.io 2", category: "Arcade", repo: "Paperio2", url: "https://zz-games.github.io/site/games/paperio2/", image: "covers/paper-io-2.jpg", imagePos: "center 20%", hot: true },
  { title: "Cookie Clicker", category: "Other", repo: "CookieClicker", url: "https://zz-games.github.io/site/games/cookieclicker/", image: "covers/cookie-clicker.jpg" },
  { title: "Knife Hit", category: "Arcade", repo: "Knife-Hit", url: "https://zz-games.github.io/site/games/knife-hit/", image: "covers/knife-hit-2.jpg" },
  { title: "Super Knife", category: "Action", repo: "Super-Knife", url: "https://zz-games.github.io/site/games/super-knife/", image: "covers/super-knife-2.jpg" },
  { title: "Contra", category: "Retro", repo: "Contra", url: "https://zz-games.github.io/site/games/contra/", image: "covers/contra.jpg", new: true },
  { title: "Candy Crush", category: "Puzzle", repo: "Candy-Crush", url: "https://zz-games.github.io/site/games/candy-crush/", image: "covers/candy-crush-2.jpg", new: true },
  { title: "Chain Pop", category: "Puzzle", repo: "Chain-Pop", url: "https://zz-games.github.io/site/games/chain-pop/", image: "covers/chain-pop-2.jpg", new: true },
  { title: "Idle Miner Tycoon", category: "Other", repo: "Idle-Miner-Tycoon", url: "https://zz-games.github.io/site/games/idle-miner-tycoon/", image: "covers/idle-miner-tycoon.jpg", new: true },
  { title: "Time Shooter 2", category: "Action", repo: "Time-Shooter-2", url: "https://zz-games.github.io/site/games/time-shooter-2/", image: "covers/time-shooter-2.jpg", new: true },
  { title: "Hill Climb Racing", category: "Racing", repo: "Hill-Climb", url: "https://zz-games.github.io/site/games/hill-climb/", image: "covers/hill-climb.jpg", new: true },
  { title: "Jetpack Joyride", category: "Arcade", repo: "Jetpack-Joyride", url: "https://zz-games.github.io/site/games/jetpack-joyride/", image: "covers/jetpack-joyride.jpg", new: true },
  { title: "Stick Merge", category: "Action", repo: "Stick-Merge", url: "https://zz-games.github.io/site/games/stick-merge/", image: "covers/stick-merge.jpg", new: true },
  { title: "Crazy Cattle 3D", category: "Action", repo: "Crazy-Cattle-3D", url: "https://zz-games.github.io/site/games/crazy-cattle-3d/", image: "covers/crazy-cattle-3d.jpg", new: true, featured: true },

  { title: "Basket Champs", category: "Sports", repo: "BasketChamps", image: "covers/basket-champs.jpg?v=2", new: true },
  { title: "Axis Football League", category: "Sports", repo: "AxisFootballLeague", image: "covers/axis-football-league.jpg?v=2", new: true },
  { title: "Ping Pong Go!", category: "Sports", repo: "ping", image: "covers/ping-pong-go.jpg?v=2", new: true, tags: "table tennis" },
  { title: "Bloons TD 4", category: "Other", repo: "BloonsTowerDefense4", image: "covers/bloons-td-4.jpg?v=2", new: true, tags: "bloons tower defense btd4 strategy" },
  { title: "Gun Mayhem", category: "Action", repo: "GunMayhem", image: "covers/gun-mayhem.jpg?v=3", new: true },
  { title: "Nitro Knights.io", category: "Action", repo: "NitroKnightsIO", image: "covers/nitro-knights-io.jpg?v=3", new: true },
  { title: "Trains.io", category: "Arcade", repo: "TrainsIO", image: "covers/trains-io.jpg?v=3", new: true },
  { title: "WormEat.io", category: "Arcade", repo: "WormEatIO", image: "covers/wormeat-io.jpg?v=3", new: true, tags: "worm snake" },
  { title: "GoTet.io", category: "Arcade", repo: "GoTetIO", image: "covers/gotet-io.jpg?v=3", new: true },
  { title: "Dots.io", category: "Arcade", repo: "DotsIO", image: "covers/dots-io.jpg", new: true },

  // No link yet — add a url (or repo) and remove the // to put these on the site
  // { title: "Henry Stickman", category: "Action", repo: "", url: "", image: "covers/henry-stickman.jpg" },
  // { title: "Snowball.io", category: "Arcade", repo: "", url: "", image: "covers/snowball-io.jpg" },
  // { title: "Fruit Ninja", category: "Arcade", repo: "", url: "", image: "covers/fruit-ninja.jpg" },
  // { title: "World's Hardest Game", category: "Puzzle", repo: "", url: "", image: "covers/world-s-hardest-game.jpg" },
];
