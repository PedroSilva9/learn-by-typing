import type { GeneratedPassage } from '../types/generatedPassage';

export const MOCK_PASSAGES: GeneratedPassage[] = [
  {
    title: 'Der Morgen',
    german:
      'Ich stehe um sieben Uhr auf. Ich trinke Kaffee und esse Brot. Dann gehe ich zur Arbeit. Der Tag beginnt.',
    english:
      "I get up at seven o'clock. I drink coffee and eat bread. Then I go to work. The day begins.",
    isMock: true,
  },
  {
    title: 'Im Supermarkt',
    german:
      'Ich kaufe Milch und Äpfel. Die Milch kostet einen Euro. Die Äpfel sind frisch. Ich zahle an der Kasse.',
    english:
      'I buy milk and apples. The milk costs one euro. The apples are fresh. I pay at the checkout.',
    isMock: true,
  },
  {
    title: 'Das Wetter heute',
    german:
      'Heute ist es sonnig und warm. Die Temperatur beträgt zwanzig Grad. Ich trage ein T-Shirt und eine kurze Hose. Nachmittags gehe ich in den Park spazieren.',
    english:
      'Today it is sunny and warm. The temperature is twenty degrees. I wear a T-shirt and shorts. In the afternoon I go for a walk in the park.',
    isMock: true,
  },
  {
    title: 'Meine Familie',
    german:
      'Meine Familie ist nicht sehr groß. Ich habe eine Schwester und einen Bruder. Meine Eltern wohnen in München. Wir treffen uns oft am Wochenende.',
    english:
      'My family is not very large. I have a sister and a brother. My parents live in Munich. We meet often on the weekend.',
    isMock: true,
  },
  {
    title: 'Ein Stadtspaziergang',
    german:
      'Gestern habe ich die Altstadt besucht. Die engen Gassen und alten Gebäude haben mich beeindruckt. In einem kleinen Café trank ich einen Espresso und beobachtete die Passanten. Auf dem Rückweg kaufte ich noch frisches Gemüse auf dem Markt.',
    english:
      'Yesterday I visited the old town. The narrow alleys and old buildings impressed me. In a small café I drank an espresso and watched the passersby. On the way back I also bought fresh vegetables at the market.',
    isMock: true,
  },
  {
    title: 'Digitale Gewohnheiten',
    german:
      'Viele Menschen verbringen mehrere Stunden täglich am Smartphone. Soziale Medien, Nachrichten und Videos nehmen viel Zeit in Anspruch. Experten empfehlen, regelmäßige Pausen einzulegen. Ein gesunder Umgang mit Technik ist wichtig für das Wohlbefinden.',
    english:
      'Many people spend several hours a day on their smartphone. Social media, news, and videos take up a lot of time. Experts recommend taking regular breaks. A healthy relationship with technology is important for well-being.',
    isMock: true,
  },
  {
    title: 'Klimawandel und Alltag',
    german:
      'Der Klimawandel stellt uns vor erhebliche Herausforderungen, die nicht allein durch politische Maßnahmen gelöst werden können. Jeder Einzelne kann durch bewusstes Konsumverhalten einen Beitrag leisten, sei es durch die Wahl öffentlicher Verkehrsmittel oder durch den Kauf regionaler Lebensmittel. Dennoch darf individuelle Verantwortung nicht dazu dienen, strukturelle Probleme kleinzureden.',
    english:
      'Climate change presents us with considerable challenges that cannot be solved by political measures alone. Each individual can contribute through conscious consumer behaviour, whether by choosing public transport or buying regional food. Nevertheless, individual responsibility must not be used to downplay structural problems.',
    isMock: true,
  },
  {
    title: 'Arbeiten im Homeoffice',
    german:
      'Das Homeoffice hat die Arbeitswelt grundlegend verändert. Einerseits bietet es Flexibilität und spart lange Pendelzeiten, andererseits verschwimmen die Grenzen zwischen Beruf und Privatleben. Viele Beschäftigte berichten von Schwierigkeiten beim Abschalten. Unternehmen sind daher aufgefordert, klare Regeln zu etablieren und die Eigenverantwortung ihrer Mitarbeiter zu stärken.',
    english:
      'Working from home has fundamentally changed the world of work. On the one hand it offers flexibility and saves long commutes, on the other hand the boundaries between professional and private life become blurred. Many employees report difficulties switching off. Companies are therefore called upon to establish clear rules and to strengthen the self-responsibility of their employees.',
    isMock: true,
  },
  {
    title: 'Sprache und Identität',
    german:
      'Sprache ist weit mehr als ein bloßes Kommunikationsmittel — sie formt unsere Wahrnehmung der Welt und beeinflusst, wie wir über uns selbst denken. Mehrsprachigkeit gilt inzwischen nicht nur als kognitiver Vorteil, sondern auch als Ausdruck kultureller Zugehörigkeit und Offenheit. Wer eine Fremdsprache erlernt, eignet sich nicht allein Vokabeln und Grammatik an, sondern erschließt sich eine neue Perspektive auf die menschliche Erfahrung.',
    english:
      'Language is far more than a mere means of communication — it shapes our perception of the world and influences how we think about ourselves. Multilingualism is now considered not only a cognitive advantage but also an expression of cultural belonging and openness. When one learns a foreign language, one acquires not just vocabulary and grammar but opens up a new perspective on the human experience.',
    isMock: true,
  },
  {
    title: 'Über das Vergessen',
    german:
      'Das Vergessen genießt in der westlichen Wissensgesellschaft einen schlechten Ruf. Als Defizit des Geistes betrachtet, wird ihm Aufmerksamkeit meist nur dann zuteil, wenn es pathologische Züge annimmt. Dabei übersieht man leicht, dass das selektive Vergessen eine unverzichtbare kognitive Leistung darstellt: Es ermöglicht Abstraktion, schützt vor Reizüberflutung und schafft den psychischen Freiraum, der für kreatives Denken unabdingbar ist. Eine Kultur des Erinnerns, die keinen Raum für das Loslassen lässt, zahlt einen hohen Preis.',
    english:
      'Forgetting has a poor reputation in Western knowledge society. Regarded as a deficiency of the mind, it usually receives attention only when it takes on pathological traits. In doing so, one easily overlooks the fact that selective forgetting represents an indispensable cognitive achievement: it enables abstraction, protects against sensory overload, and creates the psychological space that is indispensable for creative thinking. A culture of remembrance that leaves no room for letting go pays a high price.',
    isMock: true,
  },
];

export function getRandomMockPassage(): GeneratedPassage {
  return MOCK_PASSAGES[Math.floor(Math.random() * MOCK_PASSAGES.length)];
}
