import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Image } from "lucide-react";
import { toast } from "react-toastify";
import { getCurrentShopId } from "../../services/api/shopService";

const ImageUploader = ({
  currentImage,
  onImageUpload,
  aspectRatio = 1,
  imageType = "logo",
}) => {
  // Initialize previewUrl properly, checking for valid strings
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Update previewUrl when currentImage prop changes, with proper validation
  useEffect(() => {
    // Only set previewUrl if currentImage is a non-empty string
    if (
      currentImage &&
      typeof currentImage === "string" &&
      currentImage.trim() !== ""
    ) {
      setPreviewUrl(currentImage);
    } else {
      setPreviewUrl(null);
    }
  }, [currentImage]);

  // Rest of the component remains the same...
  const handleFileChange = async (e) => {
    const shopId = getCurrentShopId();
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create local preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // In a real app, upload to server/cloud storage
    setIsUploading(true);
    try {
      const baseUrl = "https://closecart-backend.vercel.app/api/v1/shops"; // Replace with your actual base URL
      const endpoint = `${baseUrl}/${shopId}/${
        imageType === "logo" ? "logo" : "cover-image"
      }`;

      const formData = new FormData();
      formData.append(imageType, file);

      const token = localStorage.getItem("token");

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload image");
      }

      // Use the URL returned from the API
      const uploadedUrl = data.data || data.url;
      onImageUpload(uploadedUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Image upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onImageUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const aspectRatioStyles = {
    paddingBottom: `${(1 / aspectRatio) * 100}%`,
  };

  // Fix for the ProfileSettings page in ProfileSettings.jsx
  // The issue is likely in this part - ensuring we display proper placeholders
  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-600">
          <div className="w-full relative" style={aspectRatioStyles}>
            <img
              src={previewUrl}
              onError={(e) => {
                console.log("Image failed to load:", previewUrl);
                e.target.onerror = null; // Prevents looping
                removeImage(); // Remove the image if it fails to load
              }}
              alt={`${imageType === "logo" ? "Shop logo" : "Cover image"}`}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={removeImage}
              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X size={16} />
            </button>
            <button
              onClick={triggerFileInput}
              className="p-1 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
              title="Change image"
              disabled={isUploading}
            >
              <Upload size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={triggerFileInput}
          disabled={isUploading}
          className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 flex flex-col items-center justify-center transition-all
                    hover:border-yellow-500 dark:hover:border-yellow-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          style={{
            minHeight: "150px",
            position: "relative",
          }}
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-yellow-500 border-gray-300"></div>
          ) : (
            <>
              <Image className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {imageType === "logo"
                  ? "Upload shop logo"
                  : "Upload cover image"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                JPG, PNG, GIF, WEBP (Max 5MB)
              </p>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ImageUploader;
