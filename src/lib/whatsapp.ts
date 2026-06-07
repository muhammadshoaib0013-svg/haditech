export const WHATSAPP_NUMBER = "923012475707";

export function getWhatsAppLink(source: string, serviceName?: string) {
  const serviceText = serviceName ? serviceName : "(SaaS / Dashboard / API / Extension / Automation)";
  
  const template = `Hi HADITECH, I found your website and I'm interested in your services.

📌 Service Needed:
${serviceText}

📌 My Requirement:
(Write details)

📌 Budget Range:
(Your budget)

📌 Timeline:
(When needed)

Please guide me with the best solution.

[Source: ${source}]`;

  const encodedMessage = encodeURIComponent(template);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
