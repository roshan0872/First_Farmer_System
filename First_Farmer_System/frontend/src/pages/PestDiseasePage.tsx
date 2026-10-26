import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Bug,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Info,
} from 'lucide-react';
import { useTranslation } from '../locales';
import { api } from '../services/api';
import { PestDisease, Crop } from '../types';

export const PestDiseasePage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [pests, setPests] = useState<PestDisease[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCropId, setSelectedCropId] = useState<string>(
    searchParams.get('crop_id') || 'All'
  );
  const [typeFilter, setTypeFilter] = useState<string>('All');

  useEffect(() => {
    fetchData();
  }, [selectedCropId, typeFilter, search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCropId !== 'All') params.append('crop_id', selectedCropId);
      if (typeFilter !== 'All') params.append('type', typeFilter);
      if (search) params.append('search', search);

      const [pestsData, cropsData] = await Promise.all([
        api.get<PestDisease[]>(`/pests-diseases?${params.toString()}`),
        api.get<Crop[]>('/crops'),
      ]);

      setPests(pestsData);
      setCrops(cropsData);
    } catch (err) {
      console.error('Failed to load pest & disease data', err);
    } finally {
      setLoading(false);
    }
  };

  const getCropName = (cropId: number) => {
    const found = crops.find((c) => c.id === cropId);
    return found ? found.name : `Crop #${cropId}`;
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-agri-error bg-red-50 px-2.5 py-1 rounded-full mb-2 border border-red-200">
          <Bug className="w-3.5 h-3.5" />
          <span>Integrated Crop Protection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-text">
          {t.pestAndDisease}
        </h1>
        <p className="text-sm text-agri-muted mt-1 max-w-2xl">
          Identify common pests and fungal/bacterial diseases, environmental triggers, and verified Integrated Pest Management (IPM) guidelines.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-5 rounded-3xl border border-agri-border shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-agri-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search symptoms, pest name, blight, rot..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-agri-muted mb-1">Filter by Crop</label>
            <select
              value={selectedCropId}
              onChange={(e) => {
                setSelectedCropId(e.target.value);
                setSearchParams(e.target.value !== 'All' ? { crop_id: e.target.value } : {});
              }}
              className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-agri-text font-medium focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <option value="All">All Crops</option>
              {crops.map((c) => (
                <option key={c.id} value={c.id.toString()}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-agri-muted mb-1">Issue Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-agri-text font-medium focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <option value="All">All Types (Pests & Diseases)</option>
              <option value="Pest">Insect Pest Only</option>
              <option value="Disease">Pathogen Disease Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pest Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white h-64 rounded-3xl border border-agri-border animate-pulse" />
          ))}
        </div>
      ) : pests.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-agri-border">
          <Bug className="w-12 h-12 text-sage mx-auto mb-3" />
          <h3 className="font-bold text-agri-text text-lg">No Pest or Disease Records Found</h3>
          <p className="text-xs text-agri-muted max-w-sm mx-auto mt-1">
            Try adjusting search terms or resetting crop filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pests.map((item) => {
            const cropName = getCropName(item.crop_id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-agri-border p-6 shadow-xs flex flex-col justify-between hover:border-forest/40 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest bg-sage-light px-2.5 py-0.5 rounded-full">
                        {cropName}
                      </span>
                      <h3 className="text-lg font-bold text-agri-text mt-1.5">{item.name}</h3>
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        item.type === 'Pest'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-red-100 text-red-900 border border-red-200'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>

                  <div className="text-xs text-agri-muted space-y-2.5 leading-relaxed">
                    <div>
                      <strong className="text-agri-text block">Visual Symptoms:</strong>
                      <p>{item.symptoms}</p>
                    </div>
                    <div>
                      <strong className="text-agri-text block">Contributing Weather/Canopy Conditions:</strong>
                      <p>{item.conditions}</p>
                    </div>
                    <div className="p-3 bg-sage-light/60 rounded-xl border border-agri-border/60">
                      <strong className="text-forest block mb-0.5">Preventive Cultural Measures (IPM):</strong>
                      <p>{item.prevention}</p>
                    </div>
                    <div>
                      <strong className="text-agri-text block">Recommended Management:</strong>
                      <p>{item.management}</p>
                    </div>
                  </div>

                  {item.source_reference && (
                    <div className="pt-2 border-t border-agri-border text-[10px] text-agri-muted italic">
                      Source: {item.source_reference} (Reviewed: {item.last_reviewed_at || 'Recent'})
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-agri-border flex items-center justify-between">
                  <span className="text-xs text-agri-muted">Target Host: <strong>{cropName}</strong></span>
                  <Link
                    to={`/crops/${item.crop_id}`}
                    className="text-xs font-bold text-forest hover:underline flex items-center space-x-1"
                  >
                    <span>View Crop Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Advisory Banner */}
      <div className="bg-white p-5 rounded-2xl border-l-4 border-l-agri-warning border border-agri-border flex items-start space-x-3 text-xs text-agri-muted">
        <ShieldAlert className="w-5 h-5 text-agri-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-agri-text mb-0.5">Educational Health Disclaimer</p>
          <p className="leading-relaxed">
            The symptoms and pest descriptions above are intended as educational references. Field symptoms can vary due to nutrient deficiencies or soil toxicity. For acute crop infestations, always seek diagnosis from your local Krishi Vigyan Kendra (KVK) or state agricultural extension officer.
          </p>
        </div>
      </div>
    </div>
  );
};
