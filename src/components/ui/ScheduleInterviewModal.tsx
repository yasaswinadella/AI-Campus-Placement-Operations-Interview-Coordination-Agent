import React, { useState } from 'react';
import { Modal } from './Modal';
import { useData } from '../../context/DataContext';
import { InterviewRound, InterviewFormat } from '../../types';
import { Calendar, Video, Clock, Users, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStudentId?: string;
  defaultJobId?: string;
  defaultApplicationId?: string;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  defaultStudentId,
  defaultJobId,
  defaultApplicationId,
}) => {
  const { allStudents, jobs, scheduleInterview } = useData();

  const [studentId, setStudentId] = useState(defaultStudentId || allStudents[0]?.id || 'STU-001');
  const [jobId, setJobId] = useState(defaultJobId || jobs[0]?.id || 'JOB-101');
  const [round, setRound] = useState<InterviewRound>('Technical');
  const [date, setDate] = useState('2026-10-25');
  const [time, setTime] = useState('11:00 AM PST');
  const [format, setFormat] = useState<InterviewFormat>('Virtual');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/cfg-live-room');
  const [interviewers, setInterviewers] = useState('Alex Vance (Engineering Lead), Marcus Vance');
  const [instructions, setInstructions] = useState('Please ensure high-speed internet and prepare live code sandbox for data structures.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleInterview({
      applicationId: defaultApplicationId,
      jobId,
      studentId,
      round,
      date,
      time,
      format,
      meetingLink,
      interviewers: interviewers.split(',').map((s) => s.trim()).filter(Boolean),
      instructions,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Interview Session"
      subtitle="Configure interview round, format, evaluators, and video conferencing bridge."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Candidate</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            >
              {allStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.branch} - CGPA {s.cgpa})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Target Position</label>
            <select
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.company})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Interview Round</label>
            <select
              value={round}
              onChange={(e) => setRound(e.target.value as InterviewRound)}
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            >
              <option value="Technical">Technical Round (Coding & Algorithms)</option>
              <option value="System Design">System Design & Architecture</option>
              <option value="HR Screen">HR Screen & Culture Alignment</option>
              <option value="Culture Fit">Culture Fit & Behavioral</option>
              <option value="Final Round">Final Executive Review</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as InterviewFormat)}
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            >
              <option value="Virtual">Virtual Video Meeting (Google Meet / Zoom)</option>
              <option value="On-site">On-site Campus Interview</option>
              <option value="Phone">Telephonic Assessment</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Time Slot & Timezone</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:00 AM - 11:00 AM PST"
                required
                className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {format === 'Virtual' && (
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Video Meeting Link</label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                required
                className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">Interviewers (Comma separated)</label>
          <div className="relative">
            <Users className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={interviewers}
              onChange={(e) => setInterviewers(e.target.value)}
              placeholder="e.g. Alex Vance, Dr. Vikram Sethi"
              required
              className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">Instructions & Preparation Notes</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={2}
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
            Dispatch Invitation & Calendar Invite
          </button>
        </div>
      </form>
    </Modal>
  );
};
