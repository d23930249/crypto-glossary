'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronRight, Copy, ExternalLink, RefreshCw, Search, Shuffle, Sparkles, X } from 'lucide-react';
import { Header } from '@/ui/components/Header';
import { Badge, Button, Card, FieldLabel } from '@/ui/components/ui';
import { publicClient } from '@/lib/eth';
import {
  CHEATSHEET_METHODS,
  FAUCETS,
  GLOSSARY,
  RPC_ENDPOINTS,
  type Faucet,
  type GlossaryEntry,
  type RpcEndpoint,
} from '@/lib/glossary-data';

type Tab = 'glossary' | 'cheatsheet' | 'quiz';

type ClaimLog = Record<string, number>;

const CATEGORY_LABEL: Record<GlossaryEntry['category'], string> = {
  core: 'Core',
  ethereum: 'Ethereum',
  testnet: 'Testnet',
  tooling: 'Tooling',
  security: 'Security',
};

function loadClaims(): ClaimLog {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem('crypto-glossary:claims');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const out: ClaimLog = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
      }
      return out;
    }
  } catch {
    return {};
  }
  return {};
}

function saveClaims(claims: ClaimLog): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('crypto-glossary:claims', JSON.stringify(claims));
}

function fmtRelative(ts: number): string {
  const diffMs = Date.now() - ts;
  const future = diffMs < 0;
  const abs = Math.abs(diffMs);
  const mins = Math.floor(abs / 60_000);
  const hrs = Math.floor(mins / 60);
  if (hrs >= 1) {
    const rest = mins % 60;
    return future ? `in ${hrs}h ${rest}m` : `${hrs}h ${rest}m ago`;
  }
  if (mins >= 1) return future ? `in ${mins}m` : `${mins}m ago`;
  const secs = Math.floor(abs / 1000);
  return future ? `in ${secs}s` : `${secs}s ago`;
}

function nextClaimReady(claims: ClaimLog, faucet: Faucet): number | null {
  const last = claims[faucet.name];
  if (typeof last !== 'number' || faucet.cooldownHours === 0) return null;
  const readyAt = last + faucet.cooldownHours * 3_600_000;
  return readyAt;
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'rounded-full bg-brand-700 px-3 py-1 text-xs font-semibold text-white transition'
          : 'rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink-soft transition hover:border-brand-100 hover:bg-mist'
      }
    >
      {children}
    </button>
  );
}

function CopyButton({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          window.setTimeout(() => setDone(false), 1200);
        } catch {
          setDone(false);
        }
      }}
      className="inline-flex items-center gap-1 rounded-md border border-line bg-white px-2 py-0.5 text-[11px] font-medium text-ink-soft transition hover:border-brand-100 hover:bg-mist"
      aria-label="Copy"
    >
      {done ? <Check className="h-3 w-3 text-positive" /> : <Copy className="h-3 w-3" />}
      {done ? 'Copied' : 'Copy'}
    </button>
  );
}

