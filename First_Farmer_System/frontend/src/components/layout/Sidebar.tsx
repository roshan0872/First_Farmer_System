import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Wheat,
  Bug,
  Scissors,
  PackageCheck,
  CloudSun,
  BotMessageSquare,
  GraduationCap,
  Settings,
  ShieldCheck,
  Home,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../locales';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();

  const navLinks = [
    { to: '/', label: 'Welcome / Home', icon: Home, exact: true },
    { to: '/dashboard', label: t.dashboard, icon: LayoutDashboard },
    { to: '/recommendations', label: t.cropRecommendation, icon: Sparkles },
    { to: '/crops', label: t.exploreCrops, icon: BookOpen },
    { to: '/cultivation', label: t.cultivationGuide, icon: Wheat },
    { to: '/pests-diseases', label: t.pestAndDisease, icon: Bug },
    { to: '/harvesting', label: t.harvestingGuide, icon: Scissors },
    { to: '/post-harvest', label: t.postHarvest, icon: PackageCheck },
    { to: '/weather', label: t.weather, icon: CloudSun },
    { to: '/chatbot', label: t.chatbot, icon: BotMessageSquare },
    { to: '/my-progress', label: t.myProgress, icon: GraduationCap },
    { to: '/profile', label: t.profile, icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 z-50 lg:z-30 h-screen lg:h-[calc(100vh-4rem)] w-64 bg-white border-r border-agri-border flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-agri-border lg:hidden flex items-center justify-between">
          <span className="font-bold text-forest text-lg">First Farmer Menu</span>
          <button
            onClick={onClose}
            className="p-1 rounded text-agri-muted hover:text-forest"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sage-light text-forest font-semibold border-l-4 border-forest shadow-xs'
                      : 'text-agri-muted hover:text-forest hover:bg-sage-light/60'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}

          {/* Administrator Section */}
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-agri-border">
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-agri-muted block mb-1">
                Administration
              </span>
              <NavLink
                to="/admin"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-50 text-agri-warning font-semibold border-l-4 border-agri-warning'
                      : 'text-agri-muted hover:text-agri-warning hover:bg-amber-50/60'
                  }`
                }
              >
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-agri-warning" />
                <span className="truncate font-semibold">{t.adminDashboard}</span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* Educational Note in sidebar bottom */}
        <div className="p-4 m-3 rounded-xl bg-sage-light/70 border border-agri-border/70 text-xs text-agri-muted">
          <p className="font-semibold text-forest mb-0.5">Educational Platform</p>
          <p className="text-[11px] leading-relaxed">
            Guidance aligned with ICAR and state agricultural extension practices.
          </p>
        </div>
      </aside>
    </>
  );
};
