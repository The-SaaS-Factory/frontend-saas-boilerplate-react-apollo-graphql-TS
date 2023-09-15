export function formatTimestampToDateString(timestamp) {
  try {
    const date = new Date(Number(timestamp));
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString();
    } else {
      return "Invalid Date";
    }
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid Date";
  }
}

export function slugify(text) {
  return text
    ? text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Eliminar caracteres especiales
        .replace(/\s+/g, "-") // Reemplazar espacios con guiones
        .replace(/--+/g, "-") // Reemplazar múltiples guiones con uno solo
        .trim()
    : ""; // Eliminar espacios en blanco al principio y al final
}
