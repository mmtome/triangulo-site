// Cenários de uso (educativos / comerciais) para /casos-de-uso e suas páginas internas.
// IMPORTANTE: são cenários hipotéticos baseados em problemas comuns de gestão e operação.
// Não representam clientes específicos, não usam nomes reais e não trazem métricas inventadas.

export type UseCaseFaq = { q: string; a: string };

export type UseCase = {
  slug: string;
  datePublished: string; // ISO date — primeira publicação
  dateModified: string; // ISO date — última alteração relevante
  sector: string;
  /** Nome curto exibido no card e em breadcrumbs */
  shortName: string;
  /** <title> da página interna */
  title: string;
  /** Meta description da página interna */
  description: string;
  /** H1 da página interna */
  h1: string;
  /** Subtítulo no hero da página interna e resumo no card */
  subtitle: string;
  /** Seção: O problema por trás do sintoma */
  problem: string[];
  /** Seção: Como isso aparece no dia a dia (sinais práticos) */
  signals: string[];
  /** Seção: O olhar da Engenharia de Produção */
  engineeringLens: {
    intro: string;
    tools: { name: string; description: string }[];
  };
  /** Seção: Onde o software entra */
  software: {
    intro: string;
    items: string[];
  };
  /** Seção: O que evitar */
  avoid: string[];
  /** Seção: Próximo passo recomendado */
  nextStep: string;
  /** Mensagem do botão de WhatsApp no CTA final */
  whatsappMessage: string;
  /** Serviços relacionados (slugs em SERVICES) */
  relatedServices: string[];
  /** FAQ opcional ao final do artigo (renderizado como FAQPage válido) */
  faq?: UseCaseFaq[];
};

