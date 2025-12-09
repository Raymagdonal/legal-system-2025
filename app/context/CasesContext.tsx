'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialCases, Case } from '../lib/data';

interface CasesContextType {
    cases: Case[];
    addCase: (newCase: Case) => void;
    updateCase: (updatedCase: Case) => void;
    deleteCase: (id: number) => void;
}

const CasesContext = createContext<CasesContextType | undefined>(undefined);

export function CasesProvider({ children }: { children: React.ReactNode }) {
    const [cases, setCases] = useState<Case[]>([]);

    // Load from LocalStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('legal-cases');
        if (saved) {
            try {
                setCases(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse cases', e);
                setCases(initialCases);
            }
        } else {
            setCases(initialCases);
        }
    }, []);

    // Save to LocalStorage whenever cases change
    useEffect(() => {
        if (cases.length > 0) {
            localStorage.setItem('legal-cases', JSON.stringify(cases));
        }
    }, [cases]);

    const addCase = (newCase: Case) => {
        setCases((prev) => [newCase, ...prev]);
    };

    const updateCase = (updatedCase: Case) => {
        setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
    };

    const deleteCase = (id: number) => {
        setCases((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <CasesContext.Provider value={{ cases, addCase, updateCase, deleteCase }}>
            {children}
        </CasesContext.Provider>
    );
}

export function useCases() {
    const context = useContext(CasesContext);
    if (context === undefined) {
        throw new Error('useCases must be used within a CasesProvider');
    }
    return context;
}
