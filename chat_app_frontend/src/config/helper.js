/**
 * src/config/helper.js
 *
 * getShowTimeAgo(dateOrTimestamp) -> human readable relative time like:
 * "just now", "5 minutes ago", "yesterday", "in 2 hours"
 *
 * Accepts a Date, ISO string, or numeric timestamp.
 */

export function getShowTimeAgo(input) {
  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date)) return "";

  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (Math.abs(seconds) < 10) return "just now";

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" });
  const divisions = [
    { unit: "second", limit: 60 }, // up to 60 seconds
    { unit: "minute", limit: 60 }, // up to 60 minutes
    { unit: "hour", limit: 24 }, // up to 24 hours
    { unit: "day", limit: 7 }, // up to 7 days
    { unit: "week", limit: 4.34524 }, // up to ~4.34 weeks in a month
    { unit: "month", limit: 12 }, // up to 12 months
    { unit: "year", limit: Number.POSITIVE_INFINITY },
  ];

  let value = seconds;
  let i = 0;
  while (i < divisions.length - 1 && Math.abs(value) >= divisions[i].limit) {
    value = value / divisions[i].limit;
    i++;
  }

  const rounded = Math.round(value);
  const unit = divisions[i].unit;
  // Intl.RelativeTimeFormat expects negative for past, positive for future
  return rtf.format(-rounded, unit);
}

export default getShowTimeAgo;
