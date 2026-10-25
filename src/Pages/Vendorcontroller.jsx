import React, { useState, useEffect } from "react";
import { vendorAPI } from "../utils/Api";
import { toast, ToastContainer } from "react-toastify";
import DocumentUploader from "../Components/common/DocumentUploader";
import "react-toastify/dist/ReactToastify.css";

const VendorController = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vendor_name: "",
    terminal_id: "",
    vendor_code: "",
    address: "",
    city: "",
    pin_code: "",
    state_code: "",
    country: "India",
    email_id1: "",
    email_id2: "",
    contact_no: "",
    mobile_no: "",
    fax: "",
    payment_terms: "",
    pan: "",
    tan: "",
    service_tax_reg: "",
    bank_name: "",
    ac_map_code: "",
    account_no: "",
    ifsc: "",
    bank_branch: "",
    gstin: "",
    status: "Active",
  });
  const [documents, setDocuments] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);

  // Fetch all vendors
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorAPI.getAllVendors();
      setVendors(response.data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle document uploads
  const handleDocumentChange = (index, e) => {
    const newDocuments = [...documents];
    newDocuments[index] = e.target.files[0];
    setDocuments(newDocuments);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      vendor_name: "",
      terminal_id: "",
      vendor_code: "",
      address: "",
      city: "",
      pin_code: "",
      state_code: "",
      country: "India",
      email_id1: "",
      email_id2: "",
      contact_no: "",
      mobile_no: "",
      fax: "",
      payment_terms: "",
      pan: "",
      tan: "",
      service_tax_reg: "",
      bank_name: "",
      ac_map_code: "",
      account_no: "",
      ifsc: "",
      bank_branch: "",
      gstin: "",
      status: "Active",
    });
    setDocuments([null, null, null]);
    setSelectedVendor(null);
  };

  // Create or update vendor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // Append form data, excluding null/undefined/empty strings
      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== null &&
          formData[key] !== undefined &&
          formData[key] !== ""
        ) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append documents
      documents.forEach((doc) => {
        if (doc) {
          formDataToSend.append("documents", doc);
        }
      });

      if (selectedVendor) {
        // Update vendor
        await vendorAPI.updateVendor(selectedVendor.VENDOR_ID, formDataToSend);
        toast.success("Vendor updated successfully");
      } else {
        // Create vendor
        await vendorAPI.createVendor(formDataToSend);
        toast.success("Vendor created successfully");
      }

      resetForm();
      setIsModalOpen(false);
      fetchVendors();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete vendor
  const handleDelete = async (vendorId) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        setLoading(true);
        await vendorAPI.deleteVendor(vendorId);
        toast.success("Vendor deleted successfully");
        fetchVendors();
      } catch (error) {
        toast.error(error.message || "Failed to delete vendor");
      } finally {
        setLoading(false);
      }
    }
  };

  // Open edit modal
  const handleEdit = async (vendor) => {
    try {
      setLoading(true);
      const vendorId = vendor.VENDOR_ID || vendor.vendor_id;
      const response = await vendorAPI.getVendorById(vendorId);
      const vendorData = response.data;
      setSelectedVendor(vendorData);
      setFormData({
        vendor_name: vendorData.VENDOR_NAME || vendorData.vendor_name || "",
        terminal_id: vendorData.TERMINAL_ID || vendorData.terminal_id || "",
        vendor_code: vendorData.VENDOR_CODE || vendorData.vendor_code || "",
        address: vendorData.ADDRESS || vendorData.address || "",
        city: vendorData.CITY || vendorData.city || "",
        pin_code: vendorData.PIN_CODE || vendorData.pin_code || "",
        state_code: vendorData.STATE_CODE || vendorData.state_code || "",
        country: vendorData.COUNTRY || vendorData.country || "India",
        email_id1: vendorData.EMAIL_ID1 || vendorData.email_id1 || "",
        email_id2: vendorData.EMAIL_ID2 || vendorData.email_id2 || "",
        contact_no: vendorData.CONTACT_NO || vendorData.contact_no || "",
        mobile_no: vendorData.MOBILE_NO || vendorData.mobile_no || "",
        fax: vendorData.FAX || vendorData.fax || "",
        payment_terms: vendorData.PAYMENT_TERMS || vendorData.payment_terms || "",
        pan: vendorData.PAN || vendorData.pan || "",
        tan: vendorData.TAN || vendorData.tan || "",
        service_tax_reg: vendorData.SERVICE_TAX_REG || vendorData.service_tax_reg || "",
        bank_name: vendorData.BANK_NAME || vendorData.bank_name || "",
        ac_map_code: vendorData.AC_MAP_CODE || vendorData.ac_map_code || "",
        account_no: vendorData.ACCOUNT_NO || vendorData.account_no || "",
        ifsc: vendorData.IFSC || vendorData.ifsc || "",
        bank_branch: vendorData.BANK_BRANCH || vendorData.bank_branch || "",
        gstin: vendorData.GSTIN || vendorData.gstin || "",
        status: vendorData.STATUS || vendorData.status || "Active",
      });
      setDocuments([null, null, null]);
      setIsModalOpen(true);
    } catch (error) {
      toast.error(error.message || "Failed to fetch vendor details");
    } finally {
      setLoading(false);
    }
  };

  // View document
  const handleViewDocument = (vendorId, docNumber) => {
    const url = vendorAPI.getVendorDocumentUrl(vendorId, docNumber);
    window.open(url, "_blank");
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Vendor Management</h1>

      {/* Create Button */}
      <button
        onClick={() => {
          resetForm();
          setIsModalOpen(true);
        }}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create New Vendor
      </button>

      {/* Vendors Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Code</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Documents</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              vendors.map((vendor) => {
                const vendorId = vendor.VENDOR_ID || vendor.vendor_id;
                const vendorName = vendor.VENDOR_NAME || vendor.vendor_name || "-";
                const vendorCode = vendor.VENDOR_CODE || vendor.vendor_code || "-";
                const email = vendor.EMAIL_ID1 || vendor.email_id1 || "-";
                const status = vendor.STATUS || vendor.status || "Active";

                return (
                  <tr key={vendorId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-gray-600">{vendorId}</td>
                    <td className="px-4 py-2 border font-medium text-gray-800">{vendorName}</td>
                    <td className="px-4 py-2 border text-gray-600">{vendorCode}</td>
                    <td className="px-4 py-2 border text-gray-600">{email}</td>
                    <td className="px-4 py-2 border">
                      {["1", "2", "3"].map((doc) => {
                        const hasDoc =
                          vendor[`HAS_DOCUMENT${doc}`] === "true" ||
                          vendor[`has_document${doc}`] === "true" ||
                          vendor[`has_document${doc}`] === true;
                        return (
                          hasDoc && (
                            <button
                              key={doc}
                              onClick={() => handleViewDocument(vendorId, doc)}
                              className="text-blue-500 hover:underline mr-2 font-medium"
                            >
                              Doc {doc}
                            </button>
                          )
                        );
                      })}
                    </td>
                    <td className="px-4 py-2 border">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleEdit(vendor)}
                        className="text-blue-600 hover:underline mr-3 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vendorId)}
                        className="text-red-600 hover:underline font-medium"
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

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedVendor ? "Edit Vendor" : "Create Vendor"}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1">Vendor Name *</label>
                  <input
                    type="text"
                    name="vendor_name"
                    value={formData.vendor_name}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Vendor Code</label>
                  <input
                    type="text"
                    name="vendor_code"
                    value={formData.vendor_code}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">Terminal ID</label>
                  <input
                    type="number"
                    name="terminal_id"
                    value={formData.terminal_id}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">Email 1</label>
                  <input
                    type="email"
                    name="email_id1"
                    value={formData.email_id1}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">Email 2</label>
                  <input
                    type="email"
                    name="email_id2"
                    value={formData.email_id2}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">Contact No</label>
                  <input
                    type="text"
                    name="contact_no"
                    value={formData.contact_no}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">Mobile No</label>
                  <input
                    type="text"
                    name="mobile_no"
                    value={formData.mobile_no}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">Fax</label>
                  <input
                    type="text"
                    name="fax"
                    value={formData.fax}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              </div>

              {/* Address Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">Pin Code</label>
                  <input
                    type="text"
                    name="pin_code"
                    value={formData.pin_code}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">State Code</label>
                  <input
                    type="text"
                    name="state_code"
                    value={formData.state_code}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              </div>

              {/* Tax and Bank Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1">PAN</label>
                  <input
                    type="text"
                    name="pan"
                    value={formData.pan}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">TAN</label>
                  <input
                    type="text"
                    name="tan"
                    value={formData.tan}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">Service Tax Reg</label>
                  <input
                    type="text"
                    name="service_tax_reg"
                    value={formData.service_tax_reg}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">GSTIN</label>
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">Bank Name</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">Account No</label>
                  <input
                    type="text"
                    name="account_no"
                    value={formData.account_no}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">IFSC</label>
                  <input
                    type="text"
                    name="ifsc"
                    value={formData.ifsc}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">Bank Branch</label>
                  <input
                    type="text"
                    name="bank_branch"
                    value={formData.bank_branch}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">AC Map Code</label>
                  <input
                    type="text"
                    name="ac_map_code"
                    value={formData.ac_map_code}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">Payment Terms</label>
                  <input
                    type="text"
                    name="payment_terms"
                    value={formData.payment_terms}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              </div>

              {/* Documents Section with DocumentUploader */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-gray-800">
                    Vendor Verification Documents (Max 3, up to 5MB each)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Upload GST registration, PAN card, or agreement contracts in PDF or image format (JPG, PNG, WEBP).
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((num) => {
                    const hasDoc = selectedVendor && (
                      selectedVendor[`HAS_DOCUMENT${num}`] === "true" ||
                      selectedVendor[`has_document${num}`] === "true" ||
                      selectedVendor[`has_document${num}`] === true
                    );
                    const docName = selectedVendor ? (selectedVendor[`DOCUMENT${num}_NAME`] || selectedVendor[`document${num}_name`] || `Document ${num}`) : `Document ${num}`;
                    const docUrl = hasDoc && selectedVendor ? vendorAPI.getVendorDocumentUrl(selectedVendor.VENDOR_ID || selectedVendor.vendor_id, num) : null;

                    return (
                      <DocumentUploader
                        key={num}
                        label={`Document ${num}`}
                        description="PDF or Image (Max 5MB)"
                        selectedFile={documents[num - 1]}
                        onFileSelect={(file) => {
                          const newDocs = [...documents];
                          newDocs[num - 1] = file;
                          setDocuments(newDocs);
                        }}
                        hasExistingDoc={hasDoc}
                        existingDocUrl={docUrl}
                        existingDocName={docName}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="block mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {loading
                    ? "Processing..."
                    : selectedVendor
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorController;
