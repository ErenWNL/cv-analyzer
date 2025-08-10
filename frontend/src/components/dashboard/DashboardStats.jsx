import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatNumber } from '../../utils/helpers'

function DashboardStats({ stats }) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const statsCards = [
    {
      title: 'Total CVs',
      value: formatNumber(stats.totalCVs || 0),
      change: stats.monthlyUploads ? `+${stats.monthlyUploads} this month` : 'No change',
      trend: stats.monthlyUploads > 0 ? 'up' : 'neutral',
      icon: '📄',
      color: 'blue'
    },
    {
      title: 'Average Score',
      value: stats.averageScore ? `${stats.averageScore}%` : 'N/A',
      change: stats.improvements ? `+${stats.improvements} improvements` : 'No improvements',
      trend: stats.improvements > 0 ? 'up' : 'neutral',
      icon: '📊',
      color: 'green'
    },
    {
      title: 'Best Score',
      value: stats.bestScore ? `${stats.bestScore}%` : 'N/A',
      change: 'Personal best',
      trend: 'neutral',
      icon: '🏆',
      color: 'yellow'
    },
    {
      title: 'Total Analyses',
      value: formatNumber(stats.totalAnalyses || 0),
      change: 'All time',
      trend: 'neutral',
      icon: '🔍',
      color: 'purple'
    }
  ]

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-500" />
      case 'down':
        return <TrendingDown size={16} className="text-red-500" />
      default:
        return <Minus size={16} className="text-gray-400" />
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((stat, index) => (
        <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">{stat.icon}</div>
            {getTrendIcon(stat.trend)}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
            <p className={`text-sm ${getTrendColor(stat.trend)} flex items-center`}>
              {stat.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardStats