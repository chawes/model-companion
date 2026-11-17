import { Link } from 'react-router-dom';
import { useDocumentTitle, useLang } from '../i18n/LangContext';

export function NotFoundPage() {
  const { t } = useLang();
  useDocumentTitle('404');
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="font-display mt-3 text-[1.9rem] leading-tight">{t('notFoundTitle')}</h1>
      <p className="mt-4 text-muted">{t('notFoundText')}</p>
      <Link to="/" className="mt-8 inline-flex h-12 items-center bg-red px-6 font-medium text-white">
        {t('notFoundBack')}
      </Link>
    </section>
  );
}
