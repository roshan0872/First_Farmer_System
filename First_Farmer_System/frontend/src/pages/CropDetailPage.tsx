import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Wheat,
  Sprout,
  Droplet,
  Layers,
  Calendar,
  Sun,
  Bug,
  Scissors,
  PackageCheck,
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronRight,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { useTranslation } from '../locales';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CropDetail, Bookmark as BookmarkType } from '../types';

export const CropDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const [crop, setCrop] = useState<CropDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'cultivation' | 'pests' | 'harvest' | 'postharvest'
  >('overview');
  const [progressSaved, setProgressSaved] = useState(false);

  useEffect(() => {
    fetchCropDetail();
  }, [id]);

  const fetchCropDetail = async () => {
    try {
      setLoading(true);
      const data = await api.get<CropDetail>(`/crops/${id}`);
      setCrop(data);

      if (isAuthenticated) {
        const bmarks = await api.get<BookmarkType[]>('/bookmarks').catch(() => []);
        setIsSaved(bmarks.some((b) => b.crop_id === Number(id)));
      }
    } catch (err) {
      console.error('Failed to load crop details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to save this crop to your learning dashboard.');
      return;
    }

    try {
      if (isSaved) {
        await api.delete(`/bookmarks/${id}`);
        setIsSaved(false);
      } else {
        await api.post(`/bookmarks/${id}`);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to update bookmark', err);
    }
  };

  const handleMarkProgress = async (moduleName: string) => {
    if (!isAuthenticated) {
      alert('Sign in to track module completion in your account.');
      return;
    }

    try {
      await api.post('/progress', {
        crop_id: Number(id),
        module_name: moduleName,
        completion_status: 'completed',
        progress_percentage: 100,
      });
      setProgressSaved(true);
      setTimeout(() => setProgressSaved(false), 2500);
    } catch (err) {
      console.error('Failed to record progress', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-forest" />
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-agri-border">
        <h2 className="text-xl font-bold text-agri-text">Crop Not Found</h2>
        <p className="text-xs text-agri-muted mt-1">The requested crop record is unavailable.</p>
        <Link to="/crops" className="mt-4 inline-block text-xs font-bold text-forest hover:underline">
          &larr; Back to Library
        </Link>
      </div>
    );
  }

  const cg = crop.cultivation_guide;
  const hg = crop.harvest_guide;
  const phg = crop.post_harvest_guide;

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-agri-muted">
        <Link to="/" className="hover:text-forest">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/crops" className="hover:text-forest">Crop Library</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-bold text-agri-text">{crop.name}</span>
      </nav>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-agri-border overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-sage-light text-forest font-bold text-xs px-3 py-1 rounded-full border border-agri-border">
                {crop.category}
              </span>
              <span className="bg-agri-page text-agri-muted font-semibold text-xs px-3 py-1 rounded-full border border-agri-border">
                Season: {crop.season}
              </span>
              <span className="bg-agri-page text-agri-muted font-semibold text-xs px-3 py-1 rounded-full border border-agri-border">
                Difficulty: {crop.difficulty_level}
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-agri-text tracking-tight">
                {crop.name}
              </h1>
              {crop.scientific_name && (
                <p className="text-sm italic text-agri-muted mt-0.5">
                  Botanical: {crop.scientific_name}
                </p>
              )}
            </div>

            <p className="text-sm text-agri-muted leading-relaxed">
              {crop.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleToggleBookmark}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSaved
                    ? 'bg-forest text-white shadow-xs'
                    : 'bg-sage-light text-forest hover:bg-sage'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                <span>{isSaved ? t.saved : t.saveToLibrary}</span>
              </button>

              <button
                onClick={() => handleMarkProgress('cultivation')}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-agri-border text-agri-text hover:bg-sage-light transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-forest" />
                <span>Mark Module Studied</span>
              </button>

              {progressSaved && (
                <span className="text-xs text-agri-success font-semibold flex items-center space-x-1 animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Progress saved to account!</span>
                </span>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="h-56 md:h-full rounded-2xl overflow-hidden bg-sage-light relative shadow-inner">
            {crop.image_path ? (
              <img
                src={crop.image_path}
                alt={crop.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sage">
                <Sprout className="w-16 h-16" />
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="border-t border-agri-border bg-agri-page px-6 flex space-x-2 sm:space-x-6 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-forest text-forest'
                : 'border-transparent text-agri-muted hover:text-agri-text'
            }`}
          >
            {t.overview} & Agro-Climate
          </button>
          <button
            onClick={() => setActiveTab('cultivation')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'cultivation'
                ? 'border-forest text-forest'
                : 'border-transparent text-agri-muted hover:text-agri-text'
            }`}
          >
            {t.cultivationGuide}
          </button>
          <button
            onClick={() => setActiveTab('pests')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'pests'
                ? 'border-forest text-forest'
                : 'border-transparent text-agri-muted hover:text-agri-text'
            }`}
          >
            {t.pestAndDisease} ({crop.pest_diseases.length})
          </button>
          <button
            onClick={() => setActiveTab('harvest')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'harvest'
                ? 'border-forest text-forest'
                : 'border-transparent text-agri-muted hover:text-agri-text'
            }`}
          >
            {t.harvestingGuide}
          </button>
          <button
            onClick={() => setActiveTab('postharvest')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'postharvest'
                ? 'border-forest text-forest'
                : 'border-transparent text-agri-muted hover:text-agri-text'
            }`}
          >
            {t.postHarvest} ({crop.products.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs space-y-4">
            <h3 className="text-base font-bold text-agri-text flex items-center space-x-2">
              <Layers className="w-4 h-4 text-forest" />
              <span>Soil & Regional Suitability</span>
            </h3>
            <div className="space-y-3 text-xs leading-relaxed text-agri-muted">
              <div>
                <strong className="text-agri-text block">Recommended Soil Types:</strong>
                <p>{crop.soil_requirements}</p>
              </div>
              <div>
                <strong className="text-agri-text block">Prime Growing Regions:</strong>
                <p>{crop.suitable_regions}</p>
              </div>
              <div>
                <strong className="text-agri-text block">Water Availability Requirement:</strong>
                <p>{crop.water_requirement} requirement level.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs space-y-4">
            <h3 className="text-base font-bold text-agri-text flex items-center space-x-2">
              <Sun className="w-4 h-4 text-forest" />
              <span>Climate & Temperature Thresholds</span>
            </h3>
            <div className="space-y-3 text-xs leading-relaxed text-agri-muted">
              <div>
                <strong className="text-agri-text block">Agro-Climatic Parameters:</strong>
                <p>{crop.climate_requirements}</p>
              </div>
              <div>
                <strong className="text-agri-text block">Optimal Sowing Window:</strong>
                <p>{crop.season} season</p>
              </div>
              <div>
                <strong className="text-agri-text block">Difficulty for Beginners:</strong>
                <p>{crop.difficulty_level} — structured guidance provided in cultivation tab.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Cultivation Guide */}
      {activeTab === 'cultivation' && cg && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Land Prep & Seeds */}
            <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs space-y-3">
              <h3 className="text-base font-bold text-agri-text flex items-center space-x-2">
                <Wheat className="w-4 h-4 text-forest" />
                <span>1. {t.landPrep}</span>
              </h3>
              <p className="text-xs text-agri-muted leading-relaxed">{cg.land_preparation}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs space-y-3">
              <h3 className="text-base font-bold text-agri-text flex items-center space-x-2">
                <Sprout className="w-4 h-4 text-forest" />
                <span>2. Seed Selection & Treatment</span>
              </h3>
              <p className="text-xs text-agri-muted leading-relaxed">{cg.seed_selection}</p>
            </div>

            {/* Sowing & Irrigation */}
            <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs space-y-3">
              <h3 className="text-base font-bold text-agri-text flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-forest" />
                <span>3. {t.sowing}</span>
              </h3>
              <p className="text-xs text-agri-muted leading-relaxed">{cg.sowing_method}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs space-y-3">
              <h3 className="text-base font-bold text-agri-text flex items-center space-x-2">
                <Droplet className="w-4 h-4 text-forest" />
                <span>4. {t.irrigation}</span>
              </h3>
              <p className="text-xs text-agri-muted leading-relaxed">{cg.irrigation}</p>
            </div>

            {/* Nutrients & Weeds */}
            <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs space-y-3">
              <h3 className="text-base font-bold text-agri-text flex items-center space-x-2">
                <Layers className="w-4 h-4 text-forest" />
                <span>5. {t.nutrients}</span>
              </h3>
              <p className="text-xs text-agri-muted leading-relaxed">{cg.nutrient_management}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs space-y-3">
              <h3 className="text-base font-bold text-agri-text flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-forest" />
                <span>6. {t.weedManagement}</span>
              </h3>
              <p className="text-xs text-agri-muted leading-relaxed">{cg.weed_management}</p>
            </div>
          </div>

          {/* Growth Stages Timeline */}
          <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs space-y-3">
            <h3 className="text-base font-bold text-agri-text flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-forest" />
              <span>Physiological {t.growthStages}</span>
            </h3>
            <p className="text-xs font-mono bg-sage-light p-4 rounded-2xl text-forest leading-relaxed">
              {cg.growth_stages}
            </p>
          </div>

          {/* Beginner Mistakes */}
          {cg.beginner_mistakes && (
            <div className="bg-amber-50/70 p-6 rounded-3xl border border-amber-200 space-y-2">
              <h3 className="text-sm font-bold text-agri-warning flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-agri-warning" />
                <span>{t.beginnerMistakes}</span>
              </h3>
              <p className="text-xs text-agri-text leading-relaxed">{cg.beginner_mistakes}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Pests & Diseases */}
      {activeTab === 'pests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-agri-text">
              Common Pests & Diseases for {crop.name}
            </h2>
            <Link
              to={`/pests-diseases?crop_id=${crop.id}`}
              className="text-xs font-bold text-forest hover:underline"
            >
              Open in Health Explorer &rarr;
            </Link>
          </div>

          {crop.pest_diseases.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-agri-border">
              <p className="text-xs text-agri-muted">No specific pest records recorded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {crop.pest_diseases.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-agri-text">{item.name}</h3>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        item.type === 'Pest'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-red-100 text-red-900 border border-red-200'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>

                  <div className="text-xs text-agri-muted space-y-2">
                    <div>
                      <strong className="text-agri-text block">Symptoms:</strong>
                      <p>{item.symptoms}</p>
                    </div>
                    <div>
                      <strong className="text-agri-text block">Contributing Conditions:</strong>
                      <p>{item.conditions}</p>
                    </div>
                    <div>
                      <strong className="text-forest block">Integrated Prevention (IPM):</strong>
                      <p>{item.prevention}</p>
                    </div>
                    <div>
                      <strong className="text-agri-text block">Management & Treatment:</strong>
                      <p>{item.management}</p>
                    </div>
                  </div>

                  {item.source_reference && (
                    <div className="pt-2 border-t border-agri-border text-[10px] text-agri-muted italic">
                      Source: {item.source_reference} (Reviewed: {item.last_reviewed_at || 'Recent'})
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Harvesting */}
      {activeTab === 'harvest' && hg && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-agri-text flex items-center space-x-2">
              <Scissors className="w-5 h-5 text-forest" />
              <span>{t.harvestHeading}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-agri-muted">
              <div>
                <strong className="text-agri-text block mb-1">Maturity Indicators:</strong>
                <p className="leading-relaxed">{hg.maturity_indicators}</p>
              </div>
              <div>
                <strong className="text-agri-text block mb-1">Harvesting Window:</strong>
                <p className="leading-relaxed">{hg.approximate_harvest_period}</p>
              </div>
              <div>
                <strong className="text-agri-text block mb-1">Harvesting Technique:</strong>
                <p className="leading-relaxed">{hg.harvesting_method}</p>
              </div>
              <div>
                <strong className="text-agri-text block mb-1">Post-Cut Handling Precautions:</strong>
                <p className="leading-relaxed">{hg.handling_precautions}</p>
              </div>
            </div>

            <div className="p-4 bg-sage-light rounded-2xl border border-agri-border text-xs text-agri-text">
              <strong className="font-bold text-forest block mb-1">Storage Preparation:</strong>
              <p className="leading-relaxed">{hg.storage_preparation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Post-Harvest & Products */}
      {activeTab === 'postharvest' && (
        <div className="space-y-8">
          {phg && (
            <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-agri-text flex items-center space-x-2">
                <PackageCheck className="w-5 h-5 text-forest" />
                <span>{t.valueAdditionHeading}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-agri-muted">
                <div>
                  <strong className="text-agri-text block mb-1">Cleaning, Sorting & Grading:</strong>
                  <p className="leading-relaxed">{phg.cleaning_and_grading}</p>
                </div>
                <div>
                  <strong className="text-agri-text block mb-1">Storage Protocol:</strong>
                  <p className="leading-relaxed">{phg.storage_method}</p>
                </div>
                <div>
                  <strong className="text-agri-text block mb-1">Preservation Protocols:</strong>
                  <p className="leading-relaxed">{phg.preservation_method}</p>
                </div>
                <div>
                  <strong className="text-agri-text block mb-1">Processing Methods:</strong>
                  <p className="leading-relaxed">{phg.processing_method}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-agri-border text-xs">
                <div className="p-3 bg-agri-page rounded-xl border border-agri-border">
                  <strong className="font-bold text-forest block mb-0.5">Food Uses</strong>
                  <p className="text-[11px] text-agri-muted">{phg.food_uses}</p>
                </div>
                <div className="p-3 bg-agri-page rounded-xl border border-agri-border">
                  <strong className="font-bold text-forest block mb-0.5">Industrial Uses</strong>
                  <p className="text-[11px] text-agri-muted">{phg.industrial_uses}</p>
                </div>
                <div className="p-3 bg-agri-page rounded-xl border border-agri-border">
                  <strong className="font-bold text-forest block mb-0.5">Valuable By-Products</strong>
                  <p className="text-[11px] text-agri-muted">{phg.by_products}</p>
                </div>
              </div>
            </div>
          )}

          {/* Product Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-agri-text">
              Value-Added Products ({crop.products.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {crop.products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest bg-sage-light px-2.5 py-0.5 rounded-full">
                      {prod.product_category}
                    </span>
                    <span className="text-xs text-agri-muted font-medium">
                      Raw: {prod.raw_material}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-agri-text">{prod.product_name}</h4>
                  <p className="text-xs text-agri-muted leading-relaxed">
                    {prod.processing_overview}
                  </p>

                  <div className="pt-2 border-t border-agri-border text-xs text-agri-muted space-y-1">
                    <p><strong>Common Uses:</strong> {prod.common_uses}</p>
                    <p><strong>Storage:</strong> {prod.storage_considerations}</p>
                    <p className="text-forest font-semibold">
                      <strong>Value Multiplication:</strong> {prod.potential_value_addition}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
