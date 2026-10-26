import React from 'react';
import { Sprout, ShieldAlert, BookOpen, ExternalLink } from 'lucide-react';
import { useTranslation } from '../../locales';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-agri-border mt-12 py-8 text-sm text-agri-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Col 1 */}
          <div>
            <div className="flex items-center space-x-2 text-forest font-bold text-lg mb-2">
              <Sprout className="w-5 h-5" />
              <span>{t.appName}</span>
            </div>
            <p className="text-xs text-agri-muted leading-relaxed mb-3">
              {t.tagline}
            </p>
            <p className="text-[11px] text-agri-muted/80">
              Designed for agriculture students, beginners, and progressive agri-entrepreneurs.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-semibold text-agri-text text-sm mb-3">Learning Resources</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="/crops" className="hover:text-forest transition-colors">Crop Learning Library</a>
              </li>
              <li>
                <a href="/recommendations" className="hover:text-forest transition-colors">Crop Suitability Models</a>
              </li>
              <li>
                <a href="/pests-diseases" className="hover:text-forest transition-colors">Integrated Pest Management</a>
              </li>
              <li>
                <a href="/post-harvest" className="hover:text-forest transition-colors">Value Addition & By-Products</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Disclaimer */}
          <div className="bg-sage-light p-3.5 rounded-xl border border-agri-border">
            <div className="flex items-center space-x-1.5 text-forest font-semibold text-xs mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>{t.disclaimerTitle}</span>
            </div>
            <p className="text-[11px] text-agri-muted leading-relaxed">
              {t.disclaimerText}
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-agri-border flex flex-col sm:flex-row items-center justify-between text-xs text-agri-muted">
          <p>© {new Date().getFullYear()} First Farmer Agriculture System. Educational and assistive project.</p>
          <p className="mt-2 sm:mt-0">Clean Code • Multi-lingual • Forest Green Design System</p>
        </div>
      </div>
    </footer>
  );
};
