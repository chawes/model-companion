import type { PrepSection } from '../types';

/**
 * Session Prep content.
 * Keep this general: exact terms, fees and requirements live on the
 * official Modeling page and are agreed with the organizer directly.
 */
export const PREP_SECTIONS: PrepSection[] = [
  {
    id: 'structure',
    title: 'How a session usually flows',
    icon: 'structure',
    intro: 'Most figure drawing sessions build from quick poses to longer ones. Formats vary — the organizer will tell you the plan for your session.',
    items: [
      'Warm-up: a run of very short gesture poses (around 1–2 minutes each).',
      'Short poses: a few poses of about 3–5 minutes.',
      'A break somewhere in the middle.',
      'Longer poses: 10 minutes, then 15–20 minutes, often seated or reclining.',
    ],
    note: 'Treat this as a typical example, not a fixed schedule.',
  },
  {
    id: 'bring',
    title: 'What to bring',
    icon: 'bring',
    items: [
      'A robe, kimono or something easy to slip on between poses.',
      'Slip-on shoes or warm socks for moving around.',
      'Water and a small snack.',
      'A layer to keep warm during breaks.',
      'A hair tie or clip if you have long hair.',
      'Anything that helps you feel at ease — a sarong to sit on, lip balm, a playlist idea for the organizer.',
    ],
  },
  {
    id: 'timing',
    title: 'How pose timing works',
    icon: 'timing',
    items: [
      'The organizer keeps time and tells you when each pose starts and ends — you don\'t need your own timer.',
      'Before you start, the organizer will usually say how long the next pose lasts. Pick a pose that suits that length.',
      'If you are unsure what to do next, it\'s fine to ask for a suggestion or check the Pose Library.',
      'Choose a fixed point to look at, so your head stays in the same position.',
    ],
  },
  {
    id: 'breaks',
    title: 'Breaks and comfort',
    icon: 'breaks',
    items: [
      'You can ask for a break or a short pause at any moment — you don\'t need to justify it.',
      'Ask in advance about a changing space, heating and where to keep your things.',
      'Mark your pose with tape before a break so you can return to it.',
      'If something starts to hurt, adjust or come out of the pose. Comfort comes before stillness.',
    ],
  },
  {
    id: 'communication',
    title: 'Talking with the organizer',
    icon: 'communication',
    items: [
      'Agree the practical details — time, place, arrival, length and any terms — directly with the organizer before the session.',
      'Mention any injuries, limits or poses you would rather avoid.',
      'Say which props you are happy to use: stool, staff, cushions, fabric.',
      'First time modeling? Say so — you\'ll get a little extra guidance.',
    ],
  },
  {
    id: 'consent',
    title: 'Consent, boundaries and privacy',
    icon: 'consent',
    items: [
      'Clothing and nudity are entirely your choice. Poses in this app are suggestions, never requirements.',
      'Nobody should touch you to adjust a pose without asking first.',
      'Ask how photography is handled at the session, and say clearly whether you are comfortable being photographed.',
      'If artwork from the session might be shared online, you can ask how you would like to be credited — or not credited.',
      'If anything makes you uncomfortable, tell the organizer. You can stop at any time.',
    ],
  },
];
