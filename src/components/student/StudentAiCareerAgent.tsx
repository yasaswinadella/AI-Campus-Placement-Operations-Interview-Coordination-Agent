import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Job, JobApplication } from '../../types';
import {
  Bot,
  Sparkles,
  Send,
  User,
  ShieldCheck,
  Briefcase,
  Calendar,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  X,
  Minimize2,
  Maximize2,
  FileText,
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'ai' | 'student';
  text: string;
  timestamp: string;
  actionCard?: {
    type: 'JOB_RECOMMENDATION' | 'APPLICATION_CONFIRM' | 'APPLICATION_RESULT' | 'INTERVIEW_LIST' | 'SKILL_GAP' | 'ASSESSMENT_SCORE';
    job?: Job;
    applicationId?: string;
    items?: any[];
  };
}

export const StudentAiCareerAgent: React.FC<{ isOpen?: boolean; onClose?: () => void; isModal?: boolean }> = ({
  isOpen = true,
  onClose,
  isModal = false,
}) => {
  const {
    studentProfile,
    jobs = [],
    applications = [],
    interviews = [],
    studentAssignments = [],
    studentAssessmentResults = [],
    placementDrives = [],
    applyJob,
    showToast,
    refreshData,
  } = useData();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${studentProfile.name || user?.name || 'Student'}! 👋 I am your **CareerFlow AI Student Career Agent**.\n\nI analyze your live profile, skills, test results, and active Supabase job postings to help you navigate campus placements.\n\nAsk me anything like:\n• *"Which jobs am I eligible for?"*\n• *"What skills am I missing?"*\n• *"Show my applications status"*\n• *"Do I have any scheduled interviews?"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingApplicationJob, setPendingApplicationJob] = useState<Job | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Quick Action Buttons
  const quickActions = [
    'Which jobs am I eligible for?',
    'What skills am I missing?',
    'Show my applications',
    'Do I have an interview?',
    'What is my assessment score?',
    'What jobs should I apply for?',
  ];

  // AI Response Generator using Pure Database Records
  const generateAiResponse = async (query: string) => {
    const q = query.toLowerCase().trim();
    const studentSkills = Object.keys(studentProfile.skills || {});
    const studentCgpa = studentProfile.cgpa || 0;
    const studentBranch = studentProfile.branch || 'Engineering';

    // 1. Explicit Application Confirmation Handling
    if (pendingApplicationJob && (q.includes('yes') || q.includes('apply') || q.includes('confirm') || q.includes('submit'))) {
      const targetJob = pendingApplicationJob;
      setPendingApplicationJob(null);

      // Re-validate eligibility
      if (studentCgpa < targetJob.minCgpa) {
        return {
          text: `⚠️ **Application Blocked by Cutoff Criteria**\n\nYour current CGPA is **${studentCgpa}**, but **${targetJob.company}** requires a minimum of **${targetJob.minCgpa} CGPA** for the **${targetJob.title}** role.`,
        };
      }

      // Check for duplicate application
      const alreadyApplied = applications.some((a) => a.jobId === targetJob.id && a.studentEmail?.toLowerCase() === studentProfile.email?.toLowerCase());
      if (alreadyApplied) {
        return {
          text: `ℹ️ You have **already applied** for **${targetJob.title}** at **${targetJob.company}**. You can track its live status in your Applications portal.`,
        };
      }

      // Perform Real Supabase Insert
      const success = applyJob(targetJob.id, {
        coverLetter: `Application generated and verified by CareerFlow AI Student Career Agent for ${studentProfile.name}.`,
        resumeUrl: studentProfile.resumeUrl || '',
      });

      if (success) {
        return {
          text: `🎉 **Application Successfully Submitted!**\n\nYour application for **${targetJob.title}** at **${targetJob.company}** has been securely created in Supabase.\n\n• **Status:** Submitted (Under Review)\n• **Next Step:** The HR recruitment team and Placement Administration have received your candidate record.`,
          actionCard: {
            type: 'APPLICATION_RESULT' as const,
            job: targetJob,
          },
        };
      } else {
        return {
          text: `❌ **Failed to submit application.** Please try applying directly from the Jobs portal or check your network connection.`,
        };
      }
    }

    // Cancel pending application
    if (pendingApplicationJob && (q.includes('no') || q.includes('cancel') || q.includes('stop') || q.includes('never mind'))) {
      setPendingApplicationJob(null);
      return {
        text: `👍 Application cancelled. Let me know if you would like to explore other opportunities!`,
      };
    }

    // 2. Job Eligibility & Matching
    if (q.includes('eligible') || q.includes('which jobs') || q.includes('can i apply') || q.includes('suitable')) {
      if (jobs.length === 0) {
        return {
          text: `📋 There are currently **no corporate jobs available in Supabase**.\n\nOnce institutional partners post vacancies, I will automatically calculate your eligibility and match percentages against your ${studentCgpa} CGPA and verified skills.`,
        };
      }

      const eligibleJobs = jobs.filter((j) => studentCgpa >= j.minCgpa);
      if (eligibleJobs.length === 0) {
        return {
          text: `⚠️ Based on your current CGPA of **${studentCgpa}**, none of the active jobs in the database meet the required minimum CGPA criteria. Consider raising your academic score or requesting custom placement drive exemptions.`,
        };
      }

      let responseText = `✅ **You are eligible for ${eligibleJobs.length} position${eligibleJobs.length > 1 ? 's' : ''} based on your ${studentCgpa} CGPA:**\n\n`;
      eligibleJobs.slice(0, 4).forEach((j, i) => {
        const jobSkills = Array.isArray(j.skills) ? j.skills : [];
        const matched = jobSkills.filter((s) => studentSkills.some((sk) => sk.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(sk.toLowerCase())));
        const matchPct = jobSkills.length > 0 ? Math.min(99, Math.round((matched.length / jobSkills.length) * 60 + 38)) : 80;

        responseText += `**${i + 1}. ${j.title}** at **${j.company}**\n• Salary: ${j.salary} | Min CGPA: ${j.minCgpa}\n• Match: **${matchPct}%** (Matched: ${matched.join(', ') || 'General'})\n\n`;
      });

      const topJob = eligibleJobs[0];
      setPendingApplicationJob(topJob);

      return {
        text: responseText + `Would you like me to submit your application for **${topJob.title}** at **${topJob.company}**? (Reply *"Yes, apply"* to confirm).`,
        actionCard: {
          type: 'JOB_RECOMMENDATION' as const,
          job: topJob,
        },
      };
    }

    // 3. Recommended Jobs
    if (q.includes('recommend') || q.includes('best job') || q.includes('what should i apply') || q.includes('match my resume')) {
      if (jobs.length === 0) {
        return {
          text: `ℹ️ No active job listings found in Supabase right now.`,
        };
      }

      const scoredJobs = jobs
        .map((j) => {
          const jobSkills = Array.isArray(j.skills) ? j.skills : [];
          const matched = jobSkills.filter((s) => studentSkills.some((sk) => sk.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(sk.toLowerCase())));
          const missing = jobSkills.filter((s) => !matched.includes(s));
          let score = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 65 + 30) : 75;
          if (studentCgpa >= j.minCgpa) score = Math.min(99, score + 4);

          return { job: j, score, matched, missing };
        })
        .sort((a, b) => b.score - a.score);

      const top = scoredJobs[0];
      setPendingApplicationJob(top.job);

      let text = `🎯 **Top Recommendation for You:**\n\n**${top.job.title}** at **${top.job.company}**\n• **Match Score:** ${top.score}%\n• **Package:** ${top.job.salary}\n• **Matched Skills:** ${top.matched.join(', ') || 'Foundation Engineering'}\n• **Missing Skills:** ${top.missing.join(', ') || 'None'}\n\n**Why Recommended:** Your academic profile (${studentBranch}) and verified skills strongly align with their hiring requirements.\n\nWould you like me to submit your application for this position? (Reply *"Yes, apply"* to proceed).`;

      return {
        text,
        actionCard: {
          type: 'JOB_RECOMMENDATION' as const,
          job: top.job,
        },
      };
    }

    // 4. Missing Skills & Skill Gaps
    if (q.includes('missing') || q.includes('skill gap') || q.includes('improve') || q.includes('learn')) {
      const allRequiredJobSkills: string[] = Array.from(
        new Set(jobs.flatMap((j) => (Array.isArray(j.skills) ? (j.skills as string[]) : [])))
      );
      const missingSkills = allRequiredJobSkills.filter(
        (reqSkill: string) => !studentSkills.some((sk) => sk.toLowerCase().includes(reqSkill.toLowerCase()))
      );

      if (missingSkills.length === 0) {
        return {
          text: `🌟 **Excellent Profile!** You currently have no significant skill gaps against active job postings. Keep taking benchmark tests to maintain your scores!`,
        };
      }

      let text = `📊 **Identified Skill Gaps across Active Corporate Requirements:**\n\n`;
      missingSkills.slice(0, 5).forEach((sk, i) => {
        text += `• **${sk}**: Required by corporate vacancies. We recommend taking a practice assessment or adding a project with this technology.\n`;
      });

      return {
        text: text + `\nYou can request an AI assessment test in any of these skills from the **Assessments** tab.`,
      };
    }

    // 5. Applications Status
    if (q.includes('application') || q.includes('applied') || q.includes('status')) {
      if (applications.length === 0) {
        return {
          text: `📄 You haven't submitted any job applications yet.\n\nBrowse the **Jobs** tab or ask me *"Which jobs am I eligible for?"* to start applying!`,
        };
      }

      let text = `📋 **Your Live Applications Status (${applications.length}):**\n\n`;
      applications.forEach((app, i) => {
        text += `**${i + 1}. ${app.jobTitle}** — ${app.company}\n• Status: **${app.status}**\n• Applied Date: ${app.appliedDate}\n• Match Score: ${app.matchScore}%\n\n`;
      });

      return {
        text,
      };
    }

    // 6. Interview Schedules
    if (q.includes('interview') || q.includes('meeting') || q.includes('schedule')) {
      if (interviews.length === 0) {
        return {
          text: `📅 **No Interviews Scheduled Yet.**\n\nWhen an HR representative shortlists your application and schedules a virtual or on-site round, it will appear here with the meeting link and instructions.`,
        };
      }

      let text = `🎯 **Your Scheduled Interviews (${interviews.length}):**\n\n`;
      interviews.forEach((int, i) => {
        text += `**${i + 1}. ${int.jobTitle}** (${int.company})\n• Round: **${int.round}**\n• Date & Time: **${int.date} at ${int.time}**\n• Mode: ${int.format} (${int.meetingLink ? `[Join Meeting](${int.meetingLink})` : 'Link Pending'})\n• Status: ${int.status}\n\n`;
      });

      return {
        text,
      };
    }

    // 7. Assessment Scores & Benchmark History
    if (q.includes('assessment') || q.includes('score') || q.includes('test') || q.includes('result') || q.includes('grade')) {
      const overall = studentProfile.overallSkillScore || 0;
      const readiness = studentProfile.careerReadiness || 0;

      let text = `🏆 **Your Verified Assessment & Readiness Profile:**\n\n• **Overall Technical Rating:** ${overall}/100\n• **Placement Readiness Score:** ${readiness}%\n• **CGPA:** ${studentCgpa}\n• **Verified Skills:** ${studentSkills.length > 0 ? studentSkills.map((s) => `${s} (${studentProfile.skills[s]}%)`).join(', ') : 'None evaluated yet'}\n\n`;

      if (studentAssessmentResults.length > 0) {
        text += `**Recent Assessment Submissions:**\n`;
        studentAssessmentResults.slice(0, 3).forEach((r) => {
          text += `• **${r.assessmentName || r.skill}**: ${r.score}% (${r.obtainedMarks}/${r.totalMarks} Marks) on ${r.date}\n`;
        });
      } else {
        text += `You have not completed any formal 50-question benchmark tests yet. Visit the **Assessments** tab to boost your readiness score!`;
      }

      return {
        text,
      };
    }

    // 8. General / Fallback Intelligent Answer
    return {
      text: `🤖 I'm here to help you maximize your placement success!\n\nHere is a quick summary of your profile:\n• **Name:** ${studentProfile.name || 'Candidate'}\n• **Branch:** ${studentBranch} | **CGPA:** ${studentCgpa}\n• **Active Applications:** ${applications.length}\n• **Scheduled Interviews:** ${interviews.length}\n• **Available Jobs in DB:** ${jobs.length}\n\nHow else can I assist you with your campus placement today?`,
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const studentMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(async () => {
      const aiResponse = await generateAiResponse(query);
      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: aiResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionCard: aiResponse.actionCard,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleConfirmApplicationFromCard = (job: Job) => {
    handleSendMessage(`Yes, apply to ${job.title} at ${job.company}`);
  };

  return (
    <div
      className={`flex flex-col bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden ${
        isModal ? 'w-full h-full' : 'h-[620px] max-w-2xl w-full'
      }`}
    >
      {/* Agent Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight">CareerFlow AI Student Agent</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Supabase Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-300">Intelligent Placement & Real-time Career Advisor</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => refreshData()}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Refresh Database Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Close Agent"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.sender === 'student' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'student' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-indigo-400'
              }`}
            >
              {m.sender === 'student' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`space-y-2 max-w-[85%] ${m.sender === 'student' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  m.sender === 'student'
                    ? 'bg-[#4F46E5] text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div
                  className={`text-[9px] mt-1.5 text-right font-medium ${
                    m.sender === 'student' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {/* Action Card Rendering */}
              {m.actionCard && m.actionCard.type === 'JOB_RECOMMENDATION' && m.actionCard.job && (
                <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                      {m.actionCard.job.title}
                    </span>
                    <span className="text-[10px] font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-100">
                      {m.actionCard.job.salary}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">Company: {m.actionCard.job.company} | Location: {m.actionCard.job.location}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleConfirmApplicationFromCard(m.actionCard!.job!)}
                      className="px-3 py-1.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm & Apply Now</span>
                    </button>
                    <button
                      onClick={() => navigate('/student/job-eligibility', { state: { jobId: m.actionCard!.job!.id } })}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs border border-slate-200 transition-colors cursor-pointer"
                    >
                      Check Eligibility
                    </button>
                  </div>
                </div>
              )}

              {m.actionCard && m.actionCard.type === 'APPLICATION_RESULT' && m.actionCard.job && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Application Live on Supabase Database</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Your candidate profile has been linked to {m.actionCard.job.company}.
                  </p>
                  <button
                    onClick={() => navigate('/student/applications')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Application Tracker</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-indigo-400 flex items-center justify-center shrink-0 text-xs">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Action Prompts */}
      <div className="p-2.5 bg-slate-100 border-t border-slate-200 flex gap-2 overflow-x-auto no-scrollbar">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(action)}
            className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-[11px] font-semibold rounded-lg border border-slate-200 whitespace-nowrap transition-colors shrink-0 shadow-2xs cursor-pointer"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask AI agent (e.g. 'Which jobs am I eligible for?')..."
          className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>Ask</span>
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};
