import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { PoseDetail } from '../components/PoseDetail';
import { getPose, POSES } from '../data/poses';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePoseFilters } from '../hooks/usePoseFilters';
import { NotFoundPage } from './NotFoundPage';

export function PoseDetailPage() {
  const { id } = useParams();
  const pose = getPose(id);
  const { results, query } = usePoseFilters();
  useDocumentTitle(pose?.title);

  // Navigate within the filtered set when the pose belongs to it, otherwise the whole library.
  const list = useMemo(() => (pose && results.includes(pose) ? results : POSES), [pose, results]);

  if (!pose) return <NotFoundPage />;

  const index = list.indexOf(pose);
  const inFilter = list === results;
  return (
    <PoseDetail
      pose={pose}
      prev={index > 0 ? list[index - 1] : undefined}
      next={index < list.length - 1 ? list[index + 1] : undefined}
      query={inFilter ? query : ''}
      position={{ index, total: list.length }}
    />
  );
}
