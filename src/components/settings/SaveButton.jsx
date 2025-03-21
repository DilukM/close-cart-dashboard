import React from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";

const SaveButton = ({ onClick, loading }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
    >
      <Save className="w-4 h-4" />
      {loading ? "Saving..." : "Save Changes"}
    </motion.button>
  );
};

export default SaveButton;
