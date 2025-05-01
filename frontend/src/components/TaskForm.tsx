import api from "@/lib/api";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

export default function TaskForm({ refresh }: { refresh: () => void }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    try {
      setLoading(true);
      e.preventDefault();
      await api.post("/tasks", form);
      setForm({ title: "", description: "", dueDate: "", priority: "Low" });
      refresh();
      setError("");
    } catch (error) {
      setLoading(false);
      setError((error as any)?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col space-y-4 shadow-sm shadow-white">
      <form onSubmit={handleSubmit} className="px-4 rounded mb-2">
        <Input
          className="input my-5"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <Textarea
          className="input my-5"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <Input
          type="date"
          className="input my-5"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          required
        />

        <Select
          value={form.priority}
          onValueChange={(value) => setForm({ ...form, priority: value })}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>

        <p className="text-red-500 text-sm pt-2">{error}</p>
        <Button className="mt-5" disabled={loading}>
          {loading ? "Loading..." : "Create Task"}
        </Button>
      </form>
    </Card>
  );
}
