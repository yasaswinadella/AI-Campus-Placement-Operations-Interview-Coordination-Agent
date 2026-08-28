import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Calendar,
  Clock,
  Video,
  User,
  Briefcase,
  Send,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';

export const HrScheduleInterview: React.FC = () => {
  const { students, jobs, scheduleInterview, showToast } = useData();
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState(students[0]?.id || 'STU-101');
  const [jobId, setJobId] = useState(jobs[0]?.id || 'JOB-101');
  const [round, setRound] = useState('Round 1: Coding & Data Structures');
  const [date, setDate] = useState('2026-08-28');
  const [time, setTime] = useState('14:30');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/xyz-cfwr-kpa');
  const [interviewerName, setInterviewerName] = useState('Priya Sharma (Principal Engineer)');
  const [notes, setNotes] = useState(
    'Focus on binary tree traversal algorithms, system concurrency, and API idempotency.'
  );

  const selectedStudent = students.find((s) => s.id === studentId) || students[0];
  const selectedJob = jobs.find((j) => j.id === jobId) || jobs[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleInterview({
      applicationId: `APP-${Date.now().toString().slice(-4)}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company,
      round,
      date,
      time,
      meetingLink,
      interviewerName,
      status: 'SCHEDULED',
      notes,
    });

    showToast('Interview Confirmed', `Scheduled ${round} for ${selectedStudent.name}.`);
    navigate('/hr/interview-management');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/hr/interview-management')}
          className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Interviews
        </button>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Schedule Campus Technical Interview
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Issue automated video meeting invites and sync calendar slots directly to candidate dashboards.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Target Candidate</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.cgpa} CGPA • {s.branch})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Job Position</label>
            <select
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.company})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Interview Round</label>
            <select
              value={round}
              onChange={(e) => setRound(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            >
              <option value="Round 1: Coding & Data Structures">Round 1: Coding & DSA</option>
              <option value="Round 2: System Architecture & Low Level Design">Round 2: System Architecture</option>
              <option value="Round 3: Executive HR & Leadership Fit">Round 3: Leadership & Cultural Fit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Time Slot (IST)</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Video Meeting URL</label>
            <div className="relative">
              <Video className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Interviewer Name / Title</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={interviewerName}
                onChange={(e) => setInterviewerName(e.target.value)}
                placeholder="e.g. Priya Sharma (Tech Lead)"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">Candidate Preparation Instructions</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/hr/interview-management')}
            className="px-4 py-2.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Confirm & Dispatch Invite</span>
          </button>
        </div>
      </form>
    </div>
  );
};
