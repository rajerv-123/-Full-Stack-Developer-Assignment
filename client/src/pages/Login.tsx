import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setOpenSuccess(false);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post<{ token: string }>(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isLoggedIn", "true");

      setSuccessMsg("Login successful! Redirecting...");
      setOpenSuccess(true);

      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/search");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Welcome Back 👋
        </h2>

        {error && (
          <p className="text-red-300 text-center mb-4 text-sm">{error}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
          />

          <button
            type="submit"
            className="w-full bg-white text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-100 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="text-white text-sm text-center mt-6">
          New here?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="underline text-white hover:text-purple-300 transition"
          >
            Create an account
          </button>
        </p>
      </div>

      <Snackbar
        open={openSuccess}
        autoHideDuration={2000}
        onClose={() => setOpenSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
