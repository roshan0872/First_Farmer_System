import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Sparkles,
  BookOpen,
  Wheat,
  Bug,
  Scissors,
  PackageCheck,
  CloudSun,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../locales';
import { api } from '../services/api';
import { Crop } from '../types';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const [featuredCrops, setFeaturedCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const crops = await api.get<Crop[]>('/crops');
        setFeaturedCrops(crops.slice(0, 4));
      } catch (err) {
        console.error('Failed to load featured crops', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  const features = [
    {
      title: t.cropRecommendation,
      desc: "Scientific rule-based matching based on your region's soil, season, and water availability with transparent scoring.",
      icon: Sparkles,
      to: "/recommendations",
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      title: t.cultivationGuide,
      desc: "Step-by-step agronomic guidelines covering land preparation, seed treatment, irrigation schedules, and nutrient timing.",
      icon: Wheat,
      to: "/cultivation",
      color: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      title: t.pestAndDisease,
      desc: "Field-verified pest and disease identification symptoms, environmental triggers, and Integrated Pest Management (IPM).",
      icon: Bug,
      to: "/pests-diseases",
      color: "bg-red-50 text-red-800 border-red-200",
    },
    {
      title: t.harvestingGuide,
      desc: "Accurate physiological maturity indicators, harvest techniques, moisture thresholds, and handling to avoid field losses.",
      icon: Scissors,
      to: "/harvesting",
      color: "bg-blue-50 text-blue-800 border-blue-200",
    },
    {
      title: t.postHarvest,
      desc: "Industrial processing methods, food products, by-product valorization, and storage systems that multiply farmgate value.",
      icon: PackageCheck,
      to: "/post-harvest",
      color: "bg-purple-50 text-purple-800 border-purple-200",
    },
    {
      title: t.weather,
      desc: "Real-time agro-meteorological advisories connecting temperature, wind, and precipitation to spraying and irrigation tasks.",
      icon: CloudSun,
      to: "/weather",
      color: "bg-teal-50 text-teal-800 border-teal-200",
    },
  ];

  const journeySteps = [
    { step: "01", title: "Crop Selection", desc: "Evaluate regional soil, season, and rainfall to pick high-suitability crops." },
    { step: "02", title: "Nursery & Sowing", desc: "Master seed treatment, furrow spacing, and land tilth preparation." },
    { step: "03", title: "Health Defense", desc: "Identify early fungal blights or insect pests before economic injury levels." },
    { step: "04", title: "Maturity & Harvest", desc: "Reap at peak moisture and color to preserve grain quality and seed vigour." },
    { step: "05", title: "Value Addition", desc: "Transform raw produce into consumer flours, oils, sauces, and packaged goods." },
  ];

  return (
    <div className="space-y-12 pb-6">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-forest via-[#255e3e] to-forest-light text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 pointer-events-none">
          <Sprout className="w-96 h-96" />
        </div>
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white/90">
            <Sprout className="w-4 h-4 text-emerald-300" />
            <span>First Farmer Agriculture System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {t.tagline}
          </h1>

          <p className="text-white/85 text-base sm:text-lg leading-relaxed pt-1">
            {t.heroDesc}
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              to="/crops"
              className="inline-flex items-center space-x-2 bg-white text-forest hover:bg-sage-light font-bold px-6 py-3 rounded-xl shadow-md transition-all hover:scale-[1.02]"
            >
              <BookOpen className="w-5 h-5" />
              <span>{t.exploreCrops}</span>
            </Link>
            <Link
              to="/recommendations"
              className="inline-flex items-center space-x-2 bg-forest-dark/70 hover:bg-forest-dark border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <Sparkles className="w-5 h-5 text-emerald-300" />
              <span>{t.cropRecommendation}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-agri-text">Core Agriculture Modules</h2>
            <p className="text-sm text-agri-muted">Comprehensive educational guidance designed for beginners and students.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Link
                key={idx}
                to={feat.to}
                className="bg-white p-6 rounded-2xl border border-agri-border hover:border-forest/40 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-agri-text group-hover:text-forest transition-colors mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-agri-muted leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-agri-border/60 flex items-center text-xs font-semibold text-forest group-hover:translate-x-1 transition-transform">
                  <span>Explore guide</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5-Step Learning Journey */}
      <section className="bg-white p-8 rounded-3xl border border-agri-border shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold text-forest uppercase tracking-wider block">End-to-End Curriculum</span>
          <h2 className="text-2xl font-bold text-agri-text mt-1">The Complete Agricultural Cycle</h2>
          <p className="text-sm text-agri-muted">Understand every vital step required to convert seed to value-added market products.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {journeySteps.map((step, idx) => (
            <div key={idx} className="bg-sage-light/50 p-4 rounded-2xl border border-agri-border relative">
              <span className="text-2xl font-black text-sage/70 block mb-2">{step.step}</span>
              <h4 className="font-bold text-agri-text text-sm mb-1">{step.title}</h4>
              <p className="text-xs text-agri-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Crops Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-agri-text">Featured Crops in Library</h2>
            <p className="text-sm text-agri-muted">Explore agronomy, pests, and post-harvest derivatives for major crops.</p>
          </div>
          <Link to="/crops" className="text-sm font-semibold text-forest hover:underline flex items-center">
            <span>View all 10 crops</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white h-64 rounded-2xl border border-agri-border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCrops.map((crop) => (
              <Link
                key={crop.id}
                to={`/crops/${crop.id}`}
                className="bg-white rounded-2xl border border-agri-border overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="h-40 bg-sage-light relative overflow-hidden">
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
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[11px] font-bold px-2 py-0.5 rounded-full text-forest">
                    {crop.season}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-agri-muted uppercase tracking-wider block">
                      {crop.category}
                    </span>
                    <h3 className="font-bold text-agri-text text-base group-hover:text-forest transition-colors">
                      {crop.name}
                    </h3>
                    <p className="text-xs text-agri-muted line-clamp-2 mt-1">
                      {crop.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-agri-border flex items-center justify-between text-xs text-forest font-semibold">
                    <span>{crop.difficulty_level}</span>
                    <span className="flex items-center text-xs">
                      Learn Guide &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Educational Notice Banner */}
      <section className="bg-white p-6 rounded-2xl border-l-4 border-l-forest border border-agri-border flex items-start space-x-3.5">
        <ShieldAlert className="w-6 h-6 text-forest flex-shrink-0 mt-0.5" />
        <div className="text-xs text-agri-muted leading-relaxed">
          <p className="font-bold text-agri-text text-sm mb-1">{t.disclaimerTitle}</p>
          <p>{t.disclaimerText}</p>
        </div>
      </section>
    </div>
  );
};
