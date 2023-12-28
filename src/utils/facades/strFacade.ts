/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatTimestampToDateString(
  timestep: string,
  includeMinutes?: boolean
) {
  try {
    const date = new Date(Number(timestep));
    if (!isNaN(date.getTime())) {
      let payload: any = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };

      if (includeMinutes) {
        payload["hour"] = "2-digit";
        payload["minute"] = "2-digit";
      }

      return date.toLocaleDateString("pt-BR", payload);
    } else {
      return timestep;
    }
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid Date";
  }
}

export function slugify(text: string) {
  return text
    ? text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Eliminar caracteres especiales
        .replace(/\s+/g, "-") // Reemplazar espacios con guiones
        .replace(/--+/g, "-") // Reemplazar múltiples guiones con uno solo
        .trim()
    : ""; // Eliminar espacios en blanco al principio y al final
}

export function getDayName(dayNumber: number) {
  const days = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
  ];
  return days[dayNumber];
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
