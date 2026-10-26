import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wheat, Layers, Droplet, ArrowRight, Sprout, Search } from 'lucide-react';
import { useTranslation } from '../locales';
import { api } from '../services/api';
import { Crop } from '../types';

export const CultivationListPage: React.FC = () => {
  const { t } = useTranslation();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const data = await api.get<Crop[]>('/crops');
        setCrops(data);
      } catch (err) {
        console.error('Failed to load crops', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  const filtered = crops.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.season.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest bg-sage-light px-2.5 py-1 rounded-full mb-2">
          <Wheat className="w-3.5 h-3.5" />
          <span>Agronomic Practices & Cultivation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-text">
          {t.cultivationGuide}
        </h1>
        <p className="text-sm text-agri-muted mt-1 max-w-2xl">
          Comprehensive step-by-step instructions for land preparation, nursery management, sowing spacing, drip irrigation, and split fertilization.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-3xl border border-agri-border shadow-xs">
        <div className="relative">
          <Search className="w-5 h-5 text-agri-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crops to view cultivation steps..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white h-56 rounded-3xl border border-agri-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((crop) => (
            <Link
              key={crop.id}
              to={`/crops/${crop.id}`}
              className="bg-white rounded-3xl border border-agri-border p-6 shadow-xs hover:border-forest/40 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest bg-sage-light px-2.5 py-0.5 rounded-full">
                    {crop.category}
                  </span>
                  <span className="text-xs font-semibold text-agri-muted">
                    Season: {crop.season}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-agri-text group-hover:text-forest transition-colors">
                    {crop.name}
                  </h3>
                  {crop.scientific_name && (
                    <span className="text-xs italic text-agri-muted block">
                      {crop.scientific_name}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-agri-muted pt-2 border-t border-agri-border">
                  <div className="flex items-center space-x-1.5 truncate">
                    <Layers className="w-3.5 h-3.5 text-forest flex-shrink-0" />
                    <span className="truncate">Soil: {crop.soil_requirements}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 truncate">
                    <Droplet className="w-3.5 h-3.5 text-forest flex-shrink-0" />
                    <span className="truncate">Water: {crop.water_requirement}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-agri-border flex items-center justify-between text-xs font-bold text-forest">
                <span>Difficulty: {crop.difficulty_level}</span>
                <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Cultivation Steps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
