'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileSignature, Scale, Bell } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
    { name: 'ภาพรวม (Dashboard)', href: '/', icon: LayoutDashboard },
    { name: 'ระบบลงนาม (e-Signature)', href: '/esign', icon: FileSignature },
    { name: 'สัญญาบริษัทเจ้าพระยาทัวร์ริสท์โบ๊ท ปี 68', href: '/cases', icon: Scale },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col bg-[#1a1c2e] text-white">
            {/* Logo Area */}
            <div className="flex items-center gap-3 px-6 py-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <FileSignature className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold leading-none">LegalFlow</h1>
                    <p className="text-xs text-gray-400">AI Intelligent System</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                    : 'text-gray-400 hover:bg-[#252840] hover:text-white'
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Notification / Footer (Optional) */}
            <div className="p-4">
                <div className="flex items-center gap-3 rounded-xl bg-[#252840] p-4">
                    {/* Mock Profile */}
                    <div className="h-10 w-10 rounded-full bg-gray-600"></div>
                    <div className="overflow-hidden">
                        <p className="truncate text-sm font-medium">ฝ่ายนิติการ</p>
                        <p className="truncate text-xs text-gray-400">admin@company.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
