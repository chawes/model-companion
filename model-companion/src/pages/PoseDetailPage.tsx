import { useParams } from 'react-router-dom';
import { PoseDetail } from '../components/PoseDetail';
import { getPose, POSES } from '../data/poses';
import { useDocumentTitle, useLang } from '../i18n/LangContext';
import { NotFoundPage } from './NotFoundPage';
import { usePoseFilter } from './PosesPage';

export function PoseDetailPage() {
  const { id } = useParams();
  const { l } = useLang();
  const pose = getPose(id);
  const { results, query } = usePoseFilter();
  useDocumentTitle(pose ? l(pose.title) : undefined);

  if (!pose) return <NotFoundPage />;

  // Step through the filtered set when the pose belongs to it, otherwise the whole library.
  const inFilter = results.includes(pose);
  const list = inFilter ? results : POSES;
  const i = list.indexOf(pose);
  return <PoseDetail pose={pose} prev={list[i - 1]} next={list[i + 1]} query={inFilter ? query : ''} />;
}
