import type { GuideLesson, PrepBlock } from '../types';

/** Five short principles, each with a tap-to-compare illustration. */
export const LESSONS: GuideLesson[] = [
  {
    id: 'silhouette',
    title: { cs: 'Čitelná silueta', en: 'A readable silhouette' },
    text: {
      cs: 'Umělci tě vidí z mnoha úhlů najednou. Když ruce a nohy nejsou přitisknuté k tělu, vzniknou mezi nimi mezery a póza je čitelná z každého místa v místnosti.',
      en: 'Artists see you from many angles at once. When arms and legs are not pressed to the body, gaps of space appear and the pose reads from every seat in the room.',
    },
    views: [
      {
        label: { cs: 'Uzavřená', en: 'Closed' },
        image: '/guide/silhouette-closed.svg',
        alt: { cs: 'Silueta s rukama u těla.', en: 'Silhouette with arms against the body.' },
        caption: { cs: 'Ruce u těla — figura splyne v jeden blok.', en: 'Arms against the body — the figure becomes one block.' },
      },
      {
        label: { cs: 'Otevřená', en: 'Open' },
        image: '/guide/silhouette-open.svg',
        alt: { cs: 'Silueta s rukou opřenou o bok.', en: 'Silhouette with a hand on the hip.' },
        caption: { cs: 'Ruka v bok otevře okno mezi paží a tělem.', en: 'A hand on the hip opens a window of space.' },
      },
    ],
    takeaway: {
      cs: 'Představ si svou pózu jako stín na zdi. Je poznat, kde máš ruce a nohy?',
      en: 'Imagine your pose as a shadow on the wall. Can you tell where the arms and legs are?',
    },
  },
  {
    id: 'angles',
    title: { cs: 'Natoč se', en: 'Turn and tilt' },
    text: {
      cs: 'Postoj čelem a souměrně je klidný, ale plochý. Pootočení těla, náklon hlavy nebo přenesení váhy dá kresbě rytmus. Mezi pózami střídej směr, ať má každý jiný pohled.',
      en: 'Facing straight ahead and symmetric is calm but flat. Turning the body, tilting the head or shifting weight gives the drawing rhythm. Vary direction between poses so everyone gets a different view.',
    },
    views: [
      {
        label: { cs: 'Čelem', en: 'Frontal' },
        image: '/guide/angles-frontal.svg',
        alt: { cs: 'Souměrná figura stojící čelem.', en: 'Symmetric figure facing forward.' },
        caption: { cs: 'Souměrné a stabilní, ale málo k objevování.', en: 'Symmetric and stable, but little to discover.' },
      },
      {
        label: { cs: 'Pootočená', en: 'Turned' },
        image: '/guide/angles-turned.svg',
        alt: { cs: 'Figura otočená bokem, hlava přes rameno.', en: 'Figure turned away, looking over the shoulder.' },
        caption: { cs: 'Pootočené tělo a hlava — hned je co kreslit.', en: 'Turned body and head — instantly more to draw.' },
      },
    ],
    takeaway: {
      cs: 'Mezi pózami změň aspoň jednu věc: směr těla, hlavy nebo váhy.',
      en: 'Change at least one thing between poses: body, head or weight.',
    },
  },
  {
    id: 'balance',
    title: { cs: 'Rovnováha', en: 'Balance' },
    text: {
      cs: 'Představ si olovnici spuštěnou z jamky na krku. Když dopadne mezi chodidla, stojíš stabilně. Když dopadne mimo, svaly pracují a tělo se začne třást. Další bod opory — tyč, zeď, stolička — pomůže i u výrazné pózy.',
      en: 'Imagine a plumb line dropping from the pit of your neck. If it lands between your feet, you are stable. If it falls outside, muscles work hard and you start to tremble. An extra point of support — a staff, a wall, a stool — steadies even an expressive pose.',
    },
    views: [
      {
        label: { cs: 'Bez opory', en: 'Unsupported' },
        image: '/guide/balance-unsupported.svg',
        alt: { cs: 'Figura na jedné noze s olovnicí.', en: 'Figure on one foot with a plumb line.' },
        caption: { cs: 'Na jedné noze — krásné na minutu, pak se třese.', en: 'One foot — beautiful for a minute, then shaky.' },
      },
      {
        label: { cs: 'S oporou', en: 'Supported' },
        image: '/guide/balance-supported.svg',
        alt: { cs: 'Figura opřená o tyč s olovnicí.', en: 'Figure leaning on a staff with a plumb line.' },
        caption: { cs: 'Tyč přidá druhý bod opory.', en: 'A staff adds a second point of contact.' },
      },
    ],
    takeaway: {
      cs: 'Delší póza? Oporu si přidej hned na začátku, ne v polovině.',
      en: 'Longer pose? Add support at the start, not halfway through.',
    },
  },
  {
    id: 'duration',
    title: { cs: 'Krátké a dlouhé pózy', en: 'Short and long poses' },
    text: {
      cs: 'Krátké pózy (1–2 min) jsou prostor pro akci a diagonály — výpad, natažení, hod. Dlouhé pózy (15–20 min) mají být plně podepřené: v sedu, v lehu nebo s oporou, abys vydržel bez námahy.',
      en: 'Short poses (1–2 min) are the place for action and diagonals — a lunge, a reach, a throw. Long poses (15–20 min) should be fully supported: seated, reclining or leaning, so you can stay still without strain.',
    },
    views: [
      {
        label: { cs: '1–2 min', en: '1–2 min' },
        image: '/guide/dynamic-action.svg',
        alt: { cs: 'Figura ve výpadu s výraznou diagonálou.', en: 'Figure in a lunge with a strong diagonal.' },
        caption: { cs: 'Krátká: zmrazený okamžik pohybu.', en: 'Short: a frozen moment of movement.' },
      },
      {
        label: { cs: '15–20 min', en: '15–20 min' },
        image: '/guide/duration-long.svg',
        alt: { cs: 'Figura ležící na boku.', en: 'Figure reclining on its side.' },
        caption: { cs: 'Dlouhá: všechno spočívá na zemi nebo na podložce.', en: 'Long: everything rests on the floor or a prop.' },
      },
    ],
    takeaway: {
      cs: 'Zeptej se sama sebe: vydržel/a bych to dvakrát tak dlouho? Pokud ne, zkrať nebo podepři.',
      en: 'Ask yourself: could I hold this twice as long? If not, shorten or support it.',
    },
  },
  {
    id: 'comfort',
    title: { cs: 'Pohodlí na prvním místě', en: 'Comfort first' },
    text: {
      cs: 'Nejrychleji unaví ruce nad úrovní ramen, zamčené koleno a silně otočený krk. Když ucítíš mravenčení, necitlivost nebo bolest, pózu uprav. Malá změna je vždycky lepší než vydržet za každou cenu.',
      en: 'Arms above the shoulders, a locked knee and a strongly turned neck tire you fastest. If you feel pins and needles, numbness or pain, adjust. A small change is always better than pushing through.',
    },
    views: [
      {
        label: { cs: 'Námaha', en: 'Strain' },
        image: '/guide/comfort-strain.svg',
        alt: { cs: 'Figura s rukama nad hlavou, zakroužkovaná ramena.', en: 'Figure with arms overhead, shoulders circled.' },
        caption: { cs: 'Zakroužkovaná místa pracují nejvíc.', en: 'Circled: the joints doing the hardest work.' },
      },
      {
        label: { cs: 'Odpočinek', en: 'Rested' },
        image: '/guide/comfort-supported.svg',
        alt: { cs: 'Figura v předklonu na stoličce.', en: 'Figure leaning forward on a stool.' },
        caption: { cs: 'Předloktí na stehnech, váha na stoličce.', en: 'Forearms on thighs, weight on the stool.' },
      },
    ],
    takeaway: {
      cs: 'Póza, která bolí, nestojí za to.',
      en: 'A pose that hurts is never worth holding.',
    },
  },
];

