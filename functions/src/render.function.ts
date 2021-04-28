import * as functions from 'firebase-functions';
import * as express from 'express';
import * as useragent from 'express-useragent';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as admin from 'firebase-admin';

const db = admin.firestore();

const file = readFileSync(resolve(__dirname, 'index.html'), {
  encoding: 'utf-8',
});

const replacer = (data: string) => {
  return (match: string, content: string): string => {
    return match.replace(content, data);
  };
};

const buildHtml = (article: { [key: string]: string }) => {
  return file
    .replace(
      /<meta name="description" content="(.+)" \/>/gm,
      replacer(article.body?.substr(0, 200))
    )
    .replace(
      /<meta property="og:description" content="(.+)" \/>/gm,
      replacer(article.body?.substr(0, 200))
    )
    .replace(/content="(.+ogp-cover.png)"/gm, replacer(article.thumbnailURL))
    .replace(/<title>(.+)<\/title>"/gm, replacer(article.title))
    .replace(
      /<meta property="og:title" content="(.+)" \/>/gm,
      replacer(article.title)
    )
    .replace(
      /<meta property="og:url" content="(.+)" \/>/g,
      replacer('https://xxxx/' + article.id)
    );
};

const app = express();

app.use(useragent.express());
app.get('*', async (req: any, res: any) => {
  if (req.useragent.isBot) {
    const article = (await db.doc(`articles/${req.query.id}`).get())?.data();
    if (article) {
      res.send(buildHtml(article));
      return;
    }
  }
  res.send(file);
});

export const render = functions.https.onRequest(app);
