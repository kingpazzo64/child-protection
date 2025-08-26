const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Put any custom routes here (before the catch-all)
  // e.g. server.get('/health', (req,res) => res.send('OK'));

  // Catch-all handler (important)
  server.use((req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Server running on http://localhost:${port}`);
  });
});
