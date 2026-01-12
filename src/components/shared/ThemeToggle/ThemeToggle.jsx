// import { motion as Motion } from 'framer-motion';
// import { HiMoon, HiSun } from 'react-icons/hi';
// import { useTheme } from '../../../context/ThemeContext';

// export default function ThemeToggle() {
//   const { theme, toggleTheme } = useTheme();

//   return (
//     <Motion.button
//       whileTap={{ scale: 0.9 }}
//       onClick={toggleTheme}
//       className="relative p-3 rounded-xl bg-gray-200 dark:bg-gray-700 
//         hover:bg-gray-300 dark:hover:bg-gray-600
//         transition-all duration-300 overflow-hidden group"
//       aria-label="Toggle theme"
//     >
//       {/* Animated background */}
//       <Motion.div
//         initial={false}
//         animate={{
//           opacity: theme === 'dark' ? 1 : 0,
//           scale: theme === 'dark' ? 1 : 0.8,
//         }}
//         className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500"
//       />
      
//       <Motion.div
//         initial={false}
//         animate={{
//           opacity: theme === 'light' ? 1 : 0,
//           scale: theme === 'light' ? 1 : 0.8,
//         }}
//         className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500"
//       />
      
//       {/* Icons */}
//       <div className="relative w-6 h-6">
//         <Motion.div
//           initial={false}
//           animate={{
//             scale: theme === 'light' ? 1 : 0,
//             rotate: theme === 'light' ? 0 : 180,
//             opacity: theme === 'light' ? 1 : 0,
//           }}
//           transition={{ duration: 0.3 }}
//           className="absolute inset-0 flex items-center justify-center"
//         >
//           <HiSun className="w-6 h-6 text-yellow-600" />
//         </Motion.div>
        
//         <Motion.div
//           initial={false}
//           animate={{
//             scale: theme === 'dark' ? 1 : 0,
//             rotate: theme === 'dark' ? 0 : -180,
//             opacity: theme === 'dark' ? 1 : 0,
//           }}
//           transition={{ duration: 0.3 }}
//           className="absolute inset-0 flex items-center justify-center"
//         >
//           <HiMoon className="w-6 h-6 text-white" />
//         </Motion.div>
//       </div>
//     </Motion.button>
//   );
// }