import type { Pose } from '../types';
import { PoseCard } from './PoseCard';

export function PoseGallery({ poses, query }: { poses: Pose[]; query?: string }) {
  return (
    <ul className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-3 md:gap-4">
      {poses.map((pose, i) => (
        <li key={pose.id}>
          <PoseCard pose={pose} query={query} index={i} />
        </li>
      ))}
    </ul>
  );
}
