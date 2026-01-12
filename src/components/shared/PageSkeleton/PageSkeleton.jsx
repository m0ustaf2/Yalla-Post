import { motion as Motion } from "framer-motion";
import "react-loading-skeleton/dist/skeleton.css";
export default function PageSkeleton() {
  return (
  <div className="fixed inset-0 z-50 bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center">
      
      <Motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "linear",
        }}
      >
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-700" />

        {/* Animated Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-transparent" />
      </Motion.div>

    </div>
  );
}
