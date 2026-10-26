import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Users,
  BookOpen,
  Bug,
  PackageCheck,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';
import { AdminStats, Crop } from '../types';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New Crop Form Modal state
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [newCropName, setNewCropName] = useState('');
  const [newScientificName, setNewScientificName] = useState('');
  const [newCategory, setNewCategory] = useState('Cereal');
  const [newDescription, setNewDescription] = useState('');
  const [newRegions, setNewRegions] = useState('South India');
  const [newSoil, setNewSoil] = useState('Loamy');
  const [newClimate, setNewClimate] = useState('Warm tropical climate; 20-30°C');
  const [newSeason, setNewSeason] = useState('Kharif');
  const [newWater, setNewWater] = useState('Medium');
  const [newDifficulty, setNewDifficulty] = useState('Beginner');
  const [newImage, setNewImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsData, cropsData] = await Promise.all([
        api.get<AdminStats>('/admin/stats'),
        api.get<Crop[]>('/crops'),
      ]);
      setStats(statsData);
      setCrops(cropsData);
    } catch (err: any) {
      setFeedback({ text: err.detail || 'Failed to load administrator data.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const created = await api.post<Crop>('/crops', {
        name: newCropName.trim(),
        scientific_name: newScientificName.trim() || undefined,
        category: newCategory,
        description: newDescription.trim(),
        suitable_regions: newRegions.trim(),
        soil_requirements: newSoil.trim(),
        climate_requirements: newClimate.trim(),
        season: newSeason,
        water_requirement: newWater,
        difficulty_level: newDifficulty,
        image_path: newImage.trim() || undefined,
        is_published: true,
      });

      setCrops((prev) => [...prev, created]);
      setShowAddCrop(false);
      setFeedback({ text: `Crop '${created.name}' created successfully!`, type: 'success' });

      // Reset form
      setNewCropName('');
      setNewScientificName('');
      setNewDescription('');
    } catch (err: any) {
      setFeedback({ text: err.detail || 'Failed to create crop record.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCrop = async (cropId: number, cropName: string) => {
    const confirmDel = window.confirm(
      `Are you sure you want to delete crop '${cropName}' and all its associated guides? This destructive action cannot be undone.`
    );
    if (!confirmDel) return;

    try {
      await api.delete(`/crops/${cropId}`);
      setCrops((prev) => prev.filter((c) => c.id !== cropId));
      setFeedback({ text: `Crop '${cropName}' deleted successfully.`, type: 'success' });
      if (stats) {
        setStats({ ...stats, total_crops: Math.max(0, stats.total_crops - 1) });
      }
    } catch (err: any) {
      setFeedback({ text: err.detail || 'Failed to delete crop.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-forest" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-agri-warning bg-amber-50 px-2.5 py-1 rounded-full mb-2 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Control Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-text">
            Agricultural Platform Administration
          </h1>
          <p className="text-sm text-agri-muted mt-1">
            Server-side role validated. Manage verified crops, agronomic records, and review user learning activity.
          </p>
        </div>

        <button
          onClick={() => setShowAddCrop(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Crop Record</span>
        </button>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center space-x-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-agri-success'
              : 'bg-red-50 border-red-200 text-agri-error'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-agri-border shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-agri-muted block">Users</span>
            <div className="text-xl font-black text-agri-text mt-0.5">{stats.total_users}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-agri-border shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-agri-muted block">Crops</span>
            <div className="text-xl font-black text-agri-text mt-0.5">{stats.total_crops}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-agri-border shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-agri-muted block">Pests & Diseases</span>
            <div className="text-xl font-black text-agri-text mt-0.5">{stats.total_pests_diseases}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-agri-border shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-agri-muted block">Products</span>
            <div className="text-xl font-black text-agri-text mt-0.5">{stats.total_products}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-agri-border shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-agri-muted block">Bookmarks</span>
            <div className="text-xl font-black text-agri-text mt-0.5">{stats.total_bookmarks}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-agri-border shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-agri-muted block">Progress Records</span>
            <div className="text-xl font-black text-agri-text mt-0.5">{stats.total_learning_records}</div>
          </div>
        </div>
      )}

      {/* Crops Table */}
      <div className="bg-white rounded-3xl border border-agri-border shadow-xs overflow-hidden">
        <div className="p-6 border-b border-agri-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-agri-text">Managed Crop Records ({crops.length})</h2>
          <span className="text-xs text-agri-muted">Database-backed entities</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-agri-page border-b border-agri-border text-agri-muted font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Crop Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Season</th>
                <th className="py-3 px-4">Soil Needs</th>
                <th className="py-3 px-4">Water</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-agri-border">
              {crops.map((c) => (
                <tr key={c.id} className="hover:bg-sage-light/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-agri-text block">{c.name}</span>
                    <span className="italic text-[11px] text-agri-muted">{c.scientific_name || '—'}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-agri-muted">{c.category}</td>
                  <td className="py-3.5 px-4 font-semibold text-agri-muted">{c.season}</td>
                  <td className="py-3.5 px-4 text-agri-muted max-w-xs truncate">{c.soil_requirements}</td>
                  <td className="py-3.5 px-4 text-agri-muted">{c.water_requirement}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleDeleteCrop(c.id, c.name)}
                      className="p-1.5 text-agri-muted hover:text-agri-error rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Crop Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Users Table */}
      {stats && stats.recent_users.length > 0 && (
        <div className="bg-white rounded-3xl border border-agri-border shadow-xs overflow-hidden">
          <div className="p-6 border-b border-agri-border">
            <h2 className="text-lg font-bold text-agri-text">Recent Registered Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-agri-page border-b border-agri-border text-agri-muted font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-agri-border">
                {stats.recent_users.map((u) => (
                  <tr key={u.id} className="hover:bg-sage-light/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-agri-text">{u.full_name}</td>
                    <td className="py-3 px-4 text-agri-muted">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 uppercase text-agri-muted font-semibold">{u.preferred_language}</td>
                    <td className="py-3 px-4 text-agri-muted">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Crop Modal */}
      {showAddCrop && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-agri-border p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-agri-border">
              <h3 className="text-xl font-bold text-agri-text">Create Agricultural Crop</h3>
              <button
                onClick={() => setShowAddCrop(false)}
                className="text-agri-muted hover:text-agri-text font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCrop} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-agri-text mb-1">Crop Name *</label>
                  <input
                    type="text"
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    required
                    placeholder="e.g. Barley"
                    className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                </div>

                <div>
                  <label className="block font-bold text-agri-text mb-1">Scientific Name</label>
                  <input
                    type="text"
                    value={newScientificName}
                    onChange={(e) => setNewScientificName(e.target.value)}
                    placeholder="e.g. Hordeum vulgare"
                    className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-agri-text mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  >
                    <option value="Cereal">Cereal</option>
                    <option value="Vegetable">Vegetable</option>
                    <option value="Fruit">Fruit</option>
                    <option value="Cash Crop">Cash Crop</option>
                    <option value="Pulse">Pulse</option>
                    <option value="Millet">Millet</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-agri-text mb-1">Season *</label>
                  <select
                    value={newSeason}
                    onChange={(e) => setNewSeason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  >
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Zaid">Zaid</option>
                    <option value="Year-round">Year-round</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-agri-text mb-1">Water Need *</label>
                  <select
                    value={newWater}
                    onChange={(e) => setNewWater(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-agri-text mb-1">Description *</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                  rows={3}
                  placeholder="Overview of the crop and agricultural importance..."
                  className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-agri-text mb-1">Soil Requirements *</label>
                  <input
                    type="text"
                    value={newSoil}
                    onChange={(e) => setNewSoil(e.target.value)}
                    placeholder="e.g. Loamy, Sandy Loam"
                    className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                </div>

                <div>
                  <label className="block font-bold text-agri-text mb-1">Suitable Regions *</label>
                  <input
                    type="text"
                    value={newRegions}
                    onChange={(e) => setNewRegions(e.target.value)}
                    placeholder="e.g. North India, Central India"
                    className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-agri-text mb-1">Image URL</label>
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-agri-border bg-agri-page text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-agri-border">
                <button
                  type="button"
                  onClick={() => setShowAddCrop(false)}
                  className="px-4 py-2 border border-agri-border rounded-xl text-agri-muted hover:bg-agri-page font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-forest hover:bg-forest-light text-white font-bold rounded-xl text-xs shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Save Crop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
