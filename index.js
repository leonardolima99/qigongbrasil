import axios from 'axios';
import {load} from 'cheerio';
import fs from 'fs';

const BASE_URL = 'https://qigongbrasil.blogspot.com'
const SITE_MAP = `${BASE_URL}/sitemap.xml`
const getPage = async () => {
  return await axios.get(SITE_MAP)
}
const getItems = (html) => {
  const $ = load(html, {xmlMode: true});
  const articles = [];
  $('url').each((i, element) => {
    articles.push({
      url: $('loc', element).text(),
      updated: new Date($('lastmod', element).text())
    })
  })
  handleFile(articles)
}
const handleFile = async (content) => {
  try {
    const file = await fs.readFileSync('./data/articlesUrl.json');
    return file
  } catch (error) {
    await fs.createWriteStream('./data/articlesUrl.json');
  } finally {
    await fs.writeFileSync('./data/articlesUrl.json', JSON.stringify(content))
  }
}
const sitemap = await getPage()
getItems(sitemap.data);
