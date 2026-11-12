# Matsuda · Comparador de Nutrição Animal

> Ferramenta interna da **Pastron Agro** (representação comercial Matsuda) para comparar suplementos da linha de nutrição animal Matsuda — preço, custo e fórmula lado a lado — inclusive contra produtos da concorrência.
>
> Artefato original: https://claude.ai/artifact/AJgqAsdu8zbHFjKkzZLraC
> Base de preços: **Tabela de Preços 04/26, de 04/08/2026** (fábrica em Álvares Machado, SP).

Este arquivo documenta o artefato (uma página HTML interativa) e reúne os dados embutidos nele: catálogo de produtos, níveis de garantia e tabela de preços.

---

## 1. Para que serve

Ajudar o representante a responder, na conversa com o produtor ou técnico: *"quanto custa suplementar cada animal por dia, e qual produto entrega mais fósforo por real?"*. A página calcula, para cada produto selecionado, preço final, custo por kg, custo do kg de fósforo, custo por cabeça/dia, custo do lote e sacos necessários.

## 2. Estrutura da página

1. **Faixa da marca** — logotipo Pastron Agro, título "Comparador de suplementos" e botão com a referência da tabela de preços vigente.
2. **Cenário da negociação** — parâmetros que alimentam todos os cálculos.
3. **Produtos em comparação** — tabela única vista por três lentes: *Preço e custo*, *Fórmula por kg* e *Ingestão diária*.
4. **Gráfico** — barras horizontais da linha selecionada na tabela (barras douradas = concorrentes).
5. **Pendências nos informativos** — inconsistências encontradas nos informativos de fábrica.
6. **Rodapé** — aviso de que os produtos são fabricados e faturados pela Matsuda; Pastron é a representante.

### 2.1 Cenário da negociação

| Campo | Padrão | Observação |
|---|---|---|
| Prazo | À vista | À vista, 30 dias, 30/60 dias, 30/60/90 dias |
| Desconto | Sem desconto | 0%, 1,5%, 3%, 4,5%, 6%, 7,5%, 9%, 10,5% |
| Frete (R$/saco) | 0 | Somado ao preço final do saco |
| Peso do animal (kg) | 450 | Base do consumo por peso vivo |
| Leite (L/cab/dia) | 10 | Usado em produtos de leite |
| Cabeças no lote | 100 | |
| Período (dias) | 30 | |
| Ganho de peso (g/cab/dia) | opcional | Só para custo por arroba |
| Rendimento de carcaça (%) | opcional | Só para custo por arroba |

Prazo, desconto e frete valem **apenas** para produtos Matsuda. Preço de concorrente entra como informado.

**Desconto × comissão:** 0% = 10% de comissão · 1,5% = 9% de comissão · 3% = 8% de comissão · 4,5% = 7% de comissão · 6% = 6% de comissão · 7,5% = 5% de comissão · 9% = 4% de comissão · 10,5% = 3% de comissão. Comissão abaixo de 3% não é permitida.

### 2.2 Lentes da tabela

- **Preço e custo** — preço de tabela, preço final (com desconto e frete), peso do saco, mistura com sal branco, preço por kg, fósforo (g/kg), ponto de fósforo, custo do kg de fósforo, consumo por cabeça, fósforo ingerido, custo por cabeça/dia e /mês, custo por litro de leite (se houver leite), custo por arroba (se informados GMD e rendimento), custo do lote e sacos no período.
- **Fórmula por kg** — todos os níveis de garantia por kg de produto (macro e microminerais, proteína e energia, aditivos). O menor cálcio é destacado como "baixo"; o melhor valor de cada linha é marcado em verde.
- **Ingestão diária** — os mesmos níveis, mas multiplicados pelo consumo em g/cab/dia.

### 2.3 Fórmulas principais

```
preço final (R$/saco) = preço de tabela × (1 − desconto%) + frete
preço por kg          = preço final ÷ peso do saco
custo do kg de P      = preço por kg ÷ fósforo (g/kg) × 1000
ponto de fósforo      = preço final do saco ÷ fósforo (g/kg)
consumo (g/cab/dia)   = g por 100 kg × peso ÷ 100 + g por litro × leite   (modo "por peso vivo")
                      = g fixos por cabeça                                (modo "fixo")
custo/cab/dia         = preço por kg × consumo(g) ÷ 1000
custo/cab/mês         = custo/cab/dia × 30
custo do lote         = custo/cab/dia × cabeças × dias
sacos no período      = consumo(g) ÷ 1000 × cabeças × dias ÷ peso do saco
custo por litro       = custo/cab/dia ÷ litros de leite/dia
custo por arroba      = custo/cab/dia ÷ (GMD kg × rendimento% ÷ 15)
```

### 2.4 Mistura com sal branco (concentrados)

Os concentrados **Fós 30S**, **Fós 40S** e **Fós 160S** são misturados com sal branco. Proporções (sacos do concentrado : sacos de sal):

| Concentrado | Cria | Recria | Engorda |
|---|---|---|---|
| Fós 30S | 2:1 | 1:1 | 1:1 |
| Fós 40S | 1:1 | 2:3 | 2:3 |
| Fós 160S | 1:1 | 2:3 | 2:3 |

Na mistura, preço por kg e níveis passam a ser os do cocho (concentrado diluído). O sódio fica em branco porque o teor do sal branco não consta nos informativos. O preço do sal (padrão: saco de 25 kg) vale para os três concentrados.

### 2.5 Funcionalidades

