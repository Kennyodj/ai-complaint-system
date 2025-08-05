import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/SubmitComplaintPage.css"; // 🆕 Create this file

const SubmitComplaintPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [aiResult, setAiResult] = useState(null); // 🧠 Store AI response

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg("");
    setAiResult(null);

    try {
      if (!user) {
        setStatusMsg("User not logged in.");
        setLoading(false);
        return;
      }

      const aiRes = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: complaint }),
      });

      const aiData = await aiRes.json();

      await addDoc(collection(db, "complaints"), {
        text: complaint,
        userId: user.uid,
        email: user.email,
        timestamp: Timestamp.now(),
        status: "Pending",
        category: aiData.category,
        urgency: aiData.urgency,
      });

      setAiResult(aiData);
      setStatusMsg("✅ Complaint submitted successfully!");
      setComplaint("");
    } catch (error) {
      console.error(error);
      setStatusMsg("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="complaint-form-container">
        <h2>Submit an IT Complaint</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="complaint">Describe the Issue</label>
          <textarea
            id="complaint"
            rows="5"
            placeholder="e.g. Wi-Fi not working in Room 204"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>

        {statusMsg && <p className="status-message">{statusMsg}</p>}

        {/* {aiResult && (
          <div className="ai-result">
            <p><strong>Category:</strong> {aiResult.category}</p>
            <p><strong>Urgency:</strong> {aiResult.urgency}</p>
          </div> */}
        {/* )} */}
      </div>
    </>
  );
};

export default SubmitComplaintPage;
