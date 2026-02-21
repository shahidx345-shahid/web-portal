// ─── Dropdown Options ────────────────────────────────────────────────────────

export const TECH_STACK_OPTIONS = [
    'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte',
    'Node.js', 'Express', 'NestJS', 'FastAPI', 'Django',
    'Python', 'Go', 'Rust', 'Java', 'PHP',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
    'TypeScript', 'Tailwind CSS', 'GraphQL', 'REST API',
    'Docker', 'AWS', 'Vercel', 'Kubernetes', 'Redux',
]

export const PROJECT_CATEGORY_OPTIONS = [
    'AI', 'Web', 'Mobile', 'Backend', 'Research', 'DevOps',
]

export const PROJECT_TYPE_OPTIONS = [
    'Personal', 'Client', 'Company', 'Open Source', 'Freelance',
]

export const ARCHITECTURE_OPTIONS = [
    'Monolith', 'Microservices', 'Serverless', 'JAMstack', 'Event-Driven', 'MVC', 'Hexagonal',
]

export const DEPLOYMENT_OPTIONS = [
    'AWS', 'Vercel', 'Heroku', 'Docker', 'GCP', 'Azure', 'Railway', 'Netlify', 'Fly.io',
]

export const TAGS_OPTIONS = [
    'Chatbot', 'NLP', 'Analytics', 'Dashboard', 'Payment',
    'Auth', 'Realtime', 'CMS', 'API', 'Admin Panel',
    'Machine Learning', 'Computer Vision', 'Open Source',
]

export const ROLE_OPTIONS = [
    'Full-Stack', 'Backend', 'Frontend', 'AI Engineer', 'DevOps', 'Architect', 'Mobile Developer',
]

export const METHODOLOGY_OPTIONS = [
    'Agile', 'Scrum', 'Kanban', 'Waterfall', 'XP', 'Lean',
]

export const INDUSTRY_OPTIONS = [
    'Fintech', 'E-commerce', 'Healthcare', 'SaaS', 'Education', 'Logistics',
    'Real Estate', 'Media & Entertainment', 'Government',
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
        tags: ['Chatbot', 'NLP', 'AI'],
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
        tags: ['Analytics', 'Dashboard', 'Realtime'],
    },
    {
        id: 3,
        title: 'Healthcare Records API',
        slug: 'healthcare-records-api',
        category: 'Backend',
        type: 'Company',
        techStack: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
        status: 'published',
        createdAt: '2024-01-10',
        thumbnail: 'from-emerald-500 to-teal-600',
        shortDescription: 'HIPAA-compliant RESTful API for managing patient health records.',
        tags: ['API', 'Auth'],
    },
    {
        id: 4,
        title: 'Mobile Banking App UI',
        slug: 'mobile-banking-app-ui',
        category: 'Mobile',
        type: 'Freelance',
        techStack: ['React', 'Firebase', 'TypeScript'],
        status: 'draft',
        createdAt: '2024-02-03',
        thumbnail: 'from-amber-500 to-orange-600',
        shortDescription: 'Fintech mobile application UI with biometric login and payment flows.',
        tags: ['Payment', 'Auth'],
    },
    {
        id: 5,
        title: 'ML Model Training Pipeline',
        slug: 'ml-model-training-pipeline',
        category: 'Research',
        type: 'Personal',
        techStack: ['Python', 'Django', 'MongoDB'],
        status: 'draft',
        createdAt: '2024-02-08',
        thumbnail: 'from-rose-500 to-pink-600',
        shortDescription: 'Automated ML pipeline for training and deploying NLP classification models.',
        tags: ['NLP', 'Machine Learning'],
    },
    {
        id: 6,
        title: 'SaaS Admin Panel Template',
        slug: 'saas-admin-panel-template',
        category: 'Web',
        type: 'Open Source',
        techStack: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Firebase'],
        status: 'archived',
        createdAt: '2023-12-20',
        thumbnail: 'from-slate-500 to-gray-700',
        shortDescription: 'Production-ready admin panel boilerplate for B2B SaaS applications.',
        tags: ['Admin Panel', 'Dashboard', 'CMS'],
    },
]
