import axios from "axios";
import { setTimeout } from "timers-promises";
import { load } from "cheerio";
import { Deta } from "deta";

import {
  slugify,
  getPage,
  handleFileJSON,
  get_timestamp_from_string,
} from "../utils/index.js";

import * as dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://qigongbrasil.blogspot.com";
const SITE_MAP = `${BASE_URL}/sitemap.xml`;
const PROJECT_KEY = process.env.PROJECT_KEY;

const deta = Deta(PROJECT_KEY);
const db = deta.Base("posts");

export const scrape_urls = async (req, res) => {
  const sitemap = await getPage(SITE_MAP);
  const $ = load(sitemap.data, { xmlMode: true });
  let count = 0;
  $("url").each(async (i, element) => {
    const post = {
      url: $("loc", element).text(),
      updated: new Date($("lastmod", element).text()).getTime(),
    };
    try {
      const item = await db.put(post);
      count++;
      console.log(count, item);
    } catch (error) {
      console.error(error);
    }
  });
  res.status(201).json({ message: "Done 👌" });
};
export const scrape_posts = async (req, res) => {
  try {
    let result = await db.fetch();
    let allItems = result.items;

    // continue fetching until last is not seen
    while (result.last) {
      result = await db.fetch({}, { last: result.last });
      allItems = allItems.concat(result.items);
    }
    let count = 0;
    for (let post of allItems) {
      await setTimeout(50);
      const html = await getPage(post.url);
      const $ = load(html.data);
      const title = $(".post-title").text();
      const slug = slugify(title);
      const content = () => {
        if (slug === "liberdade") {
          $(".post-body > img").attr(
            "src",
            "https://res.cloudinary.com/dlz7aaj3q/image/upload/v1670479605/flor-min_wpqy0y.webp"
          );
        }
        return $(".post-body").html();
      };
      const editPost = {
        url: post.url,
        updated: new Date(post.updated).getTime(),
        title,
        slug,
        content: content(),
        search: title.toLowerCase(),
        created: get_timestamp_from_string($(".date-header").text()),
      };
      await db.update(editPost, post.key);
      count++;
      console.log(count, editPost.created, editPost.title);
    }
    res.json({ message: "Done 👌" });
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};
export const get_all_posts = async (req, res) => {
  const { last, limit } = req.query;
  let result = await db.fetch({}, { last, limit: Number(limit) });
  let allItems = result.items;

  while (result.last && !limit) {
    result = await db.fetch({}, { last: result.last });
    allItems = allItems.concat(result.items);
  }

  const posts = [];
  for (const item of allItems) {
    posts.push({
      key: item.key,
      title: item.title,
      slug: item.slug,
      updated: item.updated,
      created: item.created,
    });
  }

  res.json({ posts, count: posts.length, last: result.last });
};
export const search_posts = async (req, res) => {
  const { last, limit, q } = req.query;
  let {
    count,
    items,
    last: lastKey,
  } = await db.fetch(
    { "search?contains": q.toLowerCase() },
    { last, limit: Number(limit) }
  );

  const posts = [];
  for (const item of items) {
    posts.push({
      key: item.key,
      title: item.title,
      slug: item.slug,
      updated: item.updated,
      created: item.created,
    });
  }

  res.json({ posts, count, last: lastKey });
};
export const get_post = async (req, res) => {
  const { key } = req.params;
  const item = await db.get(key);
  res.json(item);
};