- **Adicionar produtos** — busca por nome/marca e filtro por linha.
- **Consumo por produto** — digitado na linha "Consumo por cabeça" ou definido por peso vivo (g/100 kg) + extra por litro de leite; pode voltar ao valor do informativo.
- **Preço manual** — para produto Matsuda fora da tabela vigente (informar preço e peso do saco).
- **Concorrente por foto/arquivo** — lê foto da sacaria, PDF, Word (.docx) ou arquivo do Google Drive com o Claude, preenche os níveis de garantia (sem estimar) e permite conferir antes de salvar. Se o material tiver vários produtos (até 12), cadastra um por vez.
- **Tabela de preços** — importação de planilha .xlsx no mesmo formato da Matsuda (produtos casados pelo código) e correção manual de valores; botão para voltar à tabela 04/26.
- **Resumo para o cliente** — três formatos (curto para WhatsApp, completo com a conta, cartão visual em imagem) e dois tons (produtor / técnico). Traz só produtos Matsuda, com preço final; não mostra desconto, comissão nem concorrentes.
- **Persistência** — dados salvos na nuvem do artefato (quando disponível) e sempre no aparelho; aparece o aviso "Salvando só neste aparelho" quando não há conexão com os dados.
- **Tema** — claro/escuro automático, nas cores da identidade Pastron (Verde Floresta #123D2C, Oliva #71834A, Dourado #C59A45, Areia #EAE2D0, Grafite #292E29; fontes Montserrat e Source Sans 3).

---

## 3. Pendências nos informativos

- **Winter Fós Leite Vaca**: Enxofre impresso como “15 mg” no informativo (provável erro de unidade). Campo deixado em branco até confirmação.
- **Top Line Caprino**: N.N.P. aparece como “mín.” no informativo (nos demais produtos é “máx.”).
- **Winter Fós Nordeste Seca**: Proteína bruta aparece como “máx.” no informativo (nos demais é “mín.”).
- **Lac Parto Na**: Beta-glucanas aparece como “máx.” no livreto de leite 2025 (nos demais é “mín.”).

---

## 4. Catálogo de produtos Matsuda (80 produtos)

Níveis por kg de produto. Cálcio é mín.–máx. Traço (–) = dado não consta na fonte. "Cód." é o código da tabela de preços.


### Corte · Mineral pronto

| Produto | Cód. | Ca mín (g) | Ca máx (g) | P (g) | Na (g) | S (g) | Mg (g) | Co (mg) | Cu (mg) | I (mg) | Mn (mg) | Se (mg) | Zn (mg) | F máx (mg) |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Fós 15S | 03.0188.00 | 165 | 185 | 65 | 122 | 12 | 5 | 107 | 1.550 | 150 | 1.400 | 18 | 4.500 | 650 |
| Fós 20S | 03.0187.00 | 160 | 185 | 88 | 103 | 12 | 5 | 107 | 1.550 | 150 | 1.400 | 18 | 4.500 | 880 |
| Fós 20RO | 03.0190.00 | 163 | 173 | 88 | 111 | 12 | 5 | 220 | 1.550 | 150 | 1.570 | 18 | 5.000 | 880 |
| Fós 80S | 03.0191.00 | 160 | 185 | 80 | 107 | 12 | 5 | 107 | 1.300 | 70 | 1.000 | 18 | 4.000 | 800 |
| Fós Recria | 03.0193.00 | 165 | 190 | 60 | 107 | 12 | 5 | 107 | 1.300 | 70 | 1.000 | 18 | 4.000 | 600 |
| Fós Engorda S | 03.0189.00 | 125 | 145 | 44 | 178 | 12 | 5 | 107 | 1.250 | 50 | 750 | 12 | 3.700 | 440 |
| Fós Boi | 03.0194.00 | 125 | 145 | 40 | 183 | 12 | 5 | 50 | 1.000 | 50 | 520 | 12 | 3.150 | 400 |
| Fós Reprodução | 03.0160.00 | 160 | 185 | 80 | 103 | 12 | 10 | 200 | 1.600 | 190 | 1.400 | 32 | 6.000 | 800 |
| Fós Reprodução Embryo | 03.0161.00 | 150 | 170 | 95 | 88 | 12 | 10 | 200 | 1.650 | 195 | 1.960 | 32 | 6.285 | 950 |
| Top Búfalo | 03.0227.00 | 170 | 185 | 85 | 70 | 12 | 7 | 175 | 1.650 | 130 | 1.400 | 27 | 4.500 | 850 |
| Top Line Cria | 03.0175.00 | 135 | 145 | 75 | 98 | 12 | 5 | 150 | 1.700 | 180 | 1.400 | 27 | 5.000 | 750 |
| Top Line Primípara | 03.0178.00 | 100 | 120 | 75 | 80 | 12 | 5 | 150 | 1.700 | 180 | 1.400 | 27 | 5.000 | 750 |
| Top Line Recria | 03.0176.00 | 105 | 120 | 65 | 89 | 12 | 5 | 150 | 1.700 | 180 | 1.400 | 27 | 5.000 | 650 |
| Top Line Boi | 03.0174.00 | 105 | 120 | 43 | 107 | 12 | 5 | 150 | 1.500 | 100 | 780 | 18 | 4.900 | 430 |

Proteína, energia, aditivos e recomendação de uso:

- **Fós Reprodução** — MOS 3 g; Beta-glucanas 5,25 g
- **Fós Reprodução Embryo** — MOS 3 g; Beta-glucanas 5,25 g
- **Top Búfalo** — Proteína bruta 22 g; NDT 70 g
- **Top Line Cria** — Proteína bruta 100 g; NNP eq. proteico 80 g; NDT 120 g; MOS 3 g; Beta-glucanas 5,25 g
- **Top Line Primípara** — Proteína bruta 170 g; NNP eq. proteico 140 g; NDT 190 g; MOS 3 g; Beta-glucanas 5,25 g
- **Top Line Recria** — Proteína bruta 170 g; NNP eq. proteico 120 g; NDT 180 g; MOS 3 g; Beta-glucanas 5,25 g
- **Top Line Boi** — Proteína bruta 180 g; NNP eq. proteico 140 g; NDT 200 g; MOS 3 g; Beta-glucanas 5,25 g

### Corte · Verão aditivado

| Produto | Cód. | Ca mín (g) | Ca máx (g) | P (g) | Na (g) | S (g) | Mg (g) | Co (mg) | Cu (mg) | I (mg) | Mn (mg) | Se (mg) | Zn (mg) | F máx (mg) |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Phos Verão Cria | 03.0169.00 | 110 | 135 | 60 | 74 | 12 | 5 | 60 | 650 | 50 | 520 | 9 | 2.500 | 600 |
| Phos Verão Recria | 03.0170.00 | 105 | 120 | 55 | 74 | 12 | 5 | 60 | 650 | 50 | 520 | 9 | 2.500 | 550 |
| Phos Verão Desmama | 03.0225.00 | 50 | 60 | 36 | 37 | 12 | 5 | 60 | 650 | 50 | 520 | 9 | 2.500 | 360 |
| Phos Verão Boi | 03.0168.00 | 80 | 95 | 40 | 111 | 12 | 5 | 60 | 650 | 50 | 520 | 9 | 2.500 | 400 |
| Phos Verão Acabamento | 03.0167.00 | 30 | 45 | 18 | 95 | 5 | 5 | 30 | 350 | 12 | 260 | 6 | 1.000 | 180 |
| Phos Verão MT | – | 45 | 60 | 18 | 81 | 12 | 5 | 30 | 300 | 6 | 280 | 5 | 700 | 180 |
| Phos Cria Prime | 03.0164.00 | 80 | 110 | 50 | 74 | 12 | 5 | 60 | 650 | 50 | 520 | 12 | 2.800 | 500 |
| Phos Recria Prime | 03.0165.00 | 80 | 110 | 40 | 74 | 12 | 5 | 60 | 650 | 50 | 520 | 12 | 2.800 | 400 |
| Phos Boi Prime | 03.0166.00 | 80 | 110 | 22 | 74 | 12 | 5 | 60 | 650 | 50 | 520 | 12 | 2.800 | 220 |

Proteína, energia, aditivos e recomendação de uso:

- **Phos Verão Cria** — Proteína bruta 120 g; NNP eq. proteico 60 g; NDT 250 g; MOS 4 g; Beta-glucanas 7,5 g
- **Phos Verão Recria** — Proteína bruta 160 g; NNP eq. proteico 60 g; NDT 280 g; MOS 4 g; Beta-glucanas 7,5 g
- **Phos Verão Desmama** — Proteína bruta 180 g; NNP eq. proteico 28 g; NDT 490 g; MOS 4 g; Beta-glucanas 7,5 g
- **Phos Verão Boi** — Proteína bruta 120 g; NNP eq. proteico 80 g; NDT 270 g; MOS 4 g; Beta-glucanas 7,5 g
- **Phos Verão Acabamento** — Proteína bruta 200 g; NNP eq. proteico 70 g; NDT 450 g; MOS 3 g; Beta-glucanas 5,25 g
- **Phos Verão MT** — Proteína bruta 200 g; NNP eq. proteico 120 g; NDT 430 g; Uso: 30 a 50 g para cada 100 kg de peso vivo.
- **Phos Cria Prime** — Proteína bruta 120 g; NNP eq. proteico 50 g; NDT 280 g; MOS 3 g; Beta-glucanas 5,25 g
- **Phos Recria Prime** — Proteína bruta 140 g; NNP eq. proteico 40 g; NDT 320 g; MOS 3 g; Beta-glucanas 5,25 g; Narasina 300 mg
- **Phos Boi Prime** — Proteína bruta 130 g; NNP eq. proteico 50 g; NDT 320 g; MOS 3 g; Beta-glucanas 5,25 g

### Corte · Seca / proteinado

| Produto | Cód. | Ca mín (g) | Ca máx (g) | P (g) | Na (g) | S (g) | Mg (g) | Co (mg) | Cu (mg) | I (mg) | Mn (mg) | Se (mg) | Zn (mg) | F máx (mg) |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Fós Seca Transição Cria | 03.0162.00 | 30 | 45 | 20 | 63 | 15 | 3 | 45 | 350 | 25 | 260 | 6 | 1.350 | 200 |
| Fós Seca Transição Recria | 03.0224.00 | 30 | 45 | 18 | 56 | 15 | 3 | 45 | 350 | 25 | 260 | 6 | 1.350 | 180 |
| Fós Seca Transição Boi | 03.0223.00 | 30 | 45 | 10 | 74 | 15 | 3 | 30 | 350 | 12 | 260 | 6 | 1.000 | 100 |
| Winter Fós Cria | 03.0181.00 | 45 | 60 | 27 | 105 | 15 | 5 | 45 | 400 | 25 | 260 | 9 | 1.700 | 270 |
| Winter Fós Recria | 03.0228.00 | 35 | 45 | 24 | 93 | 15 | 5 | 45 | 400 | 25 | 260 | 9 | 1.700 | 240 |
| Winter Fós Boi Seca | 03.0180.00 | 35 | 50 | 18 | 115 | 15 | 2 | 45 | 350 | 25 | 260 | 6 | 1.350 | 180 |
| Winter Fós Gold | 03.0182.00 | 35 | 50 | 20 | 80 | 15 | 5 | 45 | 400 | 25 | 260 | 9 | 1.700 | 200 |
| Winter Fós MT Seca | – | 85 | 100 | 16 | 81 | 15 | 2 | 45 | 400 | 25 | 260 | 9 | 1.700 | 160 |
| Winter Fós Nordeste Seca * | – | 74 | 77 | 37 | 93 | 9,45 | 10 | 80 | 750 | 93 | 780 | 18 | 2.900 | 370 |
| Winter Fós Master | 03.0183.00 | 20 | 30 | 9 | 37 | 16 | 2 | 20 | 150 | 17 | 140 | 3 | 600 | 90 |
| Winter Fós Master 40 | 03.0184.00 | 20 | 30 | 9 | 37 | 16 | 2 | 20 | 150 | 17 | 140 | 3 | 600 | 90 |

Proteína, energia, aditivos e recomendação de uso:

- **Fós Seca Transição Cria** — Proteína bruta 250 g; NNP eq. proteico 84 g; NDT 500 g
- **Fós Seca Transição Recria** — Proteína bruta 200 g; NNP eq. proteico 56 g; NDT 520 g
- **Fós Seca Transição Boi** — Proteína bruta 250 g; NNP eq. proteico 84 g; NDT 520 g; MOS 3 g; Beta-glucanas 5,25 g
- **Winter Fós Cria** — Proteína bruta 400 g; NNP eq. proteico 340 g; NDT 300 g; MOS 2 g; Beta-glucanas 3,5 g
- **Winter Fós Recria** — Proteína bruta 400 g; NNP eq. proteico 300 g; NDT 360 g; MOS 2 g; Beta-glucanas 3,5 g
- **Winter Fós Boi Seca** — Proteína bruta 400 g; NNP eq. proteico 340 g; NDT 330 g; MOS 2 g; Beta-glucanas 3,5 g
- **Winter Fós Gold** — Proteína bruta 500 g; NNP eq. proteico 380 g; NDT 360 g; MOS 2 g; Beta-glucanas 3,5 g
- **Winter Fós MT Seca** — Proteína bruta 400 g; NNP eq. proteico 310 g; NDT 300 g; Uso: 100 g para cada 100 kg de peso vivo.
- **Winter Fós Nordeste Seca** — Proteína bruta 600 g; NNP eq. proteico 560 g; NDT 180 g; Uso: 0,05% do peso corporal: 50 g para cada 100 kg.
- **Winter Fós Master** — Proteína bruta 300 g; NNP eq. proteico 180 g; NDT 570 g; MOS 4 g; Beta-glucanas 7 g; Uso: 200 g para cada 100 kg de peso vivo.
- **Winter Fós Master 40** — Proteína bruta 400 g; NNP eq. proteico 240 g; NDT 540 g; MOS 4 g; Beta-glucanas 7 g; Uso: 200 g para cada 100 kg de peso vivo.

### Corte · Ureia / amireia

| Produto | Cód. | Ca mín (g) | Ca máx (g) | P (g) | Na (g) | S (g) | Mg (g) | Co (mg) | Cu (mg) | I (mg) | Mn (mg) | Se (mg) | Zn (mg) | F máx (mg) |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Amireia | 03.0204.00 | 110 | 120 | 50 | 144 | 6 | 5 | 70 | 1.000 | 60 | 1.000 | 12 | 2.500 | 500 |
| Ureia 15% Seca | 03.0201.00 | 95 | 107 | 50 | 136 | 10 | 5 | 70 | 1.000 | 60 | 1.000 | 12 | 2.500 | 500 |
| Ureia 20% | 03.0202.00 | 100 | 110 | 61 | 114 | 10 | 12 | 107 | 1.200 | 80 | 1.000 | 12 | 2.750 | 610 |

Proteína, energia, aditivos e recomendação de uso:

- **Amireia** — Proteína bruta 200 g; NNP eq. proteico 160 g; NDT 100 g
- **Ureia 15% Seca** — NNP eq. proteico 422 g; NDT 50 g
- **Ureia 20%** — NNP eq. proteico 565 g; NDT 50 g

### Corte · Proteico energético

| Produto | Cód. | Ca mín (g) | Ca máx (g) | P (g) | Na (g) | S (g) | Mg (g) | Co (mg) | Cu (mg) | I (mg) | Mn (mg) | Se (mg) | Zn (mg) | F máx (mg) |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Fós Prime | 03.0157.00 | 20 | 30 | 9 | 37 | 16 | 2 | 20 | 150 | 17 | 140 | 3 | 600 | 90 |
| Fós Prime Acabamento | 03.0158.00 | 20 | 30 | 6 | 9 | 16 | 1,4 | 14 | 100 | 12 | 100 | 2 | 450 | 60 |

Proteína, energia, aditivos e recomendação de uso:

- **Fós Prime** — Proteína bruta 200 g; NDT 700 g; MOS 4 g; Beta-glucanas 7 g; Uso: 200 g para cada 100 kg de peso vivo.
- **Fós Prime Acabamento** — Proteína bruta 200 g; NDT 740 g; MOS 4 g; Beta-glucanas 7 g; Uso: 300 a 400 g para cada 100 kg de peso vivo.

### Corte · Pampa

| Produto | Cód. | Ca mín (g) | Ca máx (g) | P (g) | Na (g) | S (g) | Mg (g) | Co (mg) | Cu (mg) | I (mg) | Mn (mg) | Se (mg) | Zn (mg) | F máx (mg) |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Fós Pampa Pastagens de Inverno | – | 10 | 30 | 20 | 56 | 22 | 2 | 50 | 450 | 50 | 530 | 9 | 1.850 | 200 |
| Fós Pampa Past. Inverno Prime | – | 10 | 25 | 6 | 13 | 21 | 2 | 20 | 200 | 15 | 140 | 3 | 600 | 60 |
| Fós Pampa Terneiro Precoce | – | 10 | 30 | 10 | 3,7 | 5 | 2 | 15 | 165 | 10 | 190 | 4,5 | 1.260 | 100 |
| Fós Pampa Annoni | – | 20 | 45 | 30 | 52 | 22 | 2,8 | 40 | 500 | 20 | 520 | 9 | 2.800 | 300 |
| Fós Pampa Nativo Inverno | – | 35 | 50 | 25 | 52 | 16 | 3 | 31 | 400 | 25 | 300 | 9 | 2.450 | 250 |
| Pampa Nativo | – | 25 | 50 | 24 | 74 | 16 | 3 | 30 | 350 | 15 | 300 | 6 | 1.950 | 240 |

Proteína, energia, aditivos e recomendação de uso:

- **Fós Pampa Pastagens de Inverno** — Proteína bruta 90 g; NDT 520 g; MOS 12 g; Beta-glucanas 21 g; Narasina 300 mg
- **Fós Pampa Past. Inverno Prime** — Proteína bruta 100 g; NDT 700 g; MOS 8,5 g; Beta-glucanas 15 g; Narasina 100 mg
- **Fós Pampa Terneiro Precoce** — Proteína bruta 210 g; NDT 630 g; MOS 17 g; Beta-glucanas 30 g; Narasina 150 mg
- **Fós Pampa Annoni** — Proteína bruta 200 g; NNP eq. proteico 57 g; NDT 500 g; MOS 8 g; Beta-glucanas 14 g
- **Fós Pampa Nativo Inverno** — Proteína bruta 350 g; NNP eq. proteico 140 g; NDT 550 g; MOS 4 g; Beta-glucanas 7 g
- **Pampa Nativo** — Proteína bruta 140 g; NDT 500 g; MOS 4 g; Beta-glucanas 7 g

### Bezerros

| Produto | Cód. | Ca mín (g) | Ca máx (g) | P (g) | Na (g) | S (g) | Mg (g) | Co (mg) | Cu (mg) | I (mg) | Mn (mg) | Se (mg) | Zn (mg) | F máx (mg) |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Top Bezerro | 03.0173.00 | 20 | 35 | 14 | 7,4 | 3 | 2 | 30 | 330 | 20 | 360 | 6 | 1.000 | 140 |
| Top Bezerro Precoce | 03.0172.00 | 15 | 20 | 7 | 3,7 | 1 | 2 | 15 | 165 | 10 | 180 | 3 | 500 | 70 |
| Top Bezerro Desmama | 03.0171.00 | 20 | 35 | 14 | 7,4 | 3 | 2 | 30 | 660 | 20 | 720 | 9 | 2.000 | 140 |
| Top Line Taurus | 03.0179.00 | 35 | 50 | 7,5 | 7,4 | 3 | 2,5 | 15 | 165 | 10 | 180 | 3 | 1.000 | 75 |

Proteína, energia, aditivos e recomendação de uso:

- **Top Bezerro** — Proteína bruta 200 g; NDT 640 g; MOS 4 g; Beta-glucanas 7 g; Narasina 300 mg
- **Top Bezerro Precoce** — Proteína bruta 200 g; NDT 700 g; MOS 4 g; Beta-glucanas 7 g; Narasina 150 mg
- **Top Bezerro Desmama** — Proteína bruta 200 g; NDT 650 g; MOS 8 g; Beta-glucanas 14 g; Narasina 600 mg
- **Top Line Taurus** — Proteína bruta 200 g; NNP eq. proteico 17 g; NDT 620 g; MOS 4 g; Beta-glucanas 7 g; Narasina 100 mg

### Núcleos corte

| Produto | Cód. | Ca mín (g) | Ca máx (g) | P (g) | Na (g) | S (g) | Mg (g) | Co (mg) | Cu (mg) | I (mg) | Mn (mg) | Se (mg) | Zn (mg) | F máx (mg) |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Núcleo Proteico | 03.0163.00 | 35 | 45 | 18 | 30 | 10 | 2 | 50 | 375 | 50 | 520 | 9 | 1.500 | 180 |
| Top Beef Núcleo Na | 03.0208.00 | 118 | 130 | 40 | 100 | 20 | 94 | 60 | 650 | 40 | 520 | 9 | 1.960 | 400 |
| Top Beef Núcleo Tamponado Na | 03.0212.00 | 118 | 130 | 40 | 111 | 20 | 94 | 60 | 650 | 40 | 520 | 9 | 1.960 | 400 |

Proteína, energia, aditivos e recomendação de uso:

- **Núcleo Proteico** — Proteína bruta 800 g; NNP eq. proteico 660 g; NDT 400 g; MOS 4 g; Beta-glucanas 7 g; Lasalocida 450 mg; Uso: Misturar 10 a 15% no concentrado e fornecer 1 kg da mistura para cada 100 kg de peso vivo. Informe o consumo do núcleo.
- **Top Beef Núcleo Na** — MOS 10 g; Beta-glucanas 17,5 g; Uso: Adicionar 4 a 5% na ração diária. Informe o consumo do núcleo.
- **Top Beef Núcleo Tamponado Na** — MOS 10 g; Beta-glucanas 17,5 g; Lasalocida 2.025 mg; Uso: Adicionar 4 a 5% na ração diária. Informe o consumo do núcleo.

### Concentrados p/ mistura

| Produto | Cód. | Ca mín (g) | Ca máx (g) | P (g) | Na (g) | S (g) | Mg (g) | Co (mg) | Cu (mg) | I (mg) | Mn (mg) | Se (mg) | Zn (mg) | F máx (mg) |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Fós 30S (concentrado) | 03.0218.00 | 200 | 240 | 130 | – | 12 | 13 | 310 | 3.500 | 280 | 3.640 | 32 | 9.000 | 1.300 |
| Fós 40S (concentrado) | 03.0219.00 | 200 | 230 | 163 | – | 12 | 12,5 | 310 | 3.500 | 280 | 3.640 | 32 | 9.000 | 1.630 |
| Fós 160S (concentrado) | 03.0220.00 | 200 | 235 | 160 | – | 12 | 16 | 150 | 1.600 | 190 | 1.400 | 32 | 6.000 | 1.600 |

Proteína, energia, aditivos e recomendação de uso:

- **Fós 30S (concentrado)** — Uso: Concentrado para misturar com sal branco (cria 2:1, recria e engorda 1:1). Preço e teores são do concentrado puro.
- **Fós 40S (concentrado)** — Uso: Concentrado para misturar com sal branco (cria 1:1, recria e engorda 2:3). Preço e teores são do concentrado puro.
- **Fós 160S (concentrado)** — Uso: Concentrado para misturar com sal branco (cria 1:1, recria e engorda 2:3). Preço e teores são do concentrado puro.

### Leite · Mineral pronto

| Produto | Cód. | Ca mín (g) | Ca máx (g) | P (g) | Na (g) | S (g) | Mg (g) | Co (mg) | Cu (mg) | I (mg) | Mn (mg) | Se (mg) | Zn (mg) | F máx (mg) |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Fós Leite | 03.0122.00 | 180 | 200 | 100 | 74 | 12 | 15 | 200 | 1.650 | 195 | 1.960 | 32 | 6.285 | 1.000 |
| Top Milk P | 03.0140.00 | 120 | 145 | 75 | 80 | 15 | 15 | 200 | 1.650 | 195 | 1.960 | 32 | 6.285 | 750 |
| Top Milk Vitaminado | 03.0146.00 | 175 | 190 | 90 | 88 | 12 | 15 | 200 | 1.650 | 195 | 1.960 | 32 | 6.285 | 900 |
| Winter Fós Leite Vaca * | – | 20 | 30 | 14 | 37 | – | 5 | 15 | 150 | 15 | 140 | 3 | 600 | 140 |

Proteína, energia, aditivos e recomendação de uso:

- **Fós Leite** — Uso: 30 g para cada 100 kg de peso vivo, mais 3 g por litro de leite/dia.
- **Top Milk P** — Proteína bruta 110 g; NNP eq. proteico 80 g; NDT 120 g; Uso: 30 g para cada 100 kg de peso vivo, mais 3,5 g por litro de leite/dia.
- **Top Milk Vitaminado** — Vitamina E 1.000 UI; Vitamina A 110.000 UI; Uso: 30 g para cada 100 kg de peso vivo, mais 3 g por litro de leite/dia.
- **Winter Fós Leite Vaca** — Proteína bruta 300 g; NNP eq. proteico 140 g; NDT 460 g; Uso: 250 g para cada 100 kg de peso vivo, mais 30 g por litro de leite/dia.

### Leite · Núcleos

| Produto | Cód. | Ca mín (g) | Ca máx (g) | P (g) | Na (g) | S (g) | Mg (g) | Co (mg) | Cu (mg) | I (mg) | Mn (mg) | Se (mg) | Zn (mg) | F máx (mg) |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Top Milk Núcleo Na | 03.0139.00 | 150 | 180 | 76 | 74 | 20 | 60 | 80 | 850 | 65 | 2.000 | 20 | 6.000 | 760 |
| Top Milk Núcleo Tamponado Na | 03.0138.00 | 150 | 180 | 76 | 55 | 20 | 70 | 80 | 850 | 65 | 2.000 | 20 | 6.000 | 760 |
| Top Milk Núcleo Buffer ASC | 03.0134.00 | 150 | 180 | 76 | 55 | 20 | 80 | 80 | 850 | 65 | 2.000 | 20 | 6.000 | 760 |
| Top Milk Núcleo Proteico Na | 03.0137.00 | 45 | 60 | 36 | 40 | 15 | 80 | 40 | 500 | 30 | 540 | 12 | 1.960 | 360 |
| Lac Gold Na | 03.0124.00 | 130 | 160 | 80 | 74 | 25 | 60 | 100 | 1.250 | 70 | 2.000 | 24 | 6.000 | 800 |
| Lac Rumen Na | – | 120 | 150 | 70 | 74 | 25 | 70 | 100 | 1.250 | 70 | 2.000 | 24 | 6.000 | 700 |
| Lac Parto Na * | 03.0155.00 | 110 | 130 | 60 | 100 | 70 | 5 | 100 | 1.650 | 150 | 2.000 | 32 | 6.000 | 600 |
| Top Farm | 03.0262.00 | 190 | 235 | 97 | 60 | 25 | 12 | 100 | 2.500 | 124 | 2.100 | 27 | 5.600 | 970 |
| Top Farm Rúmen | 03.0264.00 | 190 | 235 | 14 | 65 | 20 | 60 | 60 | 650 | 40 | 520 | 9 | 1.960 | 140 |

Proteína, energia, aditivos e recomendação de uso:

- **Top Milk Núcleo Na** — Uso: 30 g para cada 100 kg de peso vivo, mais 10 g por litro de leite/dia.
- **Top Milk Núcleo Tamponado Na** — MOS 7,5 g; Beta-glucanas 13,125 g; Lasalocida 2.000 mg; Biotina 80 mg; Vitamina E 500 UI; Uso: 30 g para cada 100 kg de peso vivo, mais 13 g por litro de leite/dia.
- **Top Milk Núcleo Buffer ASC** — MOS 11,25 g; Beta-glucanas 19,69 g; Lasalocida 3.000 mg; Biotina 100 mg; Vitamina E 500 UI; Uso: 30 g para cada 100 kg de peso vivo, mais 13 g por litro de leite/dia.
- **Top Milk Núcleo Proteico Na** — Proteína bruta 800 g; NNP eq. proteico 660 g; NDT 400 g; MOS 7,5 g; Beta-glucanas 13,125 g; Uso: Misturar 10% com milho moído e fornecer 3,5 kg da mistura para cada 10 litros de leite/dia. Informe o consumo do núcleo.
- **Lac Gold Na** — MOS 7,5 g; Beta-glucanas 13,125 g; Lasalocida 1.500 mg; Biotina 60 mg; Adsorvente 1.000 mg; Vitamina E 500 UI; Uso: 30 g para cada 100 kg de peso vivo, mais 8 g por litro de leite/dia.
- **Lac Rumen Na** — MOS 11,25 g; Beta-glucanas 19,68 g; Lasalocida 2.000 mg; Biotina 80 mg; Adsorvente 1.000 mg; Uso: 30 g para cada 100 kg de peso vivo, mais 8 g por litro de leite/dia.
- **Lac Parto Na** — MOS 7,5 g; Beta-glucanas 13,125 g; Lasalocida 1.500 mg; Adsorvente 1.200 mg; Nucleotídeos 6.100 mg; Vitamina E 500 UI; Uso: 40 g para cada 100 kg de peso vivo, no concentrado e/ou volumoso.
- **Top Farm** — MOS 5,25 g; Beta-glucanas 8,925 g; Monensina 1.500 mg; Uso: Núcleo para mistura com farelos (2 a 10% da mistura). Informe o consumo do núcleo.
- **Top Farm Rúmen** — MOS 10 g; Beta-glucanas 17,5 g; Monensina 1.000 mg

### Leite · Bezerras / novilhas

| Produto | Cód. | Ca mín (g) | Ca máx (g) | P (g) | Na (g) | S (g) | Mg (g) | Co (mg) | Cu (mg) | I (mg) | Mn (mg) | Se (mg) | Zn (mg) | F máx (mg) |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Top Milk Bezerra | – | 20 | 30 | 12 | 7,4 | 2,5 | 2 | 20 | 300 | 10 | 180 | 4,5 | 1.250 | 120 |
| Top Milk Inicial | – | 20 | 30 | 10 | 4 | 3 | 2 | 15 | 165 | 10 | 180 | 3 | 600 | 100 |
| Top Milk Novilha | – | 60 | 70 | 30 | 37 | 9 | 3 | 40 | 500 | 30 | 620 | 9 | 2.175 | 300 |
| Top Milk Núcleo Bezerra Na | – | 110 | 160 | 80 | 40 | 15 | 30 | 80 | 850 | 65 | 2.000 | 27 | 9.000 | 800 |
| Top Farm Pré-Rúmen | 03.0263.00 | 110 | 160 | 80 | 40 | 15 | 30 | 80 | 850 | 65 | 2.000 | 27 | 9.000 | 800 |

Proteína, energia, aditivos e recomendação de uso:

- **Top Milk Bezerra** — Proteína bruta 200 g; NDT 640 g; MOS 10 g; Beta-glucanas 17,5 g; Narasina 75 mg; Vitamina E 250 UI
- **Top Milk Inicial** — Proteína bruta 250 g; NDT 700 g; MOS 10 g; Beta-glucanas 17,5 g; Narasina 150 mg; Adsorvente 1.000 mg; Nucleotídeos 6.100 mg; Vitamina E 500 UI; Lactose 120 g
- **Top Milk Novilha** — Proteína bruta 250 g; NNP eq. proteico 28 g; NDT 510 g; MOS 1,5 g; Beta-glucanas 2,625 g; Lasalocida 350 mg
- **Top Milk Núcleo Bezerra Na** — MOS 40 g; Beta-glucanas 70 g; Narasina 750 mg; Adsorvente 1.000 mg; Vitamina E 500 UI; Uso: 40 g para cada 100 kg de peso vivo, no concentrado.
- **Top Farm Pré-Rúmen** — MOS 40 g; Beta-glucanas 70 g; Narasina 750 mg; Adsorvente 1.000 mg; Nucleotídeos 6.100 mg; Vitamina E 500 UI; Uso: 40 g para cada 100 kg de peso vivo, no concentrado.

### Equinos / outras espécies

| Produto | Cód. | Ca mín (g) | Ca máx (g) | P (g) | Na (g) | S (g) | Mg (g) | Co (mg) | Cu (mg) | I (mg) | Mn (mg) | Se (mg) | Zn (mg) | F máx (mg) |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Equifós | 03.0014.00 | 195 | 205 | 90 | 83 | 7 | 16 | 90 | 1.300 | 160 | 1.630 | 27 | 4.250 | 900 |
| Equifós P | 03.0015.00 | 205 | 220 | 80 | 83 | 7 | 16 | 90 | 1.300 | 160 | 1.630 | 27 | 4.250 | 800 |
| Top Line Equino Tropa | 03.0070.00 | 115 | 121 | 45 | 55 | 2 | 4 | 40 | 650 | 50 | 700 | 12 | 2.065 | 450 |
| Top Line Caprino * | 03.0244.00 | 110 | 125 | 65 | 37 | 15 | 6 | 107 | 150 | 150 | 1.400 | 12 | 4.500 | 650 |
| Top Line Ovino | 03.0239.00 | 135 | 150 | 65 | 107 | 12 | 6 | 175 | 100 | 175 | 1.440 | 27 | 6.000 | 650 |
| Vitta Ovino | 03.0242.00 | 13 | 22 | 6 | 5 | 2 | 2 | 8 | 5 | 9 | 78 | 2 | 350 | 60 |
| Vitta Touro | 03.0215.00 | 13 | 21 | 6 | 3,7 | 2 | 2 | 8 | 75 | 7 | 78 | 1,5 | 350 | 60 |

Proteína, energia, aditivos e recomendação de uso:

- **Top Line Equino Tropa** — Proteína bruta 70 g; NDT 330 g
- **Top Line Caprino** — Proteína bruta 220 g; NNP eq. proteico 145 g; NDT 270 g
- **Top Line Ovino** — Proteína bruta 30 g; NDT 100 g
- **Vitta Ovino** — Proteína bruta 160 g; NDT 720 g; Uso: 0,5 a 1,0% do peso vivo: 50 a 100 g para cada 10 kg.
- **Vitta Touro** — Proteína bruta 130 g; NDT 720 g; Uso: 0,5 a 1,0% do peso vivo: 500 a 1.000 g para cada 100 kg.

---

## 5. Tabela de preços 04/26 (R$ por saco)

Referência: Tabela de Preços 04/26, de 04/08/2026. Colunas de prazo: à vista, 30, 30/60 e 30/60/90 dias.

| Produto | Cód. | Saco (kg) | À vista | 30 | 30/60 | 30/60/90 |
|---|---|--:|--:|--:|--:|--:|
| Fós 15S | 03.0188.00 | 30 | R$ 119,92 | R$ 122,12 | R$ 123,23 | R$ 124,36 |
| Fós 20S | 03.0187.00 | 30 | R$ 149,40 | R$ 152,14 | R$ 153,52 | R$ 154,93 |
| Fós 20RO | 03.0190.00 | 30 | R$ 152,09 | R$ 154,88 | R$ 156,29 | R$ 157,72 |
| Fós 80S | 03.0191.00 | 30 | R$ 134,51 | R$ 136,98 | R$ 138,22 | R$ 139,49 |
| Fós Recria | 03.0193.00 | 30 | R$ 110,76 | R$ 112,79 | R$ 113,81 | R$ 114,86 |
| Fós Engorda S | 03.0189.00 | 30 | R$ 92,47 | R$ 94,16 | R$ 95,02 | R$ 95,89 |
| Fós Boi | 03.0194.00 | 30 | R$ 84,98 | R$ 86,54 | R$ 87,33 | R$ 88,13 |
| Fós Reprodução | 03.0160.00 | 30 | R$ 145,12 | R$ 147,78 | R$ 149,12 | R$ 150,49 |
| Fós Reprodução Embryo | 03.0161.00 | 30 | R$ 163,78 | R$ 166,78 | R$ 168,29 | R$ 169,84 |
| Top Búfalo | 03.0227.00 | 30 | R$ 158,72 | R$ 161,63 | R$ 163,10 | R$ 164,59 |
| Top Line Cria | 03.0175.00 | 30 | R$ 149,88 | R$ 152,63 | R$ 154,02 | R$ 155,43 |
| Top Line Primípara | 03.0178.00 | 30 | R$ 158,66 | R$ 161,57 | R$ 163,04 | R$ 164,53 |
| Top Line Recria | 03.0176.00 | 30 | R$ 141,22 | R$ 143,81 | R$ 145,12 | R$ 146,45 |
| Top Line Boi | 03.0174.00 | 30 | R$ 111,34 | R$ 113,38 | R$ 114,41 | R$ 115,46 |
| Phos Verão Cria | 03.0169.00 | 30 | R$ 119,86 | R$ 122,06 | R$ 123,17 | R$ 124,30 |
| Phos Verão Recria | 03.0170.00 | 30 | R$ 115,81 | R$ 117,93 | R$ 119,00 | R$ 120,09 |
| Phos Verão Desmama | 03.0225.00 | 30 | R$ 97,16 | R$ 98,94 | R$ 99,84 | R$ 100,75 |
| Phos Verão Boi | 03.0168.00 | 30 | R$ 95,96 | R$ 97,72 | R$ 98,61 | R$ 99,51 |
| Phos Verão Acabamento | 03.0167.00 | 30 | R$ 69,40 | R$ 70,67 | R$ 71,31 | R$ 71,97 |
| Phos Cria Prime | 03.0164.00 | 30 | R$ 111,39 | R$ 113,43 | R$ 114,46 | R$ 115,51 |
| Phos Recria Prime | 03.0165.00 | 30 | R$ 105,52 | R$ 107,45 | R$ 108,43 | R$ 109,42 |
| Phos Boi Prime | 03.0166.00 | 30 | R$ 78,25 | R$ 79,68 | R$ 80,40 | R$ 81,14 |
| Fós Seca Transição Cria | 03.0162.00 | 30 | R$ 78,11 | R$ 79,54 | R$ 80,26 | R$ 81,00 |
| Fós Seca Transição Recria | 03.0224.00 | 30 | R$ 73,92 | R$ 75,28 | R$ 75,96 | R$ 76,66 |
| Fós Seca Transição Boi | 03.0223.00 | 30 | R$ 64,08 | R$ 65,25 | R$ 65,84 | R$ 66,45 |
| Winter Fós Cria | 03.0181.00 | 30 | R$ 89,59 | R$ 91,23 | R$ 92,06 | R$ 92,90 |
| Winter Fós Recria | 03.0228.00 | 30 | R$ 87,92 | R$ 89,53 | R$ 90,34 | R$ 91,17 |
| Winter Fós Boi Seca | 03.0180.00 | 30 | R$ 79,57 | R$ 81,03 | R$ 81,77 | R$ 82,52 |
| Winter Fós Gold | 03.0182.00 | 30 | R$ 91,20 | R$ 92,87 | R$ 93,71 | R$ 94,57 |
| Winter Fós Master | 03.0183.00 | 25 | R$ 54,91 | R$ 55,92 | R$ 56,43 | R$ 56,95 |
| Winter Fós Master 40 | 03.0184.00 | 25 | R$ 56,49 | R$ 57,53 | R$ 58,05 | R$ 58,58 |
| Amireia | 03.0204.00 | 30 | R$ 116,18 | R$ 118,31 | R$ 119,38 | R$ 120,48 |
| Ureia 15% Seca | 03.0201.00 | 30 | R$ 120,62 | R$ 122,83 | R$ 123,95 | R$ 125,08 |
| Ureia 20% | 03.0202.00 | 30 | R$ 140,30 | R$ 142,87 | R$ 144,17 | R$ 145,49 |
| Fós Prime | 03.0157.00 | 25 | R$ 54,67 | R$ 55,67 | R$ 56,18 | R$ 56,69 |
| Fós Prime Acabamento | 03.0158.00 | 25 | R$ 52,54 | R$ 53,50 | R$ 53,99 | R$ 54,48 |
| Top Bezerro | 03.0173.00 | 30 | R$ 79,12 | R$ 80,57 | R$ 81,30 | R$ 82,05 |
| Top Bezerro Precoce | 03.0172.00 | 30 | R$ 65,81 | R$ 67,02 | R$ 67,63 | R$ 68,25 |
| Top Bezerro Desmama | 03.0171.00 | 30 | R$ 86,05 | R$ 87,63 | R$ 88,43 | R$ 89,24 |
| Top Line Taurus | 03.0179.00 | 30 | R$ 65,71 | R$ 66,91 | R$ 67,52 | R$ 68,14 |
| Núcleo Proteico | 03.0163.00 | 25 | R$ 83,99 | R$ 85,53 | R$ 86,31 | R$ 87,10 |
| Top Beef Núcleo Na | 03.0208.00 | 25 | R$ 90,33 | R$ 91,99 | R$ 92,83 | R$ 93,68 |
| Top Beef Núcleo Tamponado Na | 03.0212.00 | 25 | R$ 101,75 | R$ 103,61 | R$ 104,55 | R$ 105,51 |
| Fós 30S (concentrado) | 03.0218.00 | 25 | R$ 178,81 | R$ 182,09 | R$ 183,74 | R$ 185,43 |
| Fós 40S (concentrado) | 03.0219.00 | 25 | R$ 213,04 | R$ 216,94 | R$ 218,91 | R$ 220,92 |
| Fós 160S (concentrado) | 03.0220.00 | 25 | R$ 195,76 | R$ 199,35 | R$ 201,16 | R$ 203,00 |
| Fós Leite | 03.0122.00 | 25 | R$ 141,76 | R$ 144,36 | R$ 145,67 | R$ 147,01 |
| Top Milk P | 03.0140.00 | 30 | R$ 154,03 | R$ 156,85 | R$ 158,27 | R$ 159,73 |
| Top Milk Vitaminado | 03.0146.00 | 30 | R$ 161,00 | R$ 163,95 | R$ 165,44 | R$ 166,96 |
| Top Milk Núcleo Na | 03.0139.00 | 25 | R$ 118,92 | R$ 121,10 | R$ 122,20 | R$ 123,32 |
| Top Milk Núcleo Tamponado Na | 03.0138.00 | 25 | R$ 146,34 | R$ 149,02 | R$ 150,37 | R$ 151,75 |
| Top Milk Núcleo Buffer ASC | 03.0134.00 | 25 | R$ 156,67 | R$ 159,54 | R$ 160,99 | R$ 162,46 |
| Top Milk Núcleo Proteico Na | 03.0137.00 | 25 | R$ 111,91 | R$ 113,96 | R$ 114,99 | R$ 116,05 |
| Lac Gold Na | 03.0124.00 | 30 | R$ 168,92 | R$ 172,02 | R$ 173,58 | R$ 175,17 |
| Lac Parto Na | 03.0155.00 | 30 | R$ 172,56 | R$ 175,72 | R$ 177,32 | R$ 178,94 |
| Top Farm Pré-Rúmen | 03.0263.00 | 25 | R$ 159,70 | R$ 162,63 | R$ 164,11 | R$ 165,61 |
| Equifós | 03.0014.00 | 25 | R$ 125,06 | R$ 127,35 | R$ 128,51 | R$ 129,68 |
| Equifós P | 03.0015.00 | 25 | R$ 115,06 | R$ 117,17 | R$ 118,23 | R$ 119,32 |
| Top Line Equino Tropa | 03.0070.00 | 30 | R$ 99,34 | R$ 101,16 | R$ 102,08 | R$ 103,01 |
| Top Line Caprino | 03.0244.00 | 30 | R$ 140,21 | R$ 142,78 | R$ 144,08 | R$ 145,40 |
| Top Line Ovino | 03.0239.00 | 30 | R$ 143,86 | R$ 146,50 | R$ 147,83 | R$ 149,19 |
| Vitta Ovino | 03.0242.00 | 25 | R$ 54,07 | R$ 55,06 | R$ 55,56 | R$ 56,07 |
| Vitta Touro | 03.0215.00 | 25 | R$ 54,91 | R$ 55,92 | R$ 56,43 | R$ 56,95 |
| Top Farm | 03.0262.00 | 25 | R$ 154,59 | R$ 157,42 | R$ 158,85 | R$ 160,31 |
| Top Farm Rúmen | 03.0264.00 | 25 | R$ 66,26 | R$ 67,47 | R$ 68,08 | R$ 68,71 |

Produtos do catálogo **sem preço na tabela 04/26** (exigem preço manual): Phos Verão MT, Winter Fós MT Seca, Winter Fós Nordeste Seca, Fós Pampa Pastagens de Inverno, Fós Pampa Past. Inverno Prime, Fós Pampa Terneiro Precoce, Fós Pampa Annoni, Fós Pampa Nativo Inverno, Pampa Nativo, Winter Fós Leite Vaca, Lac Rumen Na, Top Milk Bezerra, Top Milk Inicial, Top Milk Novilha, Top Milk Núcleo Bezerra Na.

Códigos presentes na tabela de preços, mas sem fórmula no comparador: 03.0073.00, 03.0074.00, 03.0075.00.

---

## 6. Aviso

Produtos fabricados e faturados pela Matsuda Sementes e Nutrição Animal. A Pastron Agro é a representante comercial. Ferramenta de uso interno do representante: os preços seguem a tabela de fábrica e dependem de aprovação de crédito da Matsuda. Níveis de garantia conferidos nos informativos dos produtos e nos livretos Nutrição Animal 2026 e Leite 2025. Nada é estimado.

*Conhecimento que fortalece o campo.*
