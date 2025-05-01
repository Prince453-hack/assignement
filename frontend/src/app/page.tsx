"use client";
import { useState } from "react";
import api from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import alreadyLoggedIn from "@/lib/loggedIn";

export default function Login() {
  alreadyLoggedIn();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    try {
      setLoading(true);
      e.preventDefault();
      const { data } = await api.post("/auth/register", form);
      setToken(data.token);
      router.push("/dashboard");
      setError("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError((error as any)?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
      <Card className="p-4 max-w-md mx-auto rounded shadow-sm shadow-white z-50 bg-white mt-[15%]">
        <form onSubmit={handleSubmit}>
          <h2 className="text-3xl font-bold mb-5 text-center">
            Register an account
          </h2>
          <Input
            placeholder="Username"
            className="my-5"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            className="my-5"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <p className="text-red-500 text-sm">{error}</p>

          <Button className="mt-4 cursor-pointer" disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500 hover:text-gray-700 transition-all">
          <Link href="/login">
            <p>
              Already have an account?{" "}
              <span className="hover:underline text-blue-600">Login</span>
            </p>
          </Link>
        </div>
      </Card>
    </div>
  );
}
