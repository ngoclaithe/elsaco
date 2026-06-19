'use client';

import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DashboardStats } from '@/lib/types';
import { ORDER_STATUS_LABELS, formatPrice } from '@/lib/utils/format';
import { PortalPanel } from './PortalUI';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#737373',
  CONFIRMED: '#2563eb',
  PROCESSING: '#7c3aed',
  SHIPPED: '#0891b2',
  DELIVERED: '#16a34a',
  CANCELLED: '#dc2626',
};

const CATEGORY_COLORS = ['#171717', '#404040', '#737373', '#a3a3a3', '#d4d4d4'];

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((item) => (
        <p key={item.name} style={{ color: item.color }}>
          {item.name}: {item.name === 'Revenue' ? formatPrice(item.value) : item.value}
        </p>
      ))}
    </div>
  );
}

interface DashboardChartsProps {
  stats: DashboardStats;
}

export function DashboardCharts({ stats }: DashboardChartsProps) {
  const statusData = stats.ordersByStatus.map((row) => ({
    name: ORDER_STATUS_LABELS[row.status] || row.status,
    value: row.count,
    status: row.status,
  }));

  const categoryData = stats.productsByCategory.filter((c) => c.count > 0);

  return (
    <div className="grid lg:grid-cols-3 gap-6 mb-8">
      <PortalPanel className="lg:col-span-2 p-5">
        <div className="mb-4">
          <h2 className="font-medium">Sales overview</h2>
          <p className="text-xs text-muted mt-0.5">Revenue and orders — last 7 days</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={stats.salesChart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#171717" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#171717" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#737373' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="revenue"
                tick={{ fontSize: 11, fill: '#737373' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: '#737373' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#171717"
                strokeWidth={2}
                fill="url(#revenueFill)"
              />
              <Bar
                yAxisId="orders"
                dataKey="orders"
                name="Orders"
                fill="#a3a3a3"
                radius={[4, 4, 0, 0]}
                barSize={18}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </PortalPanel>

      <PortalPanel className="p-5">
        <div className="mb-4">
          <h2 className="font-medium">Order status</h2>
          <p className="text-xs text-muted mt-0.5">All orders by fulfillment stage</p>
        </div>
        <div className="h-72">
          {statusData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted">No orders yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={2}
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] || '#737373'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e5e5e5',
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </PortalPanel>

      <PortalPanel className="lg:col-span-3 p-5">
        <div className="mb-4">
          <h2 className="font-medium">Products by category</h2>
          <p className="text-xs text-muted mt-0.5">Catalog distribution</p>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#737373' }} />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 11, fill: '#404040' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #e5e5e5',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={22}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </PortalPanel>
    </div>
  );
}
