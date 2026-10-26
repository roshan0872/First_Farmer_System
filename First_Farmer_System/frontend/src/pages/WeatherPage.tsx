import React, { useEffect, useState } from 'react';
import {
  CloudSun,
  Search,
  Droplet,
  Wind,
  Thermometer,
  CloudRain,
  ShieldAlert,
  Info,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../locales';
import { api } from '../services/api';
import { WeatherData } from '../types';

export const WeatherPage: React.FC = () => {
  const { t } = useTranslation();

  const [locationInput, setLocationInput] = useState('Coimbatore');
  const [activeLocation, setActiveLocation] = useState('Coimbatore');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeather(activeLocation);
  }, [activeLocation]);

  const fetchWeather = async (loc: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<WeatherData>(`/weather?location=${encodeURIComponent(loc)}`);
      setWeather(data);
    } catch (err: any) {
      setError(err.detail || 'Could not fetch weather data for the specified location.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput.trim()) {
      setActiveLocation(locationInput.trim());
    }
  };

  const popularLocations = ['Coimbatore', 'Madurai', 'Bengaluru', 'Pune', 'Ludhiana', 'Varanasi'];

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full mb-2 border border-teal-200">
          <CloudSun className="w-3.5 h-3.5" />
          <span>Agro-Meteorological Advisory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-text">
          {t.weather}
        </h1>
        <p className="text-sm text-agri-muted mt-1 max-w-2xl">
          Track ambient temperature, relative humidity, wind velocity, and rainfall patterns to schedule foliar spraying, sowing, and irrigation.
        </p>
      </div>

      {/* Location Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-agri-border shadow-xs space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-agri-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Enter agricultural district or city (e.g. Coimbatore, Ludhiana, Pune)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-forest hover:bg-forest-light text-white font-bold rounded-xl text-sm transition-colors"
          >
            Check Weather
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-agri-muted font-semibold">Quick Locations:</span>
          {popularLocations.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                setLocationInput(loc);
                setActiveLocation(loc);
              }}
              className="px-2.5 py-1 rounded-lg bg-sage-light hover:bg-sage text-forest font-medium transition-colors"
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-agri-error">
          {error}
        </div>
      )}

      {/* Weather Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-forest" />
        </div>
      ) : weather ? (
        <div className="space-y-6">
          {/* Fallback Notice Badge if Sample Data */}
          {weather.is_sample_data && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-xs text-agri-warning">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Sample Educational Weather Mode Active</p>
                <p className="mt-0.5 text-agri-text">
                  {weather.notice_message ||
                    'OpenWeather API key is not configured in backend/.env. Displaying realistic educational simulation data to illustrate agricultural impacts.'}
                </p>
              </div>
            </div>
          )}

          {/* Current Conditions Card */}
          <div className="bg-white rounded-3xl border border-agri-border p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-agri-border gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest bg-sage-light px-3 py-1 rounded-full">
                  Current Agro-Weather
                </span>
                <h2 className="text-3xl font-extrabold text-agri-text mt-2">
                  {weather.location}, {weather.country}
                </h2>
                <p className="text-xs text-agri-muted mt-0.5 flex items-center space-x-2">
                  <span>Provider: {weather.provider}</span>
                  <span>•</span>
                  <span>Updated: {weather.updated_at}</span>
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-4xl sm:text-5xl font-black text-agri-text">
                    {Math.round(weather.temperature)}°C
                  </div>
                  <span className="text-xs font-medium text-agri-muted">
                    Feels like {Math.round(weather.feels_like)}°C • {weather.condition}
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-agri-border">
              <div className="p-4 rounded-2xl bg-agri-page border border-agri-border">
                <div className="flex items-center space-x-1.5 text-xs text-agri-muted font-semibold mb-1">
                  <Droplet className="w-4 h-4 text-forest" />
                  <span>Humidity</span>
                </div>
                <div className="text-xl font-bold text-agri-text">{weather.humidity}%</div>
                <span className="text-[10px] text-agri-muted">Relative humidity</span>
              </div>

              <div className="p-4 rounded-2xl bg-agri-page border border-agri-border">
                <div className="flex items-center space-x-1.5 text-xs text-agri-muted font-semibold mb-1">
                  <Wind className="w-4 h-4 text-forest" />
                  <span>Wind Speed</span>
                </div>
                <div className="text-xl font-bold text-agri-text">{weather.wind_speed} km/h</div>
                <span className="text-[10px] text-agri-muted">
                  {weather.wind_speed > 15 ? 'Breezy (Avoid sprays)' : 'Calm / Gentle'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-agri-page border border-agri-border">
                <div className="flex items-center space-x-1.5 text-xs text-agri-muted font-semibold mb-1">
                  <CloudRain className="w-4 h-4 text-forest" />
                  <span>Precipitation</span>
                </div>
                <div className="text-xl font-bold text-agri-text">{weather.precipitation} mm</div>
                <span className="text-[10px] text-agri-muted">Rainfall accumulation</span>
              </div>

              <div className="p-4 rounded-2xl bg-agri-page border border-agri-border">
                <div className="flex items-center space-x-1.5 text-xs text-agri-muted font-semibold mb-1">
                  <Thermometer className="w-4 h-4 text-forest" />
                  <span>Thermal Index</span>
                </div>
                <div className="text-xl font-bold text-agri-text">{weather.temperature}°C</div>
                <span className="text-[10px] text-agri-muted">Evapotranspiration rate</span>
              </div>
            </div>

            {/* Field Advisory */}
            <div className="pt-6 space-y-2">
              <h3 className="text-base font-bold text-agri-text flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-forest" />
                <span>Agricultural Field Advisory</span>
              </h3>
              <div className="p-4 bg-sage-light/70 rounded-2xl border border-agri-border text-xs text-agri-text leading-relaxed">
                {weather.agricultural_advisory}
              </div>
            </div>
          </div>

          {/* 5-Step Forecast */}
          {weather.forecast && weather.forecast.length > 0 && (
            <div className="bg-white rounded-3xl border border-agri-border p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-agri-text flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-forest" />
                <span>Upcoming Agro-Forecast Periods</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {weather.forecast.map((fc, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-agri-page border border-agri-border text-center space-y-1.5"
                  >
                    <span className="text-[11px] font-bold text-agri-muted block">{fc.time}</span>
                    <span className="text-2xl font-black text-agri-text block">
                      {Math.round(fc.temperature)}°C
                    </span>
                    <span className="text-xs font-semibold text-forest block">{fc.condition}</span>
                    <div className="text-[10px] text-agri-muted pt-1 border-t border-agri-border">
                      <p>Hum: {fc.humidity}%</p>
                      {fc.rainfall_prob !== undefined && <p>Rain: {fc.rainfall_prob}%</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
