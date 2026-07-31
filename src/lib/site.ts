// Centralized site constants. Edit values here to update the whole LP.

export const SITE = {
  name: "Triângulo Solucions",
  shortName: "Triângulo Solucions",
  city: "Uberaba",
  region: "MG",
  area: "Triângulo Mineiro",
  description:
    "Empresa de tecnologia em Uberaba/MG especializada em sistemas personalizados, automações, dashboards e soluções digitais para gestão de negócios no Triângulo Mineiro.",
};

// WhatsApp — número oficial (DDI+DDD+número, sem espaços ou símbolos).
export const WHATSAPP_NUMBER = "5516993882232";
export const WHATSAPP_MESSAGE =
  "Olá, vim pelo site da Triângulo Solucions e gostaria de entender como vocês podem ajudar minha empresa com tecnologia, processos e gestão.";

export const getWhatsAppUrl = () =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const DIAGNOSTIC_WHATSAPP_MESSAGE =
  "Olá, vim pelo site da Triângulo Solucions e gostaria de agendar um diagnóstico para entender como melhorar processos, gestão e tecnologia na minha empresa.";

export const getDiagnosticWhatsAppUrl = () =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DIAGNOSTIC_WHATSAPP_MESSAGE)}`;

export const getWhatsAppUrlWithMessage = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;



// Instagram oficial
export const INSTAGRAM_USERNAME = "triangulosolutionsbrasil";
export const INSTAGRAM_HANDLE = `@${INSTAGRAM_USERNAME}`;
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_USERNAME}/`;
