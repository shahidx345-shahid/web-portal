'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const VIOLET = '#7c3aed'
const SKY = '#0ea5e9'

const visitorsData = [
  { date: 'Mon', visitors: 1200, users: 800 },
  { date: 'Tue', visitors: 1500, users: 950 },
  { date: 'Wed', visitors: 1800, users: 1100 },
  { date: 'Thu', visitors: 1400, users: 900 },
  { date: 'Fri', visitors: 2200, users: 1400 },
  { date: 'Sat', visitors: 2800, users: 1800 },
  { date: 'Sun', visitors: 2400, users: 1600 },
]

const chatRequestsData = [
  { date: 'Mon', requests: 450, responses: 420 },
  { date: 'Tue', requests: 520, responses: 490 },
  { date: 'Wed', requests: 680, responses: 640 },
  { date: 'Thu', requests: 560, responses: 520 },
  { date: 'Fri', requests: 850, responses: 800 },
  { date: 'Sat', requests: 920, responses: 880 },
  { date: 'Sun', requests: 780, responses: 740 },
]

// ── Custom Tooltip ─────────────────────────────────────────────────────────────

const DOT_COLORS: Record<string, string> = {
  visitors: VIOLET,
  users: SKY,
  requests: VIOLET,
  responses: SKY,
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-popover border border-border rounded-xl shadow-xl px-4 py-3 min-w-[140px]">
      <p className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: DOT_COLORS[entry.name] ?? entry.color }}
            />
            <span className="text-xs font-medium capitalize text-foreground/80">{entry.name}</span>
          </div>
          <span className="text-xs font-bold text-foreground tabular-nums">
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Custom Legend ──────────────────────────────────────────────────────────────

function CustomLegend({ payload }: any) {
  return (
    <div className="flex items-center justify-center gap-6 pt-3">
      {payload?.map((entry: any) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: DOT_COLORS[entry.value] ?? entry.color }}
          />
          <span className="text-xs font-semibold capitalize text-foreground/70">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

// ── Chart Card Wrapper ─────────────────────────────────────────────────────────

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border/60 bg-card shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] sm:h-[380px] w-full">
            {children}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Analytics Component ────────────────────────────────────────────────────────

export function Analytics() {
  const axisProps = {
    stroke: 'currentColor',
    className: 'text-muted-foreground',
    tick: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' },
  }

  return (
    <div className="space-y-6">
      {/* Website Visitors */}
      <ChartCard title="Website Visitors">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visitorsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
            <XAxis dataKey="date" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} />
            <Legend content={<CustomLegend />} />
            <Line
              type="monotone" dataKey="visitors"
              stroke={VIOLET} strokeWidth={2.5}
              dot={{ r: 4, fill: VIOLET, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: VIOLET, strokeWidth: 2, stroke: '#fff' }}
            />
            <Line
              type="monotone" dataKey="users"
              stroke={SKY} strokeWidth={2.5}
              dot={{ r: 4, fill: SKY, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: SKY, strokeWidth: 2, stroke: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Chat Requests */}
      <ChartCard title="Chat Requests & Responses">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chatRequestsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
            <XAxis dataKey="date" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} />
            <Legend content={<CustomLegend />} />
            <Bar dataKey="requests" fill={VIOLET} radius={[6, 6, 0, 0]} maxBarSize={40} />
            <Bar dataKey="responses" fill={SKY} radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          { label: 'Avg. Session Duration', value: '4m 32s', dot: VIOLET },
          { label: 'Bounce Rate', value: '32.5%', dot: SKY },
          { label: 'Total Page Views', value: '45.2K', dot: '#10b981' },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60 bg-card shadow-sm rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.dot }} />
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
              <p className="text-3xl font-black text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  )
}
