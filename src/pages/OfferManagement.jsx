import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import CreateModal from "../components/CreateOfferModel";
import Modal from "../components/Model";

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
    category: "",
    tags: [], // Add this for storing multiple tags
    minPurchase: "", // Optional min purchase amount
  });

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
      console.log("Offers fetched:", offersArray);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleCreate = async () => {
    console.log("Creating offer:", formData);
    try {
      setError(null);
      const response = await fetch(
        "https://closecart-backend.vercel.app/api/v1/offers/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchOffers();
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating offer:", error);
      setError(error.message);
    }
  };

  const handleUpdate = async () => {
    try {
      await fetch(
        `https://closecart-backend.vercel.app/api/v1/offers/${selectedOffer._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      fetchOffers();
      setIsDetailModalOpen(false);
      setIsEditMode(false);
      resetForm();
    } catch (error) {
      console.error("Error updating offer:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://closecart-backend.vercel.app/api/v1/offers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchOffers();
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discount: "",
      startDate: "",
      endDate: "",
      imageUrl: "",
      category: "",
      tags: [], // Add this for storing multiple tags
      minPurchase: "", // Optional min purchase amount
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
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-yellow-500 text-xl">Loading offers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  p-8 flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Offer Management
        </h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black rounded-lg flex items-center gap-2 transition-all duration-300"
        >
          <Plus size={20} /> Create Offer
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-8">
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
          className="w-48 px-4 py-2 bg-gray-200 dark:bg-gray-900 border border-white dark:border-gray-700 rounded-lg text-grey-800 dark:text-white focus:outline-none focus:border-yellow-500"
        >
          <option value="newest">Newest First</option>
          <option value="highest">Highest Discount</option>
          <option value="lowest">Lowest Discount</option>
        </select>
      </div>

      {/* Offer Cards */}
      <motion.div
        className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-6"
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
                  setIsDetailModalOpen(true);
                }}
              >
                <img
                  src={offer.imageUrl}
                  alt={offer.title}
                  className="w-full h-50 object-cover rounded-lg shadow-md"
                />
                <div className="p-6 transition-all duration-300 relative overflow-hidden group">
                  <h3 className="text-xl font-semibold text-yellow-500 mb-2">
                    {offer.title}
                  </h3>
                  <p className="dark:text-gray-400 text-gray-700 mb-4">
                    {offer.discount}% OFF
                  </p>
                  <p className="dark:text-gray-300 text-gray-800 line-clamp-2">
                    {offer.description}
                  </p>
                  <p className="dark:text-gray-300 text-gray-800 line-clamp-2">
                    From:{formatDate(offer.startDate)} To:
                    {formatDate(offer.endDate)}
                  </p>

                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Create Modal */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        handleCreate={handleCreate}
      />

      <Modal
        details={offers}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setIsEditMode(false);
          resetForm();
        }}
      >
        {isEditMode ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Edit Offer</h2>
            <input
              placeholder="Offer Title"
              className="w-full px-4 py-2  bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 border-gray-100 rounded-lg  focus:outline-none focus:border-yellow-500"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <input
              placeholder="Description"
              className="w-full px-4 py-2  bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 border-gray-100 rounded-lg  focus:outline-none focus:border-yellow-500"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <input
              placeholder="Image Url"
              className="w-full px-4 py-2  bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 border-gray-100 rounded-lg  focus:outline-none focus:border-yellow-500"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Discount Percentage"
              className="w-full px-4 py-2  bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 border-gray-100 rounded-lg  focus:outline-none focus:border-yellow-500"
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="Start Date"
              className="w-full px-4 py-2  bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 border-gray-100 rounded-lg  focus:outline-none focus:border-yellow-500"
              value={formData.startDate ? formData.startDate.split("T")[0] : ""}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="End Date"
              className="w-full px-4 py-2  bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 border-gray-100 rounded-lg  focus:outline-none focus:border-yellow-500"
              value={formData.endDate ? formData.endDate.split("T")[0] : ""}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
                onClick={() => {
                  setIsEditMode(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black rounded-lg transition-all duration-300"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-start gap-6  ">
            {/* Image Section */}
            <div className="w-full md:w-1/2">
              <img
                src={selectedOffer?.imageUrl}
                alt={selectedOffer?.title}
                className="w-full h-auto rounded-lg shadow-lg object-cover border-2 border-yellow-500"
              />
            </div>

            {/* Offer Details Section */}
            <div className="w-full md:w-2/3 flex flex-col h-full">
              <div className="flex-grow space-y-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3 border-b border-yellow-400 pb-2">
                  {selectedOffer?.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  {selectedOffer?.description}
                </p>

                {/* Discount and Date */}
                <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-900 dark:text-yellow-400 text-xl font-bold flex items-center gap-2">
                    <span className="bg-yellow-500 text-gray-900 dark:text-white px-2 py-1 rounded">
                      {selectedOffer?.discount}%
                    </span>
                    <span>Discount</span>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-2 font-medium">
                    {formatDate(selectedOffer?.startDate)} -{" "}
                    {formatDate(selectedOffer?.endDate)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-auto pt-6">
                <button
                  className="px-5 py-2 flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 dark:text-white rounded-lg transition-colors duration-300 font-medium shadow-md"
                  onClick={() => {
                    setFormData(selectedOffer);
                    setIsEditMode(true);
                  }}
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  className="px-5 py-2 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300 font-medium shadow-md"
                  onClick={() => handleDelete(selectedOffer?._id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OfferManagement;
