import { EducationalGuide } from '../types';

export const INITIAL_GUIDES: EducationalGuide[] = [
  {
    id: 'guia-sinais-alerta-urgente',
    slug: 'sinais-alerta-vermelho',
    title: 'Sinais de Alerta Vermelho: Quando Procurar Urgência Imediata',
    category: 'sinais_alerta',
    readTimeMinutes: 4,
    published: true,
    isFree: true,
    isUrgentAlert: true,
    medicalReviewDate: '15 de Outubro de 2026',
    reviewerName: 'Dra. Esperança Manuel',
    reviewerTitle: 'Especialista em Ginecologia e Obstetrícia (Ordem dos Médicos de Angola)',
    shortIntro: 'Saber identificar os sinais de perigo salva vidas. Se tiver algum destes sintomas, dirija-se imediatamente à maternidade mais próxima sem esperar pela próxima consulta.',
    sections: [
      {
        heading: 'Sintomas que Exigem Avaliação Médica Imediata',
        body: '• Sangramento vaginal de qualquer intensidade (vermelho vivo ou escuro com coágulos).\n• Perda repentina de líquido pela vagina (rotura da bolsa de águas).\n• Febre alta (temperatura superior a 38°C) ou calafrios fortes (despiste urgente de malária).\n• Dor de cabeça intensa e persistente que não cede e visão turva ou com pontos brilhantes.\n• Dor abdominal ou no fundo da barriga intensa, constante e fora do padrão normal de cólicas.\n• Diminuição acentuada ou ausência de movimentos do bebé após a 24ª semana de gestação.\n• Inchaço súbito e severo na face, nas mãos e nas pálpebras (possível sinal de pré-eclâmpsia).\n• Convulsões ou sensação de desmaio iminente.'
      },
      {
        heading: 'O Que Fazer em Caso de Emergência em Angola',
        body: '1. Não espere pela manhã seguinte nem tente automedicar-se em casa.\n2. Ligue para o Serviço Nacional de Emergências Médicas de Angola: 111.\n3. Tenha consigo a caderneta de saúde da grávida do MINSA, os seus documentos de identificação (Bilhete de Identidade) e exames anteriores.\n4. Dirija-se à Maternidade de referência da sua província (ex: Maternidade Lucrécia Paim ou Maternidade Augusto Ngangula em Luanda, Hospital Geral de Benguela, Hospital Geral do Huambo, etc.).'
      },
      {
        heading: 'Aviso Médico Crucial',
        body: 'Nunca minimize sangramentos ou dores fortes. Na gravidez, mais vale uma consulta de urgência por excesso de zelo do que protelar uma avaliação médica.'
      }
    ],
    questionsForDoctor: [
      'Qual a maternidade pública ou clínica privada mais próxima da minha residência recomendada para urgências noturnas?',
      'Em que número de telemóvel posso contactar a equipa obstétrica em caso de dúvida aguda?'
    ]
  },
  {
    id: 'guia-consultas-prenatal-minsa',
    slug: 'calendario-consultas-minsa',
    title: 'Consultas Pré-Natais: Calendário Recomendado pelo MINSA Angola',
    category: 'consultas',
    readTimeMinutes: 5,
    published: true,
    isFree: true,
    medicalReviewDate: '10 de Outubro de 2026',
    reviewerName: 'Dr. Afonso Quitumba',
    reviewerTitle: 'Médico de Saúde Pública e Obstetrícia',
    shortIntro: 'As consultas de pré-natal são o pilar de uma gravidez segura. Conheça o calendário ideal de acompanhamento e exames laboratoriais essenciais.',
    sections: [
      {
        heading: 'Quantas Consultas Devo Fazer?',
        body: 'O Ministério da Saúde de Angola (MINSA) e a Organização Mundial da Saúde (OMS) recomendam um mínimo de 8 contactos de saúde pré-natal ao longo da gravidez:\n• 1ª Consulta: Idealmente antes das 12 semanas de gravidez.\n• A cada 4 semanas até à 28ª semana.\n• A cada 2 semanas entre a 28ª e a 36ª semana.\n• Semanalmente a partir da 36ª semana até ao dia do parto.'
      },
      {
        heading: 'Exames Laboratoriais Indispensáveis',
        body: 'Nas primeiras consultas são realizados:\n• Grupo Sanguíneo e Fator Rh (despiste de incompatibilidade materno-fetal).\n• Hemograma completo (diagnóstico precoce de anemia).\n• Teste rápido de Malária e despiste de Glicemia em jejum.\n• Rastreio serológico: VIH, Sífilis (VDRL), Hepatite B e Toxoplasmose.\n• Exame de urina tipo II e urocultura.'
      },
      {
        heading: 'A Caderneta da Grávida',
        body: 'Guarde sempre a sua Caderneta de Saúde da Grávida do MINSA na sua mala. Em qualquer posto de saúde ou hospital de Angola, ela reúne todo o histórico da gestação.'
      }
    ],
    questionsForDoctor: [
      'Todos os meus exames do primeiro trimestre estão em dia?',
      'Quando devo tomar a vacina antitetânica no posto de vacinação?'
    ]
  },
  {
    id: 'guia-nutricao-angola',
    slug: 'nutricao-hidratacao-angola',
    title: 'Nutrição e Hidratação: Alimentos Saudáveis e Tradicionais em Angola',
    category: 'alimentacao',
    readTimeMinutes: 6,
    published: true,
    isFree: false,
    medicalReviewDate: '12 de Outubro de 2026',
    reviewerName: 'Dra. Marlene dos Santos',
    reviewerTitle: 'Nutricionista Materno-Infantil',
    shortIntro: 'A rica culinária angolana oferece excelentes opções nutritivas para o crescimento saudável do bebé, desde que bem preparadas.',
    sections: [
      {
        heading: 'Alimentos Ricos em Ferro para Prevenir a Anemia',
        body: 'A anemia por carência de ferro é frequente na gestação. Aposte em:\n• Folhas verdes escuras: Quizaca bem cozida, folhas de batata-doce, couve galega e espinafres.\n• Feijão de óleo de palma com moderação no azeite de dendém virgem (excelente fonte de ferro e vitamina A natural).\n• Peixes frescos das nossas costas (como garoupa, pescada, carapau fresco bem grelhado ou cozido).\n• Dica de ouro: Consuma fruta cítrica rica em vitamina C (laranja, tangerina, maracujá) junto com as refeições para triplicar a absorção do ferro vegetal.'
      },
      {
        heading: 'Hidratação e Segurança da Água',
        body: 'No clima quente e húmido de Angola, a grávida deve beber entre 2,5 e 3 litros de água por dia.\n• Beba sempre água engarrafada de fonte segura, água filtrada ou água previamente fervida e arrefecida em recipiente limpo e tapado.\n• A água de coco natural é uma excelente aliada rica em eletrólitos.'
      },
      {
        heading: 'O Que Evitar Rigorosamente',
        body: '• Bebidas alcoólicas (não existe dose segura de álcool na gravidez).\n• Carnes mal passadas, peixe cru e ovos moles com gema líquida (risco de salmonela e toxoplasmose).\n• Alimentos de rua com conservação duvidosa ou sem refrigeração adequada.'
      }
    ],
    questionsForDoctor: [
      'Preciso de aumentar a dose de sulfato ferroso na minha dieta?',
      'O chá de folhas ou infusões tradicionais são seguros nesta fase?'
    ]
  },
  {
    id: 'guia-prevencao-malaria-angola',
    slug: 'prevencao-malaria-gravidez',
    title: 'Prevenção da Malária na Gravidez: Mosquiteiros e Tratamento Profilático',
    category: 'primeiro_trimestre',
    readTimeMinutes: 5,
    published: true,
    isFree: true,
    medicalReviewDate: '08 de Outubro de 2026',
    reviewerName: 'Dr. Afonso Quitumba',
    reviewerTitle: 'Médico de Saúde Pública e Obstetrícia',
    shortIntro: 'Em Angola, a malária é endémica e representa um risco significativo para grávidas e fetos. Saiba como se proteger com máxima eficácia.',
    sections: [
      {
        heading: 'Por que a Grávida é Mais Vulnerável?',
        body: 'Durante a gestação, as alterações imunológicas tornam a mulher mais suscetível à infeção pelo parasita Plasmodium. Os parasitas concentram-se na placenta, podendo comprometer o fornecimento de nutrientes e oxigénio ao feto, causando baixo peso ao nascer ou parto prematuro.'
      },
      {
        heading: 'Tratamento Preventivo Intermitente (TPI)',
        body: 'O protocolo nacional de Angola prevê a administração gratuita do TPI (Sulfadoxina-Pirimetamina) a partir do segundo trimestre da gestação em consultas de pré-natal, sob supervisão direta do profissional de saúde.\n• Não tome comprimidos anti-maláricos por conta própria sem prescrição médica.'
      },
      {
        heading: 'Medidas Práticas no Domicílio',
        body: '• Durma todas as noites sob um mosquiteiro impregnado com inseticida de longa duração.\n• Instale redes nas janelas e portas de casa.\n• Use repelentes de mosquitos aprovados para uso na gravidez (à base de DEET ou Icaridina em concentrações seguras).\n• Ao entardecer, use roupas compridas e de cores claras que cubram braços e pernas.'
      }
    ],
    questionsForDoctor: [
      'Quando devo receber a primeira dose do TPI na minha consulta?',
      'Se tiver febre ou dor no corpo, devo fazer o teste da gota espessa imediatamente?'
    ]
  },
  {
    id: 'guia-mala-maternidade-angola',
    slug: 'mala-maternidade-luanda-angola',
    title: 'Mala de Maternidade em Angola: Lista Prática para a Mãe e o Bebé',
    category: 'mala_maternidade',
    readTimeMinutes: 5,
    published: true,
    isFree: false,
    medicalReviewDate: '20 de Outubro de 2026',
    reviewerName: 'Enfª Parteira Teresa Vunge',
    reviewerTitle: 'Especialista em Enfermagem Materno-Infantil',
    shortIntro: 'Ter a mala pronta a partir da 34ª semana de gestação traz tranquilidade para o momento do parto. Veja a lista adaptada às maternidades angolanas.',
    sections: [
      {
        heading: 'Documentos Obrigatórios na Mala',
        body: '• Bilhete de Identidade da mãe e do pai/acompanhante.\n• Caderneta de Saúde da Grávida do MINSA com todos os carimbos e registos.\n• Últimas análises de sangue, urina e laudos das ecografias realizadas.'
      },
      {
        heading: 'Itens para a Mãe',
        body: '• 3 camisas de dormir ou pijamas de algodão com botões à frente (facilitam a amamentação).\n• 4 a 6 cuecas de algodão de cintura subida confortáveis.\n• 2 a 3 soutiens de amamentação sem aros de arame.\n• Pensos higiénicos pós-parto de alta absorção.\n• Produtos de higiene pessoal: sabonete neutro, escova e pasta de dentes, toalhas de banho macias.\n• Chinelos de quarto e chinelos de borracha para o duche.'
      },
      {
        heading: 'Itens para o Bebé',
        body: '• 4 mudas completas de roupinha de algodão macio (bodies interiores, calças com pés, casaquinhos leves).\n• 2 mantas de algodão ou flanela leve (adequadas ao ar condicionado das maternidades).\n• 1 pacote de fraldas descartáveis de tamanho recém-nascido.\n• Fraldas de pano de algodão para apoio nas mamadas.\n• Toucas e meias de algodão.\n• Toalhetes húmidos sem álcool e pomada para assaduras.'
      }
    ],
    questionsForDoctor: [
      'A maternidade onde vou dar à luz fornece algum material de higiene ou lençóis?',
      'É permitido um acompanhante familiar durante o trabalho de parto?'
    ]
  },
  {
    id: 'guia-amamentacao-primeiros-dias',
    slug: 'amamentacao-exclusiva-sucesso',
    title: 'Amamentação Exclusiva: Guia Prático para uma Pega Correta Sem Dor',
    category: 'amamentacao',
    readTimeMinutes: 6,
    published: true,
    isFree: false,
    medicalReviewDate: '14 de Outubro de 2026',
    reviewerName: 'Dra. Marlene dos Santos',
    reviewerTitle: 'Nutricionista Materno-Infantil',
    shortIntro: 'O leite materno é o alimento perfeito. Descubra como garantir uma boa pega logo nas primeiras horas de vida para evitar fissuras e dores.',
    sections: [
      {
        heading: 'A Primeira Hora Dourada',
        body: 'Colocar o recém-nascido em contacto pele a pele imediatamente após o nascimento na primeira hora de vida estimula os reflexos naturais de sucção e fortalece o vínculo afetivo. O primeiro leite, chamado colostro, é uma verdadeira vacina natural rica em anticorpos concentrados.'
      },
      {
        heading: 'Técnica da Pega Correta',
        body: '• A boca do bebé deve estar bem aberta, abocanhando a maior parte da aréola e não apenas o mamilo.\n• Os lábios do bebé devem ficar virados para fora (formato de peixinho).\n• O queixo do bebé deve estar encostado ao peito da mãe e o nariz desimpedido para respirar livremente.\n• A amamentação não deve doer! Se doer, quebre o vácuo com o dedo mínimo no canto da boca do bebé e recoloque-o com calma.'
      },
      {
        heading: 'Mitos da Amamentação em Angola',
        body: '• "Leite fraco": Não existe leite fraco! O leite de cada mulher adapta-se perfeitamente às necessidades do seu filho.\n• Chás ou água no recém-nascido: Nos primeiros 6 meses, a OMS e o MINSA recomendam amamentação materna exclusiva. O leite materno tem 88% de água e sacia totalmente a sede do bebé.'
      }
    ],
    questionsForDoctor: [
      'Como posso prevenir mastites e fissuras nos mamilos?',
      'Onde posso obter apoio presencial de uma conselheira de lactação caso tenha dificuldades?'
    ]
  },
  {
    id: 'guia-preparacao-parto-normal-cesariana',
    slug: 'preparacao-trabalho-parto',
    title: 'Preparação para o Parto: Normal e Cesariana com Segurança',
    category: 'parto',
    readTimeMinutes: 7,
    published: true,
    isFree: false,
    medicalReviewDate: '18 de Outubro de 2026',
    reviewerName: 'Dra. Esperança Manuel',
    reviewerTitle: 'Especialista em Ginecologia e Obstetrícia',
    shortIntro: 'Entender as fases do trabalho de parto ajuda a reduzir o medo e a viver o nascimento com serenidade e confiança.',
    sections: [
      {
        heading: 'Fases do Trabalho de Parto Normal',
        body: '1. Fase Latente: O colo do útero começa a afinar e dilatar até cerca de 4 a 5 cm. Contrações espaçadas e toleráveis. Descanse e hidrate-se em casa.\n2. Fase Ativa: Contrações regulares a cada 3 a 5 minutos, com duração de 45 a 60 segundos. É hora de ir para a maternidade.\n3. Período Expulsivo: Dilatação completa de 10 cm e nascimento do bebé.'
      },
      {
        heading: 'Indicações Clínicas Reais para Cesariana',
        body: 'A cesariana é uma cirurgia que salva vidas quando há indicações médicas precisas, tais como:\n• Placenta prévia oclusiva total.\n• Sofrimento fetal agudo.\n• Posição transversa do feto.\n• Descolamento prematuro da placenta.'
      },
      {
        heading: 'Respiração e Técnicas de Conforto',
        body: 'Pratique respirações lentas pelo nariz e expirações suaves pela boca durante as contrações. Banhos mornos de chuveiro e massagens na zona lombar trazem alívio natural notável.'
      }
    ],
    questionsForDoctor: [
      'Qual a posição recomendada durante o trabalho de parto na vossa maternidade?',
      'Em que situações uma cesariana pode ser necessária no meu caso específico?'
    ]
  },
  {
    id: 'guia-pos-parto-resguardo',
    slug: 'pos-parto-resguardo-cuidados',
    title: 'O Pós-Parto e o Resguardo: Cuidados Físicos e Emocionais',
    category: 'pos_parto',
    readTimeMinutes: 5,
    published: true,
    isFree: false,
    medicalReviewDate: '22 de Outubro de 2026',
    reviewerName: 'Enfª Parteira Teresa Vunge',
    reviewerTitle: 'Especialista em Enfermagem Materno-Infantil',
    shortIntro: 'O puerpério é um período de recolhimento, recuperação física e adaptação à nova rotina familiar.',
    sections: [
      {
        heading: 'Recuperação Física nas Primeiras 6 Semanas',
        body: '• Lóquios (sangramento pós-parto): Inicialmente vermelho vivo, tornando-se acastanhado e depois amarelado ao longo de 4 a 6 semanas.\n• Cuidados com a cicatriz: Seja de parto normal com sutura ou de cesariana, lave suavemente com água e sabão neutro e seque muito bem com toalha limpa.\n• Evite carregar pesos excessivos ou trabalhos domésticos pesados nas primeiras semanas.'
      },
      {
        heading: 'O Tradicional Resguardo em Angola',
        body: 'Na tradição angolana, o apoio da mãe, tias e irmãs no resguardo é um recurso cultural precioso. Aceite a ajuda da família nas refeições e tarefas da casa para que possa descansar e amamentar em paz.'
      },
      {
        heading: 'Baby Blues vs Depressão Pós-Parto',
        body: 'Sentir sensibilidade, choro fácil e cansaço nos primeiros 10 dias (baby blues) é muito comum devido à queda hormonal súbita. Contudo, se a tristeza for profunda, persistir por semanas ou impedir de cuidar do bebé, procure apoio médico ou psicológico imediatamente.'
      }
    ],
    questionsForDoctor: [
      'Quando devo fazer a consulta de revisão do puerpério (6 semanas)?',
      'Qual o método contracetivo mais indicado para o período de amamentação?'
    ]
  }
];
