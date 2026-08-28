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
} from 'lucide-react';

export const StudentCareerPaths: React.FC = () => {
  const { studentProfile } = useData();
  const navigate = useNavigate();

  const [selectedPathId, setSelectedPathId] = useState('path-1');

  const careerPaths = [
    {
      id: 'path-1',
      title: 'Machine Learning & AI Systems Engineer',
      readiness: 88,
      avgStartingSalary: '18 - 26 LPA',
      seniorSalary: '45 - 65 LPA',
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
      targetCompanies: ['Google DeepMind', 'Meta AI', 'TechNova', 'OpenAI', 'Amazon Web Services'],
    },
    {
      id: 'path-2',
      title: 'Full Stack Distributed Systems Architect',
      readiness: 90,
      avgStartingSalary: '14 - 20 LPA',
      seniorSalary: '40 - 55 LPA',
      demandLevel: 'High',
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
      targetCompanies: ['Stripe', 'Uber', 'EcoFin Analytics', 'Microsoft', 'Atlassian'],
    },
    {
      id: 'path-3',
      title: 'Cloud DevOps & Site Reliability Engineer (SRE)',
      readiness: 76,
      avgStartingSalary: '13 - 18 LPA',
      seniorSalary: '38 - 50 LPA',
      demandLevel: 'Very High',
      summary: 'Maintains mission-critical containerized infrastructure, Kubernetes clusters, and zero-downtime CI/CD deployment pipelines.',
      milestones: [
        {
          level: 'Stage 1: Campus Entry (0-2 Yrs)',
          role: 'Cloud & Infrastructure Associate',
          salary: '12 - 16 LPA',
          skills: ['Linux', 'Docker', 'Bash', 'AWS Fundamentals', 'Terraform'],
          status: 'COMPLETED',
        },
        {
          level: 'Stage 2: Senior SRE (2-5 Yrs)',
          role: 'Senior DevOps / SRE',
          salary: '22 - 34 LPA',
          skills: ['Kubernetes (CKA)', 'Helm', 'Prometheus', 'Grafana', 'Security Hardening'],
          status: 'CURRENT_TARGET',
        },
        {
          level: 'Stage 3: Cloud Architect (5+ Yrs)',
          role: 'Director of Cloud Infrastructure',
          salary: '42 - 58 LPA',
          skills: ['Multi-Cloud Strategy', 'FinOps', 'Disaster Recovery'],
          status: 'FUTURE',
        },
      ],
      recommendedCertifications: [
        'Certified Kubernetes Administrator (CKA)',
        'HashiCorp Certified Terraform Associate',
      ],
      targetCompanies: ['Netflix', 'Globex Cloud', 'Cloudflare', 'Datadog', 'Oracle Cloud'],
    },
  ];

  const activePath = careerPaths.find((p) => p.id === selectedPathId) || careerPaths[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Career Trajectory & Growth Roadmap
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Map out progression pathways, compensation salary bands, and strategic skill milestones.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/jobs')}
          className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors"
        >
          Explore Roles in Selected Path
        </button>
      </div>

      {/* Path Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {careerPaths.map((path) => {
          const isSelected = path.id === selectedPathId;
          return (
            <div
              key={path.id}
              onClick={() => setSelectedPathId(path.id)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#4F46E5] bg-indigo-50/40 ring-2 ring-[#4F46E5]/20 shadow-md'
                  : 'border-[#E2E8F0] bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-[#4F46E5] uppercase tracking-wider">
                  {path.demandLevel} Demand
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-[#22C55E] border border-emerald-200">
                  {path.readiness}% Fit
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0F172A] leading-snug">{path.title}</h3>
              <p className="text-xs text-[#64748B] mt-2 line-clamp-2">{path.summary}</p>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-[#0F172A]">
                <span>Starting CTC:</span>
                <span className="text-[#4F46E5]">{path.avgStartingSalary}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Career Path Timeline */}
      <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs space-y-8">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#4F46E5]" />
            <h2 className="text-xl font-bold text-[#0F172A]">{activePath.title} Timeline</h2>
          </div>
          <p className="text-xs text-[#64748B] mt-1">{activePath.summary}</p>
        </div>

        {/* Milestone Steps */}
        <div className="space-y-6">
          {activePath.milestones.map((ms, index) => (
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
                <span className="text-xs font-semibold text-[#64748B] mr-1">Required Stack:</span>
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
          <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-2">
            <h4 className="text-xs font-bold text-[#0F172A] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#4F46E5]" />
              Recommended Credentials
            </h4>
            <ul className="space-y-1.5 text-xs text-[#64748B]">
              {activePath.recommendedCertifications.map((cert) => (
                <li key={cert} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-2">
            <h4 className="text-xs font-bold text-[#0F172A] flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#4F46E5]" />
              Top Hiring Organizations
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {activePath.targetCompanies.map((comp) => (
                <span
                  key={comp}
                  className="px-2.5 py-1 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#0F172A]"
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
