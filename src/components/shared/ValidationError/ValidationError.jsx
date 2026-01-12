import { motion as Motion } from "framer-motion";
import { HiExclamationCircle } from "react-icons/hi";

export default function ValidationError({ error }) {
  if (!error) return null;

  // Extract error message safely
  const errorMessage = typeof error === 'string' 
    ? error 
    : error?.message 
    || 'An error occurred';

  return (
    <Motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute left-0 right-0 top-full mt-1 z-20"
    >
      <div className="flex items-start gap-2 p-2.5 bg-red-500 text-white rounded-lg shadow-lg relative">
        {/* Tooltip Arrow */}
        <div className="absolute -top-1 left-4 w-2 h-2 bg-red-500 transform rotate-45"></div>
        
        <HiExclamationCircle className="w-4 h-4 shrink-0 mt-0.5 animate-pulse" />
        <p className="text-xs font-medium leading-tight">
          {errorMessage}
        </p>
      </div>
    </Motion.div>
  );
}