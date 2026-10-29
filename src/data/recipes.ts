import { Recipe } from '../types';

export const MATERNAL_RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    title: 'Caldo de Peixe Fresco com Legumes e Mandioca',
    category: 'ferro_anemia',
    trimester: 'todos',
    prepTimeMinutes: 30,
    servings: '2 a 3 porções',
    difficulty: 'Fácil',
    shortDescription: 'Caldo revigorante de peixe fresco da costa angolana (corvina ou garoupa), rico em ferro, ômega-3 e de fácil digestão.',
    imageEmoji: '🍲',
    bgGradient: 'from-amber-500 to-rose-600',
    ingredients: [
      '500g de peixe fresco limpo e em postas (corvina ou garoupa)',
      '1 mandioca média descascada e cortada em cubos',
      '1 cenoura média em rodelas',
      '1 chuchu ou abobrinha em cubos',
      '2 dentes de alho picados e 1 cebola média',
      '1 tomate maduro sem pele e sem grainhas',
      '1 raminho de coentros frescos picados',
      '1 colher de chá de azeite doce (ou óleo vegetal)',
      '1 pitada suave de sal iodado e sumo de meio limão',
      '1 litro de água filtrada ou mineral'
    ],
    instructions: [
      'Tempera as postas de peixe com o sumo de limão, alho e a pitada de sal. Deixa repousar 10 minutos.',
      'Numa panela média, coloca o fio de azeite e refoga suavemente a cebola e o tomate até ficarem macios.',
      'Adiciona a água filtrada e junta a mandioca e a cenoura. Deixa cozer em lume médio por 12 minutos até a mandioca amaciar.',
      'Acrescenta o chuchu e as postas de peixe temperadas. Deixa cozinhar tapado por mais 8 a 10 minutos (o peixe deve ficar bem cozido por completo).',
      'Finaliza polvilhando os coentros frescos picados e desliga o lume. Serve morno numa tigela reconfortante.'
    ],
    maternalBenefit: 'Acalma o estômago, fornece hidratação imediata e repõe eletrólitos sem pesar na digestão.',
    fetalBenefit: 'Os ácidos gordos ômega-3 (DHA) do peixe fresco são fundamentais para o desenvolvimento neurológico e visão do feto.',
    doctorTip: 'Certifica-te de que o peixe esteja bem cozido (nunca cru). O sal deve ser moderado para evitar a subida da tensão arterial.',
    tags: ['Peixe Fresco', 'Ferro', 'Ômega-3', 'Sem Frituras', 'Digestão Leve']
  },
  {
    id: 'rec-2',
    title: 'Papas de Aveia Quentes com Banana da Ganda e Gengibre',
    category: 'anti_enjoo',
    trimester: '1',
    prepTimeMinutes: 12,
    servings: '1 porção',
    difficulty: 'Fácil',
    shortDescription: 'Excelente pequeno-almoço para aliviar os enjoos matinais do primeiro trimestre e dar energia sustentada.',
    imageEmoji: '🥣',
    bgGradient: 'from-amber-400 to-orange-500',
    ingredients: [
      '4 colheres de sopa de aveia em flocos finos',
      '200ml de leite meio-gordo pasteurizado (ou água de coco/leite vegetal)',
      '1 banana da Ganda madura amassada',
      '1 rodela fina de gengibre fresco ralado (1/4 de colher de café)',
      '1 pitada leve de canela em pó para perfumar',
      '1 colher de chá de sementes de chia (opcional)'
    ],
    instructions: [
      'Num pequeno tacho, mistura a aveia e o leite (ou água de coco).',
      'Leva a lume brando, mexendo sempre durante 4 a 5 minutos até engrossar num creme aveludado.',
      'Junta o gengibre ralado muito fininho e mistura bem (o gengibre é o segredo natural contra náuseas).',
      'Desliga o lume, deita numa tigela e cobre com a banana amassada e a pitada de canela.',
      'Come devagar, em pequenos goles ou colheradas, preferencialmente ainda na cama ou logo ao despertar.'
    ],
    maternalBenefit: 'O gengibre possui gingeróis com forte ação antiemética comprovada pela obstetrícia moderna, aliviando o refluxo e enjoo.',
    fetalBenefit: 'Fornece hidratos de carbono complexos de absorção lenta, evitando picos e quedas de glicose no sangue da mãe.',
    doctorTip: 'Mulheres com enjoo severo no 1º trimestre devem comer algo seco ou quente antes mesmo de levantar da cama.',
    tags: ['Anti-Enjoo', '1º Trimestre', 'Gengibre Natural', 'Fibras', 'Fácil']
  },
  {
    id: 'rec-3',
    title: 'Mufete Suave Saudável para Mamãs',
    category: 'ferro_anemia',
    trimester: 'todos',
    prepTimeMinutes: 35,
    servings: '2 porções',
    difficulty: 'Médio',
    shortDescription: 'Uma recriação equilibrada do prato emblemático angolano: peixe grelhado bem passado, batata-doce da Huíla e feijão com óleo de palma reduzido.',
    imageEmoji: '🐟',
    bgGradient: 'from-rose-500 to-red-600',
    ingredients: [
      '2 peixes médios frescos (carapau ou cacusso) bem limpos e escamados',
      '1 batata-doce da Huíla média cozida com casca limpa',
      '1 banana-pão madura cozida',
      '1 chávena de feijão vermelho ou catete cozido macio',
      '1 colher de chá de óleo de palma virgem (azeite de dendém) apenas para perfumar',
      '1 cebola roxa picada fininha e 1 dente de alho ralado',
      'Sumo de 1 limão natural e coentros frescos',
      '1 pitada suave de sal iodado'
    ],
    instructions: [
      'Lava muito bem o peixe e tempera com alho, sal suave e sumo de limão fresco. Grelha numa chapa ou grelha até o peixe ficar perfeitamente passado no interior.',
      'Coze a batata-doce e a banana-pão em água fervente limpa até ficarem tenras.',
      'Num tacho pequeno, refoga meia cebola no mínimo de óleo de palma (apenas 1 colher de chá) e junta o feijão cozido com um pouco do próprio caldo para um feijão suave.',
      'Para o molho de vinagrete suave de Angola: mistura a cebola roxa picada com coentros, sumo de limão fresco e 2 colheres de água filtrada (sem picante forte).',
      'Monta o prato com a posta de peixe bem passada, as fatias de batata-doce, banana e o feijão perfumado.'
    ],
    maternalBenefit: 'A batata-doce é rica em betacaroteno e fibras que regulam o intestino, enquanto o feijão e peixe previnem a anemia gestacional.',
    fetalBenefit: 'Proteína pura de alto valor biológico indispensável para a multiplicação celular rápida e peso saudável do bebé.',
    doctorTip: 'Evita picantes fortes (como o jindungo cru) durante a gestação porque provocam azia intensa e desconforto gástrico.',
    tags: ['Tradição Angolana', 'Batata-Doce', 'Rico em Ferro', 'Sem Excesso de Gordura']
  },
  {
    id: 'rec-4',
    title: 'Sumo Revigorante de Múcua com Laranja e Hortelã',
    category: 'hidratacao',
    trimester: 'todos',
    prepTimeMinutes: 10,
    servings: '2 copos grandes',
    difficulty: 'Fácil',
    shortDescription: 'O superalimento sagrado do embondeiro angolano: riquíssimo em vitamina C, potássio e cálcio bioativo.',
    imageEmoji: '🍹',
    bgGradient: 'from-amber-300 to-rose-400',
    ingredients: [
      '1 chávena de polpa ou frutos de múcua (baobá) limpos',
      '500ml de água mineral ou fervida fria',
      'Sumo de 2 laranjas doces espremidas na hora',
      '4 folhas frescas de hortelã lavadas',
      '1 colher de sopa de mel ou açúcar mascavado (opcional e moderado)'
    ],
    instructions: [
      'Coloca a múcua numa tigela com 250ml de água morna filtrada durante 15 minutos para soltar a polpa aveludada.',
      'Com as mãos bem lavadas ou uma colher, espreme as sementes contra o coador até obter um leite de múcua espesso e branco.',
      'Num jarro, junta o leite de múcua, o restante da água fria e o sumo natural de laranja fresco.',
      'Adiciona as folhas de hortelã ligeiramente machucadas para libertar aroma e mexe bem.',
      'Serve fresco (não demasiado gelado para não provocar cólicas no estômago).'
    ],
    maternalBenefit: 'A vitamina C da múcua e da laranja multiplica por até 4x a absorção do ferro dos alimentos e do sulfato ferroso prescrito pelo médico.',
    fetalBenefit: 'O cálcio natural do baobá e os bioflavonoides apoiam a formação dos botões dentários e tecido conjuntivo do feto.',
    doctorTip: 'Toma este sumo 30 minutos após o almoço ou quando tomares o comprimido de ferro prescrito na consulta pré-natal.',
    tags: ['Múcua Angolana', 'Super Vitamina C', 'Hidratação', 'Absorção de Ferro']
  },
  {
    id: 'rec-5',
    title: 'Kizaca Suave com Espinafres e Arroz Integral',
    category: 'calcio_ossos',
    trimester: 'todos',
    prepTimeMinutes: 25,
    servings: '2 a 3 porções',
    difficulty: 'Fácil',
    shortDescription: 'Folhas verdes ricas em ácido fólico e cálcio natural, preparadas com suavidade para garantir digestão perfeita.',
    imageEmoji: '🥬',
    bgGradient: 'from-emerald-500 to-teal-700',
    ingredients: [
      '200g de folhas de kizaca (folhas de mandioca) bem trituradas e pré-fervidas',
      '1 molho de espinafres frescos bem lavados folha a folha',
      '1 cebola média picadinha',
      '2 dentes de alho esmagados',
      '1 colher de sopa de azeite doce ou óleo de milho',
      '1 chávena de arroz carolino ou integral cozido',
      '1 pitada suave de sal'
    ],
    instructions: [
      'Garante que as folhas de kizaca foram devidamente fervidas previamente para eliminar qualquer aspereza.',
      'Num tacho, aquece o azeite e refoga o alho e a cebola até dourarem suavemente.',
      'Junta a kizaca e os espinafres picados. Cozinha em lume brando por 10 a 12 minutos com 3 colheres de água até ficarem macios.',
      'Ajusta o sal no mínimo necessário.',
      'Serve acompanhado de arroz integral quente ou funge suave de milho bem cozido.'
    ],
    maternalBenefit: 'Folhas verdes escuras são das fontes vegetais mais ricas em ácido fólico, prevenindo a fadiga materna.',
    fetalBenefit: 'O folato é crucial para o fecho completo do tubo neural e medula espinhal do feto nas primeiras semanas e para o crescimento tecidual contínuo.',
    doctorTip: 'Lava sempre todas as folhas verdes em água abundante corrente e, se possível, deixa em água com gotas de lixívia alimentar antes de cozer.',
    tags: ['Kizaca', 'Ácido Fólico', 'Cálcio', 'Folhas Verdes', 'Intestino Regular']
  },
  {
    id: 'rec-6',
    title: 'Salada Colorida de Feijão Frade com Abacate da Huíla',
    category: 'energia_fibras',
    trimester: 'todos',
    prepTimeMinutes: 15,
    servings: '2 porções',
    difficulty: 'Fácil',
    shortDescription: 'Gorduras monoinsaturadas saudáveis, fibras ativas e ferro vegetal para combater a obstipação gestacional.',
    imageEmoji: '🥑',
    bgGradient: 'from-lime-500 to-emerald-600',
    ingredients: [
      '1 chávena e meia de feijão frade cozido ao dente e arrefecido',
      '1 abacate maduro da Huíla cortado em cubos médios',
      '1 tomate chucha sem sementes cortado em cubos',
      'Meia cebola roxa picada fininha',
      '1 ovo cozido duro cortado em quartos (bem passado!)',
      'Sumo de meio limão fresco e 1 colher de sobremesa de azeite doce',
      'Salsa fresca picada e pitada suave de sal'
    ],
    instructions: [
      'Numa saladeira espaçosa, junta o feijão frade cozido e o tomate em cubos.',
      'Rega o abacate com o sumo de limão para manter a cor verde brilhante e não oxidar.',
      'Adiciona o abacate, a cebola roxa picada e a salsa à saladeira.',
      'Tempera delicadamente com o azeite doce e uma pitada de sal, misturando com cuidado para não desmanchar o abacate.',
      'Finaliza colocando os quartos de ovo cozido por cima. Pode ser consumido fresco ao almoço.'
    ],
    maternalBenefit: 'O abacate é rico em potássio (ajuda a evitar as dolorosas cãibras noturnas nas pernas) e gorduras anti-inflamatórias.',
    fetalBenefit: 'A gema do ovo bem cozido é uma das fontes mais nobres de colina, nutriente vital para a memória e sinapses cerebrais do bebé.',
    doctorTip: 'O ovo tem de estar com a gema e clara completamente sólidas e cozidas para eliminar qualquer risco de salmonela na gravidez.',
    tags: ['Abacate da Huíla', 'Feijão Frade', 'Anti-Cãibras', 'Colina', 'Fibras']
  },
  {
    id: 'rec-7',
    title: 'Tigela Cremosa de Iogurte com Manga de Benguela e Chia',
    category: 'calcio_ossos',
    trimester: 'todos',
    prepTimeMinutes: 8,
    servings: '1 porção',
    difficulty: 'Fácil',
    shortDescription: 'Lanche prático com cálcio bioassimilável, probióticos benéficos e doçura natural da fruta angolana.',
    imageEmoji: '🥭',
    bgGradient: 'from-yellow-400 to-rose-500',
    ingredients: [
      '1 copo (170g) de iogurte natural pasteurizado sem açúcar',
      'Metade de uma manga de Benguela madura cortada em fatias',
      '1 colher de chá de sementes de chia ou linhaça moída',
      '1 colher de sobremesa de mel puro (ou pedacinhos de amêndoa torrada)'
    ],
    instructions: [
      'Coloca o iogurte natural numa taça bonita.',
      'Distribui os pedaços de manga doce fresca por cima.',
      'Polvilha com as sementes de chia ou linhaça moída.',
      'Finaliza com um fio fino de mel para equilibrar a acidez natural do iogurte.',
      'Consumir como lanche da tarde ou pós-jantar leve.'
    ],
    maternalBenefit: 'Os probióticos do iogurte fortalecem a flora intestinal materna, combatem a azia e previnem infeções urinárias recorrentes.',
    fetalBenefit: 'O cálcio é a matéria-prima direta que o feto extrai para consolidar o esqueleto e dentes de leite durante o 2º e 3º trimestres.',
    doctorTip: 'Consome apenas iogurtes e derivados lácteos com indicação explícita de "leite pasteurizado" no rótulo.',
    tags: ['Cálcio Forte', 'Manga Fresca', 'Probióticos', 'Lanche Saudável']
  },
  {
    id: 'rec-8',
    title: 'Água Aromatizada com Pepino, Limão e Hortelã',
    category: 'hidratacao',
    trimester: 'todos',
    prepTimeMinutes: 5,
    servings: '1 jarro de 1 litro',
    difficulty: 'Fácil',
    shortDescription: 'A solução ideal para mamãs que têm dificuldade em beber água pura ou sentem náuseas com água simples.',
    imageEmoji: '🥒',
    bgGradient: 'from-emerald-400 to-cyan-500',
    ingredients: [
      '1 litro de água filtrada ou mineral fresca',
      'Metade de um pepino médio bem lavado e cortado em rodelas finas com casca',
      'Meio limão cortado em rodelas',
      '6 folhas frescas de hortelã ligeiramente amassadas'
    ],
    instructions: [
      'Num jarro de vidro limpo, coloca as rodelas de pepino, limão e as folhas de hortelã.',
      'Despeja o litro de água fresca filtrada por cima.',
      'Deixa em repouso no frigorífico por 30 minutos para os óleos essenciais e aroma infundirem suavemente.',
      'Vai bebendo aos golinhos ao longo da manhã e tarde, mantendo o jarro perto do teu local de descanso ou trabalho.'
    ],
    maternalBenefit: 'Acelera a eliminação de toxinas renais, reduz o edema e inchaço nos tornozelos e mantém o líquido amniótico no volume ideal.',
    fetalBenefit: 'A hidratação materna contínua assegura uma circulação placentária volumosa com entrega otimizada de oxigénio.',
    doctorTip: 'Tenta beber pelo menos 2 a 3 litros de líquidos por dia em Angola, especialmente em dias de calor intenso.',
    tags: ['Água Viva', 'Desinchaço', 'Sem Açúcar', 'Refrescante']
  },
  {
    id: 'rec-9',
    title: 'Chips Crocantes de Batata-Doce no Forno',
    category: 'lanches',
    trimester: 'todos',
    prepTimeMinutes: 25,
    servings: '2 porções',
    difficulty: 'Fácil',
    shortDescription: 'Substituto perfeito e saudável para batatas fritas industriais: crocante, natural e cheio de betacaroteno.',
    imageEmoji: '🍠',
    bgGradient: 'from-orange-500 to-rose-600',
    ingredients: [
      '2 batatas-doces médias lavadas com escova sob água corrente',
      '1 colher de sopa de azeite doce',
      '1 pitada leve de sal e alecrim ou orégãos secos'
    ],
    instructions: [
      'Pré-aquece o forno a 180°C.',
      'Corta a batata-doce em rodelas muito fininhas (podes usar um fatiador de legumes ou faca afiada).',
      'Seca as rodelas com um pano de cozinha limpo para ficarem bem crocantes.',
      'Numa tigela, envolve as fatias no azeite e ervas.',
      'Distribui as rodelas num tabuleiro sem sobrepor. Leva ao forno por 15 a 18 minutos até dourarem nas bordas.',
      'Deixa arrefecer 5 minutos e desfruta de um petisco crocante e saciante.'
    ],
    maternalBenefit: 'Sem gorduras trans nem conservantes industriais; fornece amido resistente que nutre as bactérias boas do intestino.',
    fetalBenefit: 'O betacaroteno é convertido pelo organismo em vitamina A segura, vital para o crescimento celular harmonioso.',
    doctorTip: 'Guarda num pote hermético para levar na mala para consultas ou dias fora de casa.',
    tags: ['Lanche Prático', 'Crocante', 'Anti-Azia', 'Sem Fritura']
  },
  {
    id: 'rec-10',
    title: 'Caldo de Galinha Caipira com Abóbora e Legumes',
    category: 'energia_fibras',
    trimester: 'todos',
    prepTimeMinutes: 40,
    servings: '3 porções',
    difficulty: 'Fácil',
    shortDescription: 'Canja materna tradicional rica em colagénio natural, minerais e conforto para dias de cansaço ou convalescença.',
    imageEmoji: '🍲',
    bgGradient: 'from-amber-400 to-yellow-600',
    ingredients: [
      '400g de peito ou coxas de galinha caipira limpos e sem pele',
      '1 fatia grossa de abóbora amarela aos cubos',
      '1 cenoura média e 1 alho-francês em rodelas',
      '3 colheres de sopa de arroz branco ou massinhas',
      '2 dentes de alho picados e 1 cebola',
      '1 colher de chá de azeite doce e salsa fresca picada',
      '1 litro e meio de água filtrada'
    ],
    instructions: [
      'Numa panela de fundo grosso, sela os pedaços de galinha com um fio de azeite, alho e cebola até dourarem suavemente.',
      'Adiciona a água filtrada e deixa ferver com a panela tapada em lume brando por 20 minutos.',
      'Junta a abóbora, a cenoura e o arroz. Cozinha por mais 15 minutos até os vegetais estarem tenros e o caldo encorpado.',
      'Retira o frango, desfia em pedaços pequenos e devolve à sopa.',
      'Polvilha com salsa fresca picada e serve quente.'
    ],
    maternalBenefit: 'Ajuda a repor líquidos, proteínas e minerais em dias de febre ligeira, cansaço físico ou digestão difícil.',
    fetalBenefit: 'Aminoácidos essenciais (lisina, leucina) para a formação de todos os órgãos e músculos do bebé.',
    doctorTip: 'Retira sempre a pele do frango para reduzir gorduras saturadas desnecessárias no caldo.',
    tags: ['Canja Materna', 'Conforto', 'Proteína Pura', 'Reidratação']
  }
];

