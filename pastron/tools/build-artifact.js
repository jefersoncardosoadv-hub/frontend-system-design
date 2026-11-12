// Monta a página única do artefato a partir dos arquivos do site.
const fs = require('fs'); const [src, out, pastron, matsuda] = process.argv.slice(2);
const html = fs.readFileSync(src + '/index.html', 'utf8');
let body = html.match(/<body>([\s\S]*)<\/body>/)[1]
  .replace('<script src="data.js"></script>', '<script>' + fs.readFileSync(src + '/data.js', 'utf8') + '</script>')
  .replace('<script src="app.js"></script>', '<script>' + fs.readFileSync(src + '/app.js', 'utf8') + '</script>');
if (pastron) body = body.replace('assets/pastron-negativa.png', pastron);
if (matsuda) body = body.replace('assets/matsuda.png', matsuda);
const head = html.match(/<title>[\s\S]*?(?=<link rel="stylesheet" href="styles.css">)/)[0];
fs.writeFileSync(out, head + '<style>' + fs.readFileSync(src + '/styles.css', 'utf8') + '</style>\n' + body);
