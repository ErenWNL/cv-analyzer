import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  X,
  LayoutDashboard,
  FileText,
  Brain,
  TrendingUp,
  User,
  Settings,
  Users,
  Briefcase,
  Search,
  BarChart3,
  Shield,
  Database,
  MessageSquare,
  Award,
  Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { user, isAdmin, isHR, isCandidate } = useAuth();

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: ['all']
      }
    ];

    const candidateItems = [
      {
        name: 'CV Analyzer',
        href: '/cv-analyzer',
        icon: FileText,
        roles: ['candidate', 'user']
      },
      {
        name: 'Skill Assessment',
        href: '/skill-assessment',
        icon: Brain,
        roles: ['candidate', 'user']
      },
      {
        name: 'Career Guidance',
        href: '/career-guidance',
        icon: TrendingUp,
        roles: ['candidate', 'user']
      },
      {
        name: 'AI Chat Assistant',
        href: '/chat',
        icon: MessageSquare,
        roles: ['candidate', 'user']
      }
    ];

    const hrItems = [
      {
        name: 'Job Postings',
        href: '/hr/job-postings',
        icon: Briefcase,
        roles: ['hr']
      },
      {
        name: 'Candidate Search',
        href: '/hr/candidate-search',
        icon: Search,
        roles: ['hr']
      },
      {
        name: 'Matching Results',
        href: '/hr/matching-results',
        icon: Target,
        roles: ['hr']
      },
      {
        name: 'HR Analytics',
        href: '/hr/analytics',
        icon: BarChart3,
        roles: ['hr']
      }
    ];

    const adminItems = [
      {
        name: 'Admin Panel',
        href: '/admin/panel',
        icon: Shield,
        roles: ['admin']
      },
      {
        name: 'User Management',
        href: '/admin/users',
        icon: Users,
        roles: ['admin']
      },
      {
        name: 'System Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
        roles: ['admin']
      },
      {
        name: 'System Config',
        href: '/admin/config',
        icon: Database,
        roles: ['admin']
      }
    ];

    const profileItems = [
      {
        name: 'Profile',
        href: '/profile',
        icon: User,
        roles: ['all']
      },
      {
        name: 'Settings',
        href: '/settings',
        icon: Settings,
        roles: ['all']
      }
    ];

    let items = [...baseItems];

    if (isCandidate) {
      items = [...items, ...candidateItems];
    }

    if (isHR) {
      items = [...items, ...hrItems];
    }

    if (isAdmin) {
      items = [...items, ...adminItems];
    }

    items = [...items, ...profileItems];

    return items;
  };

  const navigationItems = getNavigationItems();

  const isActiveLink = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const NavLink = ({ item }) => {
    const Icon = item.icon;
    const isActive = isActiveLink(item.href);

    return (
      <Link
        to={item.href}
        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <Icon className={`mr-3 h-5 w-5 transition-colors ${
          isActive 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
        }`} />
        {item.name}
        {isActive && (
          <div className="ml-auto w-1 h-1 bg-blue-500 rounded-full"></div>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex">
          {/* Sidebar panel */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-slate-800 shadow-xl">
            {/* Close button */}
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Sidebar content */}
            <div className="h-0 flex-1 overflow-y-auto pb-4">
              <SidebarContent 
                navigationItems={navigationItems}
                NavLink={NavLink}
                user={user}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-1 flex-col overflow-y-auto bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 shadow-sm">
          <SidebarContent 
            navigationItems={navigationItems}
            NavLink={NavLink}
            user={user}
          />
        </div>
      </div>
    </>
  );
};

// Shared sidebar content component
const SidebarContent = ({ navigationItems, NavLink, user }) => {
  return (
    <>
      {/* Logo */}
      <div className="flex flex-shrink-0 items-center px-6 py-4 border-b border-gray-200 dark:border-slate-700">
        <Link to="/dashboard" className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">CV</span>
          </div>
          <div className="ml-3">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              CV Analyzer
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              AI-Powered Platform
            </p>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-white" />
            )}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
              {user?.roles?.[0] || 'User'}
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {/* Main navigation section */}
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Main
          </h3>
          {navigationItems.slice(0, 1).map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </div>

        {/* Features section */}
        {navigationItems.slice(1, -2).length > 0 && (
          <div className="space-y-1 pt-4">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Features
            </h3>
            {navigationItems.slice(1, -2).map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>
        )}

        {/* Account section */}
        <div className="space-y-1 pt-4">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Account
          </h3>
          {navigationItems.slice(-2).map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </div>
      </nav>

      {/* Bottom section with stats */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>CV Score</span>
          <span className="text-green-500 font-medium">87%</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '87%' }}></div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;