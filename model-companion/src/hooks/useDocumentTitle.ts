import { useEffect } from 'react';
import { SITE } from '../data/site';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE.appName}` : `${SITE.appName} — ${SITE.clubName}`;
  }, [title]);
}
