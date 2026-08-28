import React, { useState } from 'react';
import { Modal } from './Modal';
import { useData } from '../../context/DataContext';
import { Building2, Megaphone, Calendar, GraduationCap, Award } from 'lucide-react';

interface CreateDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDriveModal: React.FC<CreateDriveModalProps> = ({ isOpen, onClose }) => {
  const { createPlacementDrive } = useData();

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Graduate Engineering Trainee (GET)');
  const [salaryPackage, setSalaryPackage] = useState('16.5 LPA (Fixed 13 + 3.5 Retention)');
  const [minCgpa, setMinCgpa] = useState(7.5);
  const [eligibleBranches, setEligibleBranches] = useState(
    'Computer Science & Engineering, Information Technology, Electronics & Communication'
  );
  const [maxBacklogs, setMaxBacklogs] = useState(0);
  const [minAssessmentScore, setMinAssessmentScore] = useState(75);
  const [driveDate, setDriveDate] = useState('2026-10-15');
  const [registrationDeadline, setRegistrationDeadline] = useState('2026-10-08');
  const [description, setDescription] = useState(
    'Premier campus placement drive with multi-tier coding rounds, system design challenges, and executive panel evaluations.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPlacementDrive({
      company,
      companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
      role,
      salaryPackage,
      minCgpa,
      eligibleBranches: eligibleBranches.split(',').map((s) => s.trim()).filter(Boolean),
      maxBacklogs,
      minAssessmentScore,
      driveDate,
      registrationDeadline,
      status: 'UPCOMING',
      description,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Announce Campus Placement Drive"
      subtitle="Publish placement schedule, eligibility criteria, and cutoffs to all student portals."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Hiring Organization</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Microsoft / Cisco / Oracle"
              required
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Target Designation / Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. SDE-1 / Cloud DevOps"
              required
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Offered CTC / Package</label>
            <input
              type="text"
              value={salaryPackage}
              onChange={(e) => setSalaryPackage(e.target.value)}
              placeholder="e.g. 18.0 LPA"
              required
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            />
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

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Min Assessment Score %</label>
            <input
              type="number"
              min="0"
              max="100"
              value={minAssessmentScore}
              onChange={(e) => setMinAssessmentScore(parseInt(e.target.value))}
              required
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Placement Drive Date</label>
            <input
              type="date"
              value={driveDate}
              onChange={(e) => setDriveDate(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Registration Deadline</label>
            <input
              type="date"
              value={registrationDeadline}
              onChange={(e) => setRegistrationDeadline(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">Eligible Academic Branches</label>
          <input
            type="text"
            value={eligibleBranches}
            onChange={(e) => setEligibleBranches(e.target.value)}
            placeholder="e.g. Computer Science, IT, ECE"
            required
            className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">Drive Description & Process Details</label>
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
            Broadcast Drive to Campus
          </button>
        </div>
      </form>
    </Modal>
  );
};
