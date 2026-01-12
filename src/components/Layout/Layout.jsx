import { Outlet } from "react-router-dom";
import AppNav from "./Navbar/AppNav";
import AppFooter from "./Footer/AppFooter";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js";

export default function Layout() {
  const { userData } = useContext(AuthContext);
  const showNavAndFooter = !!userData;
  return (
    <>
      <main className="dark:bg-gray-950 text-gray-100">
        {showNavAndFooter && <AppNav />}

        <div className="min-h-screen">
          <Outlet />
        </div>
        {showNavAndFooter && <AppFooter />}
      </main>
    </>
  );
}
