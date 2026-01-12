import { Navigate } from "react-router-dom";

export default function ProtectedAuthRoute({ children }) {
  if (localStorage.getItem("token")) {
    return <Navigate to={"/"} />;
  }
  return children;
}
