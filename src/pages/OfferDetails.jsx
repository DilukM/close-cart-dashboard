import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

const OfferDetails = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [offer, setOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOffer = async () => {
    try {
      const response = await fetch(
        `https://closecart-backend.vercel.app/api/v1/offers/${id}`,
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
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch offer");
      }

      setOffer(data.data);
      setFormData(data.data);
    } catch (error) {
      console.error("Error fetching offer:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffer();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `https://closecart-backend.vercel.app/api/v1/offers/${id}`,
        {
          method: "PUT",
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

      history.push("/offer-management");
    } catch (error) {
      console.error("Error updating offer:", error);
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`https://closecart-backend.vercel.app/api/v1/offers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      history.push("/offer-management");
    } catch (error) {
      console.error("Error deleting offer:", error);
      setError(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        Loading offer...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {offer.title}
      </h1>
      <p className="text-gray-300 mb-4">{offer.description}</p>
      <p className="text-yellow-500 text-lg font-semibold">
        {offer.discount}% Discount
      </p>
      <p className="text-yellow-500 text-lg font-semibold">
        From: {new Date(offer.startDate).toLocaleDateString()} To:{" "}
        {new Date(offer.endDate).toLocaleDateString()}
      </p>

      <div className="space-y-4 mt-6">
        <input
          placeholder="Offer Title"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          placeholder="Description"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          placeholder="Image Url"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData({ ...formData, imageUrl: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Discount Percentage"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          value={formData.discount}
          onChange={(e) =>
            setFormData({ ...formData, discount: e.target.value })
          }
        />
        <input
          type="date"
          placeholder="Start Date"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
        />
        <input
          type="date"
          placeholder="End Date"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          value={formData.endDate}
          onChange={(e) =>
            setFormData({ ...formData, endDate: e.target.value })
          }
        />
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black rounded-lg transition-all duration-300"
          onClick={handleUpdate}
        >
          Save Changes
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
          onClick={handleDelete}
        >
          Delete Offer
        </button>
      </div>
    </div>
  );
};

export default OfferDetails;
