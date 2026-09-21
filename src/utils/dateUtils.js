export function minsFromNow(mins) {
  return new Date(Date.now() + mins * 60000);
}

export function fmtTime(d) {
  if (!d) return "--:--";
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function fmtDateTime(d) {
  if (!d) return "--";
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
