import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Compass,
  Briefcase,
  TrendingUp,
  DollarSign,
  Award,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Layers,
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  TrendingDown,
} from 'lucide-react';

export const StudentCareerPaths: React.FC = () => {
  const { studentProfile } = useData();
  const navigate = useNavigate();

  const [selectedPathId, setSelectedPathId] = useState('path-1');

  const skills = studentProfile?.skills || {};
  const pyScore = skills['Python'] || 80;
  const dsaScore = skills['DSA'] || 80;
  const sqlScore = skills['SQL'] || 80;
  const reactScore = skills['React'] || 80;
  const javaScore = skills['Java'] || 80;
  const dbmsScore = skills['DBMS'] || 80;

  const careerPaths = [
    {
      id: 'path-1',
      title: 'Full Stack & Cloud Systems Architect',
      readiness: Math.min(99, Math.round((reactScore * 0.35 + dsaScore * 0.35 + sqlScore * 0.3))),
      targetSkill: 'React',
      avgStartingSalary: '16 - 22 LPA',
      seniorSalary: '45 - 65 LPA',
      demandLevel: 'Ultra High',
      summary: 'Architects end-to-end cloud platforms with reactive TypeScript frontends and high-concurrency microservices.',
      milestones: [
        {
          level: 'Stage 1: Campus Entry (0-2 Yrs)',
          role: 'Associate Software Engineer (SDE-1)',
          salary: '14 - 18 LPA',
          skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'DSA'],
          status: 'COMPLETED',
        },
        {
          level: 'Stage 2: Senior Engineer (2-5 Yrs)',
          role: 'Senior Full Stack SDE-2',
          salary: '24 - 36 LPA',
          skills: ['GraphQL', 'Redis', 'Microservices', 'Kafka', 'System Design'],
          status: 'CURRENT_TARGET',
        },
        {
          level: 'Stage 3: Lead / Staff (5+ Yrs)',
          role: 'Principal Systems Architect',
          salary: '45 - 60 LPA',
          skills: ['Multi-region Cloud Infra', 'High Availability', 'Architecture Governance'],
          status: 'FUTURE',
        },
      ],
      recommendedCertifications: [
        'AWS Certified Solutions Architect Associate',
        'Meta Front-End Developer Professional',
      ],
      targetCompanies: ['Google', 'Microsoft', 'TechNova', 'Uber', 'Atlassian'],
    },
    {
      id: 'path-2',
      title: 'Machine Learning & AI Systems Engineer',
      readiness: Math.min(99, Math.round((pyScore * 0.4 + dsaScore * 0.35 + dbmsScore * 0.25))),
      targetSkill: 'Python',
      avgStartingSalary: '18 - 26 LPA',
      seniorSalary: '50 - 75 LPA',
      demandLevel: 'Ultra High',
      summary: 'Focuses on deep neural networks, transformer models, inference pipelines, and distributed vector embeddings.',
      milestones: [
        {
          level: 'Stage 1: Campus Entry (0-2 Yrs)',
          role: 'Junior ML / Data Scientist',
          salary: '18 - 24 LPA',
          skills: ['Python', 'SQL', 'FastAPI', 'PyTorch', 'Pandas'],
          status: 'COMPLETED',
        },
        {
          level: 'Stage 2: Mid-Senior (2-5 Yrs)',
          role: 'Senior AI / MLOps Engineer',
          salary: '28 - 38 LPA',
          skills: ['MLOps', 'Kubeflow', 'Distributed Training', 'Docker', 'CUDA'],
          status: 'CURRENT_TARGET',
        },
        {
          level: 'Stage 3: Staff / Principal (5+ Yrs)',
          role: 'Principal AI Systems Architect',
          salary: '50 - 75 LPA',
          skills: ['Distributed Model Partitioning', 'System Design', 'Team Leadership'],
          status: 'FUTURE',
        },
      ],
      recommendedCertifications: [
        'AWS Certified Machine Learning - Specialty',
        'DeepLearning.AI Generative AI for Large Language Models',
      ],
      targetCompanies: ['Google DeepMind', 'Meta AI', 'EcoFin AI', 'OpenAI', 'Amazon Web Services'],
    },
    {
      id: 'path-3',
      title: 'Enterprise Java & Core Platform Engineer',
      readiness: Math.min(99, Math.round((javaScore * 0.4 + dbmsScore * 0.3 + dsaScore * 0.3))),
      targetSkill: 'Java',
      avgStartingSalary: '15 - 22 LPA',
      seniorSalary: '42 - 58 LPA',
      demandLevel: 'Very High',
      summary: 'Builds enterprise banking cores, high-throughput distributed transaction engines, and multithreaded services.',
      milestones: [
        {
          level: 'Stage 1: Campus Entry (0-2 Yrs)',
          role: 'Core Backend Developer (Java / Spring)',
          salary: '14 - 19 LPA',
          skills: ['Java 21', 'Spring Boot', 'PostgreSQL', 'DSA', 'JUnit'],
          status: 'COMPLETED',
        },
        {
          level: 'Stage 2: Senior Engineer (2-5 Yrs)',
          role: 'Lead Platform SDE-2',
          salary: '25 - 38 LPA',
          skills: ['Kafka Streams', 'gRPC', 'Distributed Caching', 'Kubernetes'],
          status: 'CURRENT_TARGET',
        },
        {
          level: 'Stage 3: Staff Engineer (5+ Yrs)',
          role: 'Director of Distributed Systems',
          salary: '48 - 65 LPA',
          skills: ['Fault Tolerance', 'Fintech Security', 'Global Scalability'],
          status: 'FUTURE',
        },
      ],
      recommendedCertifications: [
        'Oracle Certified Professional: Java SE Developer',
        'Spring Professional Certification',
      ],
      targetCompanies: ['Goldman Sachs', 'Morgan Stanley', 'Stripe', 'Oracle Cloud', 'SAP'],
    },
    {
      id: 'path-4',
      title: 'Data Platform & Database Architect',
      readiness: Math.min(99, Math.round((sqlScore * 0.4 + dbmsScore * 0.35 + pyScore * 0.25))),
      targetSkill: 'SQL',
      avgStartingSalary: '14 - 20 LPA',
      seniorSalary: '38 - 52 LPA',
      demandLevel: 'High',
      summary: 'Designs distributed data warehouses, streaming analytics pipelines, and ACID database replication systems.',
      milestones: [
        {
          level: 'Stage 1: Campus Entry (0-2 Yrs)',
          role: 'Associate Data / Analytics Engineer',
          salary: '13 - 17 LPA',
          skills: ['SQL', 'PostgreSQL', 'Python', 'Spark', 'Airflow'],
          status: 'COMPLETED',
        },
        {
          level: 'Stage 2: Senior Engineer (2-5 Yrs)',
          role: 'Senior Data Infrastructure SDE',
          salary: '22 - 35 LPA',
          skills: ['Snowflake', 'dbt', 'BigQuery', 'Kafka', 'Data Mesh'],
          status: 'CURRENT_TARGET',
        },
        {
          level: 'Stage 3: Staff Architect (5+ Yrs)',
          role: 'Principal Data Architect',
          salary: '42 - 58 LPA',
          skills: ['Enterprise Data Lakehouse', 'Governance', 'Real-Time Streaming'],
          status: 'FUTURE',
        },
      ],
      recommendedCertifications: [
        'Snowflake SnowPro Core Certification',
        'Google Cloud Professional Data Engineer',
      ],
      targetCompanies: ['Databricks', 'Snowflake', 'EcoFin Analytics', 'Netflix', 'Amazon'],
    },
  ];

  const activePath = careerPaths.find((p) => p.id === selectedPathId) || careerPaths[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-[#4F46E5] border border-indigo-200 text-xs font-bold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>AI Career Trajectory & Roadmap</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Strategic Placement Career Trajectories
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Real-time career roadmaps matched against your verified skills, compensation salary bands, and campus placement drives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student/skill-gaps')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
            <span>View Skill Gaps</span>
          </button>
          <button
            onClick={() => navigate('/student/jobs')}
            className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Explore Open Roles
          </button>
        </div>
      </div>

      {/* Path Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {careerPaths.map((path) => {
          const isSelected = path.id === selectedPathId;
          return (
            <div
              key={path.id}
              onClick={() => setSelectedPathId(path.id)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-[#4F46E5] bg-indigo-50/40 ring-2 ring-[#4F46E5]/30 shadow-md'
                  : 'border-[#E2E8F0] bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-wider">
                    {path.demandLevel} Demand
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-[#22C55E] border border-emerald-200">
                    {path.readiness}% Fit
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0F172A] leading-snug">{path.title}</h3>
                <p className="text-xs text-[#64748B] mt-2 line-clamp-2">{path.summary}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-[#0F172A]">
                <span>Starting CTC:</span>
                <span className="text-[#4F46E5] font-bold">{path.avgStartingSalary}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Career Path Detail Card */}
      <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#4F46E5]" />
              <h2 className="text-xl font-bold text-[#0F172A]">{activePath.title}</h2>
            </div>
            <p className="text-xs text-[#64748B] mt-1 max-w-2xl">{activePath.summary}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/student/assessment')}
              className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] text-xs font-bold rounded-xl border border-indigo-200 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Test {activePath.targetSkill} Skill</span>
            </button>
            <button
              onClick={() => navigate('/student/jobs')}
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>View Eligible Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Milestone Steps */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Progression Milestones & Compensation Band</h3>
          {activePath.milestones.map((ms) => (
            <div
              key={ms.level}
              className={`p-6 rounded-2xl border transition-all ${
                ms.status === 'CURRENT_TARGET'
                  ? 'border-[#4F46E5] bg-indigo-50/20 shadow-xs'
                  : 'border-[#E2E8F0] bg-slate-50/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    {ms.level}
                  </span>
                  <h4 className="text-base font-bold text-[#0F172A]">{ms.role}</h4>
                </div>
                <span className="text-sm font-extrabold text-[#22C55E] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {ms.salary}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs font-semibold text-[#64748B] mr-1">Required Competencies:</span>
                {ms.skills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 bg-white border border-[#E2E8F0] text-slate-800 rounded-lg text-xs font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Target Employers & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E2E8F0]">
          <div className="p-5 rounded-2xl bg-slate-50 border border-[#E2E8F0] space-y-3">
            <h4 className="text-xs font-bold text-[#0F172A] flex items-center gap-2 uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#4F46E5]" />
              Recommended Industry Certifications
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {activePath.recommendedCertifications.map((cert) => (
                <li key={cert} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-[#E2E8F0] space-y-3">
            <h4 className="text-xs font-bold text-[#0F172A] flex items-center gap-2 uppercase tracking-wider">
              <Briefcase className="w-4 h-4 text-[#4F46E5]" />
              Top Hiring Campus Recruiters
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {activePath.targetCompanies.map((comp) => (
                <span
                  key={comp}
                  className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0F172A] shadow-xs"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
