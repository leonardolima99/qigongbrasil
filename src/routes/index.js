const e = require("express");
const {
  scrape_urls,
  scrape_posts,
  get_post,
  get_all_posts,
  search_posts,
} = require("../controllers/posts.controller.js");

const router = e.Router();

router
  .get("/", (req, res) => {
    res.send("Hello");
  })
  .get("/posts", get_all_posts)
  .get("/posts/search", search_posts)
  .get("/posts/:key", get_post)
  .post("/scrape_urls", scrape_urls)
  .post("/scrape_posts", scrape_posts);

module.exports = { router };
