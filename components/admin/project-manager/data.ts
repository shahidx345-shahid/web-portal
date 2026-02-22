import { getOptionsByType } from '@/lib/master-data-store'

/**
 * Senior UI Engineer Note:
 * We've migrated hardcoded arrays to local storage-backed dynamic lookups.
 * These getters now serve as the single source of truth for the entire Admin UI.
 */

// ─── Dropdown Options (Dynamic) ──────────────────────────────────────────────

export const TECH_STACK_OPTIONS = getOptionsByType('tech_stack')
export const PROJECT_CATEGORY_OPTIONS = getOptionsByType('category')
export const ROLE_OPTIONS = getOptionsByType('role')
export const ARCHITECTURE_OPTIONS = getOptionsByType('architecture')
export const DEPLOYMENT_OPTIONS = getOptionsByType('hosting')
export const TAGS_OPTIONS = getOptionsByType('tag')
export const METHODOLOGY_OPTIONS = getOptionsByType('methodology')
export const INDUSTRY_OPTIONS = getOptionsByType('industry')

export const PROJECT_TYPE_OPTIONS = [
    'Personal', 'Client', 'Company', 'Freelance'
]

export const STATUS_OPTIONS = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
]

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Project {
    id: number
    title: string
    slug: string
    category: string
    type: string
    techStack: string[]
    status: 'published' | 'draft' | 'archived'
    createdAt: string
    thumbnail: string
    shortDescription: string
    tags: string[]
}

// ─── Dummy Projects ──────────────────────────────────────────────────────────

export const DUMMY_PROJECTS: Project[] = [
    {
        id: 1,
        title: 'AI-Powered Customer Chatbot',
        slug: 'ai-powered-customer-chatbot',
        category: 'AI',
        type: 'Company',
        techStack: ['Python', 'FastAPI', 'React', 'MongoDB'],
        status: 'published',
        createdAt: '2024-02-15',
        thumbnail: 'from-violet-500 to-purple-700',
        shortDescription: 'An NLP-based chatbot for automated customer support with 92% accuracy.',
        tags: ['Chatbot', 'NLP'],
    },
    {
        id: 2,
        title: 'E-Commerce Analytics Dashboard',
        slug: 'ecommerce-analytics-dashboard',
        category: 'Web',
        type: 'Client',
        techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Docker'],
        status: 'published',
        createdAt: '2024-01-28',
        thumbnail: 'from-blue-500 to-cyan-600',
        shortDescription: 'Real-time analytics platform for tracking 50K+ daily transactions.',
        tags: ['Analytics', 'Dashboard'],
    },
]
