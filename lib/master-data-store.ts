'use client'

/**
 * Senior UI Engineer Note:
 * This store centralizes all "Product Taxonomy" and "System Constants".
 * By moving these out of hardcoded arrays and into a manageable state,
 * we enable the "Master Data" UI to allow non-developers to tune the platform.
 */

export type MasterDataType =
    | 'tech_stack'
    | 'category'
    | 'tag'
    | 'architecture'
    | 'role'
    | 'hosting'
    | 'methodology'
    | 'industry'

export interface MasterDataItem {
    id: string
    name: string
    type: MasterDataType
    status: 'active' | 'inactive'
}

const DEFAULT_DATA: MasterDataItem[] = [
    // Tech Stack
    { id: 'ts-1', name: 'React', type: 'tech_stack', status: 'active' },
    { id: 'ts-2', name: 'Node.js', type: 'tech_stack', status: 'active' },
    { id: 'ts-3', name: 'Python', type: 'tech_stack', status: 'active' },
    { id: 'ts-4', name: 'MongoDB', type: 'tech_stack', status: 'active' },
    { id: 'ts-5', name: 'Next.js', type: 'tech_stack', status: 'active' },
    { id: 'ts-6', name: 'TypeScript', type: 'tech_stack', status: 'active' },

    // Categories
    { id: 'cat-1', name: 'AI', type: 'category', status: 'active' },
    { id: 'cat-2', name: 'Web', type: 'category', status: 'active' },
    { id: 'cat-3', name: 'Mobile', type: 'category', status: 'active' },
    { id: 'cat-4', name: 'Backend', type: 'category', status: 'active' },

    // Roles
    { id: 'role-1', name: 'Full-stack', type: 'role', status: 'active' },
    { id: 'role-2', name: 'Backend', type: 'role', status: 'active' },
    { id: 'role-3', name: 'Frontend', type: 'role', status: 'active' },
    { id: 'role-4', name: 'AI Engineer', type: 'role', status: 'active' },

    // Hosting
    { id: 'host-1', name: 'AWS', type: 'hosting', status: 'active' },
    { id: 'host-2', name: 'Vercel', type: 'hosting', status: 'active' },
    { id: 'host-3', name: 'Docker', type: 'hosting', status: 'active' },

    // Architecture
    { id: 'arch-1', name: 'Monolith', type: 'architecture', status: 'active' },
    { id: 'arch-2', name: 'Microservices', type: 'architecture', status: 'active' },
    { id: 'arch-3', name: 'Serverless', type: 'architecture', status: 'active' },

    // Tags
    { id: 'tag-1', name: 'SaaS', type: 'tag', status: 'active' },
    { id: 'tag-2', name: 'Automation', type: 'tag', status: 'active' },
    { id: 'tag-3', name: 'Dashboard', type: 'tag', status: 'active' },
    { id: 'tag-4', name: 'Data Viz', type: 'tag', status: 'active' },

    // Methodology
    { id: 'meth-1', name: 'Agile/Scrum', type: 'methodology', status: 'active' },
    { id: 'meth-2', name: 'Kanban', type: 'methodology', status: 'active' },
    { id: 'meth-3', name: 'Waterfall', type: 'methodology', status: 'active' },

    // Industry
    { id: 'ind-1', name: 'FinTech', type: 'industry', status: 'active' },
    { id: 'ind-2', name: 'HealthTech', type: 'industry', status: 'active' },
    { id: 'ind-3', name: 'E-commerce', type: 'industry', status: 'active' },
    { id: 'ind-4', name: 'Web3', type: 'industry', status: 'active' },
]

export function getMasterData(): MasterDataItem[] {
    if (typeof window === 'undefined') return DEFAULT_DATA
    const saved = localStorage.getItem('master_data')
    return saved ? JSON.parse(saved) : DEFAULT_DATA
}

export function saveMasterData(data: MasterDataItem[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem('master_data', JSON.stringify(data))
    // Dispatch custom event for reactivity across components
    window.dispatchEvent(new Event('master_data_updated'))
}

export function addMasterItem(name: string, type: MasterDataType) {
    const current = getMasterData()
    const exists = current.find(item => item.name.toLowerCase() === name.toLowerCase() && item.type === type)
    if (exists) return

    const newItem: MasterDataItem = {
        id: `id-${Date.now()}`,
        name,
        type,
        status: 'active'
    }
    saveMasterData([...current, newItem])
}

export function getOptionsByType(type: MasterDataType): string[] {
    return getMasterData()
        .filter(item => item.type === type && item.status === 'active')
        .map(item => item.name)
}

import { useState, useEffect } from 'react'

export function useMasterOptions(type: MasterDataType): string[] {
    // Initial state must be based on DEFAULT_DATA to match server-side rendering
    const [options, setOptions] = useState<string[]>(() =>
        DEFAULT_DATA.filter(item => item.type === type && item.status === 'active').map(item => item.name)
    )

    useEffect(() => {
        // After hydration, we sync with localStorage and listen for updates
        const syncOptions = () => setOptions(getOptionsByType(type))
        syncOptions()

        window.addEventListener('master_data_updated', syncOptions)
        return () => window.removeEventListener('master_data_updated', syncOptions)
    }, [type])

    return options
}
