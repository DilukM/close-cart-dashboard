import React, { useState, useEffect } from "react";
import { X, Plus, Tag as TagIcon } from "lucide-react";

const CreateModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  handleCreate,
}) => {
  const [newTag, setNewTag] = useState("");
  const [availableCategories, setAvailableCategories] = useState([
    "Food",
    "Clothing",
    "Electronics",
    "Home & Garden",
    "Beauty",
    "Sports",
    "Books",
    "Toys",
    "Other",
  ]);

  useEffect(() => {
    // This would be an API call in a real application
    // Example: fetchCategories().then(data => setAvailableCategories(data));
  }, []);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (!newTag.trim()) return;

    // Don't add duplicate tags
    if (formData.tags && formData.tags.includes(newTag.trim())) {
      return;
    }

    setFormData({
      ...formData,
      tags: [...(formData.tags || []), newTag.trim()],
    });
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative max-h-90vh overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Create New Offer</h2>
        <div className="space-y-4">
          <input
            placeholder="Offer Title"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <div>
            <select
              value={formData.category || ""}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 appearance-none"
            >
              <option value="" disabled>
                Select Category
              </option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="Description"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            rows="3"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          {/* Tags Input */}
          <div>
            <div className="flex mb-2 items-center">
              <TagIcon size={16} className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-400">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags &&
                formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center bg-yellow-500/30 text-yellow-300 text-sm rounded-full px-3 py-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-yellow-300 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white focus:outline-none focus:border-yellow-500"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-r-lg"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <input
            placeholder="Image Url"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
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
              type="number"
              placeholder="Min Purchase (optional)"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
              value={formData.minPurchase || ""}
              onChange={(e) =>
                setFormData({ ...formData, minPurchase: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black rounded-lg transition-all duration-300"
              onClick={handleCreate}
            >
              Create Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
