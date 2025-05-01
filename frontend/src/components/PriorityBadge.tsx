export default function PriorityBadge({ priority }: { priority: string }) {
  let color = "";

  switch (priority) {
    case "Low":
      color = "bg-green-100 text-green-800";
      break;
    case "Medium":
      color = "bg-orange-100 text-orange-800";
      break;
    case "High":
      color = "bg-red-100 text-red-800";
      break;
    default:
      color = "bg-gray-100 text-gray-800";
  }

  return (
    <span className={`text-xs font-semibold p-1 rounded ${color}`}>
      {priority}
    </span>
  );
}