function GlossaryTab() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<GlossaryEntry['category'] | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY.filter((entry) => {
      if (category !== 'all' && entry.category !== category) return false;
      if (!q) return true;
      return (
        entry.term.toLowerCase().includes(q) ||
        entry.short.toLowerCase().includes(q) ||
        entry.body.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const categories = useMemo(() => {
    const set = new Set<GlossaryEntry['category']>();
    GLOSSARY.forEach((e) => set.add(e.category));
    return Array.from(set);
  }, []);

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search terms, definitions, body text…"
              spellCheck={false}
              autoComplete="off"
              className="field pl-9"
            />
          </div>
          <p className="shrink-0 text-sm text-ink-soft tnum">{filtered.length} / {GLOSSARY.length}</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <FilterChip active={category === 'all'} onClick={() => setCategory('all')}>
            All
          </FilterChip>
          {categories.map((c) => (
            <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
              {CATEGORY_LABEL[c]}
            </FilterChip>
          ))}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <p className="text-sm text-ink-soft">No terms match your search.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.map((entry) => (
            <details
              key={entry.term}
              className="group rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-brand-100"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold tracking-tight text-ink">{entry.term}</p>
                  <p className="mt-1 text-sm text-ink-soft">{entry.short}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <Badge>{CATEGORY_LABEL[entry.category]}</Badge>
                  <ChevronRight className="h-4 w-4 text-ink-soft transition group-open:rotate-90" />
                </div>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink">{entry.body}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

function CheatsheetTab() {
  const [claims, setClaims] = useState<ClaimLog>({});
  const [hydrated, setHydrated] = useState(false);

  const [blockNumber, setBlockNumber] = useState<bigint | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [gasPrice, setGasPrice] = useState<bigint | null>(null);
  const [rpcError, setRpcError] = useState<string | null>(null);
  const [rpcLoading, setRpcLoading] = useState(false);

  useEffect(() => {
    setClaims(loadClaims());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const t = window.setInterval(() => setClaims({ ...loadClaims() }), 30_000);
    return () => window.clearInterval(t);
  }, [hydrated]);

  async function loadChain() {
    setRpcLoading(true);
    setRpcError(null);
    try {
      const [block, id, gas] = await Promise.all([
        publicClient.getBlockNumber(),
        publicClient.getChainId(),
        publicClient.getGasPrice(),
      ]);
      setBlockNumber(block);
      setChainId(id);
      setGasPrice(gas);
    } catch (err) {
      setRpcError(err instanceof Error ? err.message : 'Failed to reach RPC.');
    } finally {
      setRpcLoading(false);
    }
  }

  useEffect(() => {
    loadChain();
  }, []);

  function recordClaim(name: string) {
    const next = { ...loadClaims(), [name]: Date.now() };
    saveClaims(next);
    setClaims(next);
  }

  function clearClaim(name: string) {
    const next = { ...loadClaims() };
    delete next[name];
    saveClaims(next);
    setClaims(next);
  }

  const gwei = gasPrice !== null ? Number(gasPrice) / 1e9 : null;

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-ink">Sepolia live chain</p>
            <p className="mt-1 text-sm text-ink-soft">Reads the testnet RPC this app is wired to.</p>
          </div>
          <Button variant="ghost" onClick={loadChain} disabled={rpcLoading}>
            <RefreshCw className={`h-4 w-4 ${rpcLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        {rpcError ? (
          <p className="mt-4 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-800">{rpcError}</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-mist px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-ink-soft">Block</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink tnum">
                {blockNumber !== null ? blockNumber.toString() : '—'}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-mist px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-ink-soft">Chain ID</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink tnum">
                {chainId !== null ? chainId : '—'}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-mist px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-ink-soft">Gas price</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink tnum">
                {gwei !== null ? `${gwei.toFixed(3)} gwei` : '—'}
              </p>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-ink">Faucet tracker</p>
            <p className="mt-1 text-sm text-ink-soft">Tap "Mark claimed" after you grab testnet ETH. Cooldowns are stored in this browser only.</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {FAUCETS.map((f) => {
            const last = claims[f.name];
            const ready = nextClaimReady(claims, f);
            const readyIn = ready !== null ? ready - Date.now() : null;
            const readyNow = readyIn === null || readyIn <= 0;
            return (
              <div
                key={f.name}
                className="flex flex-col gap-2 rounded-xl border border-line bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink">{f.name}</p>
                    <Badge>{f.network}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">{f.notes}</p>
                  <p className="mt-1 text-[11px] text-ink-soft tnum">
                    {f.cooldownHours > 0 ? `Cooldown: ${f.cooldownHours}h` : 'No cooldown'}
                    {last ? ` · last claimed ${fmtRelative(last)}` : ''}
                    {readyIn !== null && readyIn > 0 ? ` · next in ${fmtRelative(readyIn)}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {last !== undefined && (
                    <button
                      type="button"
                      onClick={() => clearClaim(f.name)}
                      className="inline-flex items-center gap-1 rounded-md border border-line bg-white px-2 py-1 text-[11px] font-medium text-ink-soft transition hover:border-brand-100 hover:bg-mist"
                    >
                      <X className="h-3 w-3" /> Reset
                    </button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => recordClaim(f.name)}
                    disabled={!readyNow && last !== undefined}
                  >
                    <Check className="h-4 w-4" />
                    {last === undefined ? 'Mark claimed' : readyNow ? 'Mark claimed again' : 'On cooldown'}
                  </Button>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border border-line bg-white px-2 py-1 text-[11px] font-medium text-ink-soft transition hover:border-brand-100 hover:bg-mist"
                  >
                    <ExternalLink className="h-3 w-3" /> Open
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <p className="font-display text-lg font-bold tracking-tight text-ink">RPC endpoints</p>
        <p className="mt-1 text-sm text-ink-soft">Public endpoints you can drop into a wallet, a script, or an env var. This app uses PublicNode (Sepolia).</p>
        <div className="mt-4 space-y-2">
          {RPC_ENDPOINTS.map((r) => (
            <RpcRow key={r.url} endpoint={r} />
          ))}
        </div>
      </Card>

      <Card>
        <p className="font-display text-lg font-bold tracking-tight text-ink">JSON-RPC method cheatsheet</p>
        <p className="mt-1 text-sm text-ink-soft">The verbs you actually need when you curl an Ethereum node by hand.</p>
        <div className="mt-4 space-y-2">
          {CHEATSHEET_METHODS.map((m) => (
            <details key={m.method} className="group rounded-xl border border-line bg-white p-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <code className="rounded-md bg-mist px-2 py-0.5 font-mono text-sm text-brand-800">{m.method}</code>
                  <span className="text-sm text-ink-soft">{m.summary}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-ink-soft transition group-open:rotate-90" />
              </summary>
              <div className="mt-3 rounded-lg bg-ink p-3 text-xs text-paper-deep">
                <pre className="overflow-x-auto whitespace-pre-wrap break-all font-mono">{m.example}</pre>
              </div>
              <div className="mt-2 flex justify-end">
                <CopyButton value={`curl -X POST -H "Content-Type: application/json" --data '${m.example}' https://ethereum-sepolia-rpc.publicnode.com`} />
              </div>
            </details>
          ))}
        </div>
      </Card>
    </div>
  );
}

function RpcRow({ endpoint }: { endpoint: RpcEndpoint }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-line bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-ink">{endpoint.name}</p>
          <Badge>{endpoint.network}</Badge>
          {endpoint.auth === 'key' && <Badge>Requires key</Badge>}
        </div>
        <p className="mt-1 break-all font-mono text-xs text-ink-soft">{endpoint.url}</p>
        <p className="mt-1 text-xs text-ink-soft">{endpoint.notes}</p>
      </div>
      <CopyButton value={endpoint.url} />
    </div>
  );
}

type QuizState =
  | { kind: 'idle' }
  | { kind: 'active'; pool: GlossaryEntry[]; index: number; score: number; lastPicked: number | null; answered: boolean };

function QuizTab() {
  const [state, setState] = useState<QuizState>({ kind: 'idle' });
  const [poolSize, setPoolSize] = useState(10);

  function start() {
    const pool = [...GLOSSARY]
      .map((e) => ({ e, k: Math.random() }))
      .sort((a, b) => a.k - b.k)
      .slice(0, Math.min(poolSize, GLOSSARY.length))
      .map((x) => x.e);
    setState({ kind: 'active', pool, index: 0, score: 0, lastPicked: null, answered: false });
  }

  function reset() {
    setState({ kind: 'idle' });
  }

  if (state.kind === 'idle') {
    return (
      <Card>
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-accent" />
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-ink">Flashcard quiz</p>
            <p className="mt-1 text-sm text-ink-soft">
              Read the short definition, pick the matching term. Get it right to bank the card and move on.
              Pulled from the same glossary the search tab uses — works fully offline.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-end gap-3">
          <div>
            <FieldLabel htmlFor="pool">Cards</FieldLabel>
            <input
              id="pool"
              type="number"
              min={1}
              max={GLOSSARY.length}
              value={poolSize}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isFinite(n) && n > 0) setPoolSize(Math.min(GLOSSARY.length, Math.floor(n)));
              }}
              className="field w-24 tnum"
            />
          </div>
          <Button onClick={start}>
            <Shuffle className="h-4 w-4" />
            Start quiz
          </Button>
          <p className="text-xs text-ink-soft">Glossary has {GLOSSARY.length} entries.</p>
        </div>
      </Card>
    );
  }

  if (state.kind !== 'active' || !state.pool[state.index]) {
    return (
      <Card>
        <p className="font-display text-2xl font-bold text-ink">Quiz done</p>
        <p className="mt-1 text-sm text-ink-soft">
          You scored {state.score} / {state.pool.length}.
        </p>
        <div className="mt-4 flex gap-2">
          <Button onClick={start}>
            <Shuffle className="h-4 w-4" />
            New round
          </Button>
          <Button variant="ghost" onClick={reset}>
            Back
          </Button>
        </div>
      </Card>
    );
  }

  const card = state.pool[state.index];
  const answered = state.answered;

  const distractors: GlossaryEntry[] = (() => {
    if (answered) return [];
    const set = new Set<string>([card.term]);
    const out: GlossaryEntry[] = [];
    const pool = GLOSSARY.filter((e) => e.term !== card.term);
    while (out.length < 3 && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      const pick = pool[idx] as GlossaryEntry;
      if (!set.has(pick.term)) {
        out.push(pick);
        set.add(pick.term);
      }
      pool.splice(idx, 1);
    }
    return [...out, card].sort(() => Math.random() - 0.5);
  })();

  function pick(idx: number) {
    if (answered) return;
    const isCorrect = distractors[idx]?.term === card.term;
    setState((s) => {
      if (s.kind !== 'active') return s;
      return {
        kind: 'active',
        pool: s.pool,
        index: s.index,
        score: s.score + (isCorrect ? 1 : 0),
        lastPicked: idx,
        answered: true,
      };
    });
  }

  function next() {
    setState((s) => {
      if (s.kind !== 'active') return s;
      return { ...s, index: s.index + 1, lastPicked: null, answered: false };
    });
  }

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-ink">Quiz in progress</p>
            <p className="mt-1 text-sm text-ink-soft tnum">
              Card {state.index + 1} / {state.pool.length} · Score {state.score}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={reset}>
              Quit
            </Button>
            <Button onClick={next}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-mist">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${((state.index + (state.answered ? 1 : 0)) / state.pool.length) * 100}%` }}
          />
        </div>
      </Card>

      <Card>
        <Badge>Definition</Badge>
        <p className="mt-3 font-display text-2xl font-bold leading-tight text-ink">{card.short}</p>
        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {distractors.map((d, idx) => {
            const picked = state.lastPicked === idx;
            const isAnswer = d.term === card.term;
            const showResult = state.answered;
            return (
              <button
                key={`${d.term}-${idx}`}
                type="button"
                onClick={() => pick(idx)}
                disabled={state.answered}
                className={
                  showResult
                    ? isAnswer
                      ? 'flex items-center justify-between rounded-xl border-2 border-positive bg-positive/10 px-4 py-3 text-left text-sm font-semibold text-ink'
                      : picked
                        ? 'flex items-center justify-between rounded-xl border-2 border-rose-400 bg-rose-50 px-4 py-3 text-left text-sm font-semibold text-ink'
                        : 'flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 text-left text-sm font-medium text-ink-soft'
                    : 'flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 text-left text-sm font-medium text-ink transition hover:border-brand-100 hover:bg-mist disabled:opacity-70'
                }
              >
                <span>{d.term}</span>
                {showResult && isAnswer && <Check className="h-4 w-4 text-positive" />}
                {showResult && picked && !isAnswer && <X className="h-4 w-4 text-rose-500" />}
              </button>
            );
          })}
        </div>
        {state.answered && (
          <div className="mt-5 rounded-xl border border-line bg-mist px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-ink-soft">Answer</p>
            <p className="mt-1 font-medium text-ink">{card.term}</p>
            <p className="mt-1 text-sm text-ink-soft">{card.body}</p>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function GlossaryPage() {
  const [tab, setTab] = useState<Tab>('glossary');

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-8 lg:py-14">
        <section className="relative overflow-hidden rounded-[1.75rem] border border-brand-700/30 bg-brand-800 px-6 py-8 text-paper shadow-[0_24px_70px_-36px_rgba(15,74,47,0.8)] sm:px-10 sm:py-10">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-accent" aria-hidden="true" />
          <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <Badge className="mb-5 bg-accent text-white">Offline reference · Sepolia ready</Badge>
              <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-paper sm:text-6xl">
                Crypto and Testnet Glossary
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-paper/80 sm:text-lg">
                Search crypto terms, check faucets and RPCs, or drill with flashcards. Content works offline;
                the live chain panel reads the Sepolia RPC this app is wired to.
              </p>
            </div>
            <div className="border-l border-paper/25 pl-5 text-sm text-paper/80 lg:mb-1">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-accent-50">
                Study deck
              </p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between border-b border-paper/15 pb-2">
                  <span>Glossary entries</span>
                  <span className="font-mono text-paper">{GLOSSARY.length}</span>
                </div>
                <div className="flex items-center justify-between border-b border-paper/15 pb-2">
                  <span>Reference modes</span>
                  <span className="font-mono text-paper">03</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Network</span>
                  <span className="font-mono text-paper">Sepolia</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap items-center gap-2 border-b border-line pb-3">
          <span className="mr-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">Open shelf</span>
          <FilterChip active={tab === 'glossary'} onClick={() => setTab('glossary')}>
            Glossary
          </FilterChip>
          <FilterChip active={tab === 'cheatsheet'} onClick={() => setTab('cheatsheet')}>
            Faucets and RPC
          </FilterChip>
          <FilterChip active={tab === 'quiz'} onClick={() => setTab('quiz')}>
            Flashcards
          </FilterChip>
        </div>

        <div className="mt-7">
          {tab === 'glossary' && <GlossaryTab />}
          {tab === 'cheatsheet' && <CheatsheetTab />}
          {tab === 'quiz' && <QuizTab />}
        </div>

        <p className="mt-12 border-t border-line pt-4 text-center text-xs text-ink-soft">
          Content is reference material only. Always verify against official docs before shipping.
        </p>
      </main>
    </div>
  );
}
