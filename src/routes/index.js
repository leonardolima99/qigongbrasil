import e from "express";
import {
  scrape_urls,
  scrape_posts,
  get_post,
  get_all_posts,
  search_posts,
} from "../controllers/posts.controller.js";

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

export { router };
