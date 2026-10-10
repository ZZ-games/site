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
// ============================================================

const SITE = {
  name: "ZZ Games",
  tagline: "Fast games. No waiting. Just play.",
  githubUser: "ZZ-games",
  requestFormUrl: "https://sites.google.com/view/zz-games-/feature-requests/request-form",
};

const GAMES = [
  { title: "Kart Rush GP", category: "Racing", repo: "", url: "", image: "", featured: true },

  { title: "Slope", category: "Arcade", repo: "Slope", url: "games/slope/", image: "" },
  { title: "Geometry Dash Lite", category: "Arcade", repo: "geometry-dash", url: "", image: "images/covers/geometry-dash-lite.jpg" },
  { title: "Stickman Hook", category: "Arcade", repo: "Stickman-Hook", url: "games/stickman-hook/", image: "images/covers/stickman-hook.jpg" },
  { title: "Block Blasts", category: "Puzzle", repo: "Block-Blast", url: "games/block-blast/", image: "" },
  { title: "Basket Random", category: "Sports", repo: "Basket-Random", url: "games/basket-random/", image: "" },
  { title: "Cluster Rush", category: "Arcade", user: "zz126j", repo: "Cluster-Rush", url: "games/cluster-rush/", image: "" },
  { title: "Drive Mad", category: "Racing", repo: "drive-mad", url: "games/drive-mad/", image: "images/covers/drive-mad.jpg" },
  { title: "Table Tennis World Tour", category: "Sports", repo: "Table-Tennis-World-Tour", url: "games/table-tennis-world-tour/", image: "" },
  { title: "Retro Bowl", category: "Sports", repo: "retro-bowl", url: "games/retro-bowl/", image: "images/covers/retro-bowl.jpg" },
  { title: "Slow Roads", category: "Racing", repo: "slow-roads", url: "games/slow-roads/", image: "images/covers/slow-road.jpg" },
  { title: "Summer Rider", category: "Racing", user: "zz126j", repo: "SummerRider", url: "games/summerrider/", image: "" },
  { title: "Ragdoll Archers", category: "Action", repo: "RagdollArchers", url: "games/ragdollarchers/", image: "images/covers/ragdoll-archers.jpg" },
  { title: "Rooftop Run", category: "Arcade", repo: "Rooftop-Run", url: "games/rooftop-run/", image: "" },
  { title: "Moto Road Rash 3D", category: "Racing", repo: "MotoRoadRash3D", url: "", image: "images/covers/moto-road-rash-3d.jpg" },
  { title: "Survival Race", category: "Racing", repo: "Survival-Race", url: "games/survival-race/", image: "images/covers/survival-race.jpg" },
  { title: "Snow Rider", category: "Racing", user: "zz126j", repo: "SnowRider", url: "games/snowrider/", image: "" },
  { title: "PolyTrack", category: "Racing", repo: "polytrack2", url: "games/polytrack2/", image: "images/covers/polytrack.jpg" },
  { title: "Drift Boss", category: "Racing", repo: "Drift-Boss", url: "games/drift-boss/", image: "" },
  { title: "Subway Surfers", category: "Arcade", repo: "subway-surfers", url: "", image: "images/covers/subway-surfers.jpg" },
  { title: "Apple Worm", category: "Puzzle", repo: "Apple-Worm", url: "games/apple-worm/", image: "" },
  { title: "Escape Road", category: "Racing", repo: "", url: "", image: "" },
  { title: "Hole.io", category: "Arcade", repo: "", url: "", image: "" },
  { title: "Dunk Shot", category: "Sports", repo: "", url: "", image: "" },
  { title: "Moto X3M", category: "Racing", repo: "", url: "", image: "" },
  { title: "Fly the Plane", category: "Arcade", user: "zz126j", repo: "Fly-the-plane", url: "games/fly-the-plane/", image: "" },
  { title: "Among Us", category: "Action", repo: "", url: "", image: "" },
  { title: "Super Liquid Soccer", category: "Sports", repo: "", url: "", image: "" },
  { title: "Wrestle Bros", category: "Sports", repo: "", url: "", image: "" },
  { title: "Flip Man", category: "Arcade", user: "zz126j", repo: "flip-man", url: "games/flip-man/", image: "" },
  { title: "Ramp Car vs Police", category: "Racing", user: "zz126j", repo: "Ramp-Car-vs-Police", url: "games/ramp-car-vs-police/", image: "" },
  { title: "Basketball Stars", category: "Sports", repo: "", url: "", image: "" },
  { title: "Draw Climber", category: "Puzzle", repo: "", url: "", image: "" },
  { title: "Blaze Drifter", category: "Racing", repo: "", url: "", image: "" },
  { title: "Mad Pursuit", category: "Racing", user: "zz126j", repo: "Mad-Pursuit", url: "games/mad-pursuit/", image: "" },
  { title: "Football Bros", category: "Sports", repo: "", url: "", image: "" },
  { title: "Soccer Bros", category: "Sports", repo: "", url: "", image: "" },
  { title: "Baseball Bros", category: "Sports", repo: "", url: "", image: "" },
  { title: "Google Snake", category: "Retro", repo: "", url: "", image: "" },
  { title: "Sky Race 3D", category: "Racing", repo: "", url: "", image: "" },
  { title: "Stack Ball", category: "Arcade", repo: "", url: "", image: "" },
  { title: "Google Doodle Baseball", category: "Retro", repo: "", url: "", image: "" },
  { title: "Mr. Car Racer", category: "Racing", repo: "", url: "", image: "" },
  { title: "Blackjack", category: "Other", repo: "", url: "", image: "" },
  { title: "Stickman Duel", category: "Action", repo: "", url: "", image: "" },
  { title: "Bad Piggies", category: "Puzzle", repo: "", url: "", image: "" },
  { title: "Golf Battle", category: "Sports", repo: "", url: "", image: "" },
  { title: "Henry Stickman", category: "Action", repo: "", url: "", image: "" },
  { title: "Jetski Race", category: "Racing", repo: "", url: "", image: "" },
  { title: "Tall.io", category: "Arcade", repo: "", url: "", image: "" },
  { title: "Crazy Plane Landing", category: "Arcade", repo: "", url: "", image: "" },
  { title: "Five Nights at Freddy's", category: "Action", repo: "", url: "", image: "" },
  { title: "Snowball.io", category: "Arcade", repo: "", url: "", image: "" },
  { title: "Money Rush", category: "Arcade", repo: "", url: "", image: "" },
  { title: "Grass Mowing Simulator", category: "Other", repo: "", url: "", image: "" },
  { title: "Elytra Flight", category: "Arcade", repo: "", url: "", image: "" },
  { title: "Crazy Motorcycle", category: "Racing", repo: "", url: "", image: "" },
  { title: "Crossy Road", category: "Arcade", repo: "", url: "", image: "" },
  { title: "Fruit Ninja", category: "Arcade", repo: "", url: "", image: "" },
  { title: "Suika Game", category: "Puzzle", repo: "", url: "", image: "" },
  { title: "Dune Dash", category: "Racing", repo: "", url: "", image: "" },
  { title: "Cut the Rope", category: "Puzzle", repo: "", url: "", image: "" },
  { title: "Tanuki Sunset", category: "Racing", repo: "", url: "", image: "" },
  { title: "Angry Birds", category: "Puzzle", repo: "", url: "", image: "" },
  { title: "Icy Purple Head", category: "Puzzle", repo: "", url: "", image: "" },
  { title: "BitLife", category: "Other", repo: "", url: "", image: "" },
  { title: "World's Hardest Game", category: "Puzzle", repo: "", url: "", image: "" },
  { title: "Poly Billiards", category: "Sports", user: "zz126j", repo: "Poly-Billiards", url: "games/poly-billiards/", image: "images/covers/poly-billiards.jpg" },
];
