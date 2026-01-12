import React from 'react';
import { Calendar, Building2 } from 'lucide-react';
import HoverCard from './HoverCard';
import type { SkillProjectEvidence } from '../hooks/use-skills-with-projects.hook';

interface ProjectBadgeProps {
  project: SkillProjectEvidence;
  color?: string;
}

const formatDate = (dateStr: string): string => {
  const [year, month] = dateStr.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
};

const formatDateRange = (startDate: string, endDate: string | null, isCurrent: boolean): string => {
  const start = formatDate(startDate);
  if (isCurrent) {
    return `${start} - Present`;
  }
  if (endDate) {
    return `${start} - ${formatDate(endDate)}`;
  }
  return start;
};

const ProjectBadge: React.FC<ProjectBadgeProps> = ({ project, color = 'primary' }) => {
  const colorClasses: Record<string, { badge: string; hover: string; border: string }> = {
    primary: {
      badge: 'bg-sky-500/10 text-sky-400 hover:bg-sky-500/20',
      hover: 'bg-slate-900 border-sky-500/30',
      border: 'border-sky-500/20',
    },
    purple: {
      badge: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20',
      hover: 'bg-slate-900 border-purple-500/30',
      border: 'border-purple-500/20',
    },
    pink: {
      badge: 'bg-pink-500/10 text-pink-400 hover:bg-pink-500/20',
      hover: 'bg-slate-900 border-pink-500/30',
      border: 'border-pink-500/20',
    },
    blue: {
      badge: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20',
      hover: 'bg-slate-900 border-blue-500/30',
      border: 'border-blue-500/20',
    },
    cyan: {
      badge: 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20',
      hover: 'bg-slate-900 border-cyan-500/30',
      border: 'border-cyan-500/20',
    },
    red: {
      badge: 'bg-red-500/10 text-red-400 hover:bg-red-500/20',
      hover: 'bg-slate-900 border-red-500/30',
      border: 'border-red-500/20',
    },
    yellow: {
      badge: 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20',
      hover: 'bg-slate-900 border-yellow-500/30',
      border: 'border-yellow-500/20',
    },
    green: {
      badge: 'bg-green-500/10 text-green-400 hover:bg-green-500/20',
      hover: 'bg-slate-900 border-green-500/30',
      border: 'border-green-500/20',
    },
    emerald: {
      badge: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20',
      hover: 'bg-slate-900 border-emerald-500/30',
      border: 'border-emerald-500/20',
    },
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <HoverCard
      trigger={
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium cursor-default transition-colors duration-200 ${colors.badge} ${colors.border} border`}
        >
          {project.companyName}
        </span>
      }
      side="top"
      align="center"
    >
      <div
        className={`w-72 p-4 rounded-lg shadow-xl backdrop-blur-sm ${colors.hover} border`}
      >
        <div className="space-y-3">
          {/* Company and Role */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-100">
                {project.companyName}
              </span>
            </div>
            <p className="text-sm text-slate-400 ml-6">{project.roleTitle}</p>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {formatDateRange(project.startDate, project.endDate, project.isCurrent)}
            </span>
            {project.isCurrent && (
              <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 text-xs">
                Current
              </span>
            )}
          </div>

          {/* Description */}
          <div className="pt-2 border-t border-slate-700/50">
            <p className="text-sm text-slate-300 leading-relaxed line-clamp-4">
              {project.description}
            </p>
          </div>
        </div>
      </div>
    </HoverCard>
  );
};

export default ProjectBadge;
