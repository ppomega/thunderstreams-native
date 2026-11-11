import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchAssets } from '../lib/api';
import type { Series } from '../lib/types';

type AssetsState = {
  assets: Series[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  byId: (id: string) => Series | undefined;
};

const Ctx = createContext<AssetsState | null>(null);

export function AssetsProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    fetchAssets(ctrl.signal)
      .then(setAssets)
      .catch((e) => {
        if (e?.name !== 'AbortError') setError(e?.message ?? 'Unable to load titles');
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const byId = useCallback((id: string) => assets.find((a) => a._id === id), [assets]);
  const value = useMemo(() => ({ assets, loading, error, reload, byId }), [assets, loading, error, reload, byId]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAssets() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAssets must be used inside AssetsProvider');
  return v;
}
