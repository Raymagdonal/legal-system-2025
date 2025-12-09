'use client';

import { useState } from 'react';
import { Plus, Trash2, Search, Pencil } from 'lucide-react';
import clsx from 'clsx';
import { Case } from '../lib/data';
import { useCases } from '../context/CasesContext';

// Helper for Status Translation
const getStatusLabel = (status: Case['status']) => {
    switch (status) {
        case 'In Progress': return 'กำลังดำเนินการ';
        case 'Closed': return 'เสร็จสิ้น';
        case 'Pending': return 'รอการดำเนินการ';
        default: return status;
    }
}

export default function CasesPage() {
    const { cases, addCase, updateCase, deleteCase } = useCases();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form State
    const [newCase, setNewCase] = useState<Partial<Case>>({
        title: '',
        address: '',
        counterparty: '',
        startDate: '',
        endDate: '',
        details: '',
        status: 'Pending',
    });

    // Handle Delete
    const handleDelete = (id: number) => {
        if (confirm('คุณแน่ใจหรือไม่ที่จะลบสัญญาฉบับนี้?')) {
            deleteCase(id);
        }
    };

    // Handle Edit
    const handleEdit = (c: Case) => {
        setEditingId(c.id);
        setNewCase(c);
        setIsModalOpen(true);
    };

    // Handle Save (Add or Update)
    const handleSave = () => {
        if (!newCase.title || !newCase.startDate || !newCase.endDate) return alert('กรุณากรอกข้อมูลสำคัญให้ครบถ้วน (ชื่อสัญญา, วันที่)');

        if (editingId) {
            // Update Existing
            updateCase({ ...newCase, id: editingId } as Case);
        } else {
            // Add New
            const caseToAdd: Case = {
                id: Date.now(),
                title: newCase.title!,
                address: newCase.address || '',
                counterparty: newCase.counterparty || '',
                startDate: newCase.startDate!,
                endDate: newCase.endDate!,
                details: newCase.details || '',
                status: (newCase.status as Case['status']) || 'Pending',
            };
            addCase(caseToAdd);
        }

        // Reset
        setIsModalOpen(false);
        setEditingId(null);
        setNewCase({ title: '', address: '', counterparty: '', startDate: '', endDate: '', details: '', status: 'Pending', });
    };

    // Handle Cancel
    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setNewCase({ title: '', address: '', counterparty: '', startDate: '', endDate: '', details: '', status: 'Pending', });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">สัญญาบริษัทเจ้าพระยาทัวร์ริสท์โบ๊ท ปี 68</h1>
                <button
                    onClick={() => { setIsModalOpen(true); setEditingId(null); setNewCase({ title: '', address: '', counterparty: '', startDate: '', endDate: '', details: '', status: 'Pending', }); }}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
                >
                    <Plus className="h-4 w-4" />
                    เพิ่มสัญญาใหม่
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
                <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="ค้นหาชื่อสัญญา..." className="w-full bg-transparent text-sm text-gray-900 outline-none" />
                </div>
            </div>

            {/* Case Table */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-800 font-medium">
                        <tr>
                            <th className="px-6 py-4">ชื่อสัญญา</th>
                            <th className="px-6 py-4">รายละเอียดคู่สัญญา</th>
                            <th className="px-6 py-4">รายละเอียด</th>
                            <th className="px-6 py-4">ระยะเวลาสัญญา</th>
                            <th className="px-6 py-4">สถานะ</th>
                            <th className="px-6 py-4 text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {cases.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                    ไม่พบข้อมูลสัญญา
                                </td>
                            </tr>
                        ) : cases.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gray-800">{c.title}</p>
                                    <p className="text-xs text-gray-400 truncate max-w-[150px]">{c.address}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-indigo-600 font-medium">{c.counterparty || '-'}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="truncate max-w-[200px] text-gray-600" title={c.details}>{c.details || '-'}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col text-xs">
                                        <span>เริ่ม: {c.startDate}</span>
                                        <span>สิ้นสุด: {c.endDate}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={clsx(
                                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                            c.status === 'In Progress' && 'bg-blue-100 text-blue-800',
                                            c.status === 'Closed' && 'bg-green-100 text-green-800',
                                            c.status === 'Pending' && 'bg-yellow-100 text-yellow-800'
                                        )}
                                    >
                                        {getStatusLabel(c.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(c)}
                                            className="rounded-lg p-2 text-indigo-500 hover:bg-indigo-50 transition"
                                            title="แก้ไข"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition"
                                            title="ลบข้อมูล"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal - Expanded Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl my-8">
                        <h2 className="mb-4 text-xl font-bold text-gray-800">
                            {editingId ? 'แก้ไขสัญญา' : 'เพิ่มสัญญาใหม่'}
                        </h2>
                        <div className="space-y-4">

                            {/* ชื่อสัญญา */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">ชื่อสัญญา *</label>
                                <input
                                    type="text"
                                    value={newCase.title}
                                    onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-indigo-500"
                                    placeholder="เช่น สัญญาเช่าอาคาร..."
                                />
                            </div>

                            {/* คู่สัญญา */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">รายละเอียดคู่สัญญา</label>
                                <input
                                    type="text"
                                    value={newCase.counterparty}
                                    onChange={(e) => setNewCase({ ...newCase, counterparty: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-indigo-500"
                                    placeholder="เช่น บริษัท ก. จำกัด..."
                                />
                            </div>

                            {/* ที่อยู่ */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">ที่อยู่</label>
                                <textarea
                                    value={newCase.address}
                                    onChange={(e) => setNewCase({ ...newCase, address: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-indigo-500"
                                    placeholder="ระบุที่อยู่..."
                                    rows={2}
                                />
                            </div>

                            {/* วันที่เริ่มต้น - สิ้นสุด */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">วันที่เริ่มต้น *</label>
                                    <input
                                        type="date"
                                        value={newCase.startDate}
                                        onChange={(e) => setNewCase({ ...newCase, startDate: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">วันที่สิ้นสุด *</label>
                                    <input
                                        type="date"
                                        value={newCase.endDate}
                                        onChange={(e) => setNewCase({ ...newCase, endDate: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* รายละเอียด */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">รายละเอียดสัญญา</label>
                                <textarea
                                    value={newCase.details}
                                    onChange={(e) => setNewCase({ ...newCase, details: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-indigo-500"
                                    placeholder="รายละเอียดเพิ่มเติม..."
                                    rows={3}
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">สถานะ</label>
                                <select
                                    value={newCase.status}
                                    onChange={(e) => setNewCase({ ...newCase, status: e.target.value as Case['status'] })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-indigo-500"
                                >
                                    <option value="Pending">รอการดำเนินการ</option>
                                    <option value="In Progress">กำลังดำเนินการ</option>
                                    <option value="Closed">เสร็จสิ้น</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={handleCancel}
                                    className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                                >
                                    {editingId ? 'บันทึกการแก้ไข' : 'บันทึก'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
