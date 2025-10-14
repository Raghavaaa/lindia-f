"use client";
import { useState } from "react";

export default function TestLoginPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Success! User: ${JSON.stringify(data.user)}`);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Database Login</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              required={!isLogin}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your name"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter your email"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Please wait..." : (isLogin ? "Login" : "Register")}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:text-blue-800"
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded ${
          message.includes("Success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {message}
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-semibold">Test Credentials:</h3>
        <p>Email: test@example.com</p>
        <p>Password: test123</p>
        <p>Name: Test User</p>
      </div>
    </div>
  );
}
