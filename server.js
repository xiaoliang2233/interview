const Koa = require('koa');
const fs = require('fs')
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, 'index.html'));
const bundle = fs.readFileSync(path.resolve(__dirname, 'dist/bundle.js'));
const pipeline = fs.readFileSync(path.resolve(__dirname, 'pipeline.jsx'));

const app = new Koa();

app.use(async ctx => {
  if(ctx.url === '/') {
    ctx.response.type = 'html';
    ctx.body = html;
  } else if(ctx.url === '/dist/bundle.js') {
    ctx.body = bundle.toString();
  } else if(ctx.url === '/pipeline.jsx') {
    ctx.body = pipeline.toString();
  } else {
    switch (ctx.url) {
      case '/normal': {
        await new Promise((resolve) => {
          setTimeout(() => {
            ctx.body = 'ok';
            resolve()
          }, 1000)
        })
        break;
      }
      case '/serverError': {
        await new Promise((resolve) => {
          setTimeout(() => {
            ctx.body = 'error';
            ctx.status = 500;
            resolve()
          }, 3000)
        })
        break;
      }
      case '/netWorkError': {
        await new Promise(() => null);
        break;
      }
      default: {
        ctx.body = 'undefined';
      }
    }
  }
});

app.listen(3000);
