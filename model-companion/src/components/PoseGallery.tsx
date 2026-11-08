import type { Pose } from '../types';
import { PoseCard } from './PoseCard';

export function PoseGallery({ poses, query }: { poses: Pose[]; query?: string }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-3 lg:gap-x-8 lg:gap-y-12 xl:grid-cols-4">
      {poses.map((pose, i) => (
        <li key={pose.id}>
          <PoseCard pose={pose} query={query} index={i} />
        </li>
      ))}
    </ul>
  );
}
