export interface Case {
    id: number;
    title: string;
    address: string;
    counterparty: string; // รายละเอียดคู่สัญญา
    startDate: string;
    endDate: string;
    details: string;
    status: 'In Progress' | 'Closed' | 'Pending';
}

export const initialCases: Case[] = [
    {
        id: 1,
        title: 'สัญญาเช่าอาคารสำนักงาน A',
        address: '123 ถ.สุขุมวิท เขตวัฒนา กทม.',
        counterparty: 'บริษัท เอ บี ซี จำกัด (ผู้ให้เช่า)',
        startDate: '2025-01-01',
        endDate: '2025-12-15',
        details: 'สัญญาเช่าพื้นที่สำนักงาน ชั้น 15-16',
        status: 'In Progress',
    },
    {
        id: 2,
        title: 'สัญญาจ้างเหมาบริการ รปภ.',
        address: 'สำนักงานใหญ่',
        counterparty: 'บริษัท รักษาความปลอดภัย ดีฟอลต์ จำกัด',
        startDate: '2025-06-01',
        endDate: '2025-12-25',
        details: 'จัดจ้างพนักงานรักษาความปลอดภัย 24 ชม.',
        status: 'Pending',
    },
    {
        id: 3,
        title: 'สัญญาบริการอินเทอร์เน็ต',
        address: 'IT Department',
        counterparty: 'บริษัท ทรู คอร์ปอเรชั่น จำกัด (มหาชน)',
        startDate: '2025-01-01',
        endDate: '2026-12-31',
        details: 'Fiber Optic 1Gbps',
        status: 'In Progress',
    }
];
