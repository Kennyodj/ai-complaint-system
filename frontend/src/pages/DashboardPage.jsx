import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardPage.css";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "complaints"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComplaints(results);
      setDataLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || dataLoading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading your complaints...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h2>Your Complaints</h2>
        {complaints.length === 0 ? (
          <p>No complaints submitted yet.</p>
        ) : (
          complaints.map((complaint) => (
            <div key={complaint.id} className="complaint-card">
              <div className="complaint-header">
                <span>{complaint.email || user.email}</span>
                <span>{complaint.timestamp?.toDate().toLocaleString()}</span>
              </div>
              <div className="complaint-body">{complaint.text}</div>
              <div className="complaint-meta">
                <span className={`badge ${
                  complaint.status === "Resolved"
                    ? "badge-resolved"
                    : complaint.status === "In Progress"
                    ? "badge-progress"
                    : "badge-pending"
                }`}>
                  {complaint.status || "Pending"}
                </span>
                <span className={`badge ${
                  complaint.urgency === "High"
                    ? "badge-high"
                    : complaint.urgency === "Medium"
                    ? "badge-medium"
                    : "badge-low"
                }`}>
                  {complaint.urgency || "—"}
                </span>
                <span className="badge">{complaint.category || "Uncategorized"}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default DashboardPage;
