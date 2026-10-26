import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Bookmark,
  CheckCircle2,
  Clock,
  BookOpen,
  Trash2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '../locales';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Bookmark as BookmarkType, LearningProgress, DashboardStats, Crop } from '../types';

export const LearningProgressPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [progressList, setProgressList] = useState<LearningProgress[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [bData, pData, sData, cData] = await Promise.all([
        api.get<BookmarkType[]>('/bookmarks').catch(() => []),
        api.get<LearningProgress[]>('/progress').catch(() => []),
        api.get<DashboardStats>('/progress/stats').catch(() => null),
        api.get<Crop[]>('/crops').catch(() => []),
      ]);

      setBookmarks(bData);
      setProgressList(pData);
      setStats(sData);
      setCrops(cData);
    } catch (err) {
      console.error('Failed to load learning progress', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (cropId: number) => {
    try {
      await api.delete(`/bookmarks/${cropId}`);
      setBookmarks((prev) => prev.filter((b) => b.crop_id !== cropId));
      if (stats) {
        setStats({ ...stats, saved_crops_count: Math.max(0, stats.saved_crops_count - 1) });
      }
    } catch (err) {
      console.error('Failed to remove bookmark', err);
    }
  };

  const getCropName = (cropId?: number) => {
    if (!cropId) return 'General Concept';
    const found = crops.find((c) => c.id === cropId);
    return found ? found.name : `Crop #${cropId}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-forest" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest bg-sage-light px-2.5 py-1 rounded-full mb-2">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Curriculum Mastery & Progress</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-text">
          {t.myProgress}
        </h1>
        <p className="text-sm text-agri-muted mt-1 max-w-2xl">
          Track completed agronomic modules, manage bookmarked crops, and continue your step-by-step agricultural journey.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-agri-muted block mb-1">
            Overall Curriculum Progress
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-forest">
              {stats?.overall_progress_percentage || 0}%
            </span>
            <span className="text-xs text-agri-muted">completed</span>
          </div>
          <div className="w-full bg-sage-light h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-forest h-full rounded-full transition-all duration-500"
              style={{ width: `${stats?.overall_progress_percentage || 0}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-agri-muted block mb-1">
            Completed Modules
          </span>
          <div className="text-3xl font-black text-agri-text">
            {stats?.completed_modules_count || 0}
          </div>
          <span className="text-xs text-agri-muted">Verified module completions in database</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-agri-muted block mb-1">
            Saved Bookmarks
          </span>
          <div className="text-3xl font-black text-agri-text">
            {bookmarks.length}
          </div>
          <span className="text-xs text-agri-muted">Crops saved for active study</span>
        </div>
      </div>

      {/* Bookmarked Crops Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-agri-text">Saved Crops for Study</h2>
          <Link to="/crops" className="text-xs font-semibold text-forest hover:underline">
            Browse More Crops &rarr;
          </Link>
        </div>

        {bookmarks.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-agri-border">
            <Bookmark className="w-10 h-10 text-sage mx-auto mb-2" />
            <h3 className="font-bold text-agri-text text-base">No Saved Crops Yet</h3>
            <p className="text-xs text-agri-muted max-w-sm mx-auto mt-1">
              Click the bookmark icon on any crop in the library to save it here for convenient reference.
            </p>
            <Link
              to="/crops"
              className="mt-3 inline-block px-4 py-2 bg-forest text-white font-bold text-xs rounded-xl shadow-xs hover:bg-forest-light transition-colors"
            >
              Explore Crop Library
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="bg-white p-5 rounded-3xl border border-agri-border shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest bg-sage-light px-2 py-0.5 rounded-md">
                        {bm.crop?.category || 'Crop'}
                      </span>
                      <h3 className="text-lg font-bold text-agri-text mt-1">{bm.crop?.name}</h3>
                      {bm.crop?.scientific_name && (
                        <span className="text-xs italic text-agri-muted block">
                          {bm.crop.scientific_name}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveBookmark(bm.crop_id)}
                      className="p-1.5 text-agri-muted hover:text-agri-error rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove Bookmark"
                      aria-label="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-agri-muted line-clamp-2 mt-2">
                    {bm.crop?.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-agri-border flex items-center justify-between text-xs">
                  <span className="text-agri-muted">Water: {bm.crop?.water_requirement}</span>
                  <Link
                    to={`/crops/${bm.crop_id}`}
                    className="font-bold text-forest hover:underline flex items-center space-x-1"
                  >
                    <span>View Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Module History List */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-agri-border shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-agri-text">Recent Learning Modules & Progress</h2>

        {progressList.length === 0 ? (
          <div className="p-8 text-center bg-sage-light/40 rounded-2xl border border-agri-border">
            <CheckCircle2 className="w-8 h-8 text-sage mx-auto mb-2" />
            <p className="text-sm font-bold text-agri-text">No completed modules recorded yet</p>
            <p className="text-xs text-agri-muted mt-1 max-w-sm mx-auto">
              When studying a crop's cultivation or pest guide, click "Mark Module Studied" to persist your curriculum progress.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {progressList.map((pr) => (
              <div
                key={pr.id}
                className="p-4 rounded-2xl bg-agri-page border border-agri-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-forest text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-agri-text text-sm">
                      {getCropName(pr.crop_id)} —{' '}
                      <span className="capitalize">{pr.module_name.replace('_', ' ')}</span>
                    </h4>
                    <span className="text-agri-muted text-[11px]">
                      Last updated: {new Date(pr.last_accessed_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase tracking-wider">
                    {pr.completion_status} ({pr.progress_percentage}%)
                  </span>
                  {pr.crop_id && (
                    <Link
                      to={`/crops/${pr.crop_id}`}
                      className="text-xs font-bold text-forest hover:underline"
                    >
                      Review &rarr;
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
