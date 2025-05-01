import api from "@/lib/api";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PriorityBadge from "./PriorityBadge";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { useRouter } from "next/navigation";

export default function TaskList({ refreshFlag }: { refreshFlag: boolean }) {
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  const loadTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}`);
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, [refreshFlag]);

  return (
    <div className="space-y-4 mt-5">
      {tasks.map((task: any) => (
        <Card
          key={task._id}
          className="p-4 bg-white shadow flex justify-between items-start relative"
        >
          <div className="flex items-start p-3">
            <div className="flex-1">
              <h3 className="font-semibold text-xl">{task.title}</h3>
              <p className="text-base text-gray-600">{task.description}</p>
              <p className="text-xs text-gray-500">
                Due: {task.dueDate?.slice(0, 10)} | Priority:{" "}
                <PriorityBadge priority={task.priority} />
              </p>
            </div>
            <div className="absolute right-4 flex items-center flex-col gap-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={async () => {
                  await api.put(`/tasks/${task._id}`, {
                    completed: !task.completed,
                  });
                  toast.success("Task updated successfully!");
                  loadTasks();
                }}
                className="shadow-md"
              />
              <Pencil
                size={20}
                className="text-blue-500 hover:text-blue-400 cursor-pointer"
                onClick={() => {
                  router.push(`/tasks/${task._id}`);
                }}
              />

              <Trash2
                size={20}
                className="text-red-500 hover:text-red-400 cursor-pointer"
                onClick={() => {
                  if (!confirm("Are you sure you want to delete this task?")) {
                    return;
                  }
                  deleteTask(task._id);
                  toast.success("Task deleted successfully!");
                  loadTasks();
                }}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
