"use client";

import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { useState } from "react";
import { logout } from "@/lib/auth";
import useAuth from "@/lib/authentication";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TasksPage() {
  useAuth();
  const router = useRouter();
  const [refreshFlag, setRefreshFlag] = useState(false);

  const refreshTasks = () => {
    setRefreshFlag(!refreshFlag);
  };

  return (
    <div className="absolute top-0 z-[-2] min-h-screen w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-between items-center mb-10 text-white">
          <h1 className="text-5xl font-semibold">My Tasks</h1>

          <div className="space-x-4">
            <Button
              className="cursor-pointer text-black bg-blue-400 hover:bg-blue-500 hover:text-white transition-colors duration-150"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              className="cursor-pointer text-black hover:bg-red-500 hover:text-white transition-colors duration-150"
              variant="outline"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
        <TaskForm refresh={refreshTasks} />
        <TaskList refreshFlag={refreshFlag} />
      </div>{" "}
    </div>
  );
}
