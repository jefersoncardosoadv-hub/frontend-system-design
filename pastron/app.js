(() => {
  'use strict';
  const D = window.PASTRON_DATA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const DESCONTOS = [[0, 10], [1.5, 9], [3, 8], [4.5, 7], [6, 6], [7.5, 5], [9, 4], [10.5, 3]];
  const PRAZOS = ['à vista', '30 dias', '30/60 dias', '30/60/90 dias'];
  const SAL_KG = 25;
  const PADRAO = {
    prazo: 0, desc: 0, frete: 0, peso: 450, leite: 10, cab: 100, dias: 30, gmd: '', rend: '', sal: '',
    sel: ['fos-leite', 'top-milk-p', 'top-milk-vitaminado'],
    cons: {}, mix: {}, manual: {}, custom: [], lens: 'custo', row: 'cabdia', formato: 'curto', tom: 'produtor',
  };
  const KEY = 'pastron-comparador-v1';
  let S = structuredClone(PADRAO);
  try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* sem armazenamento: segue com o padrão */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* idem */ } };

  // Níveis de garantia: [chave, rótulo, unidade, melhor = maior ('hi') | menor ('lo') | nenhum]
  const NIVEIS = [
    ['Macrominerais'],
    ['ca', 'Cálcio (mín.–máx.)', 'g', null], ['p', 'Fósforo', 'g', 'hi'], ['na', 'Sódio', 'g', 'hi'], ['s', 'Enxofre', 'g', 'hi'], ['mg', 'Magnésio', 'g', 'hi'],
    ['Microminerais'],
    ['co', 'Cobalto', 'mg', 'hi'], ['cu', 'Cobre', 'mg', 'hi'], ['i', 'Iodo', 'mg', 'hi'], ['mn', 'Manganês', 'mg', 'hi'], ['se', 'Selênio', 'mg', 'hi'], ['zn', 'Zinco', 'mg', 'hi'], ['f', 'Flúor (máx.)', 'mg', 'lo'],
    ['Proteína e energia'],
    ['pb', 'Proteína bruta', 'g', 'hi'], ['nnp', 'NNP eq. proteico', 'g', null], ['ndt', 'NDT', 'g', 'hi'],
    ['Aditivos'],
    ['mos', 'MOS', 'g', 'hi'], ['beta', 'Beta-glucanas', 'g', 'hi'], ['narasina', 'Narasina', 'mg', null], ['lasalocida', 'Lasalocida', 'mg', null],
    ['monensina', 'Monensina', 'mg', null], ['biotina', 'Biotina', 'mg', 'hi'], ['adsorvente', 'Adsorvente', 'mg', 'hi'], ['nucleotideos', 'Nucleotídeos', 'mg', 'hi'],
    ['vitE', 'Vitamina E', 'UI', 'hi'], ['vitA', 'Vitamina A', 'UI', 'hi'], ['lactose', 'Lactose', 'g', 'hi'],
  ];
  const CONC_CAMPOS = [['caMin', 'Cálcio mín.', 'g'], ['caMax', 'Cálcio máx.', 'g'], ...NIVEIS.filter((n) => n.length > 1 && n[0] !== 'ca').slice(0, 14).map((n) => [n[0], n[1], n[2]])];

  const nf = (d) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const brl = (v, d = 2) => 'R$ ' + nf(d).format(v);
  const n0 = (v) => nf(v < 10 && v % 1 ? (v < 1 ? 2 : 1) : 0).format(v);
  const flex = (v) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: v < 10 ? 2 : v < 100 ? 1 : 0 }).format(v);
  const num = (v) => (v === '' || v === null || v === undefined || isNaN(+v) ? null : +v);

  const produto = (id) => D.produtos.find((p) => p.id === id) || S.custom.find((p) => p.id === id);
  const selecionados = () => S.sel.map(produto).filter(Boolean);

  // ---------- Cálculo ----------
  function calc(p) {
    const r = { p, conc: !!p.conc, fator: 1 };
    const man = S.manual[p.id] || {};
    r.tabela = p.conc ? p.preco : p.precos ? p.precos[S.prazo] : num(man.preco);
    r.saco = p.conc ? p.saco : p.saco || num(man.saco);
    r.semPreco = !p.conc && !p.precos;
    if (r.tabela != null) r.final = p.conc ? r.tabela : r.tabela * (1 - S.desc / 100) + (num(S.frete) || 0);
    const prop = D.mistura[p.id] && S.mix[p.id] && D.mistura[p.id][S.mix[p.id]];
    if (r.final != null && r.saco) {
      if (prop) {
        const [a, b] = prop, kg = a * r.saco + b * SAL_KG, sal = num(S.sal);
        r.mix = { a, b, fase: S.mix[p.id] };
        r.fator = (a * r.saco) / kg;
        if (sal != null) r.kg = (a * r.final + b * sal) / kg;
      } else r.kg = r.final / r.saco;
    }
    const P = p.n.p != null ? p.n.p * r.fator : null;
    r.P = P;
    if (r.kg != null && P) { r.custoP = (r.kg / P) * 1000; r.ponto = (r.kg * r.saco) / P; }
    const regra = p.consumo ? p.consumo.por100 * (num(S.peso) || 0) / 100 + p.consumo.porLitro * (num(S.leite) || 0) : null;
    r.regra = regra;
    r.cons = num(S.cons[p.id]) ?? regra;
    r.consManual = num(S.cons[p.id]) != null;
    if (r.cons != null) {
      if (P != null) r.pIng = (P * r.cons) / 1000;
      const cab = num(S.cab) || 0, dias = num(S.dias) || 0;
      if (r.saco) {
        const kgTot = (r.cons / 1000) * cab * dias;
        r.sacos = (kgTot * r.fator) / r.saco;
        if (r.mix) r.sacosSal = (kgTot * (1 - r.fator)) / SAL_KG;
      }
      if (r.kg != null) {
        r.cabdia = (r.kg * r.cons) / 1000;
        r.cabmes = r.cabdia * 30;
        r.lote = r.cabdia * cab * dias;
        const leite = num(S.leite);
        if (leite > 0 && (/^Leite/.test(p.linha || '') || (p.consumo && p.consumo.porLitro))) r.litro = r.cabdia / leite;
        const gmd = num(S.gmd), rend = num(S.rend);
        if (gmd > 0 && rend > 0) r.arroba = r.cabdia / ((gmd / 1000) * (rend / 100) / 15);
      }
    }
    return r;
  }
  const nivel = (r, k) => {
    const v = r.p.n[k];
    if (v == null) return null;
    if (r.mix && k === 'na') return null; // teor de sódio do sal branco não consta nos informativos
    return v * r.fator;
  };

  // Linhas da lente "Preço e custo"
  const LINHAS_CUSTO = [
    ['Preço'],
    { k: 'tabela', l: 'Preço de tabela', u: 'R$/saco', f: brl },
    { k: 'final', l: 'Preço final', u: 'com desconto e frete', f: brl },
    { k: 'saco', l: 'Peso do saco', u: 'kg', f: n0 },
    { k: 'mix', l: 'Mistura com sal branco', u: 'sacos concentrado : sal' },
    { k: 'kg', l: 'Preço por kg', u: 'no cocho', f: brl, best: 'lo' },
    ['Fósforo'],
    { k: 'P', l: 'Fósforo', u: 'g/kg', f: flex, best: 'hi' },
    { k: 'ponto', l: 'Ponto de fósforo', u: 'R$ do saco por g/kg de P', f: brl, best: 'lo' },
    { k: 'custoP', l: 'Custo do kg de fósforo', u: 'R$', f: brl, best: 'lo' },
    ['Consumo e custo'],
    { k: 'cons', l: 'Consumo por cabeça', u: 'g/dia' , f: flex },
    { k: 'pIng', l: 'Fósforo ingerido', u: 'g/cab/dia', f: flex, best: 'hi' },
    { k: 'cabdia', l: 'Custo por cabeça/dia', u: 'R$', f: (v) => brl(v, v < 1 ? 3 : 2), best: 'lo', forte: true },
    { k: 'cabmes', l: 'Custo por cabeça/mês', u: 'R$ · 30 dias', f: brl, best: 'lo' },
    { k: 'litro', l: 'Custo por litro de leite', u: 'R$', f: (v) => brl(v, 3), best: 'lo', opc: true },
    { k: 'arroba', l: 'Custo por arroba', u: 'R$/@ produzida', f: brl, best: 'lo', opc: true },
    { k: 'lote', l: 'Custo do lote', u: 'R$ no período', f: brl, best: 'lo' },
    { k: 'sacos', l: 'Sacos no período', u: 'un.', f: (v) => nf(1).format(v) },
  ];

  function linhas(rs) {
    if (S.lens === 'custo') {
      return LINHAS_CUSTO.filter((L) => {
        if (Array.isArray(L)) return true;
        if (L.k === 'mix') return rs.some((r) => D.mistura[r.p.id]);
        if (L.opc) return rs.some((r) => r[L.k] != null);
        return true;
      }).map((L) => (Array.isArray(L) ? L : { ...L, get: (r) => r[L.k] ?? null }));
    }
    const ing = S.lens === 'ingestao';
    const out = [];
    for (const N of NIVEIS) {
      if (N.length === 1) { out.push(N); continue; }
      const [k, l, u, best] = N;
      const base = k === 'ca' ? 'caMin' : k;
      if (!rs.some((r) => r.p.n[base] != null)) continue;
      const get = (r, kk = base) => {
        const v = nivel(r, kk);
        if (v == null) return null;
        return ing ? (r.cons != null ? (v * r.cons) / 1000 : null) : v;
      };
      out.push({ k, l, u: ing ? u + '/cab/dia' : u + '/kg', f: flex, best, get, ca: k === 'ca' ? (r) => get(r, 'caMax') : null });
    }
    return out.filter((L, i, a) => !Array.isArray(L) || (a[i + 1] && !Array.isArray(a[i + 1])));
  }
  const melhor = (L, vals) => {
    const v = vals.filter((x) => x != null);
    if (!L.best || v.length < 2 || Math.min(...v) === Math.max(...v)) return null;
    return L.best === 'lo' ? Math.min(...v) : Math.max(...v);
  };

  // ---------- Renderização ----------
  function render() {
    const rs = selecionados().map(calc);
    renderCenario(rs);
    renderDestaques(rs);
    renderTabela(rs);
    renderGrafico(rs);
    save();
  }

  function renderCenario(rs) {
    $$('#cenarioForm [data-k]').forEach((el) => { if (document.activeElement !== el) el.value = S[el.dataset.k]; });
    const com = DESCONTOS.find((d) => d[0] === +S.desc)[1];
    $('#comissao').innerHTML = `Comissão nesta condição: <b>${com}%</b>${com === 3 ? ' (mínimo permitido)' : ''}`;
    $('#salBox').hidden = !rs.some((r) => D.mistura[r.p.id]);
    $('#cenarioResumo').textContent = [PRAZOS[S.prazo], +S.desc ? `${nf(1).format(S.desc)}% de desconto` : 'sem desconto', `${S.peso} kg`, `${S.cab} cab.`, `${S.dias} dias`].join(' · ');
  }

  function renderDestaques(rs) {
    const pick = (k, lo) => rs.filter((r) => r[k] != null).sort((a, b) => (lo ? a[k] - b[k] : b[k] - a[k]))[0];
    const itens = [
      ['Menor custo por cabeça/dia', pick('cabdia', true), (r) => brl(r.cabdia, r.cabdia < 1 ? 3 : 2), 'Informe o consumo para calcular'],
      ['Menor custo do kg de fósforo', pick('custoP', true), (r) => brl(r.custoP), 'Falta preço ou teor de fósforo'],
      ['Mais fósforo no cocho', pick('P', false), (r) => flex(r.P) + ' g/kg', 'Sem teor de fósforo'],
    ];
    $('#destaques').innerHTML = rs.length ? itens.map(([t, r, f, vazio]) => `<dl class="destaque"><dt>${t}</dt>${r
      ? `<dd class="v" style="margin:0">${f(r)}</dd><dd class="n" style="margin:0">${esc(r.p.nome)}</dd>`
      : `<dd class="v vazio" style="margin:0">${vazio}</dd>`}</dl>`).join('') : '';
    $('#destaques').hidden = !rs.length;
  }

  function celConsumo(r) {
    const id = esc(r.p.id);
    const hint = r.consManual
      ? (r.regra != null ? `<button type="button" class="mini" data-cons-reset="${id}">Voltar ao informativo</button>` : '')
      : r.p.consumo ? `<small>informativo: ${flex(r.p.consumo.por100)} g/100 kg${r.p.consumo.porLitro ? ` + ${flex(r.p.consumo.porLitro)} g/L` : ''}</small>` : '';
    return `<span class="cel"><input type="number" min="0" step="any" inputmode="decimal" id="cons-${id}" data-cons="${id}" value="${r.cons != null ? +r.cons.toFixed(1) : ''}" placeholder="informe" aria-label="Consumo de ${esc(r.p.nome)} em gramas por cabeça por dia">${hint}</span>`;
  }
  function celTabela(r) {
    if (!r.semPreco) return r.tabela != null ? brl(r.tabela) : '<span class="vazio">–</span>';
    const id = esc(r.p.id), m = S.manual[r.p.id] || {};
    return `<span class="cel"><input type="number" min="0" step="any" inputmode="decimal" id="mp-${id}" data-man="preco" data-id="${id}" value="${m.preco ?? ''}" placeholder="R$/saco" aria-label="Preço do saco de ${esc(r.p.nome)}"><small>fora da tabela 04/26</small></span>`;
  }
  function celSaco(r) {
    if (!r.semPreco) return n0(r.saco);
    const id = esc(r.p.id), m = S.manual[r.p.id] || {};
    return `<input type="number" min="0" step="any" inputmode="decimal" id="ms-${id}" data-man="saco" data-id="${id}" value="${m.saco ?? ''}" placeholder="kg" aria-label="Peso do saco de ${esc(r.p.nome)}">`;
  }
  function celMix(r) {
    const M = D.mistura[r.p.id];
    if (!M) return '<span class="vazio">–</span>';
    const id = esc(r.p.id), v = S.mix[r.p.id] || '';
    const opt = (k, t) => `<option value="${k}"${v === k ? ' selected' : ''}>${t}${k ? ` ${M[k][0]}:${M[k][1]}` : ''}</option>`;
    const aviso = r.mix && num(S.sal) == null ? '<small>informe o preço do sal no cenário</small>' : '';
    return `<span class="cel"><select id="mix-${id}" data-mix="${id}" aria-label="Mistura de ${esc(r.p.nome)}">${opt('', 'Concentrado puro')}${opt('cria', 'Cria')}${opt('recria', 'Recria')}${opt('engorda', 'Engorda')}</select>${aviso}</span>`;
  }

  function renderTabela(rs) {
    $$('.lentes button').forEach((b) => b.setAttribute('aria-selected', b.dataset.lens === S.lens));
    const box = $('#tabelaScroll');
    if (!rs.length) { box.innerHTML = '<p class="vazio-geral">Nenhum produto na comparação. Use “Adicionar produto” para começar.</p>'; return; }
    const Ls = linhas(rs);
    if (!Ls.some((L) => !Array.isArray(L) && L.k === S.row)) S.row = (Ls.find((L) => !Array.isArray(L) && L.forte) || Ls.find((L) => !Array.isArray(L) && L.best)).k;
    const head = rs.map((r) => `<th scope="col" class="${r.conc ? 'conc-col' : ''}"><div class="ph">
      <span class="linha">${esc(r.conc ? 'Concorrente' : r.p.linha)}</span>
      <span class="nome">${esc(r.p.nome)}${r.p.pendencia ? ' <abbr title="Há pendência no informativo deste produto">*</abbr>' : ''}</span>
      <span class="marca">${esc(r.conc ? r.p.marca : 'Matsuda' + (r.p.cod ? ' · ' + r.p.cod : ''))}</span>
      <button type="button" class="x rm" data-rm="${esc(r.p.id)}" aria-label="Remover ${esc(r.p.nome)}">×</button></div></th>`).join('');
    const caMin = S.lens !== 'custo' && rs.length > 1 ? Math.min(...rs.map((r) => nivel(r, 'caMin')).filter((v) => v != null)) : null;
    const body = Ls.map((L) => {
      if (Array.isArray(L)) return `<tr class="grupo"><th colspan="${rs.length + 1}">${L[0]}</th></tr>`;
      const vals = rs.map((r) => L.get(r));
      const top = melhor(L, vals);
      const graf = L.f && L.k !== 'ca' && L.k !== 'saco';
      const tds = rs.map((r, i) => {
        const v = vals[i];
        let html;
        if (L.k === 'cons') html = celConsumo(r);
        else if (L.k === 'tabela') html = celTabela(r);
        else if (L.k === 'saco') html = celSaco(r);
        else if (L.k === 'mix') html = celMix(r);
        else if (v == null) html = '<span class="vazio">–</span>';
        else if (L.k === 'ca') { const mx = L.ca(r); html = flex(v) + (mx != null ? '–' + flex(mx) : '') + (S.lens === 'formula' && nivel(r, 'caMin') === caMin && rs.filter((x) => nivel(x, 'caMin') === caMin).length === 1 ? '<span class="tag-baixo">baixo</span>' : ''); }
        else if (L.k === 'sacos' && r.mix) html = `${L.f(v)} conc. + ${L.f(r.sacosSal)} sal`;
        else html = L.f(v);
        const isBest = top != null && v === top;
        return `<td class="${isBest ? 'best' : ''}${L.forte ? ' forte' : ''}">${html}${isBest ? '<span class="tag-best">melhor</span>' : ''}</td>`;
      }).join('');
      const rot = graf ? `<button type="button" class="rowbtn" data-row="${L.k}">${L.l}</button>` : `<b style="font-weight:600">${L.l}</b>`;
      return `<tr class="${L.k === S.row ? 'sel' : ''}"><th scope="row">${rot}<span class="un">${L.u}</span></th>${tds}</tr>`;
    }).join('');
    box.innerHTML = `<table><thead><tr><th>${{ custo: 'Preço e custo', formula: 'Por kg de produto', ingestao: 'Por cabeça/dia' }[S.lens]}</th>${head}</tr></thead><tbody>${body}</tbody></table>`;
  }

  function renderGrafico(rs) {
    const L = linhas(rs).find((x) => !Array.isArray(x) && x.k === S.row);
    const g = $('#grafico');
    const dados = L ? rs.map((r) => ({ r, v: L.get(r) })).filter((d) => d.v != null) : [];
    if (!dados.length) { g.innerHTML = `<p class="vazio">${rs.length ? 'Sem valores para esta linha. Informe preço e consumo dos produtos, ou escolha outra linha na tabela.' : 'Adicione produtos para ver o gráfico.'}</p>`; return; }
    const max = Math.max(...dados.map((d) => d.v)) || 1;
    const top = melhor(L, dados.map((d) => d.v));
    g.innerHTML = `<p class="g-titulo">${L.l}<small>${L.u}</small></p><div class="barras">${dados.map(({ r, v }) => {
      const w = Math.max((v / max) * 100, 1);
      const dentro = w > 55;
      return `<span class="rot">${esc(r.p.nome)}</span><span class="trilho"><span class="barra${r.conc ? ' conc' : v === top ? ' best' : ''}" style="width:${w.toFixed(1)}%"></span>` +
        `<span class="val" style="${dentro ? `right:${(100 - w).toFixed(1)}%;color:${r.conc ? '#123D2C' : v === top ? 'var(--bg)' : '#fff'}` : `left:${w.toFixed(1)}%`}">${L.f(v)}</span></span>`;
    }).join('')}</div><p class="g-leg"><span><i style="background:var(--bar)"></i>Matsuda</span>${top != null ? '<span><i style="background:var(--bar-best)"></i>Melhor valor da linha</span>' : ''}${dados.some((d) => d.r.conc) ? '<span><i style="background:var(--bar-conc)"></i>Concorrente</span>' : ''}<span>Escala começa em zero.</span></p>`;
  }

  // ---------- Seletor de produtos ----------
  let filtroLinha = '';
  const LINHAS_CAT = [...new Set(D.produtos.map((p) => p.linha))];
  function renderLista() {
    const q = $('#busca').value.trim().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    $('#chipsLinha').innerHTML = ['', ...LINHAS_CAT].map((l) => `<button type="button" data-linha="${esc(l)}" aria-pressed="${l === filtroLinha}">${esc(l || 'Todas as linhas')}</button>`).join('');
    const todos = [...S.custom, ...D.produtos].filter((p) => {
      if (filtroLinha && p.linha !== filtroLinha) return false;
      const t = `${p.nome} ${p.linha || 'concorrente'} ${p.marca || 'matsuda'} ${p.cod || ''}`.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      return q.split(/\s+/).every((w) => t.includes(w));
    });
    $('#listaProdutos').innerHTML = todos.map((p) => {
      const on = S.sel.includes(p.id);
      const preco = p.conc ? brl(p.preco) : p.precos ? brl(p.precos[S.prazo]) : 'sem preço na tabela';
      return `<li><button type="button" data-toggle="${esc(p.id)}" aria-pressed="${on}"><span class="ck">${on ? '✓' : ''}</span>
        <span class="t"><b>${esc(p.nome)}</b><span>${esc(p.conc ? 'Concorrente · ' + p.marca : p.linha)}</span></span>
        <span class="d"><b>${preco}</b>${p.n.p != null ? flex(p.n.p) + ' g P/kg' : ''}${p.saco ? ' · ' + n0(p.saco) + ' kg' : ''}</span></button></li>`;
    }).join('') || '<li><p class="vazio-geral">Nenhum produto encontrado. Confira a grafia ou troque a linha.</p></li>';
    $('#contSel').textContent = `${S.sel.length} ${S.sel.length === 1 ? 'produto' : 'produtos'} na comparação`;
  }

  // ---------- Resumo para o cliente ----------
  function resumo() {
    const rs = selecionados().filter((p) => !p.conc).map(calc);
    const tec = S.tom === 'tecnico', full = S.formato === 'completo';
    if (!rs.length) return 'Adicione ao menos um produto Matsuda para montar o resumo.';
    const cab = num(S.cab) || 0, dias = num(S.dias) || 0;
    const L = [];
    L.push(tec ? `Comparativo de suplementação — ${cab} cabeças, ${S.peso} kg de peso vivo, ${dias} dias` : `Olá! Segue a conta da suplementação para o seu lote de ${cab} cabeças (${dias} dias):`);
    L.push('');
    for (const r of rs) {
      const nome = r.p.nome + (r.mix ? ` + sal branco (${r.mix.a}:${r.mix.b}, ${r.mix.fase})` : '');
      L.push(`*${nome}*`);
      if (r.final == null) { L.push('Preço sob consulta.', ''); continue; }
      L.push(`Saco de ${n0(r.saco)} kg: ${brl(r.final)} (${PRAZOS[S.prazo]})`);
      if (r.cabdia != null) {
        L.push(tec ? `Consumo ${flex(r.cons)} g/cab/dia · ${brl(r.cabdia, 3)}/cab/dia · ${brl(r.cabmes)}/cab/mês` : `Custo por cabeça: ${brl(r.cabdia, r.cabdia < 1 ? 3 : 2)} por dia (${brl(r.cabmes)} por mês)`);
        if (tec && r.pIng != null) L.push(`Fósforo: ${flex(r.P)} g/kg · ${flex(r.pIng)} g ingeridos/cab/dia · ${brl(r.custoP)}/kg de P`);
        if (r.litro != null) L.push(`Custo por litro de leite: ${brl(r.litro, 3)}`);
        if (r.arroba != null) L.push(`Custo por arroba produzida: ${brl(r.arroba)}`);
        L.push(`Lote no período: ${brl(r.lote)} · ${r.mix ? `${Math.ceil(r.sacos)} sacos do concentrado + ${Math.ceil(r.sacosSal)} de sal` : `${Math.ceil(r.sacos)} sacos`}`);
        if (full) {
          L.push('Conta:');
          L.push(`  ${brl(r.kg)}/kg × ${flex(r.cons)} g ÷ 1000 = ${brl(r.cabdia, 3)} por cabeça/dia`);
          L.push(`  ${brl(r.cabdia, 3)} × ${cab} cabeças × ${dias} dias = ${brl(r.lote)}`);
          if (r.p.uso) L.push(`  Uso indicado: ${r.p.uso}`);
        }
      } else if (tec && r.custoP != null) L.push(`Fósforo: ${flex(r.P)} g/kg · ${brl(r.custoP)}/kg de P`);
      L.push('');
    }
    L.push('Produtos fabricados e faturados pela Matsuda Sementes e Nutrição Animal. Preços sujeitos à aprovação de crédito da Matsuda.');
    L.push('Pastron Agro — representante comercial Matsuda');
    L.push('_Conhecimento que fortalece o campo._');
    return L.join('\n');
  }
  function renderResumo() {
    $$('#segFormato button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === S.formato));
    $$('#segTom button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === S.tom));
    $('#resumoTxt').value = resumo();
    $('#copiado').textContent = '';
  }

  // ---------- Eventos ----------
  $('#fDesc').innerHTML = DESCONTOS.map(([d]) => `<option value="${d}">${d ? nf(1).format(d) + '%' : 'Sem desconto'}</option>`).join('');
  $('#concNiveis').innerHTML = CONC_CAMPOS.map(([k, l, u]) => `<label for="cn-${k}">${l} <small>${u}</small><input id="cn-${k}" data-n="${k}" type="number" min="0" step="any" inputmode="decimal"></label>`).join('');
  $('#pendencias').innerHTML = D.pendencias.map((p) => `<li><b>${esc(p.produto)}</b>: ${esc(p.texto)}</li>`).join('');

  $('#cenarioForm').addEventListener('input', (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    S[k] = e.target.tagName === 'SELECT' ? +e.target.value : e.target.value;
    render();
  });
  $('#btnReset').addEventListener('click', () => {
    for (const k of ['prazo', 'desc', 'frete', 'peso', 'leite', 'cab', 'dias', 'gmd', 'rend', 'sal']) S[k] = PADRAO[k];
    render();
  });
  $$('.lentes button').forEach((b) => b.addEventListener('click', () => { S.lens = b.dataset.lens; render(); }));

  const tabela = $('#tabelaScroll');
  tabela.addEventListener('click', (e) => {
    const t = e.target.closest('[data-rm],[data-row],[data-cons-reset]');
    if (!t) return;
    if (t.dataset.rm) S.sel = S.sel.filter((id) => id !== t.dataset.rm);
    if (t.dataset.row) S.row = t.dataset.row;
    if (t.dataset.consReset) delete S.cons[t.dataset.consReset];
    render();
  });
  tabela.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.cons) { if (t.value === '') delete S.cons[t.dataset.cons]; else S.cons[t.dataset.cons] = t.value; }
    else if (t.dataset.man) (S.manual[t.dataset.id] ||= {})[t.dataset.man] = t.value;
    else if (t.dataset.mix) S.mix[t.dataset.mix] = t.value;
    else return;
    render();
  });

  const abrir = (d) => { d.showModal(); };
  $$('dialog').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  });
  $('#btnAdd').addEventListener('click', () => { $('#busca').value = ''; renderLista(); abrir($('#dlgAdd')); });
  $('#busca').addEventListener('input', renderLista);
  $('#chipsLinha').addEventListener('click', (e) => { const b = e.target.closest('[data-linha]'); if (b) { filtroLinha = b.dataset.linha; renderLista(); } });
  $('#listaProdutos').addEventListener('click', (e) => {
    const b = e.target.closest('[data-toggle]');
    if (!b) return;
    const id = b.dataset.toggle;
    S.sel = S.sel.includes(id) ? S.sel.filter((x) => x !== id) : [...S.sel, id];
    const y = $('#listaProdutos').scrollTop;
    renderLista(); $('#listaProdutos').scrollTop = y;
    render();
  });

  $('#btnConc').addEventListener('click', () => { $('#formConc').reset(); abrir($('#dlgConc')); });
  $('#formConc').addEventListener('submit', (e) => {
    e.preventDefault();
    const n = {};
    $$('#concNiveis [data-n]').forEach((i) => { if (i.value !== '') n[i.dataset.n] = +i.value; });
    const p = { id: 'conc-' + Date.now().toString(36), conc: true, nome: $('#cNome').value.trim(), marca: $('#cMarca').value.trim(), preco: +$('#cPreco').value, saco: +$('#cSaco').value, n };
    S.custom.push(p); S.sel.push(p.id);
    if ($('#cCons').value !== '') S.cons[p.id] = $('#cCons').value;
    $('#dlgConc').close();
    render();
  });

  $('#btnResumo').addEventListener('click', () => { renderResumo(); abrir($('#dlgResumo')); });
  $('#segFormato').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { S.formato = b.dataset.v; renderResumo(); save(); } });
  $('#segTom').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { S.tom = b.dataset.v; renderResumo(); save(); } });
  $('#btnCopiar').addEventListener('click', async () => {
    const ta = $('#resumoTxt');
    try { await navigator.clipboard.writeText(ta.value); $('#copiado').textContent = 'Texto copiado.'; }
    catch (err) { ta.focus(); ta.select(); $('#copiado').textContent = 'Texto selecionado. Copie com Ctrl+C ou pelo menu do aparelho.'; }
  });

  // Logos oficiais: se o arquivo não estiver em assets/, mostra o nome em texto (sem redesenhar a marca).
  const semImagem = (img, fn) => { if (img.complete) { if (!img.naturalWidth) fn(); } else img.addEventListener('error', fn); };
  semImagem($('#logoPastron'), () => { $('#logoPastron').hidden = true; $('#wordmark').hidden = false; });
  const lm = $('#logoMatsuda');
  const mostraMatsuda = () => { $('#matsudaBox').hidden = false; };
  if (lm.complete) { if (lm.naturalWidth) mostraMatsuda(); } else lm.addEventListener('load', mostraMatsuda);

  if (window.matchMedia('(max-width: 1039px)').matches) $('#cenarioBox').open = false;
  window.matchMedia('(min-width: 1040px)').addEventListener('change', (e) => { if (e.matches) $('#cenarioBox').open = true; });

  window.__pastron = { calc, produto, S };
  render();
})();
