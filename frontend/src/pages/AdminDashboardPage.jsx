import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboardPage.css";

const AdminDashboardPage = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [remarkInputs, setRemarkInputs] = useState({});
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      navigate("/submit");
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const q = query(collection(db, "complaints"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setComplaints(data);
        const remarks = {};
        data.forEach((c) => (remarks[c.id] = c.remarks || ""));
        setRemarkInputs(remarks);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoadingComplaints(false);
      }
    };
    fetchComplaints();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateDoc(doc(db, "complaints", id), { status: newStatus });
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
  };

  const handleRemarkChange = (id, value) => {
    setRemarkInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveRemark = async (id) => {
    await updateDoc(doc(db, "complaints", id), { remarks: remarkInputs[id] });
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, remarks: remarkInputs[id] } : c)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    await deleteDoc(doc(db, "complaints", id));
    setComplaints((prev) => prev.filter((c) => c.id !== id));
  };

  const filteredComplaints = () => {
    return complaints.filter((c) => {
      const matchesUrgency =
        urgencyFilter === "All" ||
        (urgencyFilter === "High" && parseInt(c.urgency) >= 4) ||
        (urgencyFilter === "Medium" && parseInt(c.urgency) === 3) ||
        (urgencyFilter === "Low" && parseInt(c.urgency) <= 2);

      const matchesSearch = searchTerm === "" || (
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return matchesUrgency && matchesSearch;
    });
  };

  if (loading || loadingComplaints) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>

        <div className="dashboard-controls">
          <input
            type="text"
            placeholder="Search by email, text or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div>
            <label><strong>Filter by urgency: </strong></label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="High">High (4–5)</option>
              <option value="Medium">Medium (3)</option>
              <option value="Low">Low (1–2)</option>
            </select>
          </div>
        </div>

        {filteredComplaints().length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          <div className="card-grid">
            {filteredComplaints().map((c) => (
              <div className="complaint-card" key={c.id}>
                <div className="card-header">
                  <h4>{c.category || "Uncategorized"} ({c.urgency || "?"})</h4>
                  <p>{c.email}</p>
                  <p className="timestamp">{c.timestamp?.toDate().toLocaleString()}</p>
                  <button className="toggle" onClick={() => toggleExpand(c.id)}>
                    {expandedId === c.id ? "Hide Details" : "View Details"}
                  </button>
                </div>
                {expandedId === c.id && (
                  <div className="card-details">
                    <p><strong>Complaint:</strong> {c.text}</p>
                    <label>Status:
                      <select value={c.status} onChange={(e) => handleStatusChange(c.id, e.target.value)}>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </label>
                    <label>Remarks:
                      <textarea
                        value={remarkInputs[c.id]}
                        rows={2}
                        onChange={(e) => handleRemarkChange(c.id, e.target.value)}
                      />
                    </label>
                    <button className="primary" onClick={() => handleSaveRemark(c.id)}>Save Remark</button>
                    <button className="delete" onClick={() => handleDelete(c.id)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboardPage;
