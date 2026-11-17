import { LogOut } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { InspirationAdmin } from '../admin/InspirationAdmin';
import { PosesAdmin } from '../admin/PosesAdmin';
import { input, makeCall } from '../admin/shared';
import { useDocumentTitle } from '../i18n/LangContext';

/**
 * /admin — manage poses and the Inspiration board (Czech only, for organizers).
 * Changes are committed to GitHub by /api/* and appear on the site after the next deploy (~1 min).
 */
const PW_KEY = 'model-companion:admin';
type Tab = 'poses' | 'inspiration';

export function AdminPage() {
  useDocumentTitle('Admin');
  const [password, setPassword] = useState(() => sessionStorage.getItem(PW_KEY) ?? '');
  const [authed, setAuthed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('poses');
  const call = useMemo(() => makeCall(password), [password]);

  const login = async (pw: string) => {
    setBusy(true);
    setError('');
    try {
      await makeCall(pw)('poses', 'GET');
      sessionStorage.setItem(PW_KEY, pw);
      setAuthed(true);
    } catch (e) {
      sessionStorage.removeItem(PW_KEY);
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (password) login(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    sessionStorage.removeItem(PW_KEY);
    setPassword('');
    setAuthed(false);
  };

  if (!authed) {
    return (
      <form
        className="mx-auto flex max-w-sm flex-col gap-4 px-5 py-20"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          login(password);
        }}
      >
        <h1 className="font-display text-[1.8rem] leading-tight">Admin</h1>
        <p className="text-muted">Správa póz a nástěnky Inspirace.</p>
        <label className="flex flex-col gap-1.5 text-sm">
          Heslo
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
        </label>
        <button type="submit" disabled={!password || busy} className="h-12 rounded-md bg-red font-semibold text-white hover:bg-red-bright disabled:opacity-40">
          {busy ? 'Přihlašuji…' : 'Přihlásit'}
        </button>
        {error && <p className="text-sm text-red-bright">{error}</p>}
      </form>
    );
  }

  const tabBtn = (t: Tab, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === t}
      onClick={() => setTab(t)}
      className={`relative pb-3 text-[1rem] transition-colors ${tab === t ? 'font-semibold text-fg' : 'text-muted hover:text-fg'}`}
    >
      {label}
      <span aria-hidden className={`absolute inset-x-0 -bottom-px h-[2px] bg-red-bright ${tab === t ? 'opacity-100' : 'opacity-0'}`} />
    </button>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-32 pt-8 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-[1.8rem] leading-tight">Admin</h1>
        <button type="button" onClick={logout} className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
          <LogOut size={16} aria-hidden /> Odhlásit
        </button>
      </div>
      <div role="tablist" className="mt-6 mb-6 flex gap-6 border-b border-line">
        {tabBtn('poses', 'Pózy')}
        {tabBtn('inspiration', 'Inspirace')}
      </div>
      {tab === 'poses' ? <PosesAdmin call={call} /> : <InspirationAdmin call={call} />}
    </div>
  );
}