/**
 * Practical session notes. Keep these general — exact terms are agreed
 * with the organizer and live on the official Modeling page.
 */
export const PREP: PrepBlock[] = [
  {
    id: 'flow',
    title: { cs: 'Jak sezení obvykle probíhá', en: 'How a session usually flows' },
    items: [
      { cs: 'Rozehřátí krátkými pózami (1–2 min).', en: 'A warm-up of very short poses (1–2 min).' },
      { cs: 'Pak delší pózy a přestávka uprostřed.', en: 'Then longer poses, with a break in the middle.' },
      { cs: 'Na konci dlouhé pózy (15–20 min), často v sedu nebo v lehu.', en: 'Long poses at the end (15–20 min), often seated or reclining.' },
      { cs: 'Čas hlídá organizátor — vlastní stopky nepotřebuješ.', en: 'The organizer keeps time — you don’t need a timer.' },
    ],
  },
  {
    id: 'bring',
    title: { cs: 'Co si vzít s sebou', en: 'What to bring' },
    items: [
      { cs: 'Župan nebo něco, co rychle přehodíš.', en: 'A robe or something easy to slip on.' },
      { cs: 'Přezůvky nebo teplé ponožky.', en: 'Slip-on shoes or warm socks.' },
      { cs: 'Vodu a něco malého k jídlu.', en: 'Water and a small snack.' },
      { cs: 'Gumičku do vlasů, pokud máš dlouhé vlasy.', en: 'A hair tie if you have long hair.' },
    ],
  },
  {
    id: 'comfort',
    title: { cs: 'Přestávky a pohodlí', en: 'Breaks and comfort' },
    items: [
      { cs: 'O pauzu můžeš požádat kdykoli a nemusíš ji vysvětlovat.', en: 'You can ask for a break at any time, no explanation needed.' },
      { cs: 'Předem se zeptej na převlékárnu, topení a kam si dát věci.', en: 'Ask in advance about a changing space, heating and where to leave your things.' },
      { cs: 'Před přestávkou si polohu chodidel označ páskou, ať se do pózy vrátíš.', en: 'Before a break, mark your feet with tape so you can return to the pose.' },
    ],
  },
  {
    id: 'boundaries',
    title: { cs: 'Hranice a soukromí', en: 'Boundaries and privacy' },
    items: [
      { cs: 'Oblečení i nahota jsou jen tvoje volba. Pózy v appce jsou návrhy, ne požadavky.', en: 'Clothing and nudity are entirely your choice. Poses here are suggestions, not requirements.' },
      { cs: 'Řekni organizátorovi o zraněních, omezeních nebo pózách, které nechceš.', en: 'Tell the organizer about injuries, limits or poses you would rather avoid.' },
      { cs: 'Zeptej se, jak se řeší focení, a jasně řekni, jestli souhlasíš.', en: 'Ask how photography is handled, and say clearly whether you agree to it.' },
      { cs: 'Kdykoli ti něco nebude příjemné, řekni to. Skončit můžeš kdykoli.', en: 'If anything feels uncomfortable, say so. You can stop at any time.' },
    ],
  },
];
