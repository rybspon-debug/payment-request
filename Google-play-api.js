const { getJson } = require("serpapi");

getJson({
  engine: "google_play",
  q: "car",
  api_key: "secret_api_key"
}, (json) => {
  console.log(json["organic_results"]);
});
