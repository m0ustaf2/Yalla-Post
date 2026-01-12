import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import PageSkeleton from "../components/shared/PageSkeleton/PageSkeleton";
import Notfound from "../pages/Notfound/Notfound";
import ProtectedAuthRoute from "../pages/ProtectedRoutes/ProtectedAuthRoute";
import ProtectedRoute from "../pages/ProtectedRoutes/ProtectedRoute";
import Profile from "../pages/auth/Profile/Profile";
import Layout from "./../components/Layout/Layout";
const Posts = lazy(() => import("./../pages/Posts/Posts"));
const PostDetails = lazy(() => import("../pages/PostDetails/PostDetails"));
const Login = lazy(() => import("./../pages/auth/Login/Login"));
const Register = lazy(() => import("./../pages/auth/Register/Register"));
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageSkeleton/>}>
            <ProtectedRoute>
              <Posts />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "/posts",
        element: (
          <Suspense fallback={<PageSkeleton/>}>
            <ProtectedRoute>
              <Posts />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "/profile",
        element: (
          <Suspense fallback={<PageSkeleton/>}>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "/posts/:id",
        element: (
          <Suspense fallback={<PageSkeleton/>}>
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<PageSkeleton/>}>
            <ProtectedAuthRoute>
              <Login />
            </ProtectedAuthRoute>
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<PageSkeleton/>}>
            <ProtectedAuthRoute>
              <Register />
            </ProtectedAuthRoute>
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <Notfound />,
      },
    ],
  },
]);
