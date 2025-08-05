import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SubmitComplaintPage from "./pages/SubmitComplaintPage";
import DashboardPage from "./pages/DashboardPage";
import ComplaintForm from './components/ComplaintForm';
import AdminDashboardPage from "./pages/AdminDashboardPage";


function App() {
  return (
    <Router>
      <Routes>
<Route path="/" element={<LoginPage />} />        <Route path="/login" element={<LoginPage />} />
        <Route path="/submit" element={<SubmitComplaintPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />

      </Routes>
    </Router>
    
  );
}

export default App;
