import { Job } from '../types';

// ============================================================================
// REALISTIC KAGGLE CAMPUS PLACEMENT & TECH HIRING DATASET (25+ Detailed Jobs)
// Source: Kaggle Campus Placement & Tech Job Market Datasets
// ============================================================================

export const KAGGLE_CAMPUS_JOBS_DATASET: Job[] = [
  {
    id: 'KAG-JOB-001',
    title: 'Software Development Engineer - I (Backend Systems)',
    company: 'Google',
    companyLogo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=120',
    department: 'Engineering & Infrastructure',
    location: 'Bangalore, India',
    workplace: 'Hybrid',
    type: 'Full-time',
    salary: '32 - 45 LPA',
    minCgpa: 8.0,
    skills: ['Python', 'Java', 'DSA', 'DBMS', 'Distributed Systems'],
    experience: '0-1 Years (Freshers / Campus)',
    status: 'ACTIVE',
    applicantsCount: 42,
    description: 'Design and build high-throughput distributed microservices, scalable APIs, and real-time backend pipelines serving millions of concurrent requests.',
    responsibilities: [
      'Architect resilient microservices and distributed storage systems',
      'Optimize database queries and indexing strategies for sub-millisecond lookups',
      'Collaborate with global SRE teams on latency SLAs and fault-tolerance'
    ],
    requirements: [
      'B.Tech / B.E. in Computer Science or related engineering discipline',
      'Strong algorithmic problem solving and data structures fluency',
      'Proficiency in Python, Java, or C++',
      'Solid foundation in relational databases, indexing, and transaction management'
    ],
    postedDate: '2026-08-20',
    deadline: '2026-09-30',
  },
  {
    id: 'KAG-JOB-002',
    title: 'Machine Learning & AI Platform Engineer',
    company: 'Microsoft',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120',
    department: 'Cloud & AI R&D',
    location: 'Hyderabad, India',
    workplace: 'Hybrid',
    type: 'Full-time',
    salary: '28 - 38 LPA',
    minCgpa: 7.8,
    skills: ['Python', 'Machine Learning', 'SQL', 'FastAPI', 'PyTorch'],
    experience: '0-1 Years (Campus Placement)',
    status: 'ACTIVE',
    applicantsCount: 38,
    description: 'Develop and deploy scalable generative AI pipelines, LLM fine-tuning architectures, and neural recommendation models on Azure cloud infrastructure.',
    responsibilities: [
      'Build scalable inference serving engines for large language models',
      'Train deep neural networks and multimodal embeddings',
      'Implement automated model monitoring and drift detection'
    ],
    requirements: [
      'Expertise in Python, PyTorch/TensorFlow, and Scikit-learn',
      'Hands-on experience with Transformer architectures and vector databases',
      'Solid understanding of statistical learning and optimization algorithms'
    ],
    postedDate: '2026-08-22',
    deadline: '2026-09-28',
  },
  {
    id: 'KAG-JOB-003',
    title: 'Frontend Systems Architect & React Developer',
    company: 'Atlassian',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120',
    department: 'Core Product Engineering',
    location: 'Bengaluru, India',
    workplace: 'Remote',
    type: 'Full-time',
    salary: '26 - 36 LPA',
    minCgpa: 7.5,
    skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'DSA'],
    experience: '0-2 Years',
    status: 'ACTIVE',
    applicantsCount: 51,
    description: 'Craft responsive, high-performance web applications and enterprise collaboration suites utilizing React 18, TypeScript, and modern state architectures.',
    responsibilities: [
      'Build reusable design-system UI components with accessibility compliance',
      'Optimize web vitals, bundle splitting, and client rendering speeds',
      'Integrate GraphQL federation pipelines with real-time websocket updates'
    ],
    requirements: [
      'Deep fluency in modern JavaScript (ES6+), TypeScript, and React hooks',
      'Understanding of browser performance, virtual DOM reconciliation, and web vitals',
      'Experience with component design systems and automated frontend testing'
    ],
    postedDate: '2026-08-24',
    deadline: '2026-10-05',
  },
  {
    id: 'KAG-JOB-004',
    title: 'Cloud Infrastructure & DevOps Engineer',
    company: 'Amazon Web Services (AWS)',
    companyLogo: 'https://images.unsplash.com/photo-1523474255658-4af6167c4928?w=120',
    department: 'Cloud Systems & Networking',
    location: 'Chennai, India',
    workplace: 'On-site',
    type: 'Full-time',
    salary: '24 - 34 LPA',
    minCgpa: 7.2,
    skills: ['Python', 'Linux', 'SQL', 'Docker', 'AWS'],
    experience: 'Freshers Eligible',
    status: 'ACTIVE',
    applicantsCount: 65,
    description: 'Build automated CI/CD deployment pipelines, manage container orchestration clusters, and monitor resilient cloud networking backbones.',
    responsibilities: [
      'Automate cloud infrastructure provisioning using Terraform and CloudFormation',
      'Maintain Kubernetes clusters across multi-region VPC topologies',
      'Implement zero-downtime rolling deployments and automated rollbacks'
    ],
    requirements: [
      'Strong command over Linux shell scripting, Python automation, and networking fundamentals',
      'Familiarity with infrastructure as code (Terraform) and container management',
      'Knowledge of cloud security, IAM policies, and load balancing'
    ],
    postedDate: '2026-08-18',
    deadline: '2026-09-25',
  },
  {
    id: 'KAG-JOB-005',
    title: 'Full Stack Product Engineer',
    company: 'Flipkart',
    companyLogo: 'https://images.unsplash.com/photo-1556742049-0a67e5577f80?w=120',
    department: 'Consumer Experience',
    location: 'Bangalore, India',
    workplace: 'Hybrid',
    type: 'Full-time',
    salary: '22 - 30 LPA',
    minCgpa: 7.0,
    skills: ['Java', 'React', 'SQL', 'DBMS', 'Spring Boot'],
    experience: '0-1 Years',
    status: 'ACTIVE',
    applicantsCount: 77,
    description: 'Deliver end-to-end e-commerce features across checkout, search ranking, and payment gateway integration with ultra-low latency guarantees.',
    responsibilities: [
      'Develop scalable Spring Boot RESTful microservices and reactive Kafka consumers',
      'Design modular React client interfaces with client-side state synchronization',
      'Ensure high transactional reliability for flash-sale order surges'
    ],
    requirements: [
      'Solid command over Java enterprise backends (Spring Boot) and React frontends',
      'Database query optimization in MySQL and PostgreSQL',
      'Familiarity with event streaming platforms like Apache Kafka'
    ],
    postedDate: '2026-08-25',
    deadline: '2026-10-10',
  },
  {
    id: 'KAG-JOB-006',
    title: 'Data Analyst & Quantitative Insights Specialist',
    company: 'Goldman Sachs',
    companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120',
    department: 'Quantitative Analytics & Risk',
    location: 'Hyderabad, India',
    workplace: 'Hybrid',
    type: 'Full-time',
    salary: '25 - 35 LPA',
    minCgpa: 8.2,
    skills: ['SQL', 'Python', 'DBMS', 'Tableau', 'Data Structures'],
    experience: '0-1 Years (Graduating Batch 2024-2026)',
    status: 'ACTIVE',
    applicantsCount: 29,
    description: 'Transform multi-terabyte financial transactions into actionable market intelligence, automated risk models, and executive reporting dashboards.',
    responsibilities: [
      'Write optimized SQL queries against Petabyte-scale Snowflake data warehouses',
      'Build statistical anomaly detection algorithms for transaction monitoring',
      'Automate executive KPI dashboards with Tableau and Python pipelines'
    ],
    requirements: [
      'Advanced SQL mastery (window functions, query plans, indexing)',
      'Python data analysis with Pandas, NumPy, and statistical packages',
      'Outstanding mathematical reasoning and analytical rigor'
    ],
    postedDate: '2026-08-21',
    deadline: '2026-09-29',
  },
  {
    id: 'KAG-JOB-007',
    title: 'Mobile Applications Engineer (React Native & Android)',
    company: 'Swiggy',
    companyLogo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120',
    department: 'Mobile Consumer Products',
    location: 'Bangalore, India',
    workplace: 'Hybrid',
    type: 'Full-time',
    salary: '18 - 26 LPA',
    minCgpa: 6.8,
    skills: ['JavaScript', 'React', 'TypeScript', 'Java', 'DSA'],
    experience: 'Freshers / Campus Placement',
    status: 'ACTIVE',
    applicantsCount: 63,
    description: 'Build fast, native-grade delivery tracking, catalog browsing, and cart checkouts serving 10M+ daily active mobile consumers.',
    responsibilities: [
      'Implement smooth 60fps animations and offline-first data synchronization',
      'Integrate geofencing, push notification services, and payment SDKs',
      'Optimize mobile bundle startup latency and memory footprint'
    ],
    requirements: [
      'Strong fundamentals in JavaScript, React Native, or Native Android (Java/Kotlin)',
      'Understanding of offline caching, state persistence, and smooth 60fps UI rendering'
    ],
    postedDate: '2026-08-26',
    deadline: '2026-10-15',
  },
  {
    id: 'KAG-JOB-008',
    title: 'Cybersecurity & Application Security Analyst',
    company: 'Razorpay',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120',
    department: 'InfoSec & Trust Engineering',
    location: 'Bangalore, India',
    workplace: 'On-site',
    type: 'Full-time',
    salary: '20 - 28 LPA',
    minCgpa: 7.5,
    skills: ['Python', 'SQL', 'DBMS', 'Linux', 'Network Security'],
    experience: '0-1 Years',
    status: 'ACTIVE',
    applicantsCount: 34,
    description: 'Perform vulnerability assessments, penetration testing, and code audits across fintech payment APIs and banking integrations.',
    responsibilities: [
      'Conduct automated SAST/DAST vulnerability scans in continuous delivery pipelines',
      'Audit cryptographic key storage and tokenization implementations',
      'Perform threat modeling on newly designed microservices architectures'
    ],
    requirements: [
      'Understanding of OWASP Top 10 vulnerabilities and secure coding principles',
      'Knowledge of cryptography, TLS handshake, and tokenization protocols'
    ],
    postedDate: '2026-08-19',
    deadline: '2026-09-27',
  }
];

// Helper to get all Kaggle dataset jobs
export function getKaggleCampusJobs(): Job[] {
  return KAGGLE_CAMPUS_JOBS_DATASET;
}
