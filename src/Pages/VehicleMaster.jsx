import React, { useState, useEffect } from "react";
import { Search, Truck, Plus, Trash2, RefreshCw, X, Shield, Calendar, Phone } from "lucide-react";
import { toast } from "react-toastify";
import { vehicleAPI } from "../utils/Api";

export default function VehicleMaster() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_number: "",
    vehicle_type: "Truck",
    make: "Tata",
    model: "LPT",
    year: "2022",
    chassis_number: "",
    engine_number: "",
    registration_date: "",
    owner_name: "",
    owner_contact: "",
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await vehicleAPI.getAllVehicles();
      const list = res.data || res || [];
      if (Array.isArray(list)) {
        setVehicles(list);
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.vehicle_number.trim()) {
      toast.warn("Vehicle number is required");
      return;
    }
    setSubmitting(true);
    try {
      await vehicleAPI.createVehicle(formData);
      toast.success(`Vehicle ${formData.vehicle_number.toUpperCase()} registered successfully!`);
      setIsModalOpen(false);
      setFormData({
        vehicle_number: "",
        vehicle_type: "Truck",
        make: "Tata",
        model: "LPT",
        year: "2022",
        chassis_number: "",
        engine_number: "",
        registration_date: "",
        owner_name: "",
        owner_contact: "",
      });
      fetchVehicles();
    } catch (err) {
      toast.error(err.message || "Failed to create vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, num) => {
    if (!window.confirm(`Are you sure you want to delete vehicle ${num}?`)) return;
    try {
      await vehicleAPI.deleteVehicle(id);
      toast.success(`Vehicle ${num} deleted`);
      setVehicles(prev => prev.filter(v => (v.VEHICLE_ID || v.vehicle_id) !== id));
    } catch (err) {
      toast.error(err.message || "Failed to delete vehicle");
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const num = v.VEHICLE_NUMBER || v.vehicle_number || "";
    const type = v.VEHICLE_TYPE || v.vehicle_type || "";
    const owner = v.OWNER_NAME || v.owner_name || "";
    const q = search.toLowerCase();
    return num.toLowerCase().includes(q) || type.toLowerCase().includes(q) || owner.toLowerCase().includes(q);
  });

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs uppercase tracking-wider">
            <Truck className="w-4 h-4" /> Fleet Asset Master
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
            Vehicle Master
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your fleet of trucks, prime movers, trailers, and transport vehicles.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Vehicle
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
            placeholder="Search by vehicle number, type, or owner..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-600 w-full sm:w-auto justify-between sm:justify-end">
          <span>Total Vehicles: <strong className="text-gray-900 font-bold">{vehicles.length}</strong></span>
          <button
            onClick={fetchVehicles}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Vehicle No</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type / Make / Model</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Owner Details</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Registration</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    Loading vehicles...
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    No vehicles found
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((v, idx) => {
                  const id = v.VEHICLE_ID || v.vehicle_id || idx;
                  const num = v.VEHICLE_NUMBER || v.vehicle_number;
                  const type = v.VEHICLE_TYPE || v.vehicle_type || "Truck";
                  const make = v.MAKE || v.make || "";
                  const model = v.MODEL || v.model || "";
                  const owner = v.OWNER_NAME || v.owner_name || "-";
                  const contact = v.OWNER_CONTACT || v.owner_contact || "";
                  const regDate = v.REGISTRATION_DATE || v.registration_date;

                  return (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-mono font-bold text-gray-900">
                        {num}
                      </td>
                      <td className="px-5 py-3 text-gray-700">
                        <span className="font-semibold text-gray-900">{type}</span>
                        {(make || model) && (
                          <span className="text-gray-500 text-xs block">
                            {make} {model} {v.year ? `(${v.year})` : ""}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-gray-700 text-xs">
                        <div className="font-medium text-gray-900">{owner}</div>
                        {contact && <div className="text-gray-500">{contact}</div>}
                      </td>
                      <td className="px-5 py-3 text-gray-600 text-xs">
                        {regDate ? new Date(regDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleDelete(id, num)}
                          className="text-red-600 hover:text-red-700 text-xs font-semibold hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-lg text-gray-900">Register New Vehicle</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    value={formData.vehicle_number}
                    onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value.toUpperCase() })}
                    placeholder="e.g. DL01AB1234"
                    className="w-full px-3 py-2 text-sm border rounded-lg font-mono font-medium focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={formData.vehicle_type}
                    onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Truck">Truck</option>
                    <option value="Trailer">Trailer</option>
                    <option value="Container Carrier">Container Carrier</option>
                    <option value="Prime Mover">Prime Mover</option>
                    <option value="Car Carrier">Car Carrier</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Make</label>
                  <input
                    type="text"
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    placeholder="e.g. Tata"
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Model</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. LPT 1613"
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2022"
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Owner Name</label>
                  <input
                    type="text"
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                    placeholder="Owner / Operator Name"
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Owner Contact</label>
                  <input
                    type="text"
                    value={formData.owner_contact}
                    onChange={(e) => setFormData({ ...formData, owner_contact: e.target.value })}
                    placeholder="Mobile Number"
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                >
                  {submitting ? "Registering..." : "Register Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
