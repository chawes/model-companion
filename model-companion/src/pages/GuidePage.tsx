import { GuideCard } from '../components/GuideCard';
import { PageIntro } from '../components/ui';
import { LESSONS } from '../data/guide';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useReadLessons } from '../hooks/useSavedPoses';

export function GuidePage() {
  useDocumentTitle('Model Guide');
  const { isRead } = useReadLessons();
  const readCount = LESSONS.filter((l) => isRead(l.id)).length;

  return (
    <>
      <PageIntro
        eyebrow="Model Guide"
        title={
          <>
            Seven short <em className="text-sanguine">lessons</em>
          </>
        }
        aside={
          <p className="eyebrow md:text-right">
            {readCount} of {LESSONS.length} read
          </p>
        }
      >
        A friendly introduction to what makes a pose rewarding to draw — and comfortable to hold. Not a course, not a rulebook:
        take what helps, leave the rest.
      </PageIntro>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="border-t hairline">
          {LESSONS.map((l) => (
            <GuideCard key={l.id} lesson={l} read={isRead(l.id)} />
          ))}
        </div>
      </div>
    </>
  );
}
