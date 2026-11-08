import type { Pose } from '../types';
import { PoseCard } from './PoseCard';

interface Props {
  poses: Pose[];
  query?: string;
  columns?: 'default' | 'compact';
}

export function PoseGallery({ poses, query, columns = 'default' }: Props) {
  return (
    <ul
      className={
        columns === 'compact'
          ? 'grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6'
          : 'grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:gap-x-8 lg:gap-y-14 xl:grid-cols-4'
      }
    >
      {poses.map((pose, i) => (
        <li key={pose.id}>
          <PoseCard pose={pose} query={query} index={i} />
        </li>
      ))}
    </ul>
  );
}
