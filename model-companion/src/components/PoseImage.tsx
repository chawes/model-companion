import { useState } from 'react';
import type { Pose } from '../types';

interface Props {
  pose: Pose;
  priority?: boolean;
  className?: string;
}

/** Reference image on a paper-toned frame with a soft fade-in once loaded. */
export function PoseImage({ pose, priority = false, className = '' }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-paper-deep ${className}`}>
      <img
        src={pose.image}
        alt={pose.imageAlt}
        width={800}
        height={1000}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
