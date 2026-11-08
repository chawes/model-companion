import { ButtonLink } from '../components/ui';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Not found');
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-[3rem] leading-none">This page took a break.</h1>
      <p className="mt-4 text-ink-soft">The page you're looking for doesn't exist or has moved.</p>
      <ButtonLink to="/" className="mt-8">
        Back to start
      </ButtonLink>
    </section>
  );
}
