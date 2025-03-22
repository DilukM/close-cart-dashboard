import React from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";

const SaveButton = ({
  onClick,
  loading,
  text = "Save Changes",
  icon = true,
  className = "",
  disabled = false,
}) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={loading || disabled}
      className={`px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl flex items-center gap-2 transition-colors ${
        disabled
          ? "opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400"
          : ""
      } ${className}`}
    >
      {icon && <Save className="w-4 h-4" />}
      {loading ? "Saving..." : text}
    </motion.button>
  );
};

export default SaveButton;
