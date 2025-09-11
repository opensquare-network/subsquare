export default function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case "preparing":
      return "#2196F3";
    case "queueing":
      return "#FF9800";
    case "deciding":
      return "#0F6FFF";
    case "confirming":
      return "#4CAF50";
    default:
      return "";
  }
}