export const USE_CASES: UseCase[] = [
  {
    slug: "operacao-em-planilhas",
    datePublished: "2026-06-15",
    dateModified: "2026-06-22",
    sector: "Pequena e média empresa",
    shortName: "Operação rodando em planilhas",
    title: "Operação em Planilhas: Quando Criar um Sistema?",
    description:
      "Entenda quando planilhas viram gargalo e como mapear processos antes de criar um sistema sob medida para sua empresa em Uberaba/MG.",
    h1: "Quando a operação roda em planilhas e a empresa começa a travar",
    subtitle:
      "Quando a planilha vira gargalo, o desafio não é apenas trocar de ferramenta — é entender o processo antes de criar um sistema.",
    problem: [
      "Planilhas resolvem muito bem no começo da operação: são rápidas, baratas e flexíveis. O problema aparece quando o negócio cresce e a planilha continua sendo o único lugar onde a operação acontece de verdade.",
      "O sintoma costuma ser cansaço da equipe, retrabalho silencioso e medo de mexer em fórmulas que ninguém mais entende. Mas a causa raiz raramente é a planilha em si — é a falta de um processo claro por trás dela.",
      "Por isso, antes de migrar para um sistema, faz sentido entender o que a planilha está realmente fazendo: regras de negócio, validações, cálculos e fluxos de informação que viraram parte da operação sem nunca terem sido formalizados.",
    ],
    signals: [
      "Várias versões da mesma planilha circulando entre os times",
      "Dados duplicados ou conflitantes entre comercial, operação e financeiro",
      "Pessoas-chave que são as únicas que conseguem mexer em fórmulas críticas",
      "Demora para fechar o mês porque tudo é consolidado à mão",
      "Decisões tomadas com base em planilhas que ninguém tem certeza se estão atualizadas",
      "Histórico da operação preso em arquivos espalhados em drives e e-mails",
    ],
    engineeringLens: {
      intro:
        "Antes de pensar em sistema, a Engenharia de Produção ajuda a enxergar a operação como um fluxo, não como um conjunto de planilhas. O objetivo é entender onde a informação nasce, por onde passa e onde se perde.",
      tools: [
        {
          name: "Mapeamento de processos",
          description:
            "Desenhar como o trabalho acontece hoje, do pedido até a entrega, para identificar etapas redundantes, retrabalho e pontos de decisão pouco claros.",
        },
        {
          name: "SIPOC",
          description:
            "Visão simples de fornecedores, entradas, processo, saídas e clientes de cada fluxo. Ajuda a alinhar áreas que enxergam a operação por ângulos diferentes.",
        },
        {
          name: "Análise de gargalos",
          description:
            "Identificar quais etapas concentram tempo, retrabalho ou dependência de pessoas específicas — geralmente são esses pontos que mais ganham com automação.",
        },
        {
          name: "Padronização de processos",
          description:
            "Definir o jeito certo de fazer antes de automatizar. Sem padrão, qualquer sistema apenas digitaliza o caos.",
        },
      ],
    },
    software: {
      intro:
        "Quando o processo está claro, o software entra como facilitador — centralizando dados, eliminando retrabalho e dando visibilidade. Geralmente não é necessário um ERP gigante; um sistema sob medida focado no fluxo crítico já resolve.",
      items: [
        "Sistema sob medida com cadastros centralizados e permissões por perfil",
        "Importação estruturada dos dados que já existem nas planilhas",
        "Automação das etapas repetitivas (cálculos, validações, notificações)",
        "Histórico auditável de quem fez o quê e quando",
        "Dashboard com os indicadores que a planilha tentava acompanhar",
      ],
    },
    avoid: [
      "Automatizar o processo bagunçado — o sistema vai apenas acelerar o erro",
      "Tentar substituir todas as planilhas de uma vez em vez de começar pelo fluxo mais crítico",
      "Comprar um ERP genérico só porque a planilha cansou",
      "Migrar dados sem revisar duplicidades e inconsistências",
      "Tirar a planilha da equipe antes que ela confie no novo sistema",
    ],
    nextStep:
      "Antes de desenvolver qualquer sistema, o ideal é mapear o fluxo atual, entender onde a informação se perde e definir qual melhoria gera mais impacto com menor complexidade. A partir daí fica claro se o caminho é um sistema sob medida, uma automação pontual ou apenas a reorganização do processo.",
    whatsappMessage:
      "Olá, vim pelo site da Triângulo Solutions e me identifiquei com o cenário de operação rodando em planilhas. Gostaria de entender como vocês poderiam ajudar minha empresa.",
    relatedServices: [
      "sistemas-personalizados-uberaba",
      "software-gestao-uberaba",
      "automacao-de-processos-uberaba",
    ],
    faq: [
      {
        q: "Planilha é sempre ruim?",
        a: "Não. Planilha é excelente para análise pontual, simulação e início de operação. O problema é quando ela vira o sistema oficial do negócio sem padrão, sem controle de versão e sem histórico confiável.",
      },
      {
        q: "Preciso trocar tudo de uma vez?",
        a: "Não. O caminho mais seguro é começar pelo fluxo de maior impacto, manter a planilha como apoio e migrar a operação por etapas, conforme a equipe ganha confiança no novo sistema.",
      },
    ],
  },
  {
    slug: "aprovacoes-manuais-retrabalho",
    datePublished: "2026-06-15",
    dateModified: "2026-06-22",
    sector: "Operações administrativas",
    shortName: "Aprovações manuais e retrabalho",
    title: "Aprovações Manuais e Retrabalho: Como Organizar",
    description:
      "Veja como aprovações por WhatsApp, e-mail e prints geram retrabalho e como processos e automações podem ajudar empresas em Uberaba/MG.",
    h1: "Aprovações manuais e retrabalho consumindo a equipe",
    subtitle:
      "Quando cada decisão depende de mensagens, e-mails ou prints, a empresa perde rastreabilidade e cria retrabalho sem perceber.",
    problem: [
      "É comum que as aprovações cresçam junto com a empresa de forma improvisada: começou por WhatsApp porque era rápido, virou e-mail quando precisou de registro, e hoje convivem várias rotas para a mesma decisão.",
      "O resultado é uma operação onde ninguém sabe com certeza onde uma demanda está parada, quem aprovou o quê e por quê. Quando algo dá errado, a investigação consome mais tempo do que a própria operação.",
      "Esse cenário raramente é resolvido só com uma ferramenta nova. O ganho real vem de entender o processo de decisão, definir responsáveis e prazos, e só depois automatizar.",
    ],
    signals: [
      "Pedidos aprovados por print, e-mail ou conversa solta",
      "Ninguém sabe dizer com clareza onde uma demanda está parada",
      "Erros aparecem só depois que o dano já foi feito",
      "Equipe gasta horas todo dia em tarefas repetitivas",
      "Mesma informação digitada em mais de um lugar",
      "Aprovações que dependem sempre da mesma pessoa estarem online",
    ],
    engineeringLens: {
      intro:
        "Olhar com lente de Engenharia de Produção significa tratar a aprovação como um processo, com entradas, etapas, responsáveis e saída. Quase sempre dá para reduzir etapas antes de pensar em qualquer ferramenta.",
      tools: [
        {
          name: "Fluxograma do processo",
          description:
            "Desenhar visualmente como a aprovação acontece hoje, com todos os caminhos possíveis. O fluxograma já costuma revelar etapas desnecessárias.",
        },
        {
          name: "Análise de causa raiz (5 Porquês)",
          description:
            "Quando o retrabalho é frequente, perguntar 'por quê' várias vezes ajuda a chegar na causa real, em vez de tratar só o sintoma.",
        },
        {
          name: "Padronização de etapas",
          description:
            "Definir um único caminho oficial para cada tipo de aprovação, com critérios claros para aprovar, reprovar ou pedir ajuste.",
        },
        {
          name: "Gestão visual do fluxo",
          description:
            "Tornar visível o que está em cada etapa, para que o status da demanda não dependa de perguntar para alguém.",
        },
      ],
    },
    software: {
      intro:
        "Com o processo padronizado, a automação para de ser perigosa e passa a ser libertadora. O software cuida do que é repetitivo e mantém o histórico de cada decisão, liberando as pessoas para o que exige julgamento.",
      items: [
        "Fluxos de aprovação com responsáveis, prazos e notificações",
        "Regras de validação que impedem erros antes da aprovação",
        "Painel de status com o que está parado, com quem e há quanto tempo",
        "Integrações entre planilhas, sistemas internos e ferramentas externas",
        "Registro completo de cada etapa para auditoria e melhoria contínua",
      ],
    },
    avoid: [
      "Automatizar a aprovação antes de combinar quem aprova o quê",
      "Criar um sistema enorme quando o fluxo é simples — começar pequeno geralmente é melhor",
      "Substituir o WhatsApp por outra caixa de mensagens sem mudar o processo",
      "Confiar apenas em quem 'já está acostumado' a operar dessa forma",
      "Medir velocidade da aprovação sem medir qualidade da decisão",
    ],
    nextStep:
      "O melhor próximo passo é mapear o fluxo atual de aprovação, identificar os 2 ou 3 pontos onde mais se perde tempo ou rastreabilidade, e tratar esses pontos primeiro — com padronização e, quando fizer sentido, com automação.",
    whatsappMessage:
      "Olá, vim pelo site da Triângulo Solutions e me identifiquei com o cenário de aprovações manuais e retrabalho. Gostaria de entender como vocês poderiam ajudar minha empresa.",
    relatedServices: [
      "automacao-de-processos-uberaba",
      "sistemas-personalizados-uberaba",
      "consultoria-processos-tecnologia",
    ],
  },
  {
    slug: "gestao-sem-indicadores",
    datePublished: "2026-06-15",
    dateModified: "2026-06-22",
    sector: "Gestão",
    shortName: "Gestão sem indicadores claros",
    title: "Gestão sem Indicadores: Como Sair do Achismo",
    description:
      "Entenda como indicadores, dashboards e processos claros ajudam empresas a tomar decisões melhores com dados confiáveis em Uberaba/MG.",
    h1: "Quando a gestão depende de achismo por falta de indicadores",
    subtitle:
      "Quando ninguém olha para o mesmo número, reuniões viram opinião e decisões importantes ficam sem base confiável.",
    problem: [
      "Não é falta de dado — é excesso de dado disperso. As informações existem em sistemas, planilhas, conversas e relatórios, mas ninguém consolida em um lugar só, com critério único.",
      "Sem indicadores combinados, cada área defende a sua versão da verdade. Reuniões se transformam em debate sobre o que é o número certo, em vez de discussão sobre o que fazer com ele.",
      "Esse cenário não se resolve apenas com uma ferramenta de BI. Ele exige definir antes quais perguntas o negócio precisa responder e quais indicadores realmente importam para isso.",
    ],
    signals: [
      "Decisões resolvidas no achismo por falta de dado pronto",
      "Cada área defende um número diferente para o mesmo resultado",
      "Relatórios chegam tarde demais para ainda dar tempo de agir",
      "Indicadores existem em planilhas, mas ninguém olha com frequência",
      "Dependência de uma pessoa específica para gerar qualquer análise",
      "Falta de visão histórica para entender tendência",
    ],
    engineeringLens: {
      intro:
        "A Engenharia de Produção trabalha com indicadores há décadas e oferece um caminho prático para construir uma gestão baseada em dados — começando pelas perguntas, não pela ferramenta.",
      tools: [
        {
          name: "Indicadores de desempenho",
          description:
            "Definir poucos indicadores realmente conectados aos objetivos do negócio, com fórmula clara e responsável definido.",
        },
        {
          name: "Análise de Pareto",
          description:
            "Identificar os poucos itens que respondem pela maior parte do resultado (ou do problema) e focar a gestão neles.",
        },
        {
          name: "PDCA",
          description:
            "Ciclo de planejar, executar, checar e ajustar. Garante que o indicador deixe de ser apenas observação e vire ação.",
        },
        {
          name: "Lead time e capacidade",
          description:
            "Quando o tema é operação, medir tempo de ciclo e capacidade real ajuda mais do que medir só faturamento.",
        },
      ],
    },
    software: {
      intro:
        "Com os indicadores definidos, o software entra para conectar fontes, padronizar cálculo e tornar a leitura rápida. Mais importante que um dashboard bonito é um dashboard que a liderança realmente usa nas decisões.",
      items: [
        "Dashboards comercial, operacional e financeiro com leitura rápida",
        "Padronização e documentação dos indicadores",
        "Atualizações automáticas a partir das fontes de dados",
        "Acesso por perfil para que cada área veja o que importa",
        "Alertas quando um indicador sai da faixa esperada",
      ],
    },
    avoid: [
      "Criar dashboards com 30 indicadores que ninguém acompanha",
      "Comprar ferramenta de BI antes de definir as perguntas do negócio",
      "Medir o que é fácil em vez do que é importante",
      "Confiar em número sem documentar como ele é calculado",
      "Trocar a reunião de achismo por reunião só de gráfico, sem decisão no final",
    ],
    nextStep:
      "Antes de montar dashboard, vale listar as 5 a 10 perguntas que a liderança precisa responder toda semana ou todo mês. A partir dessas perguntas é que se definem os indicadores e, só depois, a ferramenta que vai mostrá-los.",
    whatsappMessage:
      "Olá, vim pelo site da Triângulo Solutions e me identifiquei com o cenário de gestão sem indicadores claros. Gostaria de entender como vocês poderiam ajudar minha empresa.",
    relatedServices: [
      "dashboards-indicadores-uberaba",
      "software-gestao-uberaba",
      "consultoria-processos-tecnologia",
    ],
  },
  {
    slug: "erp-generico-nao-se-adapta",
    datePublished: "2026-06-15",
    dateModified: "2026-06-22",
    sector: "Pequena e média empresa",
    shortName: "ERP genérico que não se adapta",
    title: "ERP Genérico Não se Adapta: O que Fazer?",
    description:
      "Quando o sistema não acompanha o processo real da empresa, software sob medida e integração podem ser caminhos melhores. Entenda como avaliar.",
    h1: "Quando o ERP genérico não se encaixa no processo real da empresa",
    subtitle:
      "Quando o sistema obriga a empresa a mudar seu jeito de operar, talvez o problema não seja a equipe — seja a aderência da ferramenta.",
    problem: [
      "ERPs genéricos são pensados para um cenário médio do mercado. Para a maioria das pequenas e médias empresas, eles cobrem o básico, mas deixam de fora justamente o que diferencia a operação.",
      "O sintoma costuma ser uma combinação de planilhas paralelas, controles informais e adaptações forçadas no sistema. A empresa paga por módulos que não usa e ainda assim precisa contornar o que o ERP não faz direito.",
      "Antes de trocar de sistema, vale entender o que efetivamente é usado, o que é resolvido fora dele e onde está o real ganho de produtividade — em alguns casos o caminho é integração e desenvolvimento sob medida, não outro ERP.",
    ],
    signals: [
      "Pagamento por módulos que ninguém usa",
      "Funcionalidades essenciais resolvidas em planilhas paralelas",
      "Atualizações do ERP que quebram o que já funcionava",
      "Operação que vive contornando limitações do sistema",
      "Customizações caras e demoradas para mudanças simples",
      "Relatórios exportados e retrabalhados fora do ERP",
    ],
    engineeringLens: {
      intro:
        "A Engenharia de Produção ajuda a tomar essa decisão de forma estruturada: o problema é o software ou o processo? Quase sempre é uma mistura, e separar as duas coisas evita uma troca de ferramenta que não resolve.",
      tools: [
        {
          name: "Mapeamento do processo real",
          description:
            "Documentar como a operação acontece de verdade, incluindo as planilhas paralelas e os 'jeitinhos' que viraram parte do fluxo.",
        },
        {
          name: "Análise de aderência",
          description:
            "Comparar o processo real com o que o ERP atual oferece, identificando onde a ferramenta ajuda, onde atrapalha e onde simplesmente não está presente.",
        },
        {
          name: "Análise de gargalos",
          description:
            "Verificar se a lentidão da operação vem do sistema ou do desenho do processo. Trocar de ERP sem ajustar o processo costuma repetir o problema.",
        },
        {
          name: "Padronização de fluxos críticos",
          description:
            "Definir o jeito oficial de operar antes de migrar — sem isso, qualquer novo sistema também vai precisar de planilhas paralelas.",
        },
      ],
    },
    software: {
      intro:
        "Quando a análise mostra que o caminho é desenvolvimento sob medida, ele raramente substitui tudo. O mais comum é construir um software de gestão modular, focado no que diferencia a empresa, e integrar com sistemas que continuam fazendo sentido (fiscal, contábil, bancário).",
      items: [
        "Software de gestão modular, alinhado ao processo real",
        "Integração com ERP fiscal, contábil ou bancário quando necessário",
        "Permissões por perfil e auditoria de ações",
        "Migração estruturada de dados, sem perder histórico",
        "Evolução contínua com novos módulos conforme o negócio cresce",
      ],
    },
    avoid: [
      "Trocar de ERP genérico por outro ERP genérico esperando resultado diferente",
      "Customizar pesado um ERP que não foi pensado para a sua operação",
      "Construir software sob medida para tudo — fiscal e contábil seguem fazendo sentido em ferramenta especializada",
      "Migrar sem mapear o processo real, incluindo as planilhas paralelas",
      "Subestimar o esforço de adoção pela equipe ao trocar de sistema",
    ],
    nextStep:
      "O ponto de partida é uma análise honesta do que o ERP atual faz, do que é resolvido fora dele e do que pesa no dia a dia da equipe. Com esse retrato, fica claro se o caminho é trocar de ERP, integrar melhor ou desenvolver módulos sob medida para o que diferencia o negócio.",
    whatsappMessage:
      "Olá, vim pelo site da Triângulo Solutions e me identifiquei com o cenário de ERP genérico que não se adapta. Gostaria de entender como vocês poderiam ajudar minha empresa.",
    relatedServices: [
      "software-gestao-uberaba",
      "sistemas-personalizados-uberaba",
      "consultoria-processos-tecnologia",
    ],
  },
  {
    slug: "validar-produto-digital",
    datePublished: "2026-06-15",
    dateModified: "2026-06-22",
    sector: "Empreendedor / produto",
    shortName: "Validar uma ideia de produto digital",
    title: "Validar Produto Digital Antes de Criar Plataforma",
    description:
      "Entenda como validar uma ideia de produto digital com MVP, processo e tecnologia antes de construir uma plataforma completa.",
    h1: "Quando a ideia de produto digital precisa ser validada antes de virar plataforma",
    subtitle:
      "Antes de construir uma plataforma completa, vale transformar a ideia em uma versão enxuta para aprender com usuários reais.",
    problem: [
      "Muita ideia de produto digital morre porque foi construída grande demais antes da hora. O empreendedor investe meses em uma plataforma cheia de funcionalidades e descobre, tarde, que o público não tem o problema que ele imaginou.",
      "A causa raiz quase nunca é a tecnologia. É a falta de uma hipótese clara: qual problema esse produto resolve, para quem, e como saber se está resolvendo de verdade.",
      "Por isso, antes de pensar em arquitetura completa, vale recortar a ideia para a menor versão que já permite aprender com usuários reais — sem desperdiçar tempo e investimento.",
    ],
    signals: [
      "Ideia mapeada, mas sem caminho claro para tirar do papel",
      "Vontade de validar antes de investir em uma plataforma robusta",
      "Necessidade de uma primeira versão simples para captar usuários",
      "Foco em uma dor específica que ferramentas grandes não atendem",
      "Dificuldade de explicar a proposta em uma frase",
      "Dúvida entre construir do zero ou usar uma ferramenta existente",
    ],
    engineeringLens: {
      intro:
        "Mesmo em produto digital, conceitos de Engenharia de Produção ajudam: tratar a construção do produto como um processo de aprendizado, com hipóteses, experimentos e ciclos curtos de melhoria.",
      tools: [
        {
          name: "Mapeamento do problema",
          description:
            "Antes de pensar em tela, deixar claro qual problema, de qual público, com qual frequência e impacto. Essa é a base da validação.",
        },
        {
          name: "Fluxo de valor (jornada do usuário)",
          description:
            "Desenhar o caminho do usuário desde o primeiro contato até o resultado que o produto promete entregar.",
        },
        {
          name: "PDCA aplicado ao produto",
          description:
            "Construir pequeno, lançar, medir o uso real e ajustar — em vez de tentar acertar tudo na primeira versão.",
        },
        {
          name: "Indicadores de adoção",
          description:
            "Definir desde o início o que é sucesso: cadastros, uso recorrente, retenção, conversão. Sem isso, não há como saber se a ideia funciona.",
        },
      ],
    },
    software: {
      intro:
        "O MVP (Minimum Viable Product) é o ponto onde o software entra. Não é uma versão 'feia' do produto, é a versão mais enxuta que já permite o usuário viver a proposta e gerar aprendizado real.",
      items: [
        "MVP funcional com cadastro, área autenticada e fluxo principal",
        "Integrações iniciais essenciais (pagamento, e-mail, notificações)",
        "Métricas básicas de uso e funil de conversão",
        "Base técnica preparada para evoluir sem precisar reescrever",
        "Roadmap claro para próximos ciclos com base no que os usuários mostrarem",
      ],
    },
    avoid: [
      "Construir uma plataforma completa antes de validar a hipótese central",
      "Adicionar funcionalidades sem evidência de que os usuários querem",
      "Comparar o MVP com produtos consolidados que rodam há anos",
      "Confiar só em opinião de amigos e família para validar o produto",
      "Ignorar métricas porque 'ainda é cedo' — sem métricas, não há validação",
    ],
    nextStep:
      "O próximo passo é transformar a ideia em uma hipótese verificável: qual problema, para quem, e qual o menor produto que já testa essa hipótese. Com isso desenhado, a construção do MVP fica focada e o investimento se concentra no que comprova valor.",
    whatsappMessage:
      "Olá, vim pelo site da Triângulo Solutions e me identifiquei com o cenário de validar uma ideia de produto digital. Gostaria de entender como vocês poderiam ajudar minha empresa.",
    relatedServices: [
      "microsaas-sob-medida",
      "sistemas-personalizados-uberaba",
      "consultoria-processos-tecnologia",
    ],
  },
  {
    slug: "tecnologia-sem-direcao-clara",
    datePublished: "2026-06-15",
    dateModified: "2026-06-22",
    sector: "Gestão / liderança",
    shortName: "Tecnologia sem direção clara",
    title: "Tecnologia sem Direção: Como Definir o Próximo Passo",
    description:
      "Antes de comprar ferramentas, entenda como mapear processos, dados e prioridades para investir melhor em tecnologia na sua empresa.",
    h1: "Quando a empresa investe em tecnologia, mas não vê resultado",
    subtitle:
      "Antes de comprar mais ferramentas, é preciso entender onde a tecnologia realmente muda o jogo do negócio.",
    problem: [
      "É comum a empresa acumular sistemas, assinaturas e ferramentas ao longo dos anos sem que isso se traduza em resultado. Cada problema novo gerou uma compra nova, e ninguém mais sabe direito o que está sendo usado.",
      "Quando isso acontece, o problema raramente é falta de tecnologia. É falta de critério para escolher onde investir, em qual ordem e com qual objetivo de negócio.",
      "Esse cenário pede uma pausa estratégica: olhar processos, dados e ferramentas em conjunto, definir prioridades claras e decidir, com critério, o que comprar, o que desenvolver, o que integrar e o que descontinuar.",
    ],
    signals: [
      "Várias ferramentas contratadas, pouca clareza sobre o que cada uma resolve",
      "Projetos de tecnologia que começam e não terminam",
      "Sensação de que se investe muito e o resultado não aparece",
      "Falta de critério para priorizar o próximo passo digital",
      "Decisões de tecnologia tomadas reativamente, sem plano",
      "Dificuldade de explicar para a equipe por que cada ferramenta existe",
    ],
    engineeringLens: {
      intro:
        "A Engenharia de Produção entra aqui como organizadora: ajuda a olhar a empresa como um sistema, entender onde está cada processo, qual é o gargalo real e onde a tecnologia traz mais retorno.",
      tools: [
        {
          name: "Diagnóstico de processos e tecnologia",
          description:
            "Mapear processos críticos, ferramentas em uso e indicadores existentes para entender o estado atual antes de propor qualquer mudança.",
        },
        {
          name: "Análise de Pareto aplicada a investimento",
          description:
            "Identificar onde estão os poucos problemas que respondem pela maior parte do resultado — e direcionar o investimento de tecnologia para eles.",
        },
        {
          name: "Mapa do estado atual e estado desejado",
          description:
            "Comparar como a empresa opera hoje com como precisa operar nos próximos meses, deixando claras as lacunas a tratar.",
        },
        {
          name: "Melhoria contínua",
          description:
            "Substituir 'projetos gigantes' por ciclos curtos de melhoria, com entregas frequentes e ajustes baseados em resultado real.",
        },
      ],
    },
    software: {
      intro:
        "Com a direção definida, o software entra como meio, não como fim. A pergunta deixa de ser 'qual ferramenta comprar' e passa a ser 'qual problema resolver primeiro', com o caminho mais simples possível.",
      items: [
        "Plano de tecnologia priorizado por impacto no negócio",
        "Decisão estruturada entre comprar, desenvolver, integrar ou descontinuar",
        "Dashboards para acompanhar a execução, não só o planejamento",
        "Acompanhamento periódico para ajustar o caminho conforme o resultado",
        "Integrações entre ferramentas que já existem, evitando trocas desnecessárias",
      ],
    },
    avoid: [
      "Comprar mais ferramenta antes de entender o que já existe",
      "Iniciar projetos grandes sem critério de priorização",
      "Tratar tecnologia como decisão isolada da área de TI, sem envolver a liderança",
      "Confiar apenas em recomendação de fornecedor para decidir o próximo passo",
      "Adiar a decisão por medo de errar — sem direção, qualquer caminho parece arriscado",
    ],
    nextStep:
      "O próximo passo é um diagnóstico estruturado de processos, tecnologia e gestão em conjunto. Com esse retrato, fica claro onde a tecnologia muda o jogo do negócio agora e onde pode esperar — e o investimento passa a ser feito com critério.",
    whatsappMessage:
      "Olá, vim pelo site da Triângulo Solutions e me identifiquei com o cenário de tecnologia sem direção clara. Gostaria de entender como vocês poderiam ajudar minha empresa.",
    relatedServices: [
      "consultoria-processos-tecnologia",
      "automacao-de-processos-uberaba",
      "dashboards-indicadores-uberaba",
    ],
  },
];

export function getUseCaseBySlug(slug: string) {
  return USE_CASES.find((u) => u.slug === slug);
}
