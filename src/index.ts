import { resolve } from 'node:path';
import http from 'node:http';
import fs from 'node:fs';

const PORT = 9000;

// Files
const index = fs.readFileSync(resolve(process.cwd(), './public/index.html'));
const style = fs.readFileSync(
  resolve(process.cwd(), './public/styles/style.css')
);
const image = fs.readFileSync(
  resolve(process.cwd(), './public/images/programmer.gif')
);

const server = http.createServer(async (req, res) => {
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write(index);
  } else if (req.url === '/styles/style.css') {
    res.setHeader('Content-Type', 'text/css');
    res.write(style);
  } else if (req.url === '/images/programmer.gif') {
    res.setHeader('Content-Type', 'image/gif');
    res.write(image);
  }

  res.end();
});

server.listen(PORT, () => {
  console.log('Server is listening at http://localhost:%s', PORT);
});
