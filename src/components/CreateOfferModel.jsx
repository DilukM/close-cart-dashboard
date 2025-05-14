import React, { useState, useEffect } from "react";
import { X, Plus, Tag as TagIcon, Loader2, Upload } from "lucide-react";
import PropTypes from "prop-types";

const CreateModal = ({
  onClose,
  formData,
  setFormData,
  handleSubmit,
  isEditMode = false,
  isSubmitting = false,
}) => {
  const [newTag, setNewTag] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
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

  // Handle image preview for existing offers
  useEffect(() => {
    if (isEditMode && formData.imageUrl) {
      setImagePreview(formData.imageUrl);
    }
  }, [isEditMode, formData.imageUrl]);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
        alert("Please select a valid image file (JPEG, PNG, or JPG)");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Update form data with the file
      setFormData({
        ...formData,
        imageFile: file,
        imageUrl: null, // Clear the imageUrl when a new file is uploaded
      });
    }
  };

  // Reference to the hidden file input
  const fileInputRef = React.useRef(null);

  // Function to trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Clean up the preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData({
      ...formData,
      imageFile: null,
      imageUrl: null,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold dark:text-white text-gray-600 mb-4">
        {isEditMode ? "Edit Offer" : "Create New Offer"}
      </h2>
      <div className="space-y-4">
        <input
          placeholder="Offer Title"
          className="w-full px-4 py-2 dark:bg-gray-700 bg-gray-100 border dark:border-gray-600 border-gray-200 rounded-lg dark:text-white text-gray-600 focus:outline-none focus:border-yellow-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <div>
          <select
            value={formData.category || ""}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-2 dark:bg-gray-700 bg-gray-100 border dark:border-gray-600 border-gray-200 rounded-lg dark:text-white text-gray-600 focus:outline-none focus:border-yellow-500 appearance-none"
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
          className="w-full px-4 py-2 dark:bg-gray-700 bg-gray-100 border dark:border-gray-600 border-gray-200 rounded-lg dark:text-white text-gray-600 focus:outline-none focus:border-yellow-500"
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
            {(formData.tags || []).map((tag) => (
              <div
                key={tag}
                className="flex items-center bg-yellow-500/30 text-yellow-300 text-sm rounded-full px-3 py-1"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-yellow-300 hover:dark:text-white text-gray-600"
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
              className="flex-1 px-4 py-2 dark:bg-gray-700 bg-gray-100 border dark:border-gray-600 border-gray-200 border-gray-200 rounded-lg dark:text-white text-gray-600 focus:outline-none focus:border-yellow-500"
            />
            <button
              onClick={handleAddTag}
              className="px-3 py-2 ml-3 dark:bg-gray-600 bg-gray-100 hover:border-yellow dark:text-white text-gray-600 rounded-r-lg"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Offer Image
          </label>
          <div className="flex flex-col items-center">
            {imagePreview ? (
              <div className="relative w-full max-w-xs mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute bottom-2 right-2 flex space-x-2">
                  <button
                    onClick={triggerFileInput}
                    className="bg-yellow-500/80 text-black px-2 py-1 text-sm rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    Change Image
                  </button>
                  <button
                    onClick={handleRemoveImage}
                    className="bg-gray-800/80 dark:text-white text-gray-600 p-1 rounded-full hover:bg-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <label className="w-full cursor-pointer">
                <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed dark:border-gray-600 border-gray-200 rounded-lg hover:border-yellow-500 transition-colors duration-300">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-gray-400">Click to upload image</span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG or JPEG (max. 5MB)
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Discount Percentage
          </label>
          <input
            type="number"
            placeholder="Discount %"
            className="w-full px-4 py-2 dark:bg-gray-700 bg-gray-100 border dark:border-gray-600 border-gray-200 rounded-lg dark:text-white text-gray-600 focus:outline-none focus:border-yellow-500"
            value={formData.discount}
            onChange={(e) =>
              setFormData({ ...formData, discount: e.target.value })
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
              className="w-full px-4 py-2 dark:bg-gray-700 bg-gray-100 border dark:border-gray-600 border-gray-200 rounded-lg dark:text-white text-gray-600 focus:outline-none focus:border-yellow-500"
              value={formData.startDate ? formData.startDate.split("T")[0] : ""}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">End Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 dark:bg-gray-700 bg-gray-100 border dark:border-gray-600 border-gray-200 rounded-lg dark:dark:text-white text-gray-600 text-gray-600 focus:outline-none focus:border-yellow-500"
              value={formData.endDate ? formData.endDate.split("T")[0] : ""}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-4 py-2 dark:bg-gray-700 bg-gray-100 dark:text-white text-gray-600 rounded-lg hover:bg-gray-600 transition-colors duration-300"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black rounded-lg transition-all duration-300 flex items-center gap-2"
            onClick={() => handleSubmit(formData)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{isEditMode ? "Update Offer" : "Create Offer"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
CreateModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    title: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    imageUrl: PropTypes.string,
    discount: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    imageFile: PropTypes.object,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  isSubmitting: PropTypes.bool,
};

export default CreateModal;
