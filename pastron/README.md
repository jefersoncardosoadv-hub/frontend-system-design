# Comparador Pastron Matsuda

Ferramenta interna da Pastron Agro (representação comercial Matsuda) para comparar suplementos da linha de nutrição animal Matsuda: preço, custo por cabeça e fórmula lado a lado.

Site estático, sem etapa de build: abra `index.html` no navegador ou sirva a pasta (`npx serve pastron`).

## Arquivos

- `index.html`, `styles.css`, `app.js`: a página.
- `data.js`: catálogo (80 produtos) e Tabela de Preços 04/26. Gerado, não editar à mão.
- `docs/matsuda-comparador-nutricao-animal.md`: documento de referência, fonte dos dados.
- `tools/build-data.mjs`: regenera `data.js` a partir do documento (`node tools/build-data.mjs`).
- `tools/build-artifact.js`: junta tudo em uma página única para publicar como artefato.
- `assets/`: logos oficiais. Coloque aqui `pastron-negativa.png` (versão negativa, fundo Verde Floresta) e `matsuda.png`. Sem os arquivos, o cabeçalho mostra o nome em texto e o rodapé omite a logo da Matsuda.

## Regras de cálculo

Seguem o documento de referência (seção 2.3). Consumo só vem preenchido quando o informativo traz a recomendação por peso vivo; em faixas ("30 a 50 g") vale o menor valor. Nos demais produtos o consumo é digitado. Nada é estimado.

Produtos fabricados e faturados pela Matsuda Sementes e Nutrição Animal. A Pastron Agro é a representante comercial.
