import { useEffect, useId, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { NetWorthChart, SplitChart } from "@/components/ledger/charts";
import {
  HORIZONS,
  RANGES,
  buildChart,
  buildInsights,
  categoriesFor,
  formatDay,
  hasInvestable,
  hasProperty,
  money,
  moneySigned,
  orderedAccounts,
  parseMoney,
  parsePersisted,
  previousSnapshot,
  scenarioCopy,
  slices,
  todayISO,
  totals,
  yearSnapshot,
  type Account,
  type Category,
  type Kind,
} from "@/lib/ledger/model";
import { useLedger, type NewAccountInput } from "@/lib/ledger/store";

const quiet =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-card px-4 text-sm font-medium text-ink";
const solid =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-forest px-4 text-sm font-medium text-paper disabled:opacity-40";
const field =
  "min-h-11 w-full min-w-0 rounded-xl border border-line bg-card px-3 text-base text-ink";

export function Shell() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <h1 className="font-serif text-2xl tracking-tight text-forest">Kumar K  </h1>
      <p className="mt-1 text-sm text-muted">Private net worth</p>
      <p className="mt-8 text-sm text-muted">Opening your ledger…</p>
    </main>
  );
}

export function Dashboard() {
  const accounts = useLedger((s) => s.accounts);
  const snapshots = useLedger((s) => s.snapshots);
  const goal = useLedger((s) => s.goal);
  const usingSample = useLedger((s) => s.usingSample);
  const activeDate = useLedger((s) => s.activeDate);
  const whatIf = useLedger((s) => s.whatIf);
  const range = useLedger((s) => s.range);
  const anchor = useLedger((s) => s.anchor);
  const setActiveDate = useLedger((s) => s.setActiveDate);
  const stepReading = useLedger((s) => s.stepReading);
  const setRange = useLedger((s) => s.setRange);
  const startFresh = useLedger((s) => s.startFresh);
  const loadSample = useLedger((s) => s.loadSample);
  const replaceAll = useLedger((s) => s.replaceAll);
  const addReading = useLedger((s) => s.addReading);
  const removeReading = useLedger((s) => s.removeReading);

  const active =
    snapshots.find((snap) => snap.date === activeDate) ?? snapshots[snapshots.length - 1] ?? null;
  const latest = snapshots[snapshots.length - 1] ?? null;
  const fileRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [confirmFresh, setConfirmFresh] = useState(false);
  const [draftDate, setDraftDate] = useState(anchor ?? todayISO());

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (event.key === "ArrowLeft") stepReading(-1);
      if (event.key === "ArrowRight") stepReading(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stepReading]);

  if (!active || !latest) return <Shell />;

  const figure = totals(active, accounts);
  const prev = previousSnapshot(snapshots, active.date);
  const prevNet = prev ? totals(prev, accounts).net : null;
  const delta = prevNet == null ? null : figure.net - prevNet;
  const year = yearSnapshot(snapshots, active.date);
  const yearDelta = year ? figure.net - totals(year, accounts).net : null;
  const insights = buildInsights({ accounts, snapshots, active, goal });
  const chart = buildChart({
    accounts,
    snapshots,
    range,
    whatIf,
    activeDate: active.date,
    now: anchor ? new Date(`₹{anchor}T00:00:00.000Z`) : new Date(),
  });
  const hasMoney = snapshots.some((snap) =>
    accounts.some((account) => (snap.balances[account.id] ?? 0) > 0),
  );
  const scenario = scenarioCopy({
    accounts,
    anchor: latest,
    snapshots,
    whatIf,
  });
  const activeIndex = snapshots.findIndex((snap) => snap.date === active.date);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-6 md:px-8 md:py-10">
      <header className="flex items-baseline justify-between gap-3">
        <h1 className="font-serif text-2xl tracking-tight text-forest">Kumar K </h1>
        <p className="text-sm text-muted">Private · this browser</p>
      </header>

      {usingSample && (
        <div className="flex flex-col gap-3 border-y border-line py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm text-muted">
            Sample household, so the chart has a shape. Edit any figure to make it yours. Nothing
            leaves this browser.
          </p>
          <button type="button" className={quiet} onClick={startFresh}>
            Start from zero
          </button>
        </div>
      )}

      <section aria-labelledby="net-label">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-card text-ink disabled:opacity-40"
            aria-label="Previous reading"
            disabled={activeIndex <= 0}
            onClick={() => stepReading(-1)}
          >
            <ChevronLeft className="size-5" />
          </button>
          <label className="min-w-0 flex-1 text-sm text-muted sm:flex-none">
            <span className="sr-only">Reading date</span>
            <select
              className={`₹{field} sm:w-56`}
              value={active.date}
              onChange={(event) => setActiveDate(event.target.value)}
            >
              {[...snapshots].reverse().map((snap) => (
                <option key={snap.date} value={snap.date}>
                  {formatDay(snap.date)}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-card text-ink disabled:opacity-40"
            aria-label="Next reading"
            disabled={activeIndex < 0 || activeIndex >= snapshots.length - 1}
            onClick={() => stepReading(1)}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <p id="net-label" className="mt-5 text-sm font-medium tracking-wide text-muted">
          Net worth
        </p>
        <p
          aria-live="polite"
          className={`font-serif text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl lg:text-6xl ₹{
            figure.net < 0 ? "text-copper" : "text-ink"
          }`}
        >
          {money(figure.net)}
        </p>
        <p className="mt-2 text-base">
          {delta == null || prev == null ? (
            <span className="text-muted">First reading on file.</span>
          ) : (
            <>
              <span className={delta > 0 ? "text-forest" : delta < 0 ? "text-copper" : "text-muted"}>
                {moneySigned(delta)}
              </span>
              <span className="text-muted"> since {formatDay(prev.date)}</span>
            </>
          )}
        </p>

        <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-4">
          <div className="min-w-0">
            <dt className="text-sm text-muted">Assets</dt>
            <dd className="mt-1 font-serif text-lg tabular-nums sm:text-2xl">{money(figure.assets)}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-sm text-muted">Debts</dt>
            <dd className="mt-1 font-serif text-lg tabular-nums text-copper sm:text-2xl">
              {money(figure.debts)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-sm text-muted">Versus a year</dt>
            <dd
              className={`mt-1 font-serif text-lg tabular-nums sm:text-2xl ₹{
                yearDelta == null ? "text-muted" : yearDelta < 0 ? "text-copper" : "text-forest"
              }`}
            >
              {yearDelta == null ? "—" : moneySigned(yearDelta)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-line bg-card p-4 md:p-6" aria-label="Net worth charts">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-serif text-2xl">Trajectory</h2>
          <div className="flex rounded-full border border-line bg-paper p-1" role="group" aria-label="Chart range">
            {RANGES.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={range === item}
                className={`min-h-11 rounded-full px-3 text-sm font-medium ₹{
                  range === item ? "bg-forest text-paper" : "text-ink"
                }`}
                onClick={() => setRange(item)}
              >
                {item === "ALL" ? "All" : item}
              </button>
            ))}
          </div>
        </div>

        {hasMoney ? (
          <>
            <div className="mt-4">
              <NetWorthChart
                points={chart.points}
                activeDate={active.date}
                onSelect={setActiveDate}
                scenarioOn={chart.scenarioOn}
                showPace={chart.showPace}
              />
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
              <li className="flex items-center gap-2">
                <span className="h-0.5 w-4 bg-forest" />
                Net worth
              </li>
              {chart.showPace && (
                <li className="flex items-center gap-2">
                  <span className="w-4 border-b-2 border-dashed border-muted" />
                  Recent pace
                </li>
              )}
              {chart.scenarioOn && (
                <li className="flex items-center gap-2">
                  <span className="w-4 border-b-2 border-dashed border-copper" />
                  Scenario
                </li>
              )}
            </ul>
            <h3 className="mt-6 font-serif text-xl">Assets and debts</h3>
            <div className="mt-2">
              <SplitChart points={chart.points} activeDate={active.date} onSelect={setActiveDate} />
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
              <li className="flex items-center gap-2">
                <span className="h-0.5 w-4 bg-forest" />
                Assets
              </li>
              <li className="flex items-center gap-2">
                <span className="h-0.5 w-4 bg-copper" />
                Debts
              </li>
            </ul>
            <p className="mt-3 text-sm text-muted">
              Showing {formatDay(active.date)} · {money(figure.net)}. Select a point to open that
              reading.
            </p>
          </>
        ) : (
          <p className="mt-6 max-w-md text-muted">
            Add a balance, then a second date. The line appears as soon as two readings disagree
            — or even when they don't.
          </p>
        )}
      </section>

      <section className="border-t border-line pt-6" aria-labelledby="scenario-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="scenario-title" className="font-serif text-2xl">
            Scenario
          </h2>
          {active.date !== latest.date && (
            <button type="button" className={quiet} onClick={() => setActiveDate(latest.date)}>
              Open latest reading
            </button>
          )}
        </div>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Markets move investments and retirement. Property moves homes. Extra savings stack on the
          recent pace. Forecast lines draw from {formatDay(latest.date)}.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Slider
            label="Markets"
            value={whatIf.marketPct}
            min={-40}
            max={40}
            step={1}
            suffix="%"
            disabled={!hasInvestable(accounts)}
            hint={hasInvestable(accounts) ? null : "Add an investment or retirement account."}
            onChange={(marketPct) => useLedger.getState().setWhatIf({ marketPct })}
          />
          <Slider
            label="Property"
            value={whatIf.propertyPct}
            min={-30}
            max={30}
            step={1}
            suffix="%"
            disabled={!hasProperty(accounts)}
            hint={hasProperty(accounts) ? null : "Add a property account."}
            onChange={(propertyPct) => useLedger.getState().setWhatIf({ propertyPct })}
          />
          <Slider
            label="Extra saved / month"
            value={whatIf.extraMonthly}
            min={0}
            max={5000}
            step={50}
            prefix="₹"
            onChange={(extraMonthly) => useLedger.getState().setWhatIf({ extraMonthly })}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Forecast horizon">
          {HORIZONS.map((months) => (
            <button
              key={months}
              type="button"
              aria-pressed={whatIf.horizon === months}
              className={`min-h-11 rounded-full px-4 text-sm font-medium ₹{
                whatIf.horizon === months ? "bg-forest text-paper" : "border border-line bg-card text-ink"
              }`}
              onClick={() => useLedger.getState().setHorizon(months)}
            >
              {months < 12 ? `₹{months} mo` : `₹{months / 12} yr`}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="mt-4 max-w-2xl text-base">
          {scenario}
        </p>
      </section>

      <section className="grid gap-8 border-t border-line pt-6 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-serif text-2xl">Insights</h2>
            <GoalField goal={goal} />
          </div>
          <ol className="mt-4 flex flex-col gap-4">
            {insights.map((item) => (
              <li
                key={item.id}
                className={`border-l-2 pl-4 ₹{item.tone === "down" ? "border-copper" : "border-forest"}`}
              >
                <p className="text-sm font-medium text-muted">{item.title}</p>
                <p className="mt-1">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="md:col-span-5">
          <h2 className="font-serif text-2xl">Mix</h2>
          <p className="mt-1 text-sm text-muted">As of {formatDay(active.date)}</p>
          <Mix kind="asset" accounts={accounts} balances={active.balances} />
          <Mix kind="liability" accounts={accounts} balances={active.balances} />
        </div>
      </section>

      <section id="accounts" className="grid gap-6 border-t border-line pt-6 lg:grid-cols-2">
        <AccountColumn kind="asset" date={active.date} />
        <AccountColumn kind="liability" date={active.date} />
      </section>

      <section className="rounded-2xl border border-line bg-card p-4 md:p-6">
        <h2 className="font-serif text-xl">Readings</h2>
        <p className="mt-1 text-sm text-muted">
          A new reading copies the open balances. Change them to record what moved.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm text-muted sm:w-56">
            <span className="sr-only">New reading date</span>
            <input
              type="date"
              max="2099-12-31"
              value={draftDate}
              onChange={(event) => setDraftDate(event.target.value)}
              className={field}
            />
          </label>
          <button
            type="button"
            className={solid}
            onClick={() => {
              if (draftDate) addReading(draftDate);
            }}
          >
            {snapshots.some((snap) => snap.date === draftDate) ? "Open reading" : "Add reading"}
          </button>
          {snapshots.length > 1 && (
            <button type="button" className={quiet} onClick={() => removeReading(active.date)}>
              Delete this reading
            </button>
          )}
        </div>
      </section>

      <details className="rounded-2xl border border-line bg-card">
        <summary className="min-h-11 px-4 py-3 text-sm font-medium md:px-6">Data on this device</summary>
        <div className="flex flex-col gap-3 px-4 pb-4 md:px-6">
          <p className="max-w-xl text-sm text-muted">
            Balances stay in this browser. Export a backup before you clear site data. Restoring
            replaces what is open now.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={quiet}
              onClick={() => {
                const state = useLedger.getState();
                const blob = new Blob(
                  [
                    JSON.stringify(
                      {
                        version: 1,
                        accounts: state.accounts,
                        snapshots: state.snapshots,
                        goal: state.goal,
                        usingSample: state.usingSample,
                        activeDate: state.activeDate,
                        whatIf: state.whatIf,
                        range: state.range,
                      },
                      null,
                      2,
                    ),
                  ],
                  { type: "application/json" },
                );
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "fathom-ledger.json";
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export backup
            </button>
            <button type="button" className={quiet} onClick={() => fileRef.current?.click()}>
              Restore backup
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  try {
                    const parsed = parsePersisted(JSON.parse(String(reader.result)));
                    if (!parsed) {
                      setImportError("That file isn't a Kumar K  backup.");
                      return;
                    }
                    setImportError(null);
                    replaceAll(parsed);
                  } catch {
                    setImportError("That file isn't a Kumar K  backup.");
                  }
                };
                reader.readAsText(file);
              }}
            />
            <button type="button" className={quiet} onClick={loadSample}>
              Load sample
            </button>
            <button
              type="button"
              className={quiet}
              onClick={() => {
                if (!confirmFresh) {
                  setConfirmFresh(true);
                  return;
                }
                setConfirmFresh(false);
                startFresh();
              }}
            >
              {confirmFresh ? "Erase everything?" : "Start over"}
            </button>
          </div>
          {importError && <p className="text-sm text-copper">{importError}</p>}
        </div>
      </details>
    </main>
  );
}

function GoalField({ goal }: { goal: number | null }) {
  const setGoal = useLedger((s) => s.setGoal);
  const [text, setText] = useState(goal == null ? "" : String(goal));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(goal == null ? "" : String(goal));
  }, [goal, focused]);
  return (
    <label className="text-sm text-muted">
      Goal
      <input
        inputMode="numeric"
        value={text}
        placeholder="Optional"
        aria-label="Net worth goal"
        onFocus={() => setFocused(true)}
        onChange={(event) => setText(event.target.value)}
        onBlur={() => {
          setFocused(false);
          if (!text.trim()) {
            setGoal(null);
            setText("");
            return;
          }
          const amount = parseMoney(text);
          if (amount == null) {
            setText(goal == null ? "" : String(goal));
            return;
          }
          setGoal(amount);
          setText(String(amount));
        }}
        className={`₹{field} mt-1 w-36`}
      />
    </label>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  prefix,
  disabled,
  hint,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  prefix?: string;
  disabled?: boolean;
  hint?: string | null;
  onChange: (value: number) => void;
}) {
  const id = useId();
  const shown = Math.min(max, Math.max(min, value));
  return (
    <div className={disabled ? "opacity-60" : undefined}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <span className="tabular-nums text-sm text-muted">
          {prefix}
          {value}
          {suffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        value={shown}
        aria-valuetext={`₹{prefix ?? ""}₹{value}₹{suffix ?? ""}`}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {hint && <p className="text-sm text-muted">{hint}</p>}
    </div>
  );
}

function Mix({
  kind,
  accounts,
  balances,
}: {
  kind: Kind;
  accounts: Account[];
  balances: Record<string, number>;
}) {
  const rows = slices({ date: "", balances }, accounts, kind);
  const heading = kind === "asset" ? "Assets" : "Debts";
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-muted">{heading}</h3>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-muted">None on this reading.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {rows.map((row, index) => (
            <li key={row.category}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span>{row.label}</span>
                <span className="tabular-nums text-muted">
                  {money(row.value)} · {Math.round(row.pct)}%
                </span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-line">
                <div
                  className={`h-2 rounded-full ₹{kind === "asset" ? "bg-forest" : "bg-copper"}`}
                  style={{ width: `₹{Math.max(2, row.pct)}%`, opacity: 1 - index * 0.14 }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AccountColumn({ kind, date }: { kind: Kind; date: string }) {
  const accounts = useLedger((s) => s.accounts);
  const rows = orderedAccounts(accounts, kind);
  const total = useLedger((s) => {
    const snap = s.snapshots.find((item) => item.date === date);
    return rows.reduce((sum, account) => sum + (snap?.balances[account.id] ?? 0), 0);
  });
  return (
    <div className="rounded-2xl border border-line bg-card p-4 md:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-serif text-2xl">{kind === "asset" ? "Assets" : "Debts"}</h2>
        <p className={`font-serif text-xl tabular-nums ₹{kind === "liability" ? "text-copper" : "text-ink"}`}>
          {money(total)}
        </p>
      </div>
      <ul className="mt-2">
        {rows.map((account) => (
          <AccountRow key={account.id} account={account} date={date} />
        ))}
      </ul>
      {rows.length === 0 && (
        <p className="mt-3 text-sm text-muted">
          {kind === "asset" ? "No assets yet." : "No debts yet."}
        </p>
      )}
      <AddAccount kind={kind} />
    </div>
  );
}

function AccountRow({ account, date }: { account: Account; date: string }) {
  const balance = useLedger(
    (s) => s.snapshots.find((snap) => snap.date === date)?.balances[account.id] ?? 0,
  );
  const updateAccount = useLedger((s) => s.updateAccount);
  const removeAccount = useLedger((s) => s.removeAccount);
  const setBalance = useLedger((s) => s.setBalance);
  const [confirm, setConfirm] = useState(false);
  return (
    <li className="border-b border-line py-3">
      <div className="flex items-center gap-2">
        <input
          aria-label={`₹{account.name} name`}
          value={account.name}
          onChange={(event) => updateAccount(account.id, { name: event.target.value })}
          onBlur={(event) => {
            if (!event.target.value.trim()) {
              updateAccount(account.id, {
                name: account.kind === "asset" ? "Untitled asset" : "Untitled debt",
              });
            }
          }}
          className={field}
        />
        <button
          type="button"
          aria-label={confirm ? `Confirm remove ₹{account.name}` : `Remove ₹{account.name}`}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted"
          onClick={() => {
            if (!confirm) {
              setConfirm(true);
              return;
            }
            removeAccount(account.id);
          }}
        >
          {confirm ? <span className="text-xs font-medium text-copper">Remove</span> : <Trash2 className="size-4" />}
        </button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <select
          aria-label={`₹{account.name} category`}
          value={account.category}
          onChange={(event) =>
            updateAccount(account.id, { category: event.target.value as Category })
          }
          className={field}
        >
          {categoriesFor(account.kind).map((meta) => (
            <option key={meta.id} value={meta.id}>
              {meta.label}
            </option>
          ))}
        </select>
        <MoneyField
          label={`₹{account.name} balance`}
          value={balance}
          onCommit={(amount) => setBalance(account.id, amount)}
        />
      </div>
      {account.kind === "liability" && <RateField account={account} />}
    </li>
  );
}

function MoneyField({
  label,
  value,
  onCommit,
}: {
  label: string;
  value: number;
  onCommit: (amount: number) => void;
}) {
  const [text, setText] = useState(String(value));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(String(value));
  }, [value, focused]);
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted">₹</span>
      <input
        aria-label={label}
        inputMode="decimal"
        value={text}
        onFocus={() => setFocused(true)}
        onChange={(event) => setText(event.target.value)}
        onBlur={() => {
          setFocused(false);
          const amount = parseMoney(text);
          if (amount == null) {
            setText(String(value));
            return;
          }
          onCommit(amount);
          setText(String(amount));
        }}
        className={`₹{field} pr-3 pl-7 text-right tabular-nums`}
      />
    </label>
  );
}

function RateField({ account }: { account: Account }) {
  const updateAccount = useLedger((s) => s.updateAccount);
  const [text, setText] = useState(account.apr == null ? "" : String(account.apr));
  useEffect(() => {
    setText(account.apr == null ? "" : String(account.apr));
  }, [account.apr, account.id]);
  return (
    <label className="mt-2 flex items-center gap-2 text-sm text-muted">
      Annual rate
      <input
        aria-label={`₹{account.name} annual rate`}
        inputMode="decimal"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={() => {
          if (!text.trim()) {
            updateAccount(account.id, { apr: null });
            setText("");
            return;
          }
          const n = Number(text);
          if (!Number.isFinite(n)) {
            setText(account.apr == null ? "" : String(account.apr));
            return;
          }
          const next = Math.round(Math.min(80, Math.max(0, n)) * 10) / 10;
          updateAccount(account.id, { apr: next });
          setText(String(next));
        }}
        className="min-h-11 w-24 rounded-xl border border-line bg-paper px-3 tabular-nums text-ink"
      />
      <span>%</span>
    </label>
  );
}

function AddAccount({ kind }: { kind: Kind }) {
  const addAccount = useLedger((s) => s.addAccount);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>(categoriesFor(kind)[0].id);
  const [balance, setBalance] = useState("");
  const [apr, setApr] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <button type="button" className={`₹{quiet} mt-4`} onClick={() => setOpen(true)}>
        <Plus className="size-4" aria-hidden />
        Add {kind === "asset" ? "asset" : "debt"}
      </button>
    );
  }

  const submit = () => {
    if (!name.trim()) {
      setError("Name it first.");
      return;
    }
    const amount = parseMoney(balance);
    if (amount == null) {
      setError("Enter a balance of zero or more.");
      return;
    }
    let rate: number | null = null;
    if (kind === "liability" && apr.trim()) {
      const n = Number(apr);
      if (!Number.isFinite(n) || n < 0 || n > 80) {
        setError("Rate should be between 0 and 80.");
        return;
      }
      rate = Math.round(n * 10) / 10;
    }
    const input: NewAccountInput = { name, kind, category, apr: rate, balance: amount };
    addAccount(input);
    setName("");
    setBalance("");
    setApr("");
    setError(null);
    setOpen(false);
  };

  return (
    <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
      <input
        aria-label={kind === "asset" ? "New asset name" : "New debt name"}
        placeholder="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className={field}
      />
      <div className="grid grid-cols-2 gap-2">
        <select
          aria-label="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value as Category)}
          className={field}
        >
          {categoriesFor(kind).map((meta) => (
            <option key={meta.id} value={meta.id}>
              {meta.label}
            </option>
          ))}
        </select>
        <input
          aria-label="Starting balance"
          inputMode="decimal"
          placeholder="Balance"
          value={balance}
          onChange={(event) => setBalance(event.target.value)}
          className={field}
        />
      </div>
      {kind === "liability" && (
        <input
          aria-label="Annual rate"
          inputMode="decimal"
          placeholder="Rate % optional"
          value={apr}
          onChange={(event) => setApr(event.target.value)}
          className={field}
        />
      )}
      {error && <p className="text-sm text-copper">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" className={solid} onClick={submit}>
          Save
        </button>
        <button
          type="button"
          className={quiet}
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
