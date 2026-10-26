import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Scissors,
  Calendar,
  Clock,
  Layers,
  ShieldAlert,
  ArrowRight,
  PackageCheck,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../locales';
import { api } from '../services/api';
import { Crop, CropDetail } from '../types';

export const HarvestingPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<CropDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const activeCropId = searchParams.get('crop_id') || '1';

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    if (activeCropId) {
      fetchCropDetail(activeCropId);
    }
  }, [activeCropId]);

  const fetchCrops = async () => {
    try {
      const data = await api.get<Crop[]>('/crops');
      setCrops(data);
    } catch (err) {
      console.error('Failed to load crops', err);
    }
  };

  const fetchCropDetail = async (cropId: string) => {
    try {
      setLoading(true);
      const data = await api.get<CropDetail>(`/crops/${cropId}`);
      setSelectedCrop(data);
    } catch (err) {
      console.error('Failed to load harvest guide', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest bg-sage-light px-2.5 py-1 rounded-full mb-2">
          <Scissors className="w-3.5 h-3.5" />
          <span>Timely Physiological Maturity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-text">
          {t.harvestingGuide}
        </h1>
        <p className="text-sm text-agri-muted mt-1 max-w-2xl">
          Harvesting at the correct biological maturity preserves grain milling quality, nutritional value, and seed germination percentage.
        </p>
      </div>

      {/* Crop Selector Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {crops.map((c) => (
          <button
            key={c.id}
            onClick={() => setSearchParams({ crop_id: c.id.toString() })}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCropId === c.id.toString()
                ? 'bg-forest text-white shadow-sm'
                : 'bg-white border border-agri-border text-agri-text hover:bg-sage-light'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest" />
        </div>
      ) : selectedCrop && selectedCrop.harvest_guide ? (
        <div className="space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-3xl border border-agri-border p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-agri-border gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest bg-sage-light px-2.5 py-0.5 rounded-full">
                  {selectedCrop.category}
                </span>
                <h2 className="text-2xl font-bold text-agri-text mt-1">
                  Harvest Protocol for {selectedCrop.name}
                </h2>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-forest bg-sage-light px-3 py-1.5 rounded-xl">
                <Clock className="w-4 h-4" />
                <span>Duration: {selectedCrop.harvest_guide.approximate_harvest_period}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-agri-muted">
              {/* Maturity Indicators */}
              <div className="p-5 rounded-2xl bg-sage-light/50 border border-agri-border space-y-2">
                <h3 className="font-bold text-forest text-sm flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-forest" />
                  <span>Physiological Maturity Indicators</span>
                </h3>
                <p className="leading-relaxed text-agri-text">
                  {selectedCrop.harvest_guide.maturity_indicators}
                </p>
              </div>

              {/* Harvesting Technique */}
              <div className="p-5 rounded-2xl bg-sage-light/50 border border-agri-border space-y-2">
                <h3 className="font-bold text-forest text-sm flex items-center space-x-2">
                  <Scissors className="w-4 h-4 text-forest" />
                  <span>Harvesting Technique & Machinery</span>
                </h3>
                <p className="leading-relaxed text-agri-text">
                  {selectedCrop.harvest_guide.harvesting_method}
                </p>
              </div>

              {/* Handling Precautions */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <h3 className="font-bold text-agri-warning text-sm flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-agri-warning" />
                  <span>Handling & Field Loss Precautions</span>
                </h3>
                <p className="leading-relaxed text-agri-text">
                  {selectedCrop.harvest_guide.handling_precautions}
                </p>
              </div>

              {/* Storage Preparation */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <h3 className="font-bold text-agri-success text-sm flex items-center space-x-2">
                  <PackageCheck className="w-4 h-4 text-agri-success" />
                  <span>Moisture Reduction & Storage Preparation</span>
                </h3>
                <p className="leading-relaxed text-agri-text">
                  {selectedCrop.harvest_guide.storage_preparation}
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="pt-4 border-t border-agri-border flex flex-wrap items-center justify-between gap-3 text-xs">
              <Link
                to={`/crops/${selectedCrop.id}`}
                className="font-bold text-forest hover:underline flex items-center space-x-1"
              >
                <span>View Full {selectedCrop.name} Cultivation Guide &rarr;</span>
              </Link>

              <Link
                to={`/post-harvest?crop_id=${selectedCrop.id}`}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-forest text-white font-bold hover:bg-forest-light transition-colors"
              >
                <span>Explore Post-Harvest Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-3xl border border-agri-border text-xs text-agri-muted">
          No harvest guide recorded for this crop.
        </div>
      )}

      {/* Educational Notice */}
      <div className="bg-white p-5 rounded-2xl border-l-4 border-l-forest border border-agri-border flex items-start space-x-3 text-xs text-agri-muted">
        <ShieldAlert className="w-5 h-5 text-forest flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-agri-text mb-0.5">Seasonal Harvest Note</p>
          <p className="leading-relaxed">
            Actual harvest timing varies with crop variety (short duration vs long duration), prevailing temperature during grain filling, sowing dates, and moisture availability. Always verify physical moisture and grain firmness prior to combine or sickle operations.
          </p>
        </div>
      </div>
    </div>
  );
};
