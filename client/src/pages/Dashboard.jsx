import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [profile, setProfile] = useState({ name: "", email: "", bio: "" });
  const [message, setMessage] = useState("");

  // Fetch user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
        setMessage("❌ Error fetching profile.");
        setTimeout(() => setMessage(""), 3000);
      }
    };

    loadProfile();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Save profile
  const handleSave = async () => {
    try {
      await axios.put("http://localhost:5000/api/profile", profile, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Update failed", error);
      setMessage("❌ Error updating profile.");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          👤 Profile
        </h2>

        {message && (
          <div
            className="mb-6 p-4 rounded-md text-sm text-center font-medium shadow-md
            bg-green-100 text-green-700 animate-fade-in"
          >
            {message}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Your name"
              className="mt-1 w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              value={profile.email}
              disabled
              className="mt-1 w-full border rounded-md p-3 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows={4}
              className="mt-1 w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-md font-semibold shadow-sm"
          >
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
