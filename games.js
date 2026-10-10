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

  { title: "Slope", category: "Arcade", repo: "Slope", url: "", image: "" },
  { title: "Geometry Dash Lite", category: "Arcade", repo: "geometry-dash", url: "", image: "" },
  { title: "Stickman Hook", category: "Arcade", repo: "Stickman-Hook", url: "", image: "" },
  { title: "Block Blasts", category: "Puzzle", repo: "Block-Blast", url: "", image: "" },
  { title: "Basket Random", category: "Sports", repo: "Basket-Random", url: "", image: "" },
  { title: "Cluster Rush", category: "Arcade", user: "zz126j", repo: "Cluster-Rush", url: "", image: "" },
  { title: "Drive Mad", category: "Racing", repo: "drive-mad", url: "", image: "" },
  { title: "Table Tennis World Tour", category: "Sports", repo: "Table-Tennis-World-Tour", url: "", image: "" },
  { title: "Retro Bowl", category: "Sports", repo: "retro-bowl", url: "", image: "" },
  { title: "Slow Road", category: "Racing", repo: "slow-roads", url: "", image: "" },
  { title: "Summer Rider", category: "Racing", user: "zz126j", repo: "SummerRider", url: "", image: "" },
  { title: "Ragdoll Archers", category: "Action", repo: "RagdollArchers", url: "", image: "" },
  { title: "Rooftop Run", category: "Arcade", repo: "Rooftop-Run", url: "", image: "" },
  { title: "Moto Road Rash 3D", category: "Racing", repo: "MotoRoadRash3D", url: "", image: "" },
  { title: "Survival Race", category: "Racing", repo: "Survival-Race", url: "", image: "" },
  { title: "Snow Rider", category: "Racing", user: "zz126j", repo: "SnowRider", url: "", image: "" },
  { title: "PolyTrack", category: "Racing", repo: "polytrack2", url: "", image: "" },
  { title: "Drift Boss", category: "Racing", repo: "Drift-Boss", url: "", image: "" },
  { title: "Subway Surfers", category: "Arcade", repo: "subway-surfers", url: "", image: "" },
  { title: "Apple Worm", category: "Puzzle", repo: "Apple-Worm", url: "", image: "" },
  { title: "Escape Road", category: "Racing", repo: "", url: "", image: "" },
  { title: "Hole.io", category: "Arcade", repo: "", url: "", image: "" },
  { title: "Dunk Shot", category: "Sports", repo: "", url: "", image: "" },
  { title: "Moto X3M", category: "Racing", repo: "", url: "", image: "" },
  { title: "Fly the Plane", category: "Arcade", user: "zz126j", repo: "Fly-the-plane", url: "", image: "" },
  { title: "Among Us", category: "Action", repo: "", url: "", image: "" },
  { title: "Super Liquid Soccer", category: "Sports", repo: "", url: "", image: "" },
  { title: "Wrestle Bros", category: "Sports", repo: "", url: "", image: "" },
  { title: "Flip Man", category: "Arcade", user: "zz126j", repo: "flip-man", url: "", image: "" },
  { title: "Ramp Car vs Police", category: "Racing", user: "zz126j", repo: "Ramp-Car-vs-Police", url: "", image: "" },
  { title: "Basketball Stars", category: "Sports", repo: "", url: "", image: "" },
  { title: "Draw Climber", category: "Puzzle", repo: "", url: "", image: "" },
  { title: "Blaze Drifter", category: "Racing", repo: "", url: "", image: "" },
  { title: "Mad Pursuit", category: "Racing", user: "zz126j", repo: "Mad-Pursuit", url: "", image: "" },
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
  { title: "Poly Billiards", category: "Sports", user: "zz126j", repo: "Poly-Billiards", url: "", image: "" },
];
