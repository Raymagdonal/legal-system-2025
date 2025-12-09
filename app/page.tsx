'use client';

import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useCases } from './context/CasesContext';

export default function Dashboard() {
  const { cases } = useCases();

  // Calculate dynamic stats
  const totalContracts = cases.length;
  const inProgress = cases.filter(c => c.status === 'In Progress').length;
  // 'Pending' technically isn't 'Completed', but let's see what the user wants. 
  // Usually "Completed" is "Closed".
  // The user probably wants "Pending" to be shown somewhere too or just tracked.
  // The original static stats had: Total, In Progress, Completed.
  // Let's map: 
  // In Progress -> 'In Progress'
  // Completed -> 'Closed'
  // What about 'Pending'? The pie chart shows it.
  // Let's stick to the 3 cards pattern but make them dynamic.
  // actually, maybe we should add "Pending" as a card? 
  // The user asked to "sync".

  const closed = cases.filter(c => c.status === 'Closed').length;
  const pending = cases.filter(c => c.status === 'Pending').length;

  const dynamicStats = [
    { label: 'สัญญาทั้งหมด', value: totalContracts, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'กำลังดำเนินการ', value: inProgress, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'เสร็จสิ้น', value: closed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  // Dynamic Pie Data
  const pieData = [
    { name: 'กำลังดำเนินการ', value: inProgress, color: '#3B82F6' },
    { name: 'รอการลงนาม', value: pending, color: '#F59E0B' }, // Mapping 'Pending' to 'รอการลงนาม/ดำเนินการ'
    { name: 'เสร็จสิ้น', value: closed, color: '#10B981' },
  ].filter(d => d.value > 0); // Hide empty slices

  // Determine expiring contracts dynamically from shared context data
  const expiringContracts = cases.map(c => {
    const today = new Date('2025-12-09'); // Using fixed date as per current simulation context
    const end = new Date(c.endDate);
    const diffTime = Math.abs(end.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let isExpiring = false;
    if (end > today && diffDays <= 30) {
      isExpiring = true;
    }

    return { ...c, daysLeft: diffDays, isExpiring };
  }).filter(c => c.isExpiring).sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">ภาพรวมระบบ (Dashboard)</h1>

      {/* Alert Section for Expiring Contracts */}
      {expiringContracts.length > 0 ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-bold">แจ้งเตือนสัญญาใกล้หมดอายุ (ภายใน 30 วัน)</h3>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {expiringContracts.map((contract) => (
              <div key={contract.id} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                <div>
                  <p className="font-medium text-gray-800">{contract.title}</p>
                  <p className="text-xs text-gray-500">หมดอายุ: {contract.endDate}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${contract.daysLeft <= 7 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                  อีก {contract.daysLeft} วัน
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center text-gray-500">
          ไม่มีสัญญาที่ใกล้หมดอายุในขณะนี้
        </div>
      )}

      {/* Stats Cards - Grid adjusted to 3 columns */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {dynamicStats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="mt-2 text-3xl font-bold text-gray-800">{stat.value}</h3>
            </div>
            <div className={`rounded-full p-3 ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Area - Single Column now */}
      <div className="grid grid-cols-1">
        {/* Case Status Chart */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-gray-800">สถานะสัญญา</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
