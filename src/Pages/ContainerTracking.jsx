import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Package,
  Truck,
  User,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Navigation,
  FileText,
  ExternalLink,
  Globe,
  CheckCircle2,
  HelpCircle,
  Anchor,
} from "lucide-react";
import { toast } from "react-toastify";
import { containerTrackingAPI } from "../utils/Api";
import {
  identifyShippingLine,
  validateISO6346,
} from "../utils/ShippingLineIdentifier";

export default function ContainerTracking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [containerData, setContainerData] = useState(null);
  const [allContainers, setAllContainers] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // Live Shipping Line Identification from the search query
  const liveCarrierInfo = useMemo(() => {
    const q = (searchQuery || containerData?.container_no || "").trim();
    if (q.length >= 3) {
      return identifyShippingLine(q);
    }
    return null;
  }, [searchQuery, containerData]);

  // Load sample / recent containers on mount
  useEffect(() => {
    loadRecentContainers();
  }, []);

  const loadRecentContainers = async () => {
    setTableLoading(true);
    try {
      const res = await containerTrackingAPI.getAllContainers();
      if (res && res.data) {
        setAllContainers(res.data);
      }
    } catch (err) {
      console.error("Failed to load containers list:", err);
    } finally {
      setTableLoading(false);
    }
  };

  const handleTrack = async (containerNoToSearch) => {
    const no = (containerNoToSearch || searchQuery).trim();
    if (!no) {
      toast.warn("Please enter a container number");
      return;
    }

    setLoading(true);
    try {
      const res = await containerTrackingAPI.trackContainer(no);
      if (res && res.container) {
        setContainerData(res.container);
        setSearchQuery(res.container.container_no);
        toast.success(`Container ${res.container.container_no} found!`);
      }
    } catch (err) {
      console.error("Tracking error:", err);
      toast.error(err.message || `Container "${no}" not found in system.`);
      setContainerData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "In Transit":
        return "bg-blue-100 text-blue-800 border-blue-200 animate-pulse";
      case "Loaded":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Vehicle Assigned":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      {/* Scrolling Announcement / Marquee Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-2.5 overflow-hidden shadow-sm flex items-center gap-3">
        <span className="bg-amber-500 text-gray-950 text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 flex-shrink-0 shadow-sm">
          <AlertCircle className="w-3.5 h-3.5" /> Notice
        </span>
        <marquee behavior="scroll" direction="left" scrollamount="6" className="text-xs md:text-sm font-semibold text-amber-900">
          ⚠️ This is demo data for showing how we can track the container &bull; Enter any container number above or click any sample container below to see how stages, assigned vehicle, driver details, and current location are tracked in real-time.
        </marquee>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Package className="w-96 h-96" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-200 mb-3 border border-blue-400/20">
            <Navigation className="w-3.5 h-3.5" /> Live Container Tracking & Shipping Line Inspector
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Container Tracking
          </h1>
          <p className="text-blue-100 mt-2 text-sm md:text-base">
            Track real-time location, stages, assigned truck/driver, and instantly identify the <strong>Shipping Line / Ocean Carrier</strong> for free.
          </p>

          {/* Search Input Box */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                placeholder="Enter Container Number (e.g. MSCU8492019, CMAU3381920, TGHU7718290)"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-900 text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-blue-400 font-mono font-medium shadow-inner"
              />
            </div>
            <button
              onClick={() => handleTrack()}
              disabled={loading}
              className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> Tracking...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" /> Track Now
                </>
              )}
            </button>
          </div>

          {/* Quick Select Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-blue-200">
            <span className="font-semibold text-white">Quick Test:</span>
            {["CMAU3381920", "MSCU8492019", "TGHU7718290", "MAEU1234567", "CONT99887766"].map((num) => (
              <button
                key={num}
                onClick={() => {
                  setSearchQuery(num);
                  handleTrack(num);
                }}
                className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg border border-white/10 transition-colors font-mono"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Free Shipping Line & BIC Identification Inspector Card */}
      {liveCarrierInfo && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 md:p-6 shadow-lg border border-slate-700/60 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl">{liveCarrierInfo.flag}</span>
                <span className="font-black text-lg text-white">
                  {liveCarrierInfo.carrierName}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/30 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
                  {liveCarrierInfo.type}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  BIC: {liveCarrierInfo.ownerCode}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <span>📍 HQ: <strong>{liveCarrierInfo.hq}</strong></span>
                <span>&bull;</span>
                <span>Category: <strong>{liveCarrierInfo.category}</strong></span>
              </p>
              {liveCarrierInfo.validation?.isStandardFormat && (
                <div className="text-xs mt-1">
                  {liveCarrierInfo.validation.valid ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ISO 6346 Check Digit Verified (Digit: {liveCarrierInfo.validation.actualCheckDigit})
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {liveCarrierInfo.validation.message}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Direct Official Carrier Tracking Link */}
            <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
              <a
                href={liveCarrierInfo.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition"
              >
                <Anchor className="w-4 h-4" /> Official {liveCarrierInfo.shortName} Tracking
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>
              <a
                href={liveCarrierInfo.freeBicRegistryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-600 transition"
                title="Verify on Bureau International des Containers (BIC) Free Directory"
              >
                <Globe className="w-3.5 h-3.5" /> BIC Registry
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Result View */}
      {containerData ? (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 space-y-6">
          {/* Top Info Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 font-mono tracking-tight">
                  {containerData.container_no}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusBadge(containerData.status)}`}>
                  ● {containerData.status}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Type: <span className="font-semibold text-gray-800">{containerData.container_size} {containerData.container_type}</span> | Shipping Line: <span className="font-semibold text-gray-800">{liveCarrierInfo?.carrierName || containerData.line || "Intermodal"}</span> | Seal: <span className="font-semibold font-mono text-gray-800">{containerData.seal_no || "SEAL-OK"}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Current Location:</span>
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-200 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5" /> {containerData.current_location || "In Transit"}
              </span>
            </div>
          </div>

          {/* Interactive Progress Stages */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
              Journey Progression
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {containerData.stages &&
                containerData.stages.map((stage, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-4 border transition-all ${
                      stage.completed
                        ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                        : "bg-gray-50 border-gray-200 text-gray-400 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-mono">0{idx + 1}</span>
                      {stage.completed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="font-bold text-xs md:text-sm">{stage.name}</div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      {stage.time || "Scheduled"}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Three Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Card 1: Transport Asset & Driver */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-3">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm pb-2 border-b border-gray-200">
                <Truck className="w-4 h-4" /> Assigned Vehicle & Driver
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Vehicle Number:</span>
                  <span className="font-mono font-bold text-gray-900">{containerData.vehicle_number || "Pending"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Driver Name:</span>
                  <span className="font-semibold text-gray-800">{containerData.driver_name || "Unassigned"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Driver Contact:</span>
                  {containerData.driver_contact ? (
                    <a href={`tel:${containerData.driver_contact}`} className="font-mono text-blue-600 hover:underline flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> {containerData.driver_contact}
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transporter/Vendor:</span>
                  <span className="font-semibold text-gray-800 text-right">{containerData.transporter_name || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Transport Route & Schedule */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm pb-2 border-b border-gray-200">
                <Navigation className="w-4 h-4" /> Route & Schedule
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Origin / Pickup:</span>
                  <span className="font-bold text-gray-900">{containerData.pickup_location || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Destination:</span>
                  <span className="font-bold text-gray-900">{containerData.delivery_location || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pickup Date:</span>
                  <span className="text-gray-800">
                    {containerData.expected_pickup_date ? new Date(containerData.expected_pickup_date).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Date:</span>
                  <span className="text-gray-800">
                    {containerData.expected_delivery_date ? new Date(containerData.expected_delivery_date).toLocaleDateString() : "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Booking & Client */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-3">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-sm pb-2 border-b border-gray-200">
                <FileText className="w-4 h-4" /> Booking & Client Info
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Request ID:</span>
                  <span className="font-bold text-gray-900">#{containerData.request_id}</span>
                </div>
                {containerData.shipa_no && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipa Number:</span>
                    <span className="font-mono text-gray-800">{containerData.shipa_no}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Consigner:</span>
                  <span className="font-medium text-gray-800 text-right">{containerData.consigner || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Consignee:</span>
                  <span className="font-medium text-gray-800 text-right">{containerData.consignee || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* All Available Containers Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">All Registered Containers</h3>
            <p className="text-xs text-gray-500">Click any container below to view instant status, driver details, and shipping line info</p>
          </div>
          <button
            onClick={loadRecentContainers}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh List
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Container No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Shipping Line / Carrier</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Size / Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Vehicle</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Driver</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Route</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableLoading ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    Loading containers...
                  </td>
                </tr>
              ) : allContainers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-400">
                    No containers found
                  </td>
                </tr>
              ) : (
                allContainers.map((c) => {
                  const lineInfo = identifyShippingLine(c.container_no);
                  return (
                    <tr key={c.id || c.container_no} className="hover:bg-blue-50/40 transition">
                      <td className="px-4 py-3 font-mono font-bold text-blue-700">
                        {c.container_no}
                      </td>
                      <td className="px-4 py-3">
                        {lineInfo ? (
                          <div className="flex items-center gap-1.5">
                            <span>{lineInfo.flag}</span>
                            <span className="font-semibold text-gray-900 text-xs">
                              {lineInfo.shortName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Intermodal</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {c.container_size || "40ft"} {c.container_type || ""}
                      </td>
                      <td className="px-4 py-3 font-mono font-medium text-gray-800">
                        {c.vehicle_number || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {c.driver_name || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {c.pickup_location && c.delivery_location
                          ? `${c.pickup_location} → ${c.delivery_location}`
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(c.request_status)}`}>
                          {c.request_status || "Assigned"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setSearchQuery(c.container_no);
                            handleTrack(c.container_no);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          Track
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
    </div>
  );
}