export const FOOD_SAFETY_GUIDELINES = [
  {
    title: 'Carnes e Peixes Sempre Bem Cozinhados',
    description: 'Nunca consumas carne mal passada, sushi cru ou peixe mal cozido. As carnes devem atingir pelo menos 75°C no interior para eliminar o risco de toxoplasmose e listeriose.',
    iconName: 'AlertCircle',
    riskLevel: 'Critico'
  },
  {
    title: 'Higiene Rigorosa de Legumes e Frutas',
    description: 'Lava sempre as folhas de kizaca, espinafres, tomates e frutas em água potável corrente. Em Angola, usa água fervida ou tratada com gotas próprias para desinfeção alimentar.',
    iconName: 'Sparkles',
    riskLevel: 'Essencial'
  },
  {
    title: 'Atenção ao Sal e Prevenção de Pré-Eclâmpsia',
    description: 'Modera o sal e caldos em cubos industrializados. A hipertensão na gravidez (pré-eclâmpsia) é uma das causas principais de complicações obstétricas em Angola.',
    iconName: 'ShieldAlert',
    riskLevel: 'Alerta'
  },
  {
    title: 'Zero Álcool e Moderação de Cafeína',
    description: 'Nenhuma quantidade de álcool é segura durante a gestação (risco de síndrome alcoólica fetal). Limita o café a 1 chávena pequena por dia ou prefere sumos de fruta naturais.',
    iconName: 'Coffee',
    riskLevel: 'Critico'
  },
  {
    title: 'Laticínios Apenas Pasteurizados',
    description: 'Verifica sempre o rótulo do leite, queijos e iogurtes. Evita queijos artesanais frescos de leite cru não fervido para prevenir infeções bacterianas graves.',
    iconName: 'CheckCircle2',
    riskLevel: 'Essencial'
  },
  {
    title: 'Chás Tradicionais e Ervas Medicinais',
    description: 'Não tomes infusões de plantas ou raízes tradicionais sem aprovação do teu médico ou enfermeiro obstetra, pois muitas ervas provocam contrações uterinas prematuras.',
    iconName: 'AlertTriangle',
    riskLevel: 'Atenção'
  }
];
