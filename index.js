/**
 * Pensar em uma solução para nõa buscar artigos já baixados.
 * Talvez quando usar um banco de dados, fique mais simples.
 */

import axios from 'axios';
import {load} from 'cheerio';
import fs from 'fs';
import { setTimeout } from 'timers/promises';
import dotenv from 'dotenv'

import { slugify, getPage, handleFileJSON } from './src/utils.js';

dotenv.config({ path: './.env.local' })
console.log()
const BASE_URL = 'https://qigongbrasil.blogspot.com'
const SITE_MAP = `${BASE_URL}/sitemap.xml`
const PROJECT_KEY = process.env.PROJECT_KEY

const getItems = async (html, xml) => {
  const $ = load(html, {xmlMode: xml});
  if (xml) {
    const articles = [];
    $('url').each((i, element) => {
      articles.push({
        url: $('loc', element).text(),
        updated: new Date($('lastmod', element).text())
      })
    })
    await handleFileJSON('../data/articlesUrl.json', articles)
  } else {
    const article = {
      title: $('.post-title').text(),
      content: $('.post-body').html()
    }
    const slug = slugify(article.title)
    await handleFileJSON(`../data/articles/${slug}.json`, article)
  }
}

const getArticle = async () => {
  const file = JSON.parse(await fs.readFileSync('../data/articlesUrl.json'))
  for (let article of file) {
    await setTimeout(1000)
    const html = await getPage(article.url)
    getItems(html.data, false)
  }
}
const sitemap = await getPage(SITE_MAP)

/* getItems(sitemap.data, true);
getArticle() */


