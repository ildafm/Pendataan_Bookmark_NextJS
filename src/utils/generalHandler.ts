export function formatMillisToDate(millis: number): string {
  const date = new Date(millis);

  const day = String(date.getDate()).padStart(2, "0");

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                      
  const month = monthNames[date.getMonth()];
  const year = String(date.getFullYear())

  return `${day} ${month} ${year}`;
}

export function formatMillisToDaysAgo(millis: number, isMobile: boolean = false): string {
  const now = Date.now();
  const diff = now - millis;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const short = isMobile;

  const thresholds = [
    { value: seconds, limit: 60, short: "just now", long: "just now" },
    { value: minutes, limit: 60, short: `${minutes}min ago`, long: `${minutes} minute${minutes > 1 ? "s" : ""} ago` },
    { value: hours,   limit: 24, short: `${hours}h ago`, long: `${hours} hour${hours > 1 ? "s" : ""} ago` },
    { value: days,    limit: 30, short: `${days}d ago`, long: `${days} day${days > 1 ? "s" : ""} ago` },
    { value: months,  limit: 12, short: `${months}m ago`, long: `${months} month${months > 1 ? "s" : ""} ago` },
    { value: years,   limit: 5,  short: `${years}y ago`, long: `${years} year${years > 1 ? "s" : ""} ago` },
  ];

  for (const { value, limit, short: s, long: l } of thresholds) {
    if (value < limit) return short ? s : l;
  }

  return short ? "long time" : "a very long time ago";
}

export function elipsesText(text: string) {
  try {
    const maxWords = 5;
    const originalText = text;

    if (originalText.split(" ").length > maxWords) {
      const elipsText = `${originalText.split(" ").slice(0, maxWords).join(" ")}...`;
      return elipsText;
    }

    return originalText;

    // return originalText;
  } catch (err) {
    console.error(err);
  }
}