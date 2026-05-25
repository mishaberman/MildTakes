import { mkdir, readFile, writeFile } from "node:fs/promises";

const [html, css, config, app] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("styles.css", "utf8"),
  readFile("config.js", "utf8"),
  readFile("app.js", "utf8")
]);

const inline = html
  .replace('<link rel="stylesheet" href="./styles.css" />', `<style>\n${css}\n</style>`)
  .replace('<script src="./config.js" defer></script>', `<script>\n${config}\n</script>`)
  .replace('<script src="./app.js" defer></script>', `<script>\n${app}\n</script>`);

await mkdir("dist", { recursive: true });
await writeFile("dist/local-five.html", inline);
console.log("dist/local-five.html");
