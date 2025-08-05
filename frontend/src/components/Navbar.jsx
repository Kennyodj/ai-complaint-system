import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, role } = useAuth(); // ✅ Combine useAuth for user + role
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (!user) return null; // Hide navbar if not logged in

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/submit">Submit Complaint</Link>
        <Link to="/dashboard">Dashboard</Link>

        {/* ✅ Only show if user is an admin */}
        {role === "admin" && (
          <Link to="/admin" className="admin-link">
            Admin Dashboard
          </Link>
        )}
      </div>
      <div className="navbar-right">
        <span>{user.email}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
