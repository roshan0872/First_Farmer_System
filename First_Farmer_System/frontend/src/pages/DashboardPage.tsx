import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Sparkles,
  BookOpen,
  Wheat,
  Bug,
  PackageCheck,
  CloudSun,
  GraduationCap,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../locales';
import { api } from '../services/api';
import { Crop, DashboardStats, Bookmark as BookmarkType, WeatherData, CropProduct } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [products, setProducts] = useState<CropProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, cropsData, bmarksData, weatherData, prodsData] = await Promise.all([
          api.get<DashboardStats>('/progress/stats'),
          api.get<Crop[]>('/crops'),
          api.get<BookmarkType[]>('/bookmarks').catch(() => []),
          api.get<WeatherData>('/weather?location=Coimbatore').catch(() => null),
          api.get<CropProduct[]>('/products').catch(() => []),
        ]);

        setStats(statsData);
        setCrops(cropsData);
        setBookmarks(bmarksData);
        setWeather(weatherData);
        setProducts(prodsData.slice(0, 3));
      } catch (err) {
        console.error('Error fetching dashboard info', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = [
    { name: 'Library Crops', count: stats?.total_crops_in_library || 10, color: '#1F5135' },
    { name: 'Saved Crops', count: stats?.saved_crops_count || 0, color: '#2E7D4F' },
    { name: 'Completed Modules', count: stats?.completed_modules_count || 0, color: '#6E9F78' },
    { name: 'In Progress', count: stats?.in_progress_modules_count || 0, color: '#A86412' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-forest" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-agri-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest bg-sage-light px-2.5 py-1 rounded-full mb-2">
            <Sprout className="w-3.5 h-3.5" />
            <span>Agriculture Learning Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-text">
            {t.welcomeBack}, {user?.full_name || 'Farmer Vidyarthi'}!
          </h1>
          <p className="text-sm text-agri-muted mt-1 max-w-xl">
            Track your crop understanding, explore cultivation steps, and discover high-value post-harvest opportunities.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/recommendations"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-forest hover:bg-forest-light text-white text-sm font-bold rounded-xl shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>{t.cropRecommendation}</span>
          </Link>
          <Link
            to="/crops"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-sage-light hover:bg-sage text-forest text-sm font-bold rounded-xl transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Library</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-agri-border shadow-xs">
          <div className="flex items-center justify-between text-agri-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.cropsAvailable}</span>
            <BookOpen className="w-5 h-5 text-forest" />
          </div>
          <div className="text-2xl font-black text-agri-text">
            {stats?.total_crops_in_library || crops.length}
          </div>
          <span className="text-[11px] text-agri-muted">Verified agro-climatic guides</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-agri-border shadow-xs">
          <div className="flex items-center justify-between text-agri-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.savedCrops}</span>
            <Bookmark className="w-5 h-5 text-forest-light" />
          </div>
          <div className="text-2xl font-black text-agri-text">
            {stats?.saved_crops_count || bookmarks.length}
          </div>
          <span className="text-[11px] text-agri-muted">Saved for active study</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-agri-border shadow-xs">
          <div className="flex items-center justify-between text-agri-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.completedModules}</span>
            <CheckCircle2 className="w-5 h-5 text-agri-success" />
          </div>
          <div className="text-2xl font-black text-agri-text">
            {stats?.completed_modules_count || 0}
          </div>
          <span className="text-[11px] text-agri-muted">Mastered learning modules</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-agri-border shadow-xs">
          <div className="flex items-center justify-between text-agri-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.overallProgress}</span>
            <TrendingUp className="w-5 h-5 text-sage" />
          </div>
          <div className="text-2xl font-black text-forest">
            {stats?.overall_progress_percentage || 0}%
          </div>
          <div className="w-full bg-sage-light h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-forest h-full rounded-full transition-all duration-500"
              style={{ width: `${stats?.overall_progress_percentage || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Middle Grid: Progress Chart & Weather Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Statistics Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-agri-border shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-agri-text text-lg">My Agriculture Learning Activity</h3>
              <p className="text-xs text-agri-muted">Database activity metric tracking your curriculum completion.</p>
            </div>
            <Link to="/my-progress" className="text-xs font-semibold text-forest hover:underline">
              View Detailed Modules &rarr;
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#59665D' }} />
                <YAxis tick={{ fontSize: 11, fill: '#59665D' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DCE5DC',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agricultural Weather Card */}
        <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-forest uppercase tracking-wider">Agri Weather</span>
              <CloudSun className="w-5 h-5 text-forest" />
            </div>

            {weather ? (
              <div className="space-y-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-agri-text">
                    {Math.round(weather.temperature)}°C
                  </span>
                  <span className="text-sm font-semibold text-agri-muted">
                    {weather.location}, {weather.country}
                  </span>
                </div>

                <p className="text-xs font-medium text-forest bg-sage-light px-2.5 py-1 rounded-lg inline-block">
                  {weather.condition} • Humidity: {weather.humidity}% • Wind: {weather.wind_speed} km/h
                </p>

                <div className="p-3 bg-agri-page rounded-xl border border-agri-border text-xs text-agri-muted leading-relaxed">
                  <p className="font-bold text-agri-text mb-0.5">Field Advisory:</p>
                  <p className="line-clamp-3">{weather.agricultural_advisory}</p>
                </div>

                {weather.is_sample_data && (
                  <p className="text-[10px] text-agri-muted/80 italic">
                    Sample educational simulation. Configure API key for live station feeds.
                  </p>
                )}
              </div>
            ) : (
              <div className="text-xs text-agri-muted py-8 text-center">
                Weather advisory service currently unavailable.
              </div>
            )}
          </div>

          <Link
            to="/weather"
            className="mt-4 pt-3 border-t border-agri-border text-xs font-bold text-forest hover:underline flex items-center justify-between"
          >
            <span>Detailed 5-Day Agro Forecast</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Bottom Grid: Saved Crops & Featured Value-Added Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Crops Widget */}
        <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-agri-text text-base">Bookmarked Crops for Study</h3>
            <Link to="/my-progress" className="text-xs font-semibold text-forest hover:underline">
              Manage Bookmarks
            </Link>
          </div>

          {bookmarks.length === 0 ? (
            <div className="p-8 text-center bg-sage-light/40 rounded-2xl border border-dashed border-agri-border">
              <Bookmark className="w-8 h-8 text-sage mx-auto mb-2" />
              <p className="text-sm font-bold text-agri-text">No saved crops yet</p>
              <p className="text-xs text-agri-muted mt-1 max-w-xs mx-auto">
                Browse our crop library and bookmark crops you want to cultivate or study in depth.
              </p>
              <Link
                to="/crops"
                className="mt-3 inline-flex items-center text-xs font-bold text-forest hover:underline"
              >
                Go to Crop Library &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {bookmarks.slice(0, 4).map((b) => (
                <Link
                  key={b.id}
                  to={`/crops/${b.crop_id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-agri-page hover:bg-sage-light/60 transition-colors border border-agri-border"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-forest text-white flex items-center justify-center font-bold text-xs">
                      {b.crop?.name?.[0] || 'C'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-agri-text">{b.crop?.name}</h4>
                      <p className="text-[11px] text-agri-muted">
                        {b.crop?.category} • {b.crop?.season}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-forest">Open &rarr;</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Featured Post-Harvest Value-Added Products */}
        <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-agri-text text-base">Featured Value-Added Products</h3>
            <Link to="/post-harvest" className="text-xs font-semibold text-forest hover:underline">
              Explore All Products
            </Link>
          </div>

          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl border border-agri-border bg-agri-page flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest bg-sage-light px-2 py-0.5 rounded-md">
                      {p.product_category}
                    </span>
                    <h4 className="text-sm font-bold text-agri-text mt-1">{p.product_name}</h4>
                    <p className="text-xs text-agri-muted line-clamp-1 mt-0.5">
                      {p.processing_overview}
                    </p>
                  </div>
                  <Link
                    to={`/post-harvest?crop_id=${p.crop_id}`}
                    className="text-xs font-bold text-forest hover:underline flex-shrink-0 ml-3"
                  >
                    View &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
