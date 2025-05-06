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
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreviewUrl(currentImage);
  }, [currentImage]);

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
        <div
          className="relative rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-600"
          style={{ maxHeight: "300px" }}
        >
          <div className="w-full relative" style={aspectRatioStyles}>
            <img
              src={previewUrl}
              onError={(e) => {
                e.target.onerror = null; // Prevents looping
                e.target.src = "https://via.placeholder.com/150"; // Placeholder image
              }}
              alt="Uploaded preview"
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
          className={`w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 flex flex-col items-center justify-center transition-all
                    ${
                      isUploading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:border-yellow-500 dark:hover:border-yellow-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
          style={
            aspectRatioStyles
              ? {
                  ...aspectRatioStyles,
                  paddingBottom: "unset",
                  minHeight: "150px",
                }
              : {}
          }
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-yellow-500 border-gray-300"></div>
          ) : (
            <>
              <Image className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click to upload image
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
