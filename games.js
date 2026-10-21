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
//  featured – true puts it in the big banner at the top (pick one)
//  versions – optional list of { label, url } to let players pick a version (see Retro Bowl)
// ============================================================

const SITE = {
  name: "ZZ Games",
  githubUser: "ZZ-games",
  requestFormUrl: "https://forms.gle/dwiUv1H8pbPhJFhm8", // old form (backup)
  // The "Request a game" page sends answers to your Google Form.
  // entry = the id of a paragraph question in that form, like "entry.123456789"
  requestForm: {
    formId: "1FAIpQLSfksIhmSJWLb5yaeU3DiJLbKBItyC2tnGHBCvFPN_bd6VfPdA",
    entry: "entry.366340186",
  },
};

const GAMES = [
  { title: "Tung Tung Kart", category: "Racing", user: "ZZ-Interactives", repo: "Tung-Tung-Kart", url: "https://tung-tung-kart.netlify.app/", image: "images/covers/tung-tung-kart.jpg", featured: true },

  { title: "Slope", category: "Arcade", repo: "Slope", url: "games/slope/", image: "images/covers/slope.jpg" },
  { title: "Geometry Dash Lite", category: "Arcade", repo: "geometry-dash", url: "", image: "images/covers/geometry-dash-lite.jpg" },
  { title: "Stickman Hook", category: "Arcade", repo: "Stickman-Hook", url: "games/stickman-hook/", image: "images/covers/stickman-hook.jpg" },
  { title: "Block Blasts", category: "Puzzle", repo: "Block-Blast", url: "games/block-blast/", image: "images/covers/block-blasts.jpg" },
  { title: "Basket Random", category: "Sports", repo: "Basket-Random", url: "games/basket-random/", image: "images/covers/basket-random.jpg" },
  { title: "Cluster Rush", category: "Arcade", user: "zz126j", repo: "Cluster-Rush", url: "games/cluster-rush/", image: "images/covers/cluster-rush.jpg" },
  { title: "Drive Mad", category: "Racing", repo: "drive-mad", url: "games/drive-mad/", image: "images/covers/drive-mad.jpg" },
  { title: "Table Tennis World Tour", category: "Sports", repo: "Table-Tennis-World-Tour", url: "games/table-tennis-world-tour/", image: "images/covers/table-tennis-world-tour.jpg" },
  { title: "Retro Bowl", category: "Sports", repo: "retro-bowl", url: "games/retro-bowl/", image: "images/covers/retro-bowl.jpg",
    versions: [
      { label: "Normal", url: "games/retro-bowl/" },
      { label: "Hacked", url: "games/retro-bowl-glitched/", note: "999 coaching credits and free upgrades. Saves separately from Normal." },
    ] },
  { title: "Retro Bowl College", category: "Sports", repo: "Retro-Bowl-College", url: "games/retro-bowl-college/", image: "images/covers/retro-bowl-college.jpg" },
  { title: "Slow Roads", category: "Racing", repo: "slow-roads", url: "games/slow-roads/", image: "images/covers/slow-roads.jpg" },
  { title: "Krillion", category: "Puzzle", repo: "Open-Krillion.io", url: "games/krillion/", image: "images/covers/krillion.jpg" },
  { title: "Summer Rider", category: "Racing", user: "zz126j", repo: "SummerRider", url: "games/summerrider/", image: "images/covers/summer-rider.jpg" },
  { title: "Ragdoll Archers", category: "Action", repo: "RagdollArchers", url: "games/ragdollarchers/", image: "images/covers/ragdoll-archers.jpg" },
  { title: "Rooftop Run", category: "Arcade", repo: "Rooftop-Run", url: "games/rooftop-run/", image: "images/covers/rooftop-run.jpg" },
  { title: "Moto Road Rash 3D", category: "Racing", repo: "MotoRoadRash3D", url: "", image: "images/covers/moto-road-rash-3d.jpg" },
  { title: "Survival Race", category: "Racing", repo: "Survival-Race", url: "games/survival-race/", image: "images/covers/survival-race.jpg" },
  { title: "Snow Rider", category: "Racing", user: "zz126j", repo: "SnowRider", url: "games/snowrider/", image: "images/covers/snow-rider.jpg" },
  { title: "PolyTrack", category: "Racing", repo: "polytrack2", url: "games/polytrack2/", image: "images/covers/polytrack.jpg" },
  { title: "Drift Boss", category: "Racing", repo: "Drift-Boss", url: "games/drift-boss/", image: "images/covers/drift-boss.jpg", imagePos: "8% center" },
  { title: "Subway Surfers", category: "Arcade", repo: "subway-surfers", url: "", image: "images/covers/subway-surfers.jpg" },
  { title: "Apple Worm", category: "Puzzle", repo: "Apple-Worm", url: "games/apple-worm/", image: "images/covers/apple-worm.jpg" },
  { title: "Escape Road", category: "Racing", repo: "Escape-Road", url: "games/escape-road/", image: "images/covers/escape-road.jpg" },
  { title: "Hole.io", category: "Arcade", repo: "Hole.io", url: "games/hole-io/", image: "images/covers/hole-io.jpg" },
  { title: "Dunk Shot", category: "Sports", repo: "Dunk-Shot", url: "games/dunk-shot/", image: "images/covers/dunk-shot.jpg" },
  { title: "Moto X3M", category: "Racing", repo: "MotoX3M", url: "games/motox3m/", image: "images/covers/moto-x3m.jpg" },
  { title: "Fly the Plane", category: "Arcade", user: "zz126j", repo: "Fly-the-plane", url: "games/fly-the-plane/", image: "images/covers/fly-the-plane.jpg" },
  { title: "Among Us", category: "Action", repo: "Among-Us", url: "games/among-us/", image: "images/covers/among-us.jpg" },
  { title: "Super Liquid Soccer", category: "Sports", repo: "Super-Liquid-Soccer", url: "games/super-liquid-soccer/", image: "images/covers/super-liquid-soccer.jpg" },
  { title: "Wrestle Bros", category: "Sports", repo: "WrestleBros", url: "games/wrestlebros/", image: "images/covers/wrestle-bros.jpg" },
  { title: "Ramp Car vs Police", category: "Racing", user: "zz126j", repo: "Ramp-Car-vs-Police", url: "games/ramp-car-vs-police/", image: "images/covers/ramp-car-vs-police.jpg" },
  { title: "Basketball Stars", category: "Sports", repo: "Basketball-Stars", url: "games/basketball-stars/", image: "images/covers/basketball-stars.jpg" },
  { title: "Draw Climber", category: "Puzzle", repo: "Draw-Climber", url: "games/draw-climber/", image: "images/covers/draw-climber.jpg" },
  { title: "Blaze Drifter", category: "Racing", repo: "Blaze-Drifters-", url: "games/blaze-drifters/", image: "images/covers/blaze-drifter.jpg" },
  { title: "Mad Pursuit", category: "Racing", user: "zz126j", repo: "Mad-Pursuit", url: "games/mad-pursuit/", image: "images/covers/mad-pursuit.jpg" },
  { title: "Football Bros", category: "Sports", repo: "FootballBros", url: "games/footballbros/", image: "images/covers/football-bros.jpg" },
  { title: "Soccer Bros", category: "Sports", repo: "SoccerBros", url: "games/soccerbros/", image: "images/covers/soccer-bros.jpg" },
  { title: "Baseball Bros", category: "Sports", repo: "BaseballBros", url: "games/baseballbros/", image: "images/covers/baseball-bros.jpg" },
  { title: "Google Snake", category: "Retro", repo: "Snake-Game-Goog", url: "games/snake-game-goog/1.3/", image: "images/covers/google-snake.jpg" },
  { title: "Sky Race 3D", category: "Racing", repo: "Sky-Race-3d", url: "games/sky-race-3d/", image: "images/covers/sky-race-3d.jpg" },
  { title: "Stack Ball", category: "Arcade", repo: "Stack-Ball-io", url: "games/stack-ball-io/", image: "images/covers/stack-ball.jpg" },
  { title: "Google Doodle Baseball", category: "Retro", repo: "Google-Doodle-Baseball", url: "games/google-doodle-baseball/", image: "images/covers/google-doodle-baseball.jpg" },
  { title: "Mr. Car Racer", category: "Racing", repo: "Mr-Car-Racer", url: "games/mr-car-racer/", image: "images/covers/mr-car-racer.jpg" },
  { title: "Blackjack", category: "Other", repo: "Blackjack", url: "games/blackjack/", image: "images/covers/blackjack.jpg" },
  { title: "Stickman Duel", category: "Action", repo: "StickmanDuel", url: "games/stickmanduel/", image: "images/covers/stickman-duel.jpg" },
  { title: "Bad Piggies", category: "Puzzle", repo: "Bad-Piggies", url: "games/bad-piggies/", image: "images/covers/bad-piggies.jpg" },
  { title: "Golf Battle", category: "Sports", repo: "Golf-Battle", url: "games/golf-battle/", image: "images/covers/golf-battle.jpg" },
  { title: "Jetski Race", category: "Racing", repo: "Jetski-Race", url: "games/jetski-race/", image: "images/covers/jetski-race.jpg" },
  { title: "Tall.io", category: "Arcade", repo: "tall-io", url: "games/tall-io/", image: "images/covers/tall-io.jpg" },
  { title: "Crazy Plane Landing", category: "Arcade", repo: "Crazy-Plane-Landing", url: "games/crazy-plane-landing/", image: "images/covers/crazy-plane-landing.jpg" },
  { title: "Five Nights at Freddy's", category: "Action", repo: "FNAF", url: "games/fnaf/", image: "images/covers/five-nights-at-freddy-s.jpg" },
  { title: "Money Rush", category: "Arcade", repo: "Money-Rush", url: "games/money-rush/", image: "images/covers/money-rush.jpg" },
  { title: "Grass Mowing Simulator", category: "Other", repo: "Stone-Grass-Mowing-Simulator", url: "games/stone-grass-mowing-simulator/", image: "images/covers/grass-mowing-simulator.jpg" },
  { title: "Elytra Flight", category: "Arcade", repo: "Elytra-Flight", url: "games/elytra-flight/", image: "images/covers/elytra-flight.jpg" },
  { title: "Crazy Motorcycle", category: "Racing", repo: "Crazy-Motercycle", url: "games/crazy-motercycle/", image: "images/covers/crazy-motorcycle.jpg" },
  { title: "Crossy Road", category: "Arcade", repo: "Crossy-Road", url: "games/crossy-road/", image: "images/covers/crossy-road.jpg" },
  { title: "Suika Game", category: "Puzzle", repo: "Suika-game", url: "games/suika-game/", image: "images/covers/suika-game.jpg" },
  { title: "Dune Dash", category: "Racing", repo: "Dune-Dash", url: "games/dune-dash/", image: "images/covers/dune-dash.jpg" },
  { title: "Cut the Rope", category: "Puzzle", repo: "CutTheRope", url: "games/cuttherope/", image: "images/covers/cut-the-rope.jpg" },
  { title: "Tanuki Sunset", category: "Racing", repo: "Tanuki-Sunset", url: "games/tanuki-sunset/", image: "images/covers/tanuki-sunset.jpg" },
  { title: "Angry Birds", category: "Puzzle", repo: "Angry-Birds", url: "games/angry-birds/", image: "images/covers/angry-birds.jpg" },
  { title: "Icy Purple Head", category: "Puzzle", repo: "Icy-Purple-Head", url: "games/icy-purple-head/", image: "images/covers/icy-purple-head.jpg" },
  { title: "BitLife", category: "Other", repo: "bitlife", url: "games/bitlife/", image: "images/covers/bitlife.jpg" },
  { title: "Poly Billiards", category: "Sports", user: "zz126j", repo: "Poly-Billiards", url: "games/poly-billiards/", image: "images/covers/poly-billiards.jpg" },
  { title: "Tower Crash 3D", category: "Arcade", repo: "Tower-Crash-3d", url: "games/tower-crash-3d/", image: "images/covers/tower-crash-3d.jpg" },
  { title: "Highway Traffic 3D", category: "Racing", repo: "HighwayTraffic3D", url: "games/highwaytraffic3d/", image: "images/covers/highway-traffic-3d.jpg" },
  { title: "OvO", category: "Arcade", repo: "OvO", url: "games/ovo/", image: "images/covers/ovo.jpg" },
  { title: "Paper.io 2", category: "Arcade", repo: "Paperio2", url: "games/paperio2/", image: "images/covers/paper-io-2.jpg", imagePos: "center 20%" },
  { title: "Cookie Clicker", category: "Other", repo: "CookieClicker", url: "games/cookieclicker/", image: "images/covers/cookie-clicker.jpg" },
];
