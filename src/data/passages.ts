export interface Passage {
  id: string;
  title: string;
  de: string;
  en: string;
}

export const passages: Passage[] = [
  {
    id: "1",
    title: "Der Kaffee",
    de: "Jeden Morgen trinke ich eine Tasse Kaffee. Der Kaffee hilft mir, wach zu werden. Ohne Kaffee bin ich sehr müde.",
    en: "Every morning I drink a cup of coffee. The coffee helps me wake up. Without coffee I am very tired.",
  },
  {
    id: "2",
    title: "Im Supermarkt",
    de: "Ich gehe zum Supermarkt, um Brot und Milch zu kaufen. Die Äpfel sind heute im Angebot. Ich nehme auch ein paar Bananen mit.",
    en: "I go to the supermarket to buy bread and milk. The apples are on sale today. I also take a few bananas with me.",
  },
  {
    id: "3",
    title: "Das Wetter",
    de: "Heute ist das Wetter sehr schön. Die Sonne scheint und es ist warm. Ich möchte im Park spazieren gehen.",
    en: "Today the weather is very nice. The sun is shining and it is warm. I would like to go for a walk in the park.",
  },
  {
    id: "4",
    title: "Meine Familie",
    de: "Meine Familie ist nicht sehr groß. Ich habe eine Schwester und einen Bruder. Meine Eltern wohnen in einer kleinen Stadt.",
    en: "My family is not very big. I have a sister and a brother. My parents live in a small town.",
  },
  {
    id: "5",
    title: "Im Restaurant",
    de: "Wir gehen heute Abend ins Restaurant. Ich bestelle ein Schnitzel mit Pommes. Mein Freund nimmt lieber Fisch.",
    en: "We are going to a restaurant tonight. I order a schnitzel with fries. My friend prefers fish.",
  },
  {
    id: "6",
    title: "Die Arbeit",
    de: "Ich arbeite jeden Tag von neun bis fünf Uhr. Mein Büro ist im Stadtzentrum. Die Arbeit ist manchmal stressig, aber ich mag meine Kollegen.",
    en: "I work every day from nine to five o'clock. My office is in the city center. The work is sometimes stressful, but I like my colleagues.",
  },
];
