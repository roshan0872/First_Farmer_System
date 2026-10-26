import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Globe, User, LogOut, LogIn, Menu, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../locales';
import { Language } from '../../types';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { language, setLanguage, t } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-agri-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Brand and Hamburger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-agri-muted hover:text-forest hover:bg-sage-light focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-white shadow-md group-hover:bg-forest-light transition-colors">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold text-forest tracking-tight block leading-tight">
                  {t.appName}
                </span>
                <span className="text-xs text-agri-muted font-medium tracking-wide hidden sm:block">
                  Agriculture Learning System
                </span>
              </div>
            </Link>
          </div>

          {/* Right Controls: Language Selector, User Info, Auth Buttons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Language Selector */}
            <div className="flex items-center bg-sage-light rounded-lg px-2.5 py-1.5 border border-agri-border text-sm">
              <Globe className="w-4 h-4 text-forest mr-1.5 flex-shrink-0" />
              <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-transparent text-sm font-semibold text-agri-text focus:outline-none cursor-pointer"
                aria-label="Select Language"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            {/* User State */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-sage-light transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center text-xs font-bold">
                    {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <span className="text-xs font-bold text-agri-text block leading-tight">
                      {user?.full_name}
                    </span>
                    <span className="text-[10px] text-agri-muted uppercase tracking-wider font-semibold">
                      {isAdmin ? 'Administrator' : 'Student'}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-agri-muted hover:text-agri-error rounded-lg hover:bg-red-50 transition-colors"
                  title={t.logout}
                  aria-label={t.logout}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-sm font-semibold text-forest hover:bg-sage-light rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t.login}</span>
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center px-4 py-1.5 text-sm font-semibold text-white bg-forest hover:bg-forest-light rounded-lg shadow-sm transition-colors"
                >
                  {t.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
