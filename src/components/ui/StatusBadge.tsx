import React from 'react';
import { ApplicationStatus } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus | 'ACTIVE' | 'CLOSED' | 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'SCHEDULED' | 'CANCELLED' | 'RESCHEDULED' | 'PENDING';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'SELECTED':
      case 'ACTIVE':
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SHORTLISTED':
      case 'ONGOING':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'INTERVIEW':
      case 'SCHEDULED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SCREENING':
      case 'UPCOMING':
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'APPLIED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'REJECTED':
      case 'CLOSED':
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'RESCHEDULED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-bold',
  };

  const formatText = () => {
    switch (status) {
      case 'APPLIED':
        return 'Applied';
      case 'SCREENING':
        return 'Under Screening';
      case 'SHORTLISTED':
        return 'Shortlisted';
      case 'INTERVIEW':
        return 'Interview Stage';
      case 'SELECTED':
        return 'Selected / Offer';
      case 'REJECTED':
        return 'Not Selected';
      default:
        return status.charAt(0) + status.slice(1).toLowerCase();
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${getBadgeStyle()} ${sizeClasses[size]} tracking-wide capitalize whitespace-nowrap`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {formatText()}
    </span>
  );
};
