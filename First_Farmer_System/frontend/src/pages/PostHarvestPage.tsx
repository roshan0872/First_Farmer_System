import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  PackageCheck,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Boxes,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { useTranslation } from '../locales';
import { api } from '../services/api';
import { Crop, CropProduct, PostHarvestGuide } from '../types';

export const PostHarvestPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<CropProduct[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [postHarvestGuide, setPostHarvestGuide] = useState<PostHarvestGuide | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedCropId = searchParams.get('crop_id') || 'All';
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    fetchProductsAndGuides();
  }, [selectedCropId, categoryFilter, search]);

  const fetchCrops = async () => {
    try {
      const data = await api.get<Crop[]>('/crops');
      setCrops(data);
    } catch (err) {
      console.error('Failed to load crops', err);
    }
  };

  const fetchProductsAndGuides = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCropId !== 'All') params.append('crop_id', selectedCropId);
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      if (search) params.append('search', search);

      const prodsData = await api.get<CropProduct[]>(`/products?${params.toString()}`);
      setProducts(prodsData);

      if (selectedCropId !== 'All') {
        const phData = await api
          .get<PostHarvestGuide>(`/crops/${selectedCropId}/post-harvest`)
          .catch(() => null);
        setPostHarvestGuide(phData);
      } else {
        setPostHarvestGuide(null);
      }
    } catch (err) {
      console.error('Failed to load products', err);
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
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest bg-sage-light px-2.5 py-1 rounded-full mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Value Addition & Processing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-text">
          {t.postHarvest}
        </h1>
        <p className="text-sm text-agri-muted mt-1 max-w-2xl">
          Transform raw farm produce into stable food ingredients, healthy oils, artisanal snacks, and industrial materials.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-agri-border shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-agri-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products: puree, cold-pressed oil, chips, jaggery, flour..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-agri-muted mb-1">Filter by Crop</label>
            <select
              value={selectedCropId}
              onChange={(e) => {
                setSearchParams(e.target.value !== 'All' ? { crop_id: e.target.value } : {});
              }}
              className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-agri-text font-medium focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <option value="All">All Agricultural Crops</option>
              {crops.map((c) => (
                <option key={c.id} value={c.id.toString()}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-agri-muted mb-1">Product Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-agri-text font-medium focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <option value="All">All Product Categories</option>
              <option value="Food">Food & Condiments</option>
              <option value="Health">Health & Nutrition</option>
              <option value="Industrial">Industrial & Bio-materials</option>
            </select>
          </div>
        </div>
      </div>

      {/* If specific crop selected, show Post-Harvest Protocol */}
      {postHarvestGuide && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-agri-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-agri-border">
            <h2 className="text-xl font-bold text-agri-text flex items-center space-x-2">
              <Boxes className="w-5 h-5 text-forest" />
              <span>Post-Harvest Protocol for {getCropName(Number(selectedCropId))}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-agri-muted">
            <div className="p-4 rounded-2xl bg-sage-light/40 border border-agri-border">
              <strong className="text-agri-text block mb-1">Cleaning, Sorting & Grading:</strong>
              <p>{postHarvestGuide.cleaning_and_grading}</p>
            </div>
            <div className="p-4 rounded-2xl bg-sage-light/40 border border-agri-border">
              <strong className="text-agri-text block mb-1">Storage & Warehousing:</strong>
              <p>{postHarvestGuide.storage_method}</p>
            </div>
            <div className="p-4 rounded-2xl bg-sage-light/40 border border-agri-border">
              <strong className="text-agri-text block mb-1">Preservation Protocols:</strong>
              <p>{postHarvestGuide.preservation_method}</p>
            </div>
            <div className="p-4 rounded-2xl bg-sage-light/40 border border-agri-border">
              <strong className="text-agri-text block mb-1">Primary Processing:</strong>
              <p>{postHarvestGuide.processing_method}</p>
            </div>
          </div>
        </div>
      )}

      {/* Product Cards */}
      <div>
        <h2 className="text-xl font-bold text-agri-text mb-4">
          Value-Added Products ({products.length})
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white h-64 rounded-3xl border border-agri-border animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-agri-border">
            <PackageCheck className="w-12 h-12 text-sage mx-auto mb-3" />
            <h3 className="font-bold text-agri-text text-lg">No Products Found</h3>
            <p className="text-xs text-agri-muted mt-1">Try selecting another category or crop.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((p) => {
              const cropName = getCropName(p.crop_id);
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl border border-agri-border p-6 shadow-xs flex flex-col justify-between hover:border-forest/40 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-forest bg-sage-light px-2.5 py-0.5 rounded-full">
                          {p.product_category}
                        </span>
                        <h3 className="text-lg font-bold text-agri-text mt-1.5">{p.product_name}</h3>
                      </div>
                      <span className="text-xs font-semibold text-agri-muted">
                        Derived from: <strong className="text-forest">{cropName}</strong>
                      </span>
                    </div>

                    <div className="text-xs text-agri-muted space-y-2.5 leading-relaxed">
                      <div>
                        <strong className="text-agri-text block">Raw Material Used:</strong>
                        <p>{p.raw_material}</p>
                      </div>
                      <div>
                        <strong className="text-agri-text block">Processing Overview:</strong>
                        <p>{p.processing_overview}</p>
                      </div>
                      <div>
                        <strong className="text-agri-text block">Commercial Culinary / Industrial Uses:</strong>
                        <p>{p.common_uses}</p>
                      </div>
                      <div className="p-3 bg-sage-light/60 rounded-xl border border-agri-border/60">
                        <strong className="text-forest block mb-0.5">Storage Considerations:</strong>
                        <p>{p.storage_considerations}</p>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <strong className="text-agri-success block mb-0.5">Value Addition Potential:</strong>
                        <p className="text-agri-text font-medium">{p.potential_value_addition}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-agri-border flex items-center justify-between">
                    <span className="text-xs text-agri-muted">Crop: <strong>{cropName}</strong></span>
                    <Link
                      to={`/crops/${p.crop_id}`}
                      className="text-xs font-bold text-forest hover:underline flex items-center space-x-1"
                    >
                      <span>Explore Crop Agronomy &rarr;</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Educational Notice */}
      <div className="bg-white p-5 rounded-2xl border-l-4 border-l-forest border border-agri-border flex items-start space-x-3 text-xs text-agri-muted">
        <ShieldAlert className="w-5 h-5 text-forest flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-agri-text mb-0.5">Value Addition Educational Notice</p>
          <p className="leading-relaxed">
            Market prices and value addition comparisons are illustrative agronomic estimates based on published food processing case studies. Commercial profitability requires FSSAI compliance, cold chain logistics, retail packaging, and distribution validation.
          </p>
        </div>
      </div>
    </div>
  );
};
