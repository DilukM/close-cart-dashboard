import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, Loader, ArrowLeft } from "lucide-react";
import CreateModal from "../components/CreateOfferModel";

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [currentView, setCurrentView] = useState("list"); // "list", "create", "edit", "detail"
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
    imageFile: null,
    category: "",
    tags: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        "https://closecart-backend.vercel.app/api/v1/offers/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if data is in the expected format
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch offers");
      }

      // Assuming the offers array is in data.offers or data directly
      const offersArray = data.data || data;

      setOffers(offersArray);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleCreate = async (formDataObj) => {
    console.log("Form Data Object:", formDataObj);
    setIsSubmitting(true);

    try {
      setError(null);

      // Create FormData object for file upload
      const formData = new FormData();
      formData.append("title", formDataObj.title);
      formData.append("description", formDataObj.description);
      formData.append("discount", formDataObj.discount);
      formData.append("startDate", formDataObj.startDate);
      formData.append("endDate", formDataObj.endDate);
      formData.append("category", formDataObj.category);
      formData.append("tags", JSON.stringify(formDataObj.tags));

      if (formDataObj.imageFile) {
        formData.append("image", formDataObj.imageFile);
      }

      const response = await fetch(
        "https://closecart-backend.vercel.app/api/v1/offers/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          console.log("ErrorData:", errorData),
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      await fetchOffers();
      setCurrentView("list");
      resetForm();
    } catch (error) {
      console.error("Error creating offer:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (formDataObj) => {
    setIsSubmitting(true);
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append("title", formDataObj.title);
      formData.append("description", formDataObj.description);
      formData.append("discount", formDataObj.discount);
      formData.append("startDate", formDataObj.startDate);
      formData.append("endDate", formDataObj.endDate);
      formData.append("category", formDataObj.category);
      formData.append("tags", JSON.stringify(formDataObj.tags));

      if (formDataObj.imageFile) {
        formData.append("image", formDataObj.imageFile);
      }

      const response = await fetch(
        `https://closecart-backend.vercel.app/api/v1/offers/${selectedOffer._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      await fetchOffers();
      setCurrentView("list");
      resetForm();
    } catch (error) {
      console.error("Error updating offer:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setIsSubmitting(true);
    try {
      await fetch(`https://closecart-backend.vercel.app/api/v1/offers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      await fetchOffers();
      setCurrentView("list");
    } catch (error) {
      console.error("Error deleting offer:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discount: "",
      startDate: "",
      endDate: "",
      imageFile: null,
      category: "",
      tags: [],
    });
  };

  const formatDate = (dateString) => {
    const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredOffers = Array.isArray(offers)
    ? offers
        .filter(
          (offer) =>
            offer?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            offer?.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          if (sortBy === "newest")
            return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
          if (sortBy === "highest")
            return (b?.discount || 0) - (a?.discount || 0);
          if (sortBy === "lowest")
            return (a?.discount || 0) - (b?.discount || 0);
          return 0;
        })
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center">
        <div className="text-yellow-500 text-xl">Loading offers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  // List View
  if (currentView === "list") {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Offer Management
          </h1>
          <button
            onClick={() => {
              resetForm();
              setCurrentView("create");
            }}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black rounded-lg flex items-center justify-center sm:justify-start gap-2 transition-all duration-300"
          >
            <Plus size={20} /> Create Offer
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search offers..."
              className="w-full pl-10 pr-4 py-2 bg-gray-200 dark:bg-gray-900 border border-white dark:border-gray-700 rounded-lg text-grey-800 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 bg-gray-200 dark:bg-gray-900 border border-white dark:border-gray-700 rounded-lg text-grey-800 dark:text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Discount</option>
            <option value="lowest">Lowest Discount</option>
          </select>
        </div>

        {/* Offer Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          layout
        >
          <AnimatePresence>
            {filteredOffers.map((offer) => (
              <motion.div
                key={offer._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="bg-gray-100 dark:bg-gray-700 shadow-md border dark:border-gray-700 border-white hover:border-yellow-500 rounded-lg cursor-pointer transition-all duration-300 relative overflow-hidden group"
                  onClick={() => {
                    setSelectedOffer(offer);
                    setCurrentView("detail");
                  }}
                >
                  <img
                    src={offer.imageUrl}
                    alt={offer.title}
                    className="w-full h-40 sm:h-50 object-cover rounded-t-lg shadow-md"
                  />
                  <div className="p-4 sm:p-6 transition-all duration-300 relative overflow-hidden group">
                    <h3 className="text-lg sm:text-xl font-semibold text-yellow-500 mb-2">
                      {offer.title}
                    </h3>
                    <p className="dark:text-gray-400 text-gray-700 mb-2 sm:mb-4">
                      {offer.discount}% OFF
                    </p>
                    <p className="dark:text-gray-300 text-gray-800 line-clamp-2 text-sm sm:text-base">
                      {offer.description}
                    </p>
                    <p className="dark:text-gray-300 text-gray-800 line-clamp-2 text-sm sm:text-base mt-2">
                      <span className="block sm:inline">
                        From: {formatDate(offer.startDate)}
                      </span>{" "}
                      <span className="block sm:inline">
                        To: {formatDate(offer.endDate)}
                      </span>
                    </p>

                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // Create View
  if (currentView === "create") {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setCurrentView("list")}
            className="mr-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Create New Offer
          </h1>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <CreateModal
            onClose={() => {
              if (!isSubmitting) {
                setCurrentView("list");
                resetForm();
              }
            }}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleCreate}
            isEditMode={false}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    );
  }

  // Edit View
  if (currentView === "edit") {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setCurrentView("detail")}
            className="mr-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Edit Offer
          </h1>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <CreateModal
            onClose={() => {
              if (!isSubmitting) {
                setCurrentView("detail");
              }
            }}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleUpdate}
            isEditMode={true}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    );
  }

  // Detail View
  if (currentView === "detail") {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setCurrentView("list")}
            className="mr-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Offer Details
          </h1>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6">
            {/* Image Section */}
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <img
                src={selectedOffer?.imageUrl}
                alt={selectedOffer?.title}
                className="w-full h-auto rounded-lg shadow-lg object-cover border-2 border-yellow-500"
              />
            </div>

            {/* Offer Details Section */}
            <div className="w-full md:w-1/2 flex flex-col h-full">
              <div className="flex-grow space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3 border-b border-yellow-400 pb-2">
                  {selectedOffer?.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                  {selectedOffer?.description}
                </p>

                {/* Display tags if available */}
                {selectedOffer?.tags && selectedOffer.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedOffer.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-yellow-500/30 dark:text-yellow-300 text-gray-700 text-xs sm:text-sm rounded-full px-2 sm:px-3 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Discount and Date */}
                <div className="mt-3 sm:mt-4 bg-gray-100 dark:bg-gray-800 p-3 sm:p-4 rounded-lg">
                  <p className="text-gray-900 dark:text-yellow-400 text-lg sm:text-xl font-bold flex items-center gap-2">
                    <span className="bg-yellow-500 text-gray-900 dark:text-white px-2 py-1 rounded">
                      {selectedOffer?.discount}%
                    </span>
                    <span>Discount</span>
                  </p>
                  {selectedOffer?.minPurchase > 0 && (
                    <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm sm:text-base">
                      Minimum purchase: ${selectedOffer.minPurchase}
                    </p>
                  )}
                  <p className="text-gray-700 dark:text-gray-300 mt-2 font-medium text-sm sm:text-base">
                    {formatDate(selectedOffer?.startDate)} -{" "}
                    {formatDate(selectedOffer?.endDate)}
                  </p>
                </div>

                {/* Category if available */}
                {selectedOffer?.category && (
                  <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    <span className="font-medium">Category: </span>
                    {selectedOffer.category}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center sm:justify-end gap-3 sm:gap-4 mt-4 sm:mt-auto pt-4 sm:pt-6">
                <button
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 dark:text-white rounded-lg transition-colors duration-300 font-medium shadow-md"
                  onClick={() => {
                    setFormData({
                      ...selectedOffer,
                      tags: selectedOffer.tags || [],
                    });
                    setCurrentView("edit");
                  }}
                  disabled={isSubmitting}
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300 font-medium shadow-md"
                  onClick={() => handleDelete(selectedOffer?._id)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} /> Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OfferManagement;
