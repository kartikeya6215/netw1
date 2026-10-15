import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ChevronLeft, i as ChevronRight, n as Trash2, r as Plus } from "../_libs/lucide-react.mjs";
import { a as Area, c as ReferenceLine, i as XAxis, l as Tooltip, n as LineChart, o as Line, r as YAxis, s as CartesianGrid, t as ComposedChart } from "../_libs/recharts+[...].mjs";
import { n as differenceInCalendarDays, t as format } from "../_libs/date-fns.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CYRiDb0Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	{
		id: "cash",
		label: "Cash",
		kind: "asset"
	},
	{
		id: "investments",
		label: "Investments",
		kind: "asset"
	},
	{
		id: "retirement",
		label: "Retirement",
		kind: "asset"
	},
	{
		id: "property",
		label: "Property",
		kind: "asset"
	},
	{
		id: "vehicle",
		label: "Vehicle",
		kind: "asset"
	},
	{
		id: "other-asset",
		label: "Other asset",
		kind: "asset"
	},
	{
		id: "credit",
		label: "Credit card",
		kind: "liability"
	},
	{
		id: "loan",
		label: "Loan",
		kind: "liability"
	},
	{
		id: "mortgage",
		label: "Mortgage",
		kind: "liability"
	},
	{
		id: "other-debt",
		label: "Other debt",
		kind: "liability"
	}
];
var RANGES = [
	"6M",
	"1Y",
	"2Y",
	"ALL"
];
var HORIZONS = [
	6,
	12,
	24,
	36
];
function todayISO(now = /* @__PURE__ */ new Date()) {
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function parseDay(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(y || 1970, (m || 1) - 1, d || 1);
}
function formatDay(iso, pattern = "MMM d, yyyy") {
	return format(parseDay(iso), pattern);
}
function money(n) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	}).format(Math.round(n));
}
function moneyCompact(n) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		notation: "compact",
		maximumFractionDigits: 1
	}).format(n);
}
function moneySigned(n) {
	const abs = money(Math.abs(n));
	if (n > 0) return `+${abs}`;
	if (n < 0) return `−${abs}`;
	return abs;
}
function percentSigned(n) {
	return `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(1)}%`;
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function categoryMeta(id) {
	return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}
function categoriesFor(kind) {
	return CATEGORIES.filter((c) => c.kind === kind);
}
function newId(prefix) {
	return `${prefix}-${crypto.randomUUID()}`;
}
function parseMoney(text) {
	const cleaned = text.replace(/[$,\s]/g, "");
	if (!cleaned) return 0;
	if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return null;
	const n = Number(cleaned);
	if (!Number.isFinite(n) || n < 0 || n > 0xe8d4a51000) return null;
	return Math.round(n);
}
function roundMoney(n) {
	return Math.max(0, Math.round(n));
}
function shockFactor(i) {
	if (i < 9 || i > 15) return 1;
	return 1 - .18 * Math.sin((i - 9) / 6 * Math.PI);
}
function buildSample(now = /* @__PURE__ */ new Date()) {
	const accounts = [
		{
			id: "chk",
			name: "Everyday checking",
			kind: "asset",
			category: "cash",
			apr: null
		},
		{
			id: "hysa",
			name: "Reserve savings",
			kind: "asset",
			category: "cash",
			apr: null
		},
		{
			id: "brk",
			name: "Brokerage",
			kind: "asset",
			category: "investments",
			apr: null
		},
		{
			id: "ret",
			name: "Retirement",
			kind: "asset",
			category: "retirement",
			apr: null
		},
		{
			id: "home",
			name: "Primary home",
			kind: "asset",
			category: "property",
			apr: null
		},
		{
			id: "car",
			name: "Car",
			kind: "asset",
			category: "vehicle",
			apr: null
		},
		{
			id: "mtg",
			name: "Home mortgage",
			kind: "liability",
			category: "mortgage",
			apr: 6.25
		},
		{
			id: "stu",
			name: "Student loan",
			kind: "liability",
			category: "loan",
			apr: 4.8
		},
		{
			id: "cc",
			name: "Credit card",
			kind: "liability",
			category: "credit",
			apr: 21.9
		}
	];
	const snapshots = [];
	for (let i = 0; i < 24; i++) {
		const date = i === 23 ? todayISO(now) : todayISO(new Date(now.getFullYear(), now.getMonth() - (23 - i), 1));
		const shock = shockFactor(i);
		const trend = Math.pow(1.0065, i);
		snapshots.push({
			date,
			balances: {
				chk: roundMoney(6400 + Math.sin(i / 2) * 900 + i * 25),
				hysa: roundMoney(22e3 + i * 480),
				brk: roundMoney(78e3 * trend * shock),
				ret: roundMoney((112e3 + i * 1400) * shock),
				home: roundMoney(465e3 + i * 1100),
				car: roundMoney(24e3 * Math.pow(.987, i)),
				mtg: roundMoney(286e3 * Math.pow(.9965, i)),
				stu: roundMoney(16800 - i * 310),
				cc: roundMoney(900 + (.5 + .5 * Math.sin(i * .85)) * 1800)
			}
		});
	}
	const dedup = /* @__PURE__ */ new Map();
	for (const snap of snapshots) dedup.set(snap.date, snap);
	return {
		accounts,
		snapshots: [...dedup.values()].sort((a, b) => a.date.localeCompare(b.date)),
		goal: 55e4,
		usingSample: true
	};
}
function freshLedger(now = /* @__PURE__ */ new Date()) {
	return {
		accounts: [],
		snapshots: [{
			date: todayISO(now),
			balances: {}
		}],
		goal: null,
		usingSample: false
	};
}
function signedBalance(account, amount) {
	return account.kind === "asset" ? amount : -amount;
}
function totals(snapshot, accounts) {
	let assets = 0;
	let debts = 0;
	for (const account of accounts) {
		const amount = snapshot.balances[account.id] ?? 0;
		if (account.kind === "asset") assets += amount;
		else debts += amount;
	}
	return {
		net: assets - debts,
		assets,
		debts
	};
}
function slices(snapshot, accounts, kind) {
	const grouped = /* @__PURE__ */ new Map();
	for (const account of accounts) {
		if (account.kind !== kind) continue;
		const amount = snapshot.balances[account.id] ?? 0;
		grouped.set(account.category, (grouped.get(account.category) ?? 0) + amount);
	}
	const rows = categoriesFor(kind).map((meta) => ({
		category: meta.id,
		label: meta.label,
		kind,
		value: grouped.get(meta.id) ?? 0,
		pct: 0
	})).filter((row) => row.value > 0);
	const sum = rows.reduce((acc, row) => acc + row.value, 0);
	return rows.map((row) => ({
		...row,
		pct: sum > 0 ? row.value / sum * 100 : 0
	}));
}
function orderedAccounts(accounts, kind) {
	const rank = new Map(CATEGORIES.map((c, i) => [c.id, i]));
	return accounts.map((account, index) => ({
		account,
		index
	})).filter(({ account }) => account.kind === kind).sort((a, b) => (rank.get(a.account.category) ?? 0) - (rank.get(b.account.category) ?? 0) || a.index - b.index).map(({ account }) => account);
}
function previousSnapshot(snapshots, date) {
	const index = snapshots.findIndex((s) => s.date === date);
	if (index <= 0) return null;
	return snapshots[index - 1] ?? null;
}
function resolveActiveDate(snapshots, activeDate) {
	if (activeDate && snapshots.some((s) => s.date === activeDate)) return activeDate;
	return snapshots[snapshots.length - 1]?.date ?? null;
}
function closestAround(snapshots, iso, daysBack) {
	const target = parseDay(iso).getTime() - daysBack * 864e5;
	const current = parseDay(iso).getTime();
	let best = null;
	let bestDist = Infinity;
	for (const snap of snapshots) {
		const time = parseDay(snap.date).getTime();
		if (time >= current) continue;
		const dist = Math.abs(time - target);
		if (dist < bestDist) {
			best = snap;
			bestDist = dist;
		}
	}
	if (!best || bestDist > 432e7) return null;
	return best;
}
function pacePerMonth(snapshots, accounts, uptoDate) {
	const index = snapshots.findIndex((s) => s.date === uptoDate);
	if (index < 1) return null;
	const window = snapshots.slice(Math.max(0, index - 5), index + 1);
	if (window.length < 2) return null;
	const first = window[0];
	const last = window[window.length - 1];
	const days = Math.max(1, differenceInCalendarDays(parseDay(last.date), parseDay(first.date)));
	return (totals(last, accounts).net - totals(first, accounts).net) / days * 30.437;
}
function shockedNet(snapshot, accounts, whatIf) {
	let net = 0;
	for (const account of accounts) {
		let amount = snapshot.balances[account.id] ?? 0;
		if (account.kind === "asset" && (account.category === "investments" || account.category === "retirement")) amount *= 1 + whatIf.marketPct / 100;
		else if (account.kind === "asset" && account.category === "property") amount *= 1 + whatIf.propertyPct / 100;
		net += signedBalance(account, amount);
	}
	return net;
}
function hasInvestable(accounts) {
	return accounts.some((a) => a.kind === "asset" && (a.category === "investments" || a.category === "retirement"));
}
function hasProperty(accounts) {
	return accounts.some((a) => a.kind === "asset" && a.category === "property");
}
function monthsAgoISO(now, months) {
	return todayISO(new Date(now.getFullYear(), now.getMonth() - months, now.getDate()));
}
function filterRange(snapshots, range, now = /* @__PURE__ */ new Date()) {
	if (range === "ALL" || snapshots.length === 0) return snapshots;
	const cutoff = monthsAgoISO(now, range === "6M" ? 6 : range === "1Y" ? 12 : 24);
	const filtered = snapshots.filter((s) => s.date >= cutoff);
	return filtered.length > 0 ? filtered : snapshots.slice(-1);
}
function joinAnd(parts) {
	if (parts.length <= 1) return parts[0] ?? "";
	if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
	return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}
function horizonPhrase(months) {
	if (months < 18) return `${months} months`;
	const years = Math.round(months / 12);
	return years === 1 ? "1 year" : `${years} years`;
}
function etaPhrase(months) {
	if (months < 1) return "under a month";
	const rounded = Math.round(months);
	if (rounded <= 18) return rounded === 1 ? "about 1 month" : `about ${rounded} months`;
	const years = Math.round(rounded / 12);
	return years === 1 ? "about a year" : `about ${years} years`;
}
function scenarioCopy(args) {
	const { accounts, anchor, snapshots, whatIf } = args;
	if (!anchor) return "Add a reading before projecting.";
	const base = totals(anchor, accounts).net;
	const shocked = shockedNet(anchor, accounts, whatIf);
	const pace = pacePerMonth(snapshots, accounts, anchor.date);
	const endPace = base + (pace ?? 0) * whatIf.horizon;
	const endScenario = shocked + (pace ?? 0) * whatIf.horizon + whatIf.extraMonthly * whatIf.horizon;
	const levers = [];
	if (whatIf.marketPct !== 0) levers.push(`markets ${whatIf.marketPct > 0 ? "up" : "down"} ${Math.abs(whatIf.marketPct)}%`);
	if (whatIf.propertyPct !== 0) levers.push(`property ${whatIf.propertyPct > 0 ? "up" : "down"} ${Math.abs(whatIf.propertyPct)}%`);
	if (whatIf.extraMonthly > 0) levers.push(`saving an extra ${money(whatIf.extraMonthly)} a month`);
	const when = horizonPhrase(whatIf.horizon);
	if (levers.length === 0) {
		if (pace == null) return "Add another reading to sketch a pace. The sliders still show a one-time shock.";
		return `If the recent pace holds, about ${money(endPace)} in ${when}. Move a slider to bend that.`;
	}
	let sentence = `With ${joinAnd(levers)}, this reading becomes ${money(shocked)} today`;
	if (pace == null && whatIf.extraMonthly === 0) return `${sentence}.`;
	sentence += `, and about ${money(endScenario)} in ${when}`;
	if (pace != null) {
		const gap = endScenario - endPace;
		if (Math.abs(gap) >= 100) sentence += ` — ${money(Math.abs(gap))} ${gap > 0 ? "above" : "below"} the recent pace`;
	}
	return `${sentence}.`;
}
function buildInsights(args) {
	const { accounts, snapshots, active, goal } = args;
	const nowTotals = totals(active, accounts);
	const prev = previousSnapshot(snapshots, active.date);
	const insights = [];
	if (!prev) insights.push({
		id: "change",
		title: "Since last reading",
		body: "This is the only reading so far. Add an earlier date and the chart can show a change.",
		tone: "plain"
	});
	else {
		const before = totals(prev, accounts).net;
		const delta = nowTotals.net - before;
		const pct = before !== 0 ? delta / Math.abs(before) * 100 : null;
		insights.push({
			id: "change",
			title: "Since last reading",
			body: `${moneySigned(delta)}${pct == null ? "" : ` (${percentSigned(pct)})`} since ${formatDay(prev.date)}.`,
			tone: delta > 0 ? "up" : delta < 0 ? "down" : "plain"
		});
	}
	const year = closestAround(snapshots, active.date, 365);
	if (year) {
		const then = totals(year, accounts).net;
		const delta = nowTotals.net - then;
		const pct = then !== 0 ? delta / Math.abs(then) * 100 : null;
		insights.push({
			id: "year",
			title: "Past year",
			body: `${moneySigned(delta)}${pct == null ? "" : ` (${percentSigned(pct)})`} versus ${formatDay(year.date)}.`,
			tone: delta > 0 ? "up" : delta < 0 ? "down" : "plain"
		});
	}
	if (goal != null) {
		const gap = goal - nowTotals.net;
		const pace = pacePerMonth(snapshots, accounts, active.date);
		if (gap <= 0) insights.push({
			id: "goal",
			title: "Goal",
			body: `You're already ${money(Math.abs(gap))} past ${money(goal)}.`,
			tone: "up"
		});
		else if (pace != null && pace > 1) insights.push({
			id: "goal",
			title: "Goal",
			body: `${money(goal)} is ${money(gap)} away. At the recent pace, that's ${etaPhrase(gap / pace)}.`,
			tone: "plain"
		});
		else if (pace != null) insights.push({
			id: "goal",
			title: "Goal",
			body: `${money(goal)} is ${money(gap)} away, and the recent pace isn't climbing toward it.`,
			tone: "down"
		});
		else insights.push({
			id: "goal",
			title: "Goal",
			body: `${money(goal)} is ${money(gap)} away. A second reading is what turns that into a timeline.`,
			tone: "plain"
		});
	}
	if (prev) {
		let best = null;
		for (const account of accounts) {
			const delta = (active.balances[account.id] ?? 0) - (prev.balances[account.id] ?? 0);
			if (!best || Math.abs(delta) > Math.abs(best.delta)) best = {
				name: account.name,
				delta,
				kind: account.kind
			};
		}
		if (best && Math.abs(best.delta) >= 1) {
			const direction = best.delta > 0 ? "up" : "down";
			const helpful = best.kind === "asset" && best.delta > 0 || best.kind === "liability" && best.delta < 0;
			insights.push({
				id: "mover",
				title: "Largest move",
				body: `${best.name} moved the most, ${direction} ${money(Math.abs(best.delta))} since ${formatDay(prev.date, "MMM d")}.`,
				tone: helpful ? "up" : best.delta === 0 ? "plain" : "down"
			});
		}
	}
	if (nowTotals.assets > 0) {
		let top = null;
		let cash = 0;
		for (const account of accounts) {
			if (account.kind !== "asset") continue;
			const value = active.balances[account.id] ?? 0;
			if (account.category === "cash") cash += value;
			if (!top || value > top.value) top = {
				name: account.name,
				value
			};
		}
		const cashPct = cash / nowTotals.assets * 100;
		const topPct = top ? top.value / nowTotals.assets * 100 : 0;
		if (top && topPct >= 50) insights.push({
			id: "mix",
			title: "Concentration",
			body: `${top.name} is ${Math.round(topPct)}% of assets. A price change there moves almost the whole chart.`,
			tone: "plain"
		});
		else if (cashPct < 8) insights.push({
			id: "mix",
			title: "Cash",
			body: `Cash is ${money(cash)}, ${Math.round(cashPct)}% of assets. Most of this net worth isn't spendable.`,
			tone: "plain"
		});
	}
	let interest = 0;
	let topCost = null;
	for (const account of accounts) {
		if (account.kind !== "liability" || !account.apr) continue;
		const cost = (active.balances[account.id] ?? 0) * (account.apr / 100);
		interest += cost;
		if (!topCost || cost > topCost.cost) topCost = {
			name: account.name,
			cost
		};
	}
	if (interest >= 100 && topCost) insights.push({
		id: "interest",
		title: "Interest",
		body: `At the rates on file, debt costs about ${money(interest)} a year. ${topCost.name} is ${money(topCost.cost)} of that.`,
		tone: "down"
	});
	else if (nowTotals.assets > 0 && nowTotals.debts > 0) {
		const cents = Math.round(nowTotals.debts / nowTotals.assets * 100);
		insights.push({
			id: "leverage",
			title: "Leverage",
			body: `You owe ${money(nowTotals.debts)} against ${money(nowTotals.assets)} of assets — ${cents} cents of debt per dollar owned.`,
			tone: "plain"
		});
	}
	if (accounts.length === 0) return [{
		id: "empty",
		title: "Start",
		body: "Add what you own and what you owe. The chart, mix, and these notes update as the numbers change.",
		tone: "plain"
	}];
	return insights.slice(0, 5);
}
function tickFor(iso, index, isos) {
	const crowded = isos.filter((item) => item.slice(0, 7) === iso.slice(0, 7)).length > 1;
	const day = parseDay(iso);
	if (index === 0 || day.getMonth() === 0) return format(day, crowded ? "MMM d ''yy" : "MMM ''yy");
	return format(day, crowded ? "MMM d" : "MMM");
}
function buildChart(args) {
	const now = args.now ?? /* @__PURE__ */ new Date();
	const visible = filterRange(args.snapshots, args.range, now);
	const latest = args.snapshots[args.snapshots.length - 1] ?? null;
	const activeDate = resolveActiveDate(args.snapshots, args.activeDate);
	const project = Boolean(latest && activeDate === latest.date);
	const isos = visible.map((s) => s.date);
	const points = visible.map((snap, index) => {
		const figure = totals(snap, args.accounts);
		return {
			key: snap.date,
			readingDate: snap.date,
			tick: tickFor(snap.date, index, isos),
			tipTitle: formatDay(snap.date),
			net: figure.net,
			assets: figure.assets,
			debts: figure.debts,
			pace: null,
			scenario: null
		};
	});
	const scenarioOn = project && (args.whatIf.marketPct !== 0 || args.whatIf.propertyPct !== 0 || args.whatIf.extraMonthly !== 0);
	const pace = latest && project ? pacePerMonth(args.snapshots, args.accounts, latest.date) : null;
	const showPace = pace != null;
	if (latest && project && points.length > 0) {
		const anchor = points[points.length - 1];
		const base = totals(latest, args.accounts).net;
		const shocked = shockedNet(latest, args.accounts, args.whatIf);
		if (showPace) anchor.pace = base;
		if (scenarioOn) anchor.scenario = shocked;
		for (let month = 1; month <= args.whatIf.horizon; month += 1) {
			const showTick = month === args.whatIf.horizon || month % (args.whatIf.horizon > 12 ? 6 : 3) === 0;
			points.push({
				key: `future-${month}`,
				readingDate: null,
				tick: showTick ? `+${month}m` : "",
				tipTitle: `${month} month${month === 1 ? "" : "s"} out`,
				net: null,
				assets: null,
				debts: null,
				pace: showPace ? base + pace * month : null,
				scenario: scenarioOn ? shocked + (pace ?? 0) * month + args.whatIf.extraMonthly * month : null
			});
		}
	}
	return {
		points,
		scenarioOn,
		showPace
	};
}
function yDomain(values) {
	const nums = values.filter((n) => typeof n === "number" && Number.isFinite(n));
	if (nums.length === 0) return [0, 1];
	let min = Math.min(...nums);
	let max = Math.max(...nums);
	if (min === max) {
		const pad = Math.max(1e3, Math.abs(min) * .08);
		return [min - pad, max + pad];
	}
	const pad = (max - min) * .16;
	return [min - pad, max + pad];
}
var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
function isCategory(value) {
	return CATEGORIES.some((c) => c.id === value);
}
function parseAccount(raw) {
	if (!raw || typeof raw !== "object") return null;
	const item = raw;
	if (typeof item.id !== "string" || !item.id || item.id.length > 80) return null;
	if (typeof item.name !== "string") return null;
	if (item.kind !== "asset" && item.kind !== "liability") return null;
	if (typeof item.category !== "string" || !isCategory(item.category)) return null;
	if (categoryMeta(item.category).kind !== item.kind) return null;
	let apr = null;
	if (typeof item.apr === "number" && Number.isFinite(item.apr)) apr = clamp(Math.round(item.apr * 10) / 10, 0, 80);
	return {
		id: item.id,
		name: item.name.trim().slice(0, 40) || (item.kind === "asset" ? "Untitled asset" : "Untitled debt"),
		kind: item.kind,
		category: item.category,
		apr
	};
}
function parseSnapshot(raw) {
	if (!raw || typeof raw !== "object") return null;
	const item = raw;
	if (typeof item.date !== "string" || !DATE_RE.test(item.date)) return null;
	const balances = {};
	if (item.balances && typeof item.balances === "object") for (const [key, value] of Object.entries(item.balances)) {
		if (typeof value !== "number" || !Number.isFinite(value)) continue;
		balances[key] = clamp(Math.round(value), 0, 0xe8d4a51000);
	}
	return {
		date: item.date,
		balances
	};
}
function isRange(value) {
	return value === "6M" || value === "1Y" || value === "2Y" || value === "ALL";
}
function isHorizon(value) {
	return value === 6 || value === 12 || value === 24 || value === 36;
}
function sanitizeWhatIf(raw) {
	const market = typeof raw?.marketPct === "number" ? raw.marketPct : 0;
	const property = typeof raw?.propertyPct === "number" ? raw.propertyPct : 0;
	const extra = typeof raw?.extraMonthly === "number" ? raw.extraMonthly : 0;
	const horizon = typeof raw?.horizon === "number" && isHorizon(raw.horizon) ? raw.horizon : 12;
	return {
		marketPct: clamp(Math.round(market), -40, 40),
		propertyPct: clamp(Math.round(property), -30, 30),
		extraMonthly: clamp(Math.round(extra), 0, 1e5),
		horizon
	};
}
function parsePersisted(raw) {
	if (!raw || typeof raw !== "object") return null;
	const item = raw;
	if (item.version !== 1 || !Array.isArray(item.accounts) || !Array.isArray(item.snapshots)) return null;
	const accounts = [];
	for (const entry of item.accounts.slice(0, 40)) {
		const account = parseAccount(entry);
		if (account) accounts.push(account);
	}
	const ids = new Set(accounts.map((a) => a.id));
	if (ids.size !== accounts.length) return null;
	const snapshots = [];
	for (const entry of item.snapshots.slice(0, 360)) {
		const snap = parseSnapshot(entry);
		if (!snap) continue;
		const balances = {};
		for (const [id, value] of Object.entries(snap.balances)) if (ids.has(id)) balances[id] = value;
		snapshots.push({
			date: snap.date,
			balances
		});
	}
	if (snapshots.length === 0) return null;
	const dedup = /* @__PURE__ */ new Map();
	for (const snap of snapshots) dedup.set(snap.date, snap);
	const ordered = [...dedup.values()].sort((a, b) => a.date.localeCompare(b.date));
	const goal = typeof item.goal === "number" && Number.isFinite(item.goal) ? clamp(Math.round(item.goal), 0, 0xe8d4a51000) : null;
	const activeDate = typeof item.activeDate === "string" ? item.activeDate : null;
	return {
		version: 1,
		accounts,
		snapshots: ordered,
		goal,
		usingSample: item.usingSample === true,
		activeDate: resolveActiveDate(ordered, activeDate),
		whatIf: sanitizeWhatIf(item.whatIf && typeof item.whatIf === "object" ? item.whatIf : null),
		range: isRange(item.range) ? item.range : "1Y"
	};
}
function toPersisted(state) {
	return {
		version: 1,
		accounts: state.accounts,
		snapshots: state.snapshots,
		goal: state.goal,
		usingSample: state.usingSample,
		activeDate: state.activeDate,
		whatIf: state.whatIf,
		range: state.range
	};
}
function Tip({ active, payload }) {
	if (!active || !payload?.length) return null;
	const point = payload[0]?.payload;
	if (!point) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-card px-3 py-2 text-sm text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: point.tipTitle
			}),
			point.net != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 tabular-nums",
				children: ["Net ", money(point.net)]
			}),
			point.assets != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "tabular-nums text-muted",
				children: ["Assets ", money(point.assets)]
			}),
			point.debts != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "tabular-nums text-muted",
				children: ["Debts ", money(point.debts)]
			}),
			point.pace != null && point.net == null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 tabular-nums",
				children: ["Recent pace ", money(point.pace)]
			}),
			point.scenario != null && point.scenario !== point.net && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "tabular-nums text-copper",
				children: ["Scenario ", money(point.scenario)]
			})
		]
	});
}
function useBox() {
	const ref = (0, import_react.useRef)(null);
	const [size, setSize] = (0, import_react.useState)({
		w: 0,
		h: 0
	});
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const measure = () => setSize({
			w: el.clientWidth,
			h: el.clientHeight
		});
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	return {
		ref,
		size
	};
}
var axisTick = {
	fill: "var(--color-muted)",
	fontSize: 12,
	fontFamily: "Outfit, sans-serif"
};
function NetWorthChart({ points, activeDate, onSelect, scenarioOn, showPace }) {
	const { ref, size } = useBox();
	const activeKey = points.find((point) => point.readingDate === activeDate)?.key;
	const domain = yDomain(points.flatMap((point) => [
		point.net,
		point.pace,
		point.scenario
	]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "h-64 w-full min-w-0 md:h-80",
		children: size.w > 0 && size.h > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
			width: size.w,
			height: size.h,
			data: points,
			margin: {
				top: 12,
				right: 8,
				left: 0,
				bottom: 0
			},
			onClick: (state) => {
				const point = state?.activePayload?.[0]?.payload;
				if (point?.readingDate) onSelect(point.readingDate);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "netFill",
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "var(--color-forest)",
						stopOpacity: .28
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "var(--color-forest)",
						stopOpacity: .02
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					vertical: false,
					stroke: "var(--color-line)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "key",
					tickFormatter: (key) => points.find((point) => point.key === key)?.tick ?? "",
					minTickGap: 32,
					tick: axisTick,
					axisLine: false,
					tickLine: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					domain,
					width: 52,
					tickFormatter: (value) => moneyCompact(value),
					tick: axisTick,
					axisLine: false,
					tickLine: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
					content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tip, {}),
					cursor: { stroke: "var(--color-line)" },
					isAnimationActive: false
				}),
				activeKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
					x: activeKey,
					stroke: "var(--color-forest)",
					strokeOpacity: .35
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "net",
					stroke: "var(--color-forest)",
					strokeWidth: 2.25,
					fill: "url(#netFill)",
					connectNulls: false,
					dot: false,
					activeDot: {
						r: 4,
						fill: "var(--color-forest)",
						stroke: "var(--color-card)",
						strokeWidth: 2
					},
					isAnimationActive: false
				}),
				showPace && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "pace",
					stroke: "var(--color-muted)",
					strokeWidth: 1.5,
					strokeDasharray: "5 4",
					dot: false,
					connectNulls: false,
					isAnimationActive: false
				}),
				scenarioOn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "scenario",
					stroke: "var(--color-copper)",
					strokeWidth: 2,
					strokeDasharray: "5 4",
					dot: false,
					connectNulls: false,
					isAnimationActive: false
				})
			]
		})
	});
}
function SplitChart({ points, activeDate, onSelect }) {
	const { ref, size } = useBox();
	const activeKey = points.find((point) => point.readingDate === activeDate)?.key;
	const domain = yDomain(points.flatMap((point) => [point.assets, point.debts]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "h-40 w-full min-w-0 md:h-48",
		children: size.w > 0 && size.h > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
			width: size.w,
			height: size.h,
			data: points,
			margin: {
				top: 8,
				right: 8,
				left: 0,
				bottom: 0
			},
			onClick: (state) => {
				const point = state?.activePayload?.[0]?.payload;
				if (point?.readingDate) onSelect(point.readingDate);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					vertical: false,
					stroke: "var(--color-line)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "key",
					tickFormatter: (key) => points.find((point) => point.key === key)?.tick ?? "",
					minTickGap: 32,
					tick: axisTick,
					axisLine: false,
					tickLine: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					domain,
					width: 52,
					tickFormatter: (value) => moneyCompact(value),
					tick: axisTick,
					axisLine: false,
					tickLine: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
					content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tip, {}),
					cursor: { stroke: "var(--color-line)" },
					isAnimationActive: false
				}),
				activeKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
					x: activeKey,
					stroke: "var(--color-forest)",
					strokeOpacity: .35
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "assets",
					stroke: "var(--color-forest)",
					strokeWidth: 2,
					dot: false,
					connectNulls: false,
					isAnimationActive: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "debts",
					stroke: "var(--color-copper)",
					strokeWidth: 2,
					dot: false,
					connectNulls: false,
					isAnimationActive: false
				})
			]
		})
	});
}
var STORAGE_KEY = "fathom-ledger-v1";
function sampleState(now = /* @__PURE__ */ new Date()) {
	const sample = buildSample(now);
	return {
		...sample,
		activeDate: sample.snapshots[sample.snapshots.length - 1]?.date ?? null,
		whatIf: sanitizeWhatIf(null),
		range: "1Y"
	};
}
function activeDateOf(snapshots, activeDate) {
	return resolveActiveDate(snapshots, activeDate);
}
var useLedger = create((set) => ({
	...sampleState(),
	hydrated: false,
	hydrate: () => {
		if (typeof window === "undefined") return;
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (!raw) {
				set({ hydrated: true });
				return;
			}
			const parsed = parsePersisted(JSON.parse(raw));
			if (!parsed) {
				set({ hydrated: true });
				return;
			}
			set({
				...parsed,
				hydrated: true
			});
		} catch {
			set({ hydrated: true });
		}
	},
	setActiveDate: (date) => set((state) => {
		if (!state.snapshots.some((snap) => snap.date === date)) return state;
		return { activeDate: date };
	}),
	stepReading: (direction) => set((state) => {
		const current = activeDateOf(state.snapshots, state.activeDate);
		const index = state.snapshots.findIndex((snap) => snap.date === current);
		const next = state.snapshots[index + direction];
		if (!next) return state;
		return { activeDate: next.date };
	}),
	setBalance: (accountId, amount) => set((state) => {
		const date = activeDateOf(state.snapshots, state.activeDate);
		if (!date) return state;
		return {
			usingSample: false,
			snapshots: state.snapshots.map((snap) => snap.date === date ? {
				...snap,
				balances: {
					...snap.balances,
					[accountId]: amount
				}
			} : snap)
		};
	}),
	addAccount: (input) => set((state) => {
		const date = activeDateOf(state.snapshots, state.activeDate);
		const id = newId(input.kind === "asset" ? "asset" : "debt");
		const account = {
			id,
			name: input.name.trim().slice(0, 40) || (input.kind === "asset" ? "Untitled asset" : "Untitled debt"),
			kind: input.kind,
			category: input.category,
			apr: input.kind === "liability" ? input.apr : null
		};
		return {
			usingSample: false,
			accounts: [...state.accounts, account],
			snapshots: state.snapshots.map((snap) => snap.date === date ? {
				...snap,
				balances: {
					...snap.balances,
					[id]: input.balance
				}
			} : snap)
		};
	}),
	updateAccount: (id, patch) => set((state) => ({
		usingSample: false,
		accounts: state.accounts.map((account) => {
			if (account.id !== id) return account;
			const name = patch.name === void 0 ? account.name : patch.name.slice(0, 40);
			return {
				...account,
				name,
				category: patch.category ?? account.category,
				apr: account.kind === "liability" ? patch.apr === void 0 ? account.apr : patch.apr : null
			};
		})
	})),
	removeAccount: (id) => set((state) => ({
		usingSample: false,
		accounts: state.accounts.filter((account) => account.id !== id),
		snapshots: state.snapshots.map((snap) => {
			const balances = { ...snap.balances };
			delete balances[id];
			return {
				...snap,
				balances
			};
		})
	})),
	addReading: (date) => set((state) => {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return state;
		if (state.snapshots.some((snap) => snap.date === date)) return { activeDate: date };
		const sourceDate = activeDateOf(state.snapshots, state.activeDate);
		const source = state.snapshots.find((snap) => snap.date === sourceDate) ?? state.snapshots.at(-1);
		return {
			usingSample: false,
			snapshots: [...state.snapshots, {
				date,
				balances: { ...source?.balances ?? {} }
			}].sort((a, b) => a.date.localeCompare(b.date)),
			activeDate: date
		};
	}),
	removeReading: (date) => set((state) => {
		if (state.snapshots.length < 2) return state;
		const snapshots = state.snapshots.filter((snap) => snap.date !== date);
		const index = state.snapshots.findIndex((snap) => snap.date === date);
		return {
			usingSample: false,
			snapshots,
			activeDate: (snapshots[Math.max(0, index - 1)] ?? snapshots[snapshots.length - 1])?.date ?? null
		};
	}),
	setGoal: (goal) => set({
		goal,
		usingSample: false
	}),
	setWhatIf: (patch) => set((state) => ({ whatIf: sanitizeWhatIf({
		...state.whatIf,
		...patch
	}) })),
	setHorizon: (horizon) => set((state) => ({ whatIf: {
		...state.whatIf,
		horizon
	} })),
	setRange: (range) => set({ range }),
	startFresh: () => {
		const fresh = freshLedger();
		set({
			...fresh,
			activeDate: fresh.snapshots[0]?.date ?? todayISO(),
			whatIf: sanitizeWhatIf(null),
			range: "ALL",
			hydrated: true
		});
	},
	loadSample: () => {
		set({
			...sampleState(),
			hydrated: true
		});
	},
	replaceAll: (data) => set({
		...data,
		hydrated: true
	})
}));
function useLedgerPersistence() {
	(0, import_react.useEffect)(() => {
		useLedger.getState().hydrate();
		return useLedger.subscribe((state) => {
			if (!state.hydrated) return;
			try {
				const payload = toPersisted({
					version: 1,
					accounts: state.accounts,
					snapshots: state.snapshots,
					goal: state.goal,
					usingSample: state.usingSample,
					activeDate: state.activeDate,
					whatIf: state.whatIf,
					range: state.range
				});
				window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
			} catch {}
		});
	}, []);
}
var quiet = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-card px-4 text-sm font-medium text-ink";
var solid = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-forest px-4 text-sm font-medium text-paper disabled:opacity-40";
var field = "min-h-11 w-full min-w-0 rounded-xl border border-line bg-card px-3 text-base text-ink";
function Shell() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-screen max-w-6xl px-4 py-6 md:px-8 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-2xl tracking-tight text-forest",
				children: "Fathom"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Private net worth"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted",
				children: "Opening your ledger…"
			})
		]
	});
}
function Dashboard() {
	const accounts = useLedger((s) => s.accounts);
	const snapshots = useLedger((s) => s.snapshots);
	const goal = useLedger((s) => s.goal);
	const usingSample = useLedger((s) => s.usingSample);
	const activeDate = useLedger((s) => s.activeDate);
	const whatIf = useLedger((s) => s.whatIf);
	const range = useLedger((s) => s.range);
	const setActiveDate = useLedger((s) => s.setActiveDate);
	const stepReading = useLedger((s) => s.stepReading);
	const setRange = useLedger((s) => s.setRange);
	const startFresh = useLedger((s) => s.startFresh);
	const loadSample = useLedger((s) => s.loadSample);
	const replaceAll = useLedger((s) => s.replaceAll);
	const addReading = useLedger((s) => s.addReading);
	const removeReading = useLedger((s) => s.removeReading);
	const active = snapshots.find((snap) => snap.date === activeDate) ?? snapshots[snapshots.length - 1] ?? null;
	const latest = snapshots[snapshots.length - 1] ?? null;
	const fileRef = (0, import_react.useRef)(null);
	const [importError, setImportError] = (0, import_react.useState)(null);
	const [confirmFresh, setConfirmFresh] = (0, import_react.useState)(false);
	const [draftDate, setDraftDate] = (0, import_react.useState)(todayISO());
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const tag = event.target?.tagName;
			if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
			if (event.key === "ArrowLeft") stepReading(-1);
			if (event.key === "ArrowRight") stepReading(1);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [stepReading]);
	if (!active || !latest) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {});
	const figure = totals(active, accounts);
	const prev = previousSnapshot(snapshots, active.date);
	const prevNet = prev ? totals(prev, accounts).net : null;
	const delta = prevNet == null ? null : figure.net - prevNet;
	const year = closestYear(snapshots, active.date);
	const yearDelta = year ? figure.net - totals(year, accounts).net : null;
	const insights = buildInsights({
		accounts,
		snapshots,
		active,
		goal
	});
	const chart = buildChart({
		accounts,
		snapshots,
		range,
		whatIf,
		activeDate: active.date
	});
	const hasMoney = snapshots.some((snap) => accounts.some((account) => (snap.balances[account.id] ?? 0) > 0));
	const scenario = scenarioCopy({
		accounts,
		anchor: latest,
		snapshots,
		whatIf
	});
	const activeIndex = snapshots.findIndex((snap) => snap.date === active.date);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-6 md:px-8 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-2xl tracking-tight text-forest",
					children: "Fathom"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Private · this browser"
				})]
			}),
			usingSample && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 border-y border-line py-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-xl text-sm text-muted",
					children: "Sample household, so the chart has a shape. Edit any figure to make it yours. Nothing leaves this browser."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: quiet,
					onClick: startFresh,
					children: "Start from zero"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "net-label",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "inline-flex size-11 items-center justify-center rounded-full border border-line bg-card text-ink disabled:opacity-40",
								"aria-label": "Previous reading",
								disabled: activeIndex <= 0,
								onClick: () => stepReading(-1),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "min-w-0 flex-1 text-sm text-muted sm:flex-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Reading date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: `${field} sm:w-56`,
									value: active.date,
									onChange: (event) => setActiveDate(event.target.value),
									children: [...snapshots].reverse().map((snap) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: snap.date,
										children: formatDay(snap.date)
									}, snap.date))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "inline-flex size-11 items-center justify-center rounded-full border border-line bg-card text-ink disabled:opacity-40",
								"aria-label": "Next reading",
								disabled: activeIndex < 0 || activeIndex >= snapshots.length - 1,
								onClick: () => stepReading(1),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						id: "net-label",
						className: "mt-5 text-sm font-medium tracking-wide text-muted",
						children: "Net worth"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"aria-live": "polite",
						className: `font-serif text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl lg:text-6xl ${figure.net < 0 ? "text-copper" : "text-ink"}`,
						children: money(figure.net)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-base",
						children: delta == null || prev == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "First reading on file."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: delta > 0 ? "text-forest" : delta < 0 ? "text-copper" : "text-muted",
							children: moneySigned(delta)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [" since ", formatDay(prev.date)]
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 grid grid-cols-3 gap-3 border-t border-line pt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-sm text-muted",
									children: "Assets"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 font-serif text-lg tabular-nums sm:text-2xl",
									children: money(figure.assets)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-sm text-muted",
									children: "Debts"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 font-serif text-lg tabular-nums text-copper sm:text-2xl",
									children: money(figure.debts)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-sm text-muted",
									children: "Versus a year"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: `mt-1 font-serif text-lg tabular-nums sm:text-2xl ${yearDelta == null ? "text-muted" : yearDelta < 0 ? "text-copper" : "text-forest"}`,
									children: yearDelta == null ? "—" : moneySigned(yearDelta)
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-line bg-card p-4 md:p-6",
				"aria-label": "Net worth charts",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Trajectory"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex rounded-full border border-line bg-paper p-1",
						role: "group",
						"aria-label": "Chart range",
						children: RANGES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": range === item,
							className: `min-h-11 rounded-full px-3 text-sm font-medium ${range === item ? "bg-forest text-paper" : "text-ink"}`,
							onClick: () => setRange(item),
							children: item === "ALL" ? "All" : item
						}, item))
					})]
				}), hasMoney ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetWorthChart, {
							points: chart.points,
							activeDate: active.date,
							onSelect: setActiveDate,
							scenarioOn: chart.scenarioOn,
							showPace: chart.showPace
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-0.5 w-4 bg-forest" }), "Net worth"]
							}),
							chart.showPace && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 border-b-2 border-dashed border-muted" }), "Recent pace"]
							}),
							chart.scenarioOn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 border-b-2 border-dashed border-copper" }), "Scenario"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-6 font-serif text-xl",
						children: "Assets and debts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplitChart, {
							points: chart.points,
							activeDate: active.date,
							onSelect: setActiveDate
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-0.5 w-4 bg-forest" }), "Assets"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-0.5 w-4 bg-copper" }), "Debts"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted",
						children: [
							"Showing ",
							formatDay(active.date),
							" · ",
							money(figure.net),
							". Select a point to open that reading."
						]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-md text-muted",
					children: "Add a balance, then a second date. The line appears as soon as two readings disagree — or even when they don't."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border-t border-line pt-6",
				"aria-labelledby": "scenario-title",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "scenario-title",
							className: "font-serif text-2xl",
							children: "Scenario"
						}), active.date !== latest.date && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: quiet,
							onClick: () => setActiveDate(latest.date),
							children: "Open latest reading"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 max-w-2xl text-sm text-muted",
						children: [
							"Markets move investments and retirement. Property moves homes. Extra savings stack on the recent pace. Forecast lines draw from ",
							formatDay(latest.date),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								label: "Markets",
								value: whatIf.marketPct,
								min: -40,
								max: 40,
								step: 1,
								suffix: "%",
								disabled: !hasInvestable(accounts),
								hint: hasInvestable(accounts) ? null : "Add an investment or retirement account.",
								onChange: (marketPct) => useLedger.getState().setWhatIf({ marketPct })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								label: "Property",
								value: whatIf.propertyPct,
								min: -30,
								max: 30,
								step: 1,
								suffix: "%",
								disabled: !hasProperty(accounts),
								hint: hasProperty(accounts) ? null : "Add a property account.",
								onChange: (propertyPct) => useLedger.getState().setWhatIf({ propertyPct })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								label: "Extra saved / month",
								value: whatIf.extraMonthly,
								min: 0,
								max: 5e3,
								step: 50,
								prefix: "$",
								onChange: (extraMonthly) => useLedger.getState().setWhatIf({ extraMonthly })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						role: "group",
						"aria-label": "Forecast horizon",
						children: HORIZONS.map((months) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": whatIf.horizon === months,
							className: `min-h-11 rounded-full px-4 text-sm font-medium ${whatIf.horizon === months ? "bg-forest text-paper" : "border border-line bg-card text-ink"}`,
							onClick: () => useLedger.getState().setHorizon(months),
							children: months < 12 ? `${months} mo` : `${months / 12} yr`
						}, months))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"aria-live": "polite",
						className: "mt-4 max-w-2xl text-base",
						children: scenario
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-8 border-t border-line pt-6 md:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl",
							children: "Insights"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoalField, { goal })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 flex flex-col gap-4",
						children: insights.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: `border-l-2 pl-4 ${item.tone === "down" ? "border-copper" : "border-forest"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-muted",
								children: item.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1",
								children: item.body
							})]
						}, item.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl",
							children: "Mix"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: ["As of ", formatDay(active.date)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mix, {
							kind: "asset",
							accounts,
							balances: active.balances
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mix, {
							kind: "liability",
							accounts,
							balances: active.balances
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "accounts",
				className: "grid gap-6 border-t border-line pt-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountColumn, {
					kind: "asset",
					date: active.date
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountColumn, {
					kind: "liability",
					date: active.date
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-line bg-card p-4 md:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl",
						children: "Readings"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "A new reading copies the open balances. Change them to record what moved."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col gap-2 sm:flex-row sm:items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm text-muted sm:w-56",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "New reading date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									max: todayISO(),
									value: draftDate,
									onChange: (event) => setDraftDate(event.target.value),
									className: field
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: solid,
								onClick: () => {
									if (draftDate) addReading(draftDate);
								},
								children: snapshots.some((snap) => snap.date === draftDate) ? "Open reading" : "Add reading"
							}),
							snapshots.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: quiet,
								onClick: () => removeReading(active.date),
								children: "Delete this reading"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "rounded-2xl border border-line bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "min-h-11 px-4 py-3 text-sm font-medium md:px-6",
					children: "Data on this device"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 px-4 pb-4 md:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-xl text-sm text-muted",
							children: "Balances stay in this browser. Export a backup before you clear site data. Restoring replaces what is open now."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: quiet,
									onClick: () => {
										const state = useLedger.getState();
										const blob = new Blob([JSON.stringify({
											version: 1,
											accounts: state.accounts,
											snapshots: state.snapshots,
											goal: state.goal,
											usingSample: state.usingSample,
											activeDate: state.activeDate,
											whatIf: state.whatIf,
											range: state.range
										}, null, 2)], { type: "application/json" });
										const url = URL.createObjectURL(blob);
										const link = document.createElement("a");
										link.href = url;
										link.download = "fathom-ledger.json";
										link.click();
										URL.revokeObjectURL(url);
									},
									children: "Export backup"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: quiet,
									onClick: () => fileRef.current?.click(),
									children: "Restore backup"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileRef,
									type: "file",
									accept: "application/json",
									className: "sr-only",
									onChange: (event) => {
										const file = event.target.files?.[0];
										event.target.value = "";
										if (!file) return;
										const reader = new FileReader();
										reader.onload = () => {
											try {
												const parsed = parsePersisted(JSON.parse(String(reader.result)));
												if (!parsed) {
													setImportError("That file isn't a Fathom backup.");
													return;
												}
												setImportError(null);
												replaceAll(parsed);
											} catch {
												setImportError("That file isn't a Fathom backup.");
											}
										};
										reader.readAsText(file);
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: quiet,
									onClick: loadSample,
									children: "Load sample"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: quiet,
									onClick: () => {
										if (!confirmFresh) {
											setConfirmFresh(true);
											return;
										}
										setConfirmFresh(false);
										startFresh();
									},
									children: confirmFresh ? "Erase everything?" : "Start over"
								})
							]
						}),
						importError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-copper",
							children: importError
						})
					]
				})]
			})
		]
	});
}
function closestYear(snapshots, iso) {
	const target = /* @__PURE__ */ new Date(parseParts(iso).getTime() - 31536e6);
	let best = null;
	let bestDist = Infinity;
	const current = parseParts(iso).getTime();
	for (const snap of snapshots) {
		const time = parseParts(snap.date).getTime();
		if (time >= current) continue;
		const dist = Math.abs(time - target.getTime());
		if (dist < bestDist) {
			best = snap;
			bestDist = dist;
		}
	}
	if (!best || bestDist > 432e7) return null;
	return best;
}
function parseParts(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(y || 1970, (m || 1) - 1, d || 1);
}
function GoalField({ goal }) {
	const setGoal = useLedger((s) => s.setGoal);
	const [text, setText] = (0, import_react.useState)(goal == null ? "" : String(goal));
	const [focused, setFocused] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!focused) setText(goal == null ? "" : String(goal));
	}, [goal, focused]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-sm text-muted",
		children: ["Goal", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			inputMode: "numeric",
			value: text,
			placeholder: "Optional",
			"aria-label": "Net worth goal",
			onFocus: () => setFocused(true),
			onChange: (event) => setText(event.target.value),
			onBlur: () => {
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
			},
			className: `${field} mt-1 w-36`
		})]
	});
}
function Slider({ label, value, min, max, step, suffix, prefix, disabled, hint, onChange }) {
	const id = (0, import_react.useId)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: disabled ? "opacity-60" : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: id,
					className: "text-sm font-medium",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "tabular-nums text-sm text-muted",
					children: [
						prefix,
						value,
						suffix
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id,
				type: "range",
				min,
				max,
				step,
				disabled,
				value: Math.min(max, Math.max(min, value)),
				"aria-valuetext": `${prefix ?? ""}${value}${suffix ?? ""}`,
				onChange: (event) => onChange(Number(event.target.value))
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: hint
			})
		]
	});
}
function Mix({ kind, accounts, balances }) {
	const rows = slices({
		date: "",
		balances
	}, accounts, kind);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-sm font-medium text-muted",
			children: kind === "asset" ? "Assets" : "Debts"
		}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "None on this reading."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 flex flex-col gap-3",
			children: rows.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "tabular-nums text-muted",
					children: [
						money(row.value),
						" · ",
						Math.round(row.pct),
						"%"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 h-2 rounded-full bg-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `h-2 rounded-full ${kind === "asset" ? "bg-forest" : "bg-copper"}`,
					style: {
						width: `${Math.max(2, row.pct)}%`,
						opacity: 1 - index * .14
					}
				})
			})] }, row.category))
		})]
	});
}
function AccountColumn({ kind, date }) {
	const rows = orderedAccounts(useLedger((s) => s.accounts), kind);
	const total = useLedger((s) => {
		const snap = s.snapshots.find((item) => item.date === date);
		return rows.reduce((sum, account) => sum + (snap?.balances[account.id] ?? 0), 0);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-line bg-card p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: kind === "asset" ? "Assets" : "Debts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `font-serif text-xl tabular-nums ${kind === "liability" ? "text-copper" : "text-ink"}`,
					children: money(total)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2",
				children: rows.map((account) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountRow, {
					account,
					date
				}, account.id))
			}),
			rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: kind === "asset" ? "No assets yet." : "No debts yet."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddAccount, { kind })
		]
	});
}
function AccountRow({ account, date }) {
	const balance = useLedger((s) => s.snapshots.find((snap) => snap.date === date)?.balances[account.id] ?? 0);
	const updateAccount = useLedger((s) => s.updateAccount);
	const removeAccount = useLedger((s) => s.removeAccount);
	const setBalance = useLedger((s) => s.setBalance);
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "border-b border-line py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": `${account.name} name`,
					value: account.name,
					onChange: (event) => updateAccount(account.id, { name: event.target.value }),
					onBlur: (event) => {
						if (!event.target.value.trim()) updateAccount(account.id, { name: account.kind === "asset" ? "Untitled asset" : "Untitled debt" });
					},
					className: field
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": confirm ? `Confirm remove ${account.name}` : `Remove ${account.name}`,
					className: "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted",
					onClick: () => {
						if (!confirm) {
							setConfirm(true);
							return;
						}
						removeAccount(account.id);
					},
					children: confirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-copper",
						children: "Remove"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					"aria-label": `${account.name} category`,
					value: account.category,
					onChange: (event) => updateAccount(account.id, { category: event.target.value }),
					className: field,
					children: categoriesFor(account.kind).map((meta) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: meta.id,
						children: meta.label
					}, meta.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyField, {
					label: `${account.name} balance`,
					value: balance,
					onCommit: (amount) => setBalance(account.id, amount)
				})]
			}),
			account.kind === "liability" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RateField, { account })
		]
	});
}
function MoneyField({ label, value, onCommit }) {
	const [text, setText] = (0, import_react.useState)(String(value));
	const [focused, setFocused] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!focused) setText(String(value));
	}, [value, focused]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "relative block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted",
				children: "$"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": label,
				inputMode: "decimal",
				value: text,
				onFocus: () => setFocused(true),
				onChange: (event) => setText(event.target.value),
				onBlur: () => {
					setFocused(false);
					const amount = parseMoney(text);
					if (amount == null) {
						setText(String(value));
						return;
					}
					onCommit(amount);
					setText(String(amount));
				},
				className: `${field} pr-3 pl-7 text-right tabular-nums`
			})
		]
	});
}
function RateField({ account }) {
	const updateAccount = useLedger((s) => s.updateAccount);
	const [text, setText] = (0, import_react.useState)(account.apr == null ? "" : String(account.apr));
	(0, import_react.useEffect)(() => {
		setText(account.apr == null ? "" : String(account.apr));
	}, [account.apr, account.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mt-2 flex items-center gap-2 text-sm text-muted",
		children: [
			"Annual rate",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": `${account.name} annual rate`,
				inputMode: "decimal",
				value: text,
				onChange: (event) => setText(event.target.value),
				onBlur: () => {
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
				},
				className: "min-h-11 w-24 rounded-xl border border-line bg-paper px-3 tabular-nums text-ink"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "%" })
		]
	});
}
function AddAccount({ kind }) {
	const addAccount = useLedger((s) => s.addAccount);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)(categoriesFor(kind)[0].id);
	const [balance, setBalance] = (0, import_react.useState)("");
	const [apr, setApr] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	if (!open) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: `${quiet} mt-4`,
		onClick: () => setOpen(true),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
				className: "size-4",
				"aria-hidden": true
			}),
			"Add ",
			kind === "asset" ? "asset" : "debt"
		]
	});
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
		let rate = null;
		if (kind === "liability" && apr.trim()) {
			const n = Number(apr);
			if (!Number.isFinite(n) || n < 0 || n > 80) {
				setError("Rate should be between 0 and 80.");
				return;
			}
			rate = Math.round(n * 10) / 10;
		}
		addAccount({
			name,
			kind,
			category,
			apr: rate,
			balance: amount
		});
		setName("");
		setBalance("");
		setApr("");
		setError(null);
		setOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 flex flex-col gap-2 border-t border-line pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": kind === "asset" ? "New asset name" : "New debt name",
				placeholder: "Name",
				value: name,
				onChange: (event) => setName(event.target.value),
				className: field
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					"aria-label": "Category",
					value: category,
					onChange: (event) => setCategory(event.target.value),
					className: field,
					children: categoriesFor(kind).map((meta) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: meta.id,
						children: meta.label
					}, meta.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": "Starting balance",
					inputMode: "decimal",
					placeholder: "Balance",
					value: balance,
					onChange: (event) => setBalance(event.target.value),
					className: field
				})]
			}),
			kind === "liability" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": "Annual rate",
				inputMode: "decimal",
				placeholder: "Rate % optional",
				value: apr,
				onChange: (event) => setApr(event.target.value),
				className: field
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-copper",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: solid,
					onClick: submit,
					children: "Save"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: quiet,
					onClick: () => {
						setOpen(false);
						setError(null);
					},
					children: "Cancel"
				})]
			})
		]
	});
}
function Home() {
	const hydrated = useLedger((s) => s.hydrated);
	useLedgerPersistence();
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {});
}
//#endregion
export { Home as component };
