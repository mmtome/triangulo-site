// Centralized data for all service pages.
// Each service drives a /<slug> route and a card on /solucoes.

export type ServiceFAQ = { q: string; a: string };

export type ServiceContent = {
  slug: string;
  /** Used in nav, breadcrumbs and cards */
  shortName: string;
  /** Page <title> */
  title: string;
  /** Meta description */
  description: string;
  /** Hero H1 (unique per page) */
  h1: string;
  /** Hero subtitle */
  subtitle: string;
  /** Labels for the SectionLabel chip */
  badge: string;
  /** Section "When does your company need this?" */
  pains: { title: string; desc: string }[];
  /** Section "How Triângulo Solucions solves" — paragraphs */
  approach: string[];
  /** Section "What can be developed / delivered" */
  deliverables: string[];
  /** Section "Benefits for companies in Uberaba/MG" — short bullets */
  benefits: { title: string; desc: string }[];
  /** FAQ for the service */
  faq: ServiceFAQ[];
  /** Two related slugs */
  related: string[];
};

export const SERVICES: ServiceContent[] = [
  {
    slug: "sistemas-personalizados-uberaba",
    shortName: "Sistemas personalizados",
    title: "Sistemas Personalizados em Uberaba/MG",
    description:
      "Sistemas web sob medida para empresas de Uberaba/MG, construídos sobre a operação real do negócio, com foco em usabilidade, dados e crescimento.",
    h1: "Desenvolvimento de sistemas personalizados em Uberaba/MG",
    subtitle:
      "Software sob medida para empresas que querem sair das planilhas e operar com uma ferramenta feita para a realidade do seu negócio.",
    badge: "Sistemas sob medida",
    pains: [
      {
        title: "Sua operação cresceu além das planilhas",
        desc: "Versões diferentes, dados duplicados e ninguém consegue saber qual é a informação correta.",
      },
      {
        title: "Sistemas prontos não atendem seu processo",
        desc: "Você adapta a empresa ao software, em vez de o software atender a forma como a empresa trabalha.",
      },
      {
        title: "Times trabalham desconectados",
        desc: "Comercial, operação e financeiro usam ferramentas separadas e perdem informação no meio do caminho.",
      },
      {
        title: "Decisões dependem de pessoas-chave",
        desc: "Quando alguém sai de férias, a operação trava porque o conhecimento mora na cabeça da pessoa.",
      },
    ],
    approach: [
      "Começamos entendendo a operação real: como o trabalho acontece hoje, onde estão os gargalos e quais informações são críticas para o negócio. Aplicamos visão de Engenharia de Produção antes de escrever qualquer linha de código.",
      "Desenhamos um sistema simples, funcional e validável. Priorizamos as telas que geram resultado imediato e evoluímos o produto em ciclos curtos, com a sua equipe usando e dando retorno.",
      "Entregamos um software com foco em usabilidade, segurança e evolução contínua. Você passa a ter uma ferramenta que cresce junto com a empresa, não um sistema que vira gargalo dois anos depois.",
    ],
    deliverables: [
      "Sistemas web responsivos para times comerciais, operacionais e administrativos",
      "Cadastros centralizados de clientes, produtos, fornecedores e contratos",
      "Fluxos de aprovação, status e responsáveis por etapa",
      "Relatórios e exportações sob medida para a sua rotina",
      "Áreas de acesso por perfil de usuário (gestão, operação, comercial)",
      "Integração com planilhas existentes e ferramentas que sua equipe já usa",
    ],
    benefits: [
      {
        title: "Uma fonte única de informação",
        desc: "Acabam as planilhas paralelas e cada time passa a olhar para o mesmo dado.",
      },
      {
        title: "Menos retrabalho",
        desc: "Tarefas repetitivas viram fluxos do próprio sistema, não atividades manuais.",
      },
      {
        title: "Decisões com base em dados",
        desc: "Indicadores claros sobre operação, comercial e produtividade.",
      },
      {
        title: "Escala sem aumentar a estrutura",
        desc: "A operação cresce sem precisar dobrar a equipe administrativa.",
      },
    ],
    faq: [
      {
        q: "Vocês desenvolvem sistemas do zero ou usam plataformas prontas?",
        a: "Desenvolvemos sistemas sob medida, modelados a partir do processo real do cliente. Quando faz sentido, integramos com ferramentas que a empresa já utiliza.",
      },
      {
        q: "Quanto tempo leva para colocar um sistema em uso?",
        a: "Depende do escopo, mas trabalhamos com entregas em ciclos curtos. Em poucas semanas costuma ser possível colocar uma primeira versão funcional na operação.",
      },
      {
        q: "Atendem apenas empresas de Uberaba?",
        a: "Somos baseados em Uberaba/MG e atendemos todo o Triângulo Mineiro, com possibilidade de atendimento remoto para empresas de outras regiões.",
      },
      {
        q: "Como funciona o suporte depois da entrega?",
        a: "Acompanhamos o uso do sistema, ajustamos fluxos e evoluímos o produto continuamente, conforme a empresa cresce e novas necessidades aparecem.",
      },
    ],
    related: ["automacao-de-processos-uberaba", "software-gestao-uberaba"],
  },

  {
    slug: "automacao-de-processos-uberaba",
    shortName: "Automação de processos",
    title: "Automação de Processos em Uberaba/MG",
    description:
      "Automatizamos processos empresariais em Uberaba/MG: fluxos, integrações e regras claras para sua operação rodar sem retrabalho.",
    h1: "Automação de processos para empresas em Uberaba/MG",
    subtitle:
      "Tire tarefas repetitivas do dia a dia da sua equipe e transforme processos manuais em fluxos automatizados, com regras claras e rastreabilidade.",
    badge: "Automações operacionais",
    pains: [
      {
        title: "Tarefas repetitivas consomem horas da equipe",
        desc: "Cópia de dados entre sistemas, envio manual de e-mails, atualização de planilhas — tudo feito à mão.",
      },
      {
        title: "Processos rodam no improviso",
        desc: "Cada pessoa executa de um jeito diferente e ninguém sabe onde uma demanda está parada.",
      },
      {
        title: "Erros aparecem só depois do dano feito",
        desc: "Faltam regras automáticas para impedir cadastros errados, pedidos sem aprovação ou prazos vencidos.",
      },
      {
        title: "Times dependem demais de WhatsApp e e-mail",
        desc: "Informações ficam soltas em conversas e ninguém consegue auditar o que foi combinado.",
      },
    ],
    approach: [
      "Mapeamos o processo atual com a sua equipe, identificamos onde está o desperdício e definimos quais etapas podem ser automatizadas com segurança.",
      "Construímos automações que conectam pessoas, dados e sistemas — desde regras simples dentro de um software até integrações entre ferramentas diferentes.",
      "Acompanhamos a operação rodando, ajustamos parâmetros e evoluímos o fluxo conforme novos cenários aparecem. Automação boa é a que continua útil seis meses depois.",
    ],
    deliverables: [
      "Fluxos de aprovação com responsáveis, prazos e notificações",
      "Integrações entre planilhas, sistemas internos e ferramentas externas",
      "Cadastros e atualizações automáticas a partir de formulários",
      "Disparos de e-mail e mensagens automáticas baseados em eventos",
      "Regras de validação para evitar erros operacionais",
      "Painéis com status de cada processo em tempo real",
    ],
    benefits: [
      {
        title: "Equipe focada no que importa",
        desc: "Pessoas deixam de gastar tempo em tarefas mecânicas e passam a olhar para o que gera resultado.",
      },
      {
        title: "Processos rastreáveis",
        desc: "Cada etapa registrada, com responsável, data e histórico de mudanças.",
      },
      {
        title: "Menos falhas humanas",
        desc: "Regras automáticas impedem erros antes deles acontecerem.",
      },
      {
        title: "Produtividade real",
        desc: "Mais entregas por dia com a mesma estrutura.",
      },
    ],
    faq: [
      {
        q: "Quais processos podem ser automatizados?",
        a: "Praticamente qualquer processo repetitivo e baseado em regras: aprovações, cadastros, comunicação interna, integrações entre ferramentas, envio de relatórios e validações operacionais.",
      },
      {
        q: "Preciso ter um sistema próprio para automatizar?",
        a: "Não. Conseguimos automatizar fluxos usando as ferramentas que a empresa já tem, integrando planilhas, e-mails e sistemas existentes.",
      },
      {
        q: "Como vocês começam um projeto de automação?",
        a: "Começamos com um diagnóstico do processo atual. Sem entender o fluxo real, qualquer automação vira mais um problema. Depois desenhamos a solução em conjunto com a equipe que opera.",
      },
      {
        q: "É possível automatizar aos poucos?",
        a: "Sim, esse é o caminho mais saudável. Automatizamos as etapas de maior impacto primeiro e expandimos conforme a equipe se adapta.",
      },
    ],
    related: ["sistemas-personalizados-uberaba", "consultoria-processos-tecnologia"],
  },

  {
    slug: "dashboards-indicadores-uberaba",
    shortName: "Dashboards e indicadores",
    title: "Dashboards e Indicadores em Uberaba/MG",
    description:
      "Criamos dashboards de gestão e indicadores para empresas em Uberaba/MG: visualização clara de dados comerciais, operacionais e financeiros.",
    h1: "Dashboards de gestão e indicadores para empresas em Uberaba/MG",
    subtitle:
      "Transforme dados espalhados em painéis simples de ler, com indicadores que realmente ajudam a tomar decisão.",
    badge: "Dados e decisão",
    pains: [
      {
        title: "Dados existem, mas ninguém olha",
        desc: "Planilhas, sistemas e relatórios separados — e ninguém sabe consolidar.",
      },
      {
        title: "Decisões baseadas em intuição",
        desc: "Reuniões resolvem 'no achismo' porque os números não estão prontos.",
      },
      {
        title: "Relatórios chegam tarde demais",
        desc: "Quando o dado fica pronto, o mês já fechou e não dá mais para agir.",
      },
      {
        title: "Cada área tem seu próprio número",
        desc: "Comercial, operação e financeiro discordam até sobre o resultado do mês.",
      },
    ],
    approach: [
      "Começamos pelas perguntas que precisam ser respondidas: o que decide o seu mês? Quais indicadores realmente mudam o jogo? Definimos a partir daí o que medir.",
      "Conectamos as fontes de dados — sistemas próprios, planilhas e ferramentas externas — em um único painel, com regras claras de cálculo e atualização.",
      "Entregamos dashboards simples, focados em decisão. Nada de telas cheias de gráficos: indicadores claros, leitura rápida e foco em ação.",
    ],
    deliverables: [
      "Dashboard comercial: pipeline, conversão, ticket médio e metas",
      "Dashboard operacional: produtividade, prazos, gargalos e SLA",
      "Dashboard financeiro: receita, margem, inadimplência e fluxo",
      "Indicadores de produto, atendimento e qualidade",
      "Painéis para reuniões semanais e fechamento mensal",
      "Acessos por perfil para que cada área veja o que importa",
    ],
    benefits: [
      {
        title: "Decisões mais rápidas",
        desc: "Indicadores prontos quando o problema ainda dá para ser resolvido.",
      },
      {
        title: "Uma versão única dos números",
        desc: "Fim das discussões de planilha. Todo mundo olha para o mesmo painel.",
      },
      {
        title: "Reuniões mais objetivas",
        desc: "Foco no que mudou e por quê, não em montar slide.",
      },
      {
        title: "Visão histórica do negócio",
        desc: "Comparativos entre meses, trimestres e anos para entender tendência.",
      },
    ],
    faq: [
      {
        q: "Vocês usam qual ferramenta para dashboards?",
        a: "Escolhemos a ferramenta conforme o cenário do cliente — pode ser dentro do próprio sistema desenvolvido, BI dedicado ou integração com ferramentas que a empresa já tem.",
      },
      {
        q: "Posso ter dashboards mesmo usando planilhas?",
        a: "Sim. Conseguimos partir de planilhas estruturadas e montar dashboards consistentes em cima delas, padronizando o cálculo dos indicadores.",
      },
      {
        q: "Quais indicadores fazem sentido para a minha empresa?",
        a: "Os indicadores variam por modelo de negócio. No diagnóstico definimos juntos quais métricas realmente mudam decisão para a sua operação.",
      },
      {
        q: "Quanto tempo leva para entregar um dashboard?",
        a: "Para um dashboard inicial, costuma ser questão de poucas semanas. A partir daí, o painel evolui conforme novas perguntas aparecem.",
      },
    ],
    related: ["software-gestao-uberaba", "automacao-de-processos-uberaba"],
  },

  {
    slug: "software-gestao-uberaba",
    shortName: "Software de gestão",
    title: "Software de Gestão em Uberaba/MG",
    description:
      "Software de gestão sob medida para empresas de Uberaba/MG: centralize comercial, operação e financeiro em uma ferramenta criada para o seu negócio.",
    h1: "Software de gestão sob medida para empresas em Uberaba/MG",
    subtitle:
      "Centralize comercial, operação e financeiro em uma única ferramenta, modelada para a sua empresa — não um ERP genérico onde nada se encaixa.",
    badge: "Gestão integrada",
    pains: [
      {
        title: "Você usa três ou quatro ferramentas que não conversam",
        desc: "Tempo perdido alternando entre planilhas, sistemas e WhatsApp.",
      },
      {
        title: "ERPs prontos não cabem no seu negócio",
        desc: "Você paga por dezenas de módulos que não usa e ainda precisa adaptar tudo.",
      },
      {
        title: "Operação não tem visão única",
        desc: "Cliente liga e ninguém consegue dizer rapidamente o status do pedido.",
      },
      {
        title: "Não há histórico organizado",
        desc: "Cada negociação, contrato e atendimento mora em um lugar diferente.",
      },
    ],
    approach: [
      "Modelamos a gestão do seu negócio em módulos sob medida: comercial, operação, financeiro e o que mais fizer sentido. Sem inflar com funcionalidades que não serão usadas.",
      "Integramos áreas e dados para que toda a empresa olhe para a mesma informação, com permissões adequadas para cada perfil.",
      "Evoluímos o software junto com a empresa. Novos serviços, produtos ou áreas entram como novos módulos, sem refazer o sistema do zero.",
    ],
    deliverables: [
      "CRM e funil comercial integrado à operação",
      "Cadastros de clientes, contratos, produtos e fornecedores",
      "Gestão de pedidos, ordens de serviço e entregas",
      "Controle financeiro, recebimentos e faturamento",
      "Permissões por perfil (gestão, comercial, operação, financeiro)",
      "Relatórios e dashboards integrados ao próprio sistema",
    ],
    benefits: [
      {
        title: "Operação centralizada",
        desc: "Tudo em um só lugar — comercial, operação e financeiro alinhados.",
      },
      {
        title: "Você paga pelo que usa",
        desc: "Sem licenciamento por dezenas de módulos que não fazem sentido.",
      },
      {
        title: "Crescimento sustentável",
        desc: "O sistema evolui no ritmo do negócio, sem migrações dolorosas.",
      },
      {
        title: "Visão de dono em tempo real",
        desc: "Indicadores prontos para acompanhar a saúde da empresa.",
      },
    ],
    faq: [
      {
        q: "Software de gestão sob medida substitui um ERP?",
        a: "Em muitos casos sim, principalmente em pequenas e médias empresas. O ganho está em ter exatamente o que se usa, com mais aderência ao processo real.",
      },
      {
        q: "Quanto custa um software de gestão personalizado?",
        a: "Depende do escopo. Trabalhamos por entregas evolutivas, começando pelos módulos de maior impacto, para que o investimento acompanhe o valor entregue.",
      },
      {
        q: "Conseguimos migrar dados que já temos?",
        a: "Sim. Mapeamos as fontes existentes (planilhas, sistemas legados) e fazemos a carga inicial dos dados estruturados.",
      },
      {
        q: "Atendem o Triângulo Mineiro inteiro?",
        a: "Atendemos Uberaba, Uberlândia, Araxá, Frutal, Patrocínio e demais cidades do Triângulo Mineiro, com possibilidade de atendimento remoto para outras regiões.",
      },
    ],
    related: ["sistemas-personalizados-uberaba", "dashboards-indicadores-uberaba"],
  },

  {
    slug: "microsaas-sob-medida",
    shortName: "MicroSaaS sob medida",
    title: "MicroSaaS Sob Medida | Triângulo Solucions",
    description:
      "Desenvolvemos MicroSaaS sob medida: ferramentas leves e diretas, ideais para resolver uma dor específica de uma empresa ou nichar um produto digital.",
    h1: "MicroSaaS sob medida",
    subtitle:
      "Soluções enxutas, focadas em uma dor específica e prontas para escalar — sem o peso de um sistema completo.",
    badge: "Produto digital enxuto",
    pains: [
      {
        title: "Você tem uma dor específica, mas nenhuma ferramenta pronta resolve",
        desc: "Sistemas grandes oferecem muita coisa que você não precisa e nada exatamente do que precisa.",
      },
      {
        title: "Quer validar uma ideia rapidamente",
        desc: "Sem investir em uma plataforma completa antes de saber se faz sentido para o mercado.",
      },
      {
        title: "Precisa de uma ferramenta interna sem peso de ERP",
        desc: "Algo simples, que sua equipe use no dia a dia, sem treinamento longo.",
      },
      {
        title: "Quer transformar conhecimento em produto",
        desc: "Você tem um processo interno que pode virar uma solução vendida para outras empresas.",
      },
    ],
    approach: [
      "Definimos juntos o escopo mínimo viável: qual dor resolver, para quem e qual é o resultado esperado em poucas semanas de uso.",
      "Construímos um produto leve, com foco extremo em usabilidade e em fazer uma coisa muito bem feita, em vez de muitas coisas pela metade.",
      "Lançamos, medimos uso real e evoluímos com base em dados. MicroSaaS bom é o que se mantém útil sem virar mais um sistema gigante.",
    ],
    deliverables: [
      "Aplicação web responsiva focada em uma dor específica",
      "Cadastro de usuários e controle de acesso",
      "Cobrança por assinatura ou por uso (quando aplicável)",
      "Painel administrativo para acompanhar uso e clientes",
      "Integrações pontuais com ferramentas externas",
      "Documentação simples para onboarding de novos usuários",
    ],
    benefits: [
      {
        title: "Investimento controlado",
        desc: "Você não constrói um sistema gigante, apenas o que resolve a dor.",
      },
      {
        title: "Velocidade de validação",
        desc: "Coloca a solução no ar e aprende com uso real, em vez de suposições.",
      },
      {
        title: "Produto enxuto e focado",
        desc: "Menos distração, mais resultado para quem usa.",
      },
      {
        title: "Base para escalar depois",
        desc: "Se a ideia funciona, o MicroSaaS evolui em novos módulos no seu ritmo.",
      },
    ],
    faq: [
      {
        q: "MicroSaaS faz sentido para qualquer empresa?",
        a: "Faz sentido quando existe uma dor clara, recorrente e que pode ser resolvida com uma ferramenta focada. Para gestão completa, geralmente faz mais sentido um software de gestão sob medida.",
      },
      {
        q: "Posso transformar um processo interno em produto vendido?",
        a: "Sim. Muitos MicroSaaS nascem de processos internos bem desenhados que viram solução para outras empresas com o mesmo problema.",
      },
      {
        q: "Vocês ajudam a definir o escopo do MicroSaaS?",
        a: "Sim. Parte do trabalho é justamente reduzir o escopo ao mínimo viável que entrega valor real para quem vai usar.",
      },
      {
        q: "Como funciona a cobrança no produto final?",
        a: "Implementamos modelos de assinatura, por uso ou licenciamento conforme o modelo de negócio escolhido.",
      },
    ],
    related: ["sistemas-personalizados-uberaba", "consultoria-processos-tecnologia"],
  },

  {
    slug: "consultoria-processos-tecnologia",
    shortName: "Consultoria em processos e tecnologia",
    title: "Consultoria em Processos e Tecnologia",
    description:
      "Consultoria em processos e tecnologia para empresas em Uberaba/MG: mapeamos gargalos, organizamos a operação e definimos o que automatizar.",
    h1: "Consultoria em processos e tecnologia para empresas em Uberaba/MG",
    subtitle:
      "Antes de investir em sistema, é preciso entender onde está o problema. Trabalhamos como ponte entre operação e tecnologia.",
    badge: "Processos + tecnologia",
    pains: [
      {
        title: "Você sente que precisa investir em tecnologia, mas não sabe por onde começar",
        desc: "Existem mil ferramentas no mercado e não está claro qual resolve o seu caso.",
      },
      {
        title: "Já comprou sistemas que não foram para frente",
        desc: "Investimento feito, ninguém usou, voltou tudo para a planilha.",
      },
      {
        title: "A operação cresceu e ficou desorganizada",
        desc: "Processos diferentes em cada área, sem padrão e sem dono claro.",
      },
      {
        title: "Falta visão de processo na liderança",
        desc: "Decisões pontuais sem entender o impacto no fluxo inteiro do negócio.",
      },
    ],
    approach: [
      "Aplicamos visão de Engenharia de Produção: mapeamos o processo atual, identificamos gargalos reais e separamos o que é problema de processo do que é problema de ferramenta.",
      "Desenhamos um plano realista — o que pode ser resolvido com ajuste de processo, o que exige automação e o que de fato precisa de sistema. Sem empurrar tecnologia onde não faz sentido.",
      "Acompanhamos a execução: ou ajudando o cliente a estruturar internamente, ou desenvolvendo as soluções junto com o time de produto da Triângulo Solucions.",
    ],
    deliverables: [
      "Diagnóstico do processo atual com mapa de fluxo",
      "Identificação de gargalos e oportunidades de ganho rápido",
      "Plano de evolução em fases (processo, automação, sistema)",
      "Avaliação de ferramentas e sistemas atuais",
      "Definição de indicadores de acompanhamento",
      "Recomendações de prioridade e investimento",
    ],
    benefits: [
      {
        title: "Investimento certo, no momento certo",
        desc: "Você deixa de gastar com ferramenta que não resolve o problema real.",
      },
      {
        title: "Clareza sobre o que melhorar",
        desc: "Um plano com começo, meio e fim em vez de iniciativas soltas.",
      },
      {
        title: "Processos antes de software",
        desc: "Garante que tecnologia seja consequência de bons processos, não tentativa de consertar má operação.",
      },
      {
        title: "Visão integrada do negócio",
        desc: "Decisões considerando o impacto em todas as áreas.",
      },
    ],
    faq: [
      {
        q: "Preciso contratar a Triângulo para o desenvolvimento depois da consultoria?",
        a: "Não. A consultoria pode ser contratada de forma independente. Se fizer sentido, podemos seguir juntos no desenvolvimento — mas a recomendação é sempre baseada no melhor caminho para a empresa.",
      },
      {
        q: "Quanto tempo dura uma consultoria?",
        a: "Depende do escopo. Diagnósticos rápidos costumam levar poucas semanas. Projetos mais amplos podem se estender por alguns meses.",
      },
      {
        q: "Atendem qualquer setor?",
        a: "Trabalhamos melhor em operações com processos comerciais, administrativos, de serviços e gestão. Avaliamos cada caso antes de iniciar.",
      },
      {
        q: "O primeiro diagnóstico tem custo?",
        a: "Oferecemos uma conversa inicial gratuita para entender o cenário e indicar o caminho mais adequado.",
      },
    ],
    related: ["automacao-de-processos-uberaba", "sistemas-personalizados-uberaba"],
  },
];

export function getService(slug: string): ServiceContent | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export const SITE_URL = "https://triangulosolutions.com.br";
