import React, { useState, useEffect } from "react";
import { Search, MapPin, Plus, Trash2, Edit2, RefreshCw, X } from "lucide-react";
import { toast } from "react-toastify";
import { locationAPI } from "../utils/Api";

export default function LocationMaster() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [editCityName, setEditCityName] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await locationAPI.getAllLocations();
      if (Array.isArray(data)) {
        setLocations(data);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCityName.trim()) {
      toast.warning("Please enter a city name");
      return;
    }
    setSubmitting(true);
    try {
      await locationAPI.createLocation({ location_name: newCityName.trim().toUpperCase() });
      toast.success(`City "${newCityName.trim().toUpperCase()}" added successfully!`);
      setNewCityName("");
      setIsModalOpen(false);
      fetchLocations();
    } catch (err) {
      toast.error(err.message || "Failed to create location");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (loc) => {
    const id = loc.LOCATION_ID || loc.location_id;
    const name = loc.LOCATION_NAME || loc.location_name;
    setEditingCity({ id, name });
    setEditCityName(name);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editCityName.trim() || !editingCity) {
      toast.warning("Please enter a city name");
      return;
    }
    setSubmitting(true);
    try {
      await locationAPI.updateLocation(editingCity.id, {
        location_name: editCityName.trim().toUpperCase(),
      });
      toast.success(`City updated to "${editCityName.trim().toUpperCase()}"!`);
      setIsEditModalOpen(false);
      setEditingCity(null);
      fetchLocations();
    } catch (err) {
      toast.error(err.message || "Failed to update location");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from locations?`)) return;
    try {
      await locationAPI.deleteLocation(id);
      toast.success(`City "${name}" removed`);
      setLocations((prev) => prev.filter((l) => (l.LOCATION_ID || l.location_id) !== id));
    } catch (err) {
      toast.error(err.message || "Failed to delete location");
    }
  };

  const filteredLocations = locations.filter((loc) =>
    (loc.LOCATION_NAME || loc.location_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4" /> Logistics Master
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
            Location Master (Cities)
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all delivery hubs, transport cities, and pickup points across India.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm text-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New City
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search city by name (e.g. Jaipur, Delhi)..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-600 w-full sm:w-auto justify-between sm:justify-end">
          <span>
            Total Cities:{" "}
            <strong className="text-gray-900 font-bold">{locations.length}</strong>
          </span>
          <button
            onClick={fetchLocations}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Locations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  City ID
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  City / Location Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Type
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    Loading locations...
                  </td>
                </tr>
              ) : filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-400">
                    No cities matching "{search}"
                  </td>
                </tr>
              ) : (
                filteredLocations.map((loc, idx) => {
                  const id = loc.LOCATION_ID || loc.location_id;
                  const name = loc.LOCATION_NAME || loc.location_name;
                  return (
                    <tr key={id || idx} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 text-gray-500 font-mono text-xs">{id}</td>
                      <td className="px-5 py-3 font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                        {name}
                      </td>
                      <td className="px-5 py-3">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium border border-blue-100">
                          Hub City
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(loc)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDelete(id, name)}
                            className="text-red-600 hover:text-red-800 text-xs font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add City Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-lg text-gray-900">Add New City</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  City / Location Name
                </label>
                <input
                  type="text"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value.toUpperCase())}
                  placeholder="e.g. SURAT, INDORE, KOCHI"
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save City"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit City Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-lg text-gray-900">Edit City Name</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  City / Location Name
                </label>
                <input
                  type="text"
                  value={editCityName}
                  onChange={(e) => setEditCityName(e.target.value.toUpperCase())}
                  placeholder="e.g. MUMBAI, JAIPUR"
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Updating..." : "Update City"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
