import React, { useState, useEffect } from "react";
import { Search, Truck, Plus, Trash2, RefreshCw, X, Shield, Calendar, Phone, FileText, ExternalLink, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { vehicleAPI } from "../utils/Api";
import DocumentUploader from "../Components/common/DocumentUploader";

export default function VehicleMaster() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Document upload state
  const [rcFile, setRcFile] = useState(null);
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [fitnessFile, setFitnessFile] = useState(null);

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

  const handleOpenModal = () => {
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
    setRcFile(null);
    setInsuranceFile(null);
    setFitnessFile(null);
    setIsModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.vehicle_number.trim()) {
      toast.warn("Vehicle number is required");
      return;
    }
    setSubmitting(true);
    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((k) => {
        if (formData[k] !== null && formData[k] !== undefined && formData[k] !== "") {
          dataToSend.append(k, formData[k]);
        }
      });
      if (rcFile) dataToSend.append("rc_doc", rcFile);
      if (insuranceFile) dataToSend.append("insurance_doc", insuranceFile);
      if (fitnessFile) dataToSend.append("fitness_doc", fitnessFile);

      await vehicleAPI.createVehicle(dataToSend);
      toast.success(`Vehicle ${formData.vehicle_number.toUpperCase()} registered successfully with documents!`);
      setIsModalOpen(false);
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
      setVehicles((prev) => prev.filter((v) => (v.VEHICLE_ID || v.vehicle_id) !== id));
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
            Manage fleet vehicles, compliance certificates, registration (RC), and insurance documents.
          </p>
        </div>
        <button
          onClick={handleOpenModal}
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
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Compliance Documents</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Registration</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    Loading vehicles...
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
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

                  const hasRc = v.HAS_RC_DOC === "true" || v.has_rc_doc === "true";
                  const hasIns = v.HAS_INSURANCE_DOC === "true" || v.has_insurance_doc === "true";
                  const hasFit = v.HAS_FITNESS_DOC === "true" || v.has_fitness_doc === "true";

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
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {hasRc ? (
                            <a
                              href={vehicleAPI.getVehicleDocumentUrl(id, "rc")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition"
                              title="View Registration Certificate"
                            >
                              <CheckCircle2 className="w-3 h-3" /> RC
                            </a>
                          ) : (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-400">
                              RC -
                            </span>
                          )}

                          {hasIns ? (
                            <a
                              href={vehicleAPI.getVehicleDocumentUrl(id, "insurance")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
                              title="View Insurance Policy"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Insurance
                            </a>
                          ) : (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-400">
                              Ins -
                            </span>
                          )}

                          {hasFit ? (
                            <a
                              href={vehicleAPI.getVehicleDocumentUrl(id, "fitness")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 hover:bg-purple-200 transition"
                              title="View Fitness Certificate"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Fitness
                            </a>
                          ) : (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-400">
                              Fit -
                            </span>
                          )}
                        </div>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Register New Fleet Vehicle</h3>
                <p className="text-xs text-gray-500">Provide vehicle specifications and upload compliance certificates.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Chassis Number</label>
                  <input
                    type="text"
                    value={formData.chassis_number}
                    onChange={(e) => setFormData({ ...formData, chassis_number: e.target.value })}
                    placeholder="Chassis Number"
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Engine Number</label>
                  <input
                    type="text"
                    value={formData.engine_number}
                    onChange={(e) => setFormData({ ...formData, engine_number: e.target.value })}
                    placeholder="Engine Number"
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                </div>
              </div>

              {/* Compliance Documents Upload Section */}
              <div className="pt-2 border-t">
                <div className="mb-3">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Vehicle Documents & Compliance Certificates
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Upload official PDF documents or clear photos (max 5MB each). Stored securely as database bytea.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <DocumentUploader
                    label="Registration (RC)"
                    description="PDF or Image"
                    selectedFile={rcFile}
                    onFileSelect={setRcFile}
                  />
                  <DocumentUploader
                    label="Insurance Policy"
                    description="PDF or Image"
                    selectedFile={insuranceFile}
                    onFileSelect={setInsuranceFile}
                  />
                  <DocumentUploader
                    label="Fitness Certificate"
                    description="PDF or Image"
                    selectedFile={fitnessFile}
                    onFileSelect={setFitnessFile}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 shadow-sm"
                >
                  {submitting ? "Registering..." : "Register Vehicle & Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
