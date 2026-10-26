import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  ArrowUpDown,
  Bookmark,
  Sprout,
  Droplet,
  Layers,
  Calendar,
  ChevronRight,
  BookmarkCheck,
} from 'lucide-react';
import { useTranslation } from '../locales';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Crop, Bookmark as BookmarkType } from '../types';

export const CropLibraryPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const [crops, setCrops] = useState<Crop[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [season, setSeason] = useState('All');
  const [soil, setSoil] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchCropsAndBookmarks();
  }, [search, category, season, soil, sortOrder]);

  const fetchCropsAndBookmarks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);
      if (season !== 'All') params.append('season', season);
      if (soil !== 'All') params.append('soil', soil);
      params.append('sort', sortOrder);

      const [cropsData, bmarksData] = await Promise.all([
        api.get<Crop[]>(`/crops?${params.toString()}`),
        isAuthenticated ? api.get<BookmarkType[]>('/bookmarks').catch(() => []) : Promise.resolve([]),
      ]);

      setCrops(cropsData);
      setBookmarks(bmarksData);
    } catch (err) {
      console.error('Failed to load crops', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (e: React.MouseEvent, cropId: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please sign in to save crops to your personal learning progress.');
      return;
    }

    const isBookmarked = bookmarks.some((b) => b.crop_id === cropId);

    try {
      if (isBookmarked) {
        await api.delete(`/bookmarks/${cropId}`);
        setBookmarks((prev) => prev.filter((b) => b.crop_id !== cropId));
      } else {
        const newBm = await api.post<BookmarkType>(`/bookmarks/${cropId}`);
        setBookmarks((prev) => [...prev, newBm]);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  };

  const isCropSaved = (cropId: number) => bookmarks.some((b) => b.crop_id === cropId);

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest bg-sage-light px-2.5 py-1 rounded-full mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Agricultural Knowledge Repository</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-text">
          {t.exploreCrops}
        </h1>
        <p className="text-sm text-agri-muted mt-1 max-w-2xl">
          Search and explore complete agro-climatic requirements, agronomy steps, pests, and commercial derivatives for India's major crops.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-agri-border shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-agri-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold text-agri-muted mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-agri-text font-medium focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <option value="All">{t.filterByCategory}</option>
              <option value="Cereal">Cereal</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Fruit">Fruit</option>
              <option value="Cash Crop">Cash Crop</option>
              <option value="Pulse">Pulse</option>
              <option value="Millet">Millet</option>
            </select>
          </div>

          {/* Season */}
          <div>
            <label className="block text-[11px] font-bold text-agri-muted mb-1">Season</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-agri-text font-medium focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <option value="All">{t.filterBySeason}</option>
              <option value="Kharif">Kharif</option>
              <option value="Rabi">Rabi</option>
              <option value="Zaid">Zaid</option>
              <option value="Year-round">Year-round</option>
            </select>
          </div>

          {/* Soil */}
          <div>
            <label className="block text-[11px] font-bold text-agri-muted mb-1">Soil Type</label>
            <select
              value={soil}
              onChange={(e) => setSoil(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-agri-text font-medium focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <option value="All">{t.filterBySoil}</option>
              <option value="Clay">Clay</option>
              <option value="Loamy">Loamy</option>
              <option value="Sandy">Sandy</option>
              <option value="Black soil">Black Soil</option>
              <option value="Red soil">Red Soil</option>
              <option value="Alluvial">Alluvial</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-[11px] font-bold text-agri-muted mb-1">Sort Alphabetical</label>
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-agri-text font-medium flex items-center justify-between hover:bg-sage-light/60 transition-colors"
            >
              <span>{sortOrder === 'asc' ? 'A → Z (Ascending)' : 'Z → A (Descending)'}</span>
              <ArrowUpDown className="w-3.5 h-3.5 text-forest" />
            </button>
          </div>
        </div>
      </div>

      {/* Crops Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white h-72 rounded-3xl border border-agri-border animate-pulse" />
          ))}
        </div>
      ) : crops.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-agri-border">
          <BookOpen className="w-12 h-12 text-sage mx-auto mb-3" />
          <h3 className="font-bold text-agri-text text-lg">No Crops Matched Your Filters</h3>
          <p className="text-xs text-agri-muted max-w-sm mx-auto mt-1">
            Try clearing search keywords or selecting "All" categories to view the full library.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setSeason('All');
              setSoil('All');
            }}
            className="mt-4 px-4 py-2 bg-sage-light text-forest font-bold text-xs rounded-xl hover:bg-sage transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => {
            const saved = isCropSaved(crop.id);
            return (
              <Link
                key={crop.id}
                to={`/crops/${crop.id}`}
                className="bg-white rounded-3xl border border-agri-border overflow-hidden hover:shadow-md hover:border-forest/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="h-44 bg-sage-light relative overflow-hidden">
                    {crop.image_path ? (
                      <img
                        src={crop.image_path}
                        alt={crop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sage">
                        <Sprout className="w-12 h-12" />
                      </div>
                    )}

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => handleToggleBookmark(e, crop.id)}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-sm ${
                        saved
                          ? 'bg-forest text-white'
                          : 'bg-white/80 text-agri-text hover:bg-white hover:text-forest'
                      }`}
                      title={saved ? 'Remove Bookmark' : 'Save Crop'}
                      aria-label="Bookmark crop"
                    >
                      {saved ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-full text-forest">
                      {crop.season}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-agri-muted block">
                        {crop.category}
                      </span>
                      <h3 className="text-lg font-bold text-agri-text group-hover:text-forest transition-colors">
                        {crop.name}
                      </h3>
                      {crop.scientific_name && (
                        <span className="text-xs italic text-agri-muted block">
                          {crop.scientific_name}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-agri-muted line-clamp-2 leading-relaxed">
                      {crop.description}
                    </p>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-agri-border/60 text-[11px] text-agri-muted">
                      <div className="flex items-center space-x-1.5 truncate">
                        <Layers className="w-3.5 h-3.5 text-forest flex-shrink-0" />
                        <span className="truncate">{crop.soil_requirements}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 truncate">
                        <Droplet className="w-3.5 h-3.5 text-forest flex-shrink-0" />
                        <span className="truncate">Water: {crop.water_requirement}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3.5 bg-agri-page border-t border-agri-border flex items-center justify-between text-xs font-bold text-forest">
                  <span>Level: {crop.difficulty_level}</span>
                  <span className="flex items-center group-hover:translate-x-1 transition-transform">
                    {t.viewDetails} &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
