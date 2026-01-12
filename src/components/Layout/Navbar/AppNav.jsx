import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react";
import { motion as Motion } from "framer-motion";
import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext.js";
import {
  HiHome,
  HiNewspaper,
  HiUser,
  HiLogout,
  HiLogin,
  HiUserAdd,
  HiMenu,
  HiX,
} from "react-icons/hi";

export default function AppNav() {
  const { token, setToken, userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handelLogOut() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
            >
              <span className="text-white font-bold text-xl">Y</span>
            </Motion.div>
            <span className="font-logo text-2xl tracking-wide dark:text-white font-bold">
              Yalla
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-pink-500 ml-1">
                Post
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {token && (
            <div className="hidden md:flex items-center gap-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                <HiHome className="w-5 h-5" />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/posts"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                <HiNewspaper className="w-5 h-5" />
                <span>Posts</span>
              </NavLink>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-3">
           

            {/* User Dropdown */}
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="relative group cursor-pointer">
                  <div className="absolute -inset-1 bg-linear-to-r from-purple-500 to-pink-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
                  <Avatar
                    className="relative ring-2 ring-white dark:ring-gray-800"
                    alt="User"
                    img={
                      userData?.photo && !userData?.photo.includes("undefined")
                        ? userData?.photo
                        : "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    }
                    rounded
                    size="md"
                  />
                  {token && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                  )}
                </div>
              }
            >
              {token ? (
                <>
                  {userData && (
                    <DropdownHeader className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar
                          img={
                            userData?.photo && !userData?.photo.includes("undefined")
                              ? userData?.photo
                              : "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                          }
                          rounded
                          size="sm"
                        />
                        <div>
                          <span className="block text-sm font-bold text-gray-900 dark:text-white">
                            {userData?.name}
                          </span>
                          <span className="block truncate text-xs text-purple-600 dark:text-purple-400 font-medium">
                            {userData?.email}
                          </span>
                        </div>
                      </div>
                    </DropdownHeader>
                  )}
                  <DropdownItem
                    as={Link}
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
                  >
                    <HiUser className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Profile</span>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem
                    onClick={handelLogOut}
                    as="button"
                    className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                  >
                    <HiLogout className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Sign out</span>
                  </DropdownItem>
                </>
              ) : (
                <>
                  <DropdownItem
                    as={Link}
                    to="/login"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                  >
                    <HiLogin className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Login</span>
                  </DropdownItem>
                  <DropdownItem
                    as={Link}
                    to="/register"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
                  >
                    <HiUserAdd className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Register</span>
                  </DropdownItem>
                </>
              )}
            </Dropdown>

            {/* Mobile Menu Toggle */}
            {token && (
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <HiX className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <HiMenu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {token && (
          <Motion.div
            initial={false}
            animate={{
              height: isMobileMenuOpen ? "auto" : 0,
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
            className="md:hidden overflow-hidden"
          >
            <div className="py-4 space-y-2">
              <NavLink
                to="/"
                end
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                <HiHome className="w-5 h-5" />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/posts"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                <HiNewspaper className="w-5 h-5" />
                <span>Posts</span>
              </NavLink>
            </div>
          </Motion.div>
        )}
      </div>
    </Motion.nav>
  );
}