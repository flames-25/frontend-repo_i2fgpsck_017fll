import { Star, ArrowRight } from 'lucide-react'

export default function ProjectCard({ project, onDonate }) {
  const percent = project.goal_amount > 0 ? Math.min(100, Math.round((project.total_donations / project.goal_amount) * 100)) : 0

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {project.featured && (
              <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium">
                <Star size={14} /> Featured
              </span>
            )}
            <span className="text-xs text-gray-500">{project.category}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
          <p className="text-sm text-gray-600">by {project.founder_name}</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 mt-3 line-clamp-3">{project.description}</p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Raised ${project.total_donations.toFixed(2)}</span>
          {project.goal_amount > 0 && (
            <span className="text-gray-500">Goal ${project.goal_amount.toFixed(0)}</span>
          )}
        </div>
        <div className="h-2 bg-gray-100 rounded mt-2">
          <div className="h-2 bg-blue-600 rounded" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <button
        onClick={() => onDonate(project)}
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        Donate <ArrowRight size={16} />
      </button>
    </div>
  )
}
