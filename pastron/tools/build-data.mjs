// Gera data.js a partir do documento de referência (docs/matsuda-comparador-nutricao-animal.md).
// Uso: node tools/build-data.mjs   (a partir da pasta pastron/)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const md = readFileSync(join(root, 'docs/matsuda-comparador-nutricao-animal.md'), 'utf8');

const num = (s) => {
  s = s.replace(/R\$\s*/, '').trim();
  if (s === '–' || s === '-' || s === '') return null;
  return Number(s.replace(/\./g, '').replace(',', '.'));
};
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const cells = (line) => line.split('|').slice(1, -1).map((c) => c.trim());

const KEYS = ['caMin', 'caMax', 'p', 'na', 's', 'mg', 'co', 'cu', 'i', 'mn', 'se', 'zn', 'f'];
const EXTRA = {
  'Proteína bruta': 'pb', 'NNP eq. proteico': 'nnp', 'NDT': 'ndt', 'MOS': 'mos', 'Beta-glucanas': 'beta',
  'Narasina': 'narasina', 'Lasalocida': 'lasalocida', 'Monensina': 'monensina', 'Biotina': 'biotina',
  'Adsorvente': 'adsorvente', 'Nucleotídeos': 'nucleotideos', 'Vitamina E': 'vitE', 'Vitamina A': 'vitA', 'Lactose': 'lactose',
};

const sec = (n) => md.split(/\n## /).find((s) => s.startsWith(n + '.'));
const products = [];
const byName = new Map();
let cat = null;

for (const line of sec(4).split('\n')) {
  if (line.startsWith('### ')) { cat = line.slice(4).trim(); continue; }
  if (line.startsWith('| ') && !line.startsWith('| Produto') && !line.startsWith('|---')) {
    const c = cells(line);
    const flagged = c[0].endsWith('*');
    const name = c[0].replace(/\s*\*$/, '');
    const n = {};
    KEYS.forEach((k, i) => { const v = num(c[i + 2]); if (v !== null) n[k] = v; });
    const p = { id: slug(name), nome: name, linha: cat, cod: c[1] === '–' ? null : c[1], n };
    if (flagged) p.pendencia = true;
    products.push(p); byName.set(name, p);
    continue;
  }
  const m = line.match(/^- \*\*(.+?)\*\* — (.*)$/);
  if (m) {
    const p = byName.get(m[1]);
    if (!p) throw new Error('Produto sem linha na tabela: ' + m[1]);
    let [items, uso] = m[2].split(/Uso: /);
    for (const it of items.split(';').map((s) => s.trim()).filter(Boolean)) {
      const mm = it.match(/^(.+?) ([\d.,]+) (g|mg|UI)$/);
      if (!mm || !EXTRA[mm[1]]) throw new Error('Item não reconhecido: ' + it);
      p.n[EXTRA[mm[1]]] = num(mm[2]);
    }
    if (uso) {
      p.uso = uso.trim();
      // Consumo do informativo. Em faixas ("30 a 50 g"), vale o menor valor.
      const pv = uso.match(/([\d.,]+)(?: a [\d.,]+)? g para cada (100|10) kg/);
      const lt = uso.match(/mais ([\d.,]+) g por litro/);
      if (pv) p.consumo = { por100: num(pv[1]) * (pv[2] === '10' ? 10 : 1), porLitro: lt ? num(lt[1]) : 0 };
    }
  }
}

const byCod = new Map(products.filter((p) => p.cod).map((p) => [p.cod, p]));
for (const line of sec(5).split('\n')) {
  if (!line.startsWith('| ') || line.startsWith('| Produto') || line.startsWith('|---')) continue;
  const c = cells(line);
  const p = byCod.get(c[1]);
  if (!p) throw new Error('Código sem produto: ' + c[1]);
  p.saco = num(c[2]);
  p.precos = c.slice(3, 7).map(num);
}

const pendencias = sec(3).split('\n').filter((l) => l.startsWith('- ')).map((l) => {
  const m = l.match(/^- \*\*(.+?)\*\*: (.*)$/);
  return { produto: m[1], texto: m[2] };
});

const data = {
  tabela: 'Tabela de Preços 04/26, de 04/08/2026',
  mistura: {
    'fos-30s-concentrado': { cria: [2, 1], recria: [1, 1], engorda: [1, 1] },
    'fos-40s-concentrado': { cria: [1, 1], recria: [2, 3], engorda: [2, 3] },
    'fos-160s-concentrado': { cria: [1, 1], recria: [2, 3], engorda: [2, 3] },
  },
  pendencias,
  produtos: products,
};
for (const id of Object.keys(data.mistura)) if (!products.find((p) => p.id === id)) throw new Error('Concentrado ausente: ' + id);

writeFileSync(join(root, 'data.js'),
  '// Gerado por tools/build-data.mjs a partir de docs/matsuda-comparador-nutricao-animal.md. Não editar à mão.\n' +
  'window.PASTRON_DATA = ' + JSON.stringify(data) + ';\n');
console.log(products.length, 'produtos;', products.filter((p) => p.precos).length, 'com preço;',
  products.filter((p) => p.consumo).length, 'com consumo do informativo');
