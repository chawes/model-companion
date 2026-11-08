import type { GuideLesson } from '../types';

/**
 * Model Guide — short, friendly lessons. Not formal training:
 * every model works in their own way.
 */
export const LESSONS: GuideLesson[] = [
  {
    id: 'silhouette',
    number: 1,
    title: 'Silhouette and readability',
    summary: 'If the pose reads as a solid shadow, it reads from every seat in the room.',
    body: [
      'Artists see you from many angles at once. A pose with clear shapes — arms away from the body, legs apart, gaps of space between limbs — is easier to read and more rewarding to draw.',
      'Those gaps are called negative space. When arms hug the body, the figure merges into one block and much of the gesture disappears.',
    ],
    views: [
      {
        label: 'Closed',
        image: '/guide/silhouette-closed.svg',
        alt: 'Filled silhouette of a figure standing with arms tight against the body.',
        caption: 'Arms against the body — the shape becomes a single column.',
      },
      {
        label: 'Open',
        image: '/guide/silhouette-open.svg',
        alt: 'Filled silhouette of a figure with one hand on the hip, creating a gap between arm and body.',
        caption: 'A hand on the hip opens a window of negative space.',
      },
    ],
    takeaway: 'Imagine your pose as a shadow on the wall. Can you see where the arms and legs are?',
  },
  {
    id: 'angles',
    number: 2,
    title: 'Variety and body angles',
    summary: 'Turn, tilt and twist — symmetry is the enemy of an interesting drawing.',
    body: [
      'A figure facing straight ahead with both sides mirrored is calm but flat. Turning the body three-quarters, tilting the head or shifting the hips gives artists overlaps, foreshortening and rhythm.',
      'Across a session, try to vary direction: some poses facing the room, some turned, some from the back. Everyone around you gets a different view.',
    ],
    views: [
      {
        label: 'Frontal',
        image: '/guide/angles-frontal.svg',
        alt: 'Figure standing straight, facing forward, symmetrical.',
        caption: 'Frontal and symmetric — stable, but little to discover.',
      },
      {
        label: 'Turned',
        image: '/guide/angles-turned.svg',
        alt: 'Figure turned three-quarters away, looking back over the shoulder.',
        caption: 'Turned body, head looking back — instantly more to draw.',
      },
    ],
    takeaway: 'Change at least one direction between poses: body, head or weight.',
  },
  {
    id: 'balance',
    number: 3,
    title: 'Balance and stability',
    summary: 'A pose you can hold is a pose you can hold still.',
    body: [
      'Picture a plumb line dropping from the pit of your neck. When it lands between or near your feet, you are balanced. When it falls outside your base, muscles start working hard to keep you up — and small tremors begin.',
      'Extra points of contact — a staff, a wall, a stool, a hand on the knee — make even expressive poses steady.',
    ],
    views: [
      {
        label: 'Unsupported',
        image: '/guide/balance-unsupported.svg',
        alt: 'Figure balancing on one foot with arms out, a dashed plumb line from the neck.',
        caption: 'One foot, arms out — beautiful for a minute, shaky after that.',
      },
      {
        label: 'Supported',
        image: '/guide/balance-supported.svg',
        alt: 'Figure leaning on a staff, a dashed plumb line falling inside the base.',
        caption: 'A staff adds a second point of contact.',
      },
    ],
    takeaway: 'Longer pose? Add a point of support before you start, not halfway through.',
  },
  {
    id: 'dynamic',
    number: 4,
    title: 'Dynamic versus static',
    summary: 'Diagonals feel like movement. Verticals feel like stillness.',
    body: [
      'Dynamic poses suggest an action — a lunge, a reach, a throw. They use strong diagonals and asymmetry, and they are perfect for quick gesture drawing.',
      'Static poses are calm and settled. They give artists time to study proportion, light and form. A good session usually needs both.',
    ],
    views: [
      {
        label: 'Static',
        image: '/guide/dynamic-static.svg',
        alt: 'Calm standing figure with folded arms, vertical plumb line.',
        caption: 'Vertical and settled — ideal for longer studies.',
      },
      {
        label: 'Dynamic',
        image: '/guide/dynamic-action.svg',
        alt: 'Figure in a lunge with a strong diagonal line of action.',
        caption: 'A diagonal line of action — energy for quick sketches.',
      },
    ],
    takeaway: 'Save the big action for short poses; settle into stillness for long ones.',
  },
  {
    id: 'duration',
    number: 5,
    title: 'Short versus long poses',
    summary: 'Match the effort of the pose to how long you need to hold it.',
    body: [
      'Short poses (1–2 minutes) are the place for bold, physical, even slightly uncomfortable actions. Nobody has to hold them for long.',
      'Long poses (15–20 minutes) should be fully supported — seated, reclining or leaning — so you can stay still without strain. The duration tags in the Pose Library are suggestions built on this idea.',
    ],
    views: [
      {
        label: '1–2 min',
        image: '/guide/duration-short.svg',
        alt: 'Figure caught mid-throw.',
        caption: 'Short: a frozen moment of action.',
      },
      {
        label: '15–20 min',
        image: '/guide/duration-long.svg',
        alt: 'Figure reclining on its side with the head propped.',
        caption: 'Long: everything rests on the floor or a prop.',
      },
    ],
    takeaway: 'Ask yourself: could I hold this for twice as long? If not, shorten or support it.',
  },
  {
    id: 'comfort',
    number: 6,
    title: 'Comfort and body awareness',
    summary: 'Raised arms, locked knees and twisted necks are where fatigue starts.',
    body: [
      'Arms above the shoulders, weight on one locked knee and strong neck rotation tire the body fastest. Wrists and knees on hard floors come next.',
      'Notice pins and needles, numbness or sharp pain. A small adjustment is always better than pushing through — artists would much rather you stay comfortable.',
    ],
    views: [
      {
        label: 'Strain',
        image: '/guide/comfort-strain.svg',
        alt: 'Figure with arms overhead; shoulders and elbow circled as strain points.',
        caption: 'Circled: the joints doing the hardest work.',
      },
      {
        label: 'Rested',
        image: '/guide/comfort-supported.svg',
        alt: 'Figure seated on a stool with forearms resting on thighs.',
        caption: 'Forearms on thighs, weight on the stool — sustainable.',
      },
    ],
    takeaway: 'Comfort first. A pose that hurts is never worth holding.',
  },
  {
    id: 'communication',
    number: 7,
    title: 'Communication and boundaries',
    summary: 'You decide what you are comfortable with — and you can change your mind.',
    body: [
      'Before the session, tell the organizer anything that matters to you: clothing or nudity preferences, poses or props you would rather avoid, injuries, and whether you are comfortable being photographed. All of these are your choices.',
      'During the session, you can ask for a break, adjust a pose or stop at any time. A practical tip: before a break, mark your feet and hand positions with tape so you can return to the same pose afterwards.',
    ],
    views: [
      {
        label: 'Before break',
        image: '/guide/communication-before.svg',
        alt: 'Figure in pose with tape crosses marking the position of each foot.',
        caption: 'Tape marks where your feet are before you step out.',
      },
      {
        label: 'After break',
        image: '/guide/communication-after.svg',
        alt: 'Silhouette of the same pose stepping back onto the tape marks.',
        caption: 'Step back onto the marks — the artists can carry on.',
      },
    ],
    takeaway: 'Speak up early and often. Organizers and artists want you to.',
  },
];

export const getLesson = (id: string | undefined) => LESSONS.find((l) => l.id === id);
