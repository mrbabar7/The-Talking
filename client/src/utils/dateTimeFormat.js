export const dateFormat = (dateString) => {
  const date = new Date(dateString);
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };

  const formattedDate = date.toLocaleDateString([], options);
  if (formattedDate === new Date().toLocaleDateString([], options)) {
    return "Today";
  }
  if (formattedDate === new Date().toLocaleDateString([], options) - 1) {
    return "Yesterday";
  }
  return formattedDate;
};

export const formatDate = (content) => {
  return new Date(content).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: "false",
  });
};
