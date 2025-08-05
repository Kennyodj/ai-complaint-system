import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; 
import { doc, setDoc } from "firebase/firestore"; 
import { sendPasswordResetEmail } from "firebase/auth";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleForgotPassword = async () => {
  const email = prompt("Please enter your email to reset password:");
  if (email) {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Check your inbox.");
    } catch (error) {
      alert("Error: " + error.message);
    }
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/submit");
          } else {
          const res = await createUserWithEmailAndPassword(auth, email, password);
          await setDoc(doc(db, "users", res.user.uid), {
    uid: res.user.uid,
    email: res.user.email,
    role: "user" 
  });

  navigate("/submit");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
        <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>

      <p style={{ marginTop: "1rem" }}>
  <button onClick={handleForgotPassword} style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}>
    Forgot password?
  </button>
</p>

    </div>
  );
};

export default LoginPage;
