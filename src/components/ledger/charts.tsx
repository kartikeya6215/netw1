import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { money, moneyCompact, yDomain, type ChartPoint } from "@/lib/ledger/model";

interface TipProps {
  active?: boolean;
  payload?: Array<{ payload?: ChartPoint }>;
}

function Tip({ active, payload }: TipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;
  return (
    <div className="rounded-xl border border-line bg-card px-3 py-2 text-sm text-ink">
      <p className="font-medium">{point.tipTitle}</p>
      {point.net != null && <p className="mt-1 tabular-nums">Net {money(point.net)}</p>}
      {point.assets != null && <p className="tabular-nums text-muted">Assets {money(point.assets)}</p>}
      {point.debts != null && <p className="tabular-nums text-muted">Debts {money(point.debts)}</p>}
      {point.pace != null && point.net == null && (
        <p className="mt-1 tabular-nums">Recent pace {money(point.pace)}</p>
      )}
      {point.scenario != null && point.scenario !== point.net && (
        <p className="tabular-nums text-copper">Scenario {money(point.scenario)}</p>
      )}
    </div>
  );
}

const axisTick = { fill: "var(--color-muted)", fontSize: 12, fontFamily: "Outfit, sans-serif" };

interface ChartProps {
  points: ChartPoint[];
  activeDate: string | null;
  onSelect: (date: string) => void;
  scenarioOn: boolean;
  showPace: boolean;
}

function selectReading(state: unknown, onSelect: (date: string) => void) {
  const point = (state as { activePayload?: Array<{ payload?: ChartPoint }> } | null)?.activePayload?.[0]
    ?.payload;
  if (point?.readingDate) onSelect(point.readingDate);
}

export function NetWorthChart({ points, activeDate, onSelect, scenarioOn, showPace }: ChartProps) {
  const activeKey = points.find((point) => point.readingDate === activeDate)?.key;
  const domain = yDomain(points.flatMap((point) => [point.net, point.pace, point.scenario]));
  return (
    <div className="h-64 w-full min-w-0 md:h-80">
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 300, height: 240 }}>
        <ComposedChart
          data={points}
          margin={{ top: 12, right: 8, left: 0, bottom: 0 }}
          onClick={(state) => selectReading(state, onSelect)}
        >
          <defs>
            <linearGradient id="netFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-forest)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--color-forest)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--color-line)" />
          <XAxis
            dataKey="key"
            tickFormatter={(key: string) => points.find((point) => point.key === key)?.tick ?? ""}
            minTickGap={32}
            tick={axisTick}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={domain}
            width={52}
            tickFormatter={(value: number) => moneyCompact(value)}
            tick={axisTick}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<Tip />} cursor={{ stroke: "var(--color-line)" }} isAnimationActive={false} />
          {activeKey && <ReferenceLine x={activeKey} stroke="var(--color-forest)" strokeOpacity={0.35} />}
          <Area
            type="monotone"
            dataKey="net"
            stroke="var(--color-forest)"
            strokeWidth={2.25}
            fill="url(#netFill)"
            connectNulls={false}
            dot={false}
            activeDot={{ r: 4, fill: "var(--color-forest)", stroke: "var(--color-card)", strokeWidth: 2 }}
            isAnimationActive={false}
          />
          {showPace && (
            <Line
              type="monotone"
              dataKey="pace"
              stroke="var(--color-muted)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
          )}
          {scenarioOn && (
            <Line
              type="monotone"
              dataKey="scenario"
              stroke="var(--color-copper)"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SplitChart({
  points,
  activeDate,
  onSelect,
}: Pick<ChartProps, "points" | "activeDate" | "onSelect">) {
  const activeKey = points.find((point) => point.readingDate === activeDate)?.key;
  const domain = yDomain(points.flatMap((point) => [point.assets, point.debts]));
  return (
    <div className="h-40 w-full min-w-0 md:h-48">
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 300, height: 150 }}>
        <LineChart
          data={points}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          onClick={(state) => selectReading(state, onSelect)}
        >
          <CartesianGrid vertical={false} stroke="var(--color-line)" />
          <XAxis
            dataKey="key"
            tickFormatter={(key: string) => points.find((point) => point.key === key)?.tick ?? ""}
            minTickGap={32}
            tick={axisTick}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={domain}
            width={52}
            tickFormatter={(value: number) => moneyCompact(value)}
            tick={axisTick}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<Tip />} cursor={{ stroke: "var(--color-line)" }} isAnimationActive={false} />
          {activeKey && <ReferenceLine x={activeKey} stroke="var(--color-forest)" strokeOpacity={0.35} />}
          <Line
            type="monotone"
            dataKey="assets"
            stroke="var(--color-forest)"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="debts"
            stroke="var(--color-copper)"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
