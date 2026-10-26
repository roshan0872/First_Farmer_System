import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Layers,
  Calendar,
  Droplet,
  Thermometer,
  CloudRain,
  Tag,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { useTranslation } from '../locales';
import { api } from '../services/api';
import { RecommendationRequest, RecommendationResponse, RecommendationMatch } from '../types';

export const RecommendationPage: React.FC = () => {
  const { t } = useTranslation();

  const [region, setRegion] = useState('South India');
  const [soilType, setSoilType] = useState('Clay');
  const [season, setSeason] = useState('Kharif');
  const [waterAvailability, setWaterAvailability] = useState('High');
  const [temperature, setTemperature] = useState<string>('28');
  const [rainfall, setRainfall] = useState<string>('');
  const [preferredCategory, setPreferredCategory] = useState<string>('All');

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: RecommendationRequest = {
      region,
      soil_type: soilType,
      season,
      water_availability: waterAvailability,
      temperature: temperature ? parseFloat(temperature) : undefined,
      rainfall: rainfall ? parseFloat(rainfall) : undefined,
      preferred_category: preferredCategory !== 'All' ? preferredCategory : undefined,
    };

    try {
      const data = await api.post<RecommendationResponse>('/recommendations', payload);
      setResponse(data);
    } catch (err: any) {
      setError(err.detail || 'Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest bg-sage-light px-2.5 py-1 rounded-full mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Rule-Based Agricultural Matching</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-text">
          {t.cropRecommendation}
        </h1>
        <p className="text-sm text-agri-muted mt-1 max-w-2xl">
          {t.recommendationIntro} Transparent compatibility evaluations based on verified soil types, agro-climatic zones, and water requirements.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-agri-border shadow-xs">
        <form onSubmit={handleEvaluate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Region */}
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1.5 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-forest" />
                <span>Region / Zone *</span>
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <option value="South India">South India (TN, KA, AP, KL, TS)</option>
                <option value="North India">North India (PB, HR, UP, UK, HP)</option>
                <option value="Central India">Central India (MP, MH, CG)</option>
                <option value="Western India">Western India (GJ, RJ)</option>
                <option value="Eastern India">Eastern India (WB, OD, BR, JH)</option>
                <option value="Coastal Plains">Coastal Plains</option>
                <option value="Pan-India">Pan-India General</option>
              </select>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1.5 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-forest" />
                <span>Soil Type *</span>
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <option value="Clay">Clay / Heavy Soil</option>
                <option value="Clay Loam">Clay Loam</option>
                <option value="Loamy">Loamy / Garden Soil</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Sandy">Sandy Soil</option>
                <option value="Black soil">Black Soil (Regur)</option>
                <option value="Red soil">Red Soil / Laterite</option>
                <option value="Alluvial">Alluvial Soil</option>
              </select>
            </div>

            {/* Season */}
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1.5 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-forest" />
                <span>Cultivation Season *</span>
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <option value="Kharif">Kharif (Monsoon: Jun - Oct)</option>
                <option value="Rabi">Rabi (Winter: Oct - Mar)</option>
                <option value="Zaid">Zaid (Summer: Mar - Jun)</option>
                <option value="Year-round">Year-round / Perennial</option>
              </select>
            </div>

            {/* Water Availability */}
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1.5 flex items-center space-x-1">
                <Droplet className="w-3.5 h-3.5 text-forest" />
                <span>Water Supply Availability *</span>
              </label>
              <select
                value={waterAvailability}
                onChange={(e) => setWaterAvailability(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <option value="High">High (Canal / Perennial River / Assured Borewell)</option>
                <option value="Medium">Medium (Seasonal Well / Tube Well / Drip System)</option>
                <option value="Low">Low (Rainfed / Dryland / Limited Irrigation)</option>
              </select>
            </div>
          </div>

          {/* Optional Parameters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 border-t border-agri-border">
            <div>
              <label className="block text-xs font-semibold text-agri-muted mb-1 flex items-center space-x-1">
                <Thermometer className="w-3.5 h-3.5" />
                <span>Estimated Temp (°C) — Optional</span>
              </label>
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="e.g. 28"
                step="0.5"
                className="w-full px-3.5 py-2 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-agri-muted mb-1 flex items-center space-x-1">
                <CloudRain className="w-3.5 h-3.5" />
                <span>Rainfall (mm) — Optional</span>
              </label>
              <input
                type="number"
                value={rainfall}
                onChange={(e) => setRainfall(e.target.value)}
                placeholder="e.g. 850"
                className="w-full px-3.5 py-2 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-agri-muted mb-1 flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Crop Category Preference — Optional</span>
              </label>
              <select
                value={preferredCategory}
                onChange={(e) => setPreferredCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <option value="All">All Categories</option>
                <option value="Cereal">Cereal</option>
                <option value="Vegetable">Vegetable</option>
                <option value="Cash Crop">Cash Crop</option>
                <option value="Fruit">Fruit</option>
                <option value="Pulse">Pulse</option>
                <option value="Millet">Millet</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-agri-muted">
              Evaluates multi-factor agro-climatic scoring against published agricultural data.
            </span>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-forest hover:bg-forest-light text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>{t.getRecommendations}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Feedback */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2 text-sm text-agri-error">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Section */}
      {response && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-agri-text">
                Recommendation Results ({response.matches.length} matching crops)
              </h2>
              <p className="text-xs text-agri-muted">
                Evaluated {response.total_crops_evaluated} crops for {response.input_summary.soil_type} soil in {response.input_summary.season} season ({response.input_summary.water_availability} water).
              </p>
            </div>
          </div>

          {response.matches.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-agri-border">
              <Info className="w-10 h-10 text-agri-warning mx-auto mb-2" />
              <h3 className="font-bold text-agri-text text-base">No Direct Matches Found</h3>
              <p className="text-xs text-agri-muted max-w-md mx-auto mt-1">
                Your combination of soil, season, and water availability is highly specific or restrictive. Try adjusting water supply or selecting Year-round season.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {response.matches.map((match: RecommendationMatch) => {
                const badgeColor =
                  match.match_score >= 80
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : match.match_score >= 60
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-orange-100 text-orange-800 border-orange-300';

                return (
                  <div
                    key={match.crop.id}
                    className="bg-white rounded-3xl border border-agri-border p-6 shadow-xs flex flex-col justify-between hover:border-forest/40 transition-colors"
                  >
                    <div className="space-y-4">
                      {/* Top Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-agri-muted block">
                            {match.crop.category} • {match.crop.season}
                          </span>
                          <h3 className="text-xl font-bold text-agri-text">
                            {match.crop.name}
                          </h3>
                          {match.crop.scientific_name && (
                            <span className="text-xs italic text-agri-muted block">
                              {match.crop.scientific_name}
                            </span>
                          )}
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${badgeColor}`}
                          >
                            {match.match_score}% Match
                          </span>
                          <span className="block text-[10px] text-agri-muted font-semibold mt-0.5">
                            {match.match_level}
                          </span>
                        </div>
                      </div>

                      {/* Explanation */}
                      <div className="p-3.5 rounded-2xl bg-sage-light/60 border border-agri-border/70 text-xs text-agri-text leading-relaxed">
                        <p className="font-bold text-forest mb-0.5">Why this matches:</p>
                        <p>{match.explanation}</p>
                      </div>

                      {/* Matching criteria list */}
                      <div>
                        <span className="text-xs font-bold text-agri-text block mb-1.5">
                          Verified Matching Factors:
                        </span>
                        <ul className="space-y-1">
                          {match.matched_criteria.map((crit, idx) => (
                            <li
                              key={idx}
                              className="flex items-start space-x-2 text-xs text-agri-muted"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-forest flex-shrink-0 mt-0.5" />
                              <span>{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Unmet or limitations */}
                      {match.unmet_or_partial_criteria.length > 0 && (
                        <div>
                          <span className="text-xs font-bold text-agri-warning block mb-1">
                            Agronomic Cautions & Adjustments:
                          </span>
                          <ul className="space-y-1">
                            {match.unmet_or_partial_criteria.map((unm, idx) => (
                              <li
                                key={idx}
                                className="flex items-start space-x-2 text-xs text-agri-muted"
                              >
                                <AlertTriangle className="w-3.5 h-3.5 text-agri-warning flex-shrink-0 mt-0.5" />
                                <span>{unm}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-6 pt-4 border-t border-agri-border flex items-center justify-between">
                      <span className="text-xs text-agri-muted font-medium">
                        Water Need: <strong className="text-agri-text">{match.crop.water_requirement}</strong>
                      </span>
                      <Link
                        to={`/crops/${match.crop.id}`}
                        className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-forest hover:bg-forest-light px-4 py-2 rounded-xl transition-colors"
                      >
                        <span>Open Full Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Educational Disclaimer Banner */}
          <div className="bg-white p-5 rounded-2xl border-l-4 border-l-forest border border-agri-border flex items-start space-x-3 text-xs text-agri-muted">
            <ShieldAlert className="w-5 h-5 text-forest flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-agri-text mb-0.5">Agricultural Recommendation Notice</p>
              <p className="leading-relaxed">{response.educational_disclaimer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
