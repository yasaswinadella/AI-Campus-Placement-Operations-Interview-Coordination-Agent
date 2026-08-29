import React, { useState } from 'react';
import { Modal } from './Modal';
import { useData } from '../../context/DataContext';
import { Building2, DollarSign, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose }) => {
  const { hrProfile, addJob } = useData();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState(hrProfile.companyLocation || 'San Francisco, CA');
  const [workplace, setWorkplace] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [type, setType] = useState<'Full-time' | 'Internship' | 'Contract'>('Full-time');
  const [salary, setSalary] = useState('$130,000 - $160,000 / yr (16 - 20 LPA)');
  const [experience, setExperience] = useState('Fresher / 0-2 yrs');
  const [minCgpa, setMinCgpa] = useState(7.5);
  const [deadline, setDeadline] = useState('2026-10-31');
  const [skills, setSkills] = useState('Python, SQL, React, DSA');
  const [description, setDescription] = useState(
    'We are looking for passionate engineers ready to solve high-scale distributed systems and customer-facing features.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJob({
      company: hrProfile.company || 'TechNova Inc.',
      companyLogo: hrProfile.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      title,
      department,
      location,
      workplace,
      type,
      salary,
      experience,
      minCgpa,
      deadline,
      description,
      responsibilities: [
        'Design and implement high performance features and microservices.',
        'Collaborate across cross-functional engineering teams.',
        'Write test cases and participate in pull request code reviews.',
      ],
      requirements: [
        `Minimum CGPA requirement: ${minCgpa}`,
        'Proficiency in core algorithms and modern tech stacks.',
        'Strong problem-solving capability and clear communication.',
      ],
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      postedByHrId: hrProfile.hrId,
      postedByRole: 'HR',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Job Posting"
      subtitle="Publish an active job listing across the university placement network."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Associate Software Development Engineer"
              required
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Cloud Infrastructure / AI Labs"
              required
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Employment Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            >
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Workplace Mode</label>
            <select
              value={workplace}
              onChange={(e) => setWorkplace(e.target.value as any)}
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            >
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Min. CGPA Cutoff</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={minCgpa}
              onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
              required
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Salary Package / CTC</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 14 - 18 LPA ($120k - $140k)"
              required
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Application Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">Required Skills (Comma separated)</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. Python, SQL, React, Docker, DSA"
            required
            className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">Role Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
            className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
          />
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            Publish Live Job
          </button>
        </div>
      </form>
    </Modal>
  );
};
