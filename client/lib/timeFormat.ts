// timeUtils.ts
// Lightweight date/time helpers with zero dependencies.
// If you use dayjs/date‑fns in your project, you can swap the implementations below.

/**
 * Formats a Date (or date‑parseable string/number) into a locale‑aware string.
 * @param input ‑ Date | string | number
 * @param options ‑ Intl.DateTimeFormat options (defaults to numeric date & short time)
 * @param locale ‑ BCP‑47 locale, defaults to browser/Node locale.
 */
export function formatDate(
    input: Date | string | number,
    options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    },
    locale?: string
): string {
    const date = input instanceof Date ? input : new Date(input);
    return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Returns an ISO‑8601 string (UTC) like `2025‑07‑11T10:05:00Z`.
 */
export function toISO(input: Date | string | number): string {
    const date = input instanceof Date ? input : new Date(input);
    return date.toISOString();
}

/**
 * Converts a `Date` (or timestamp) to "time‑ago" phrases (e.g., "4h ago").
 * Falls back to full date after ~30 days.
 */
export function timeAgo(input: Date | string | number, locale = "en"): string {
    const date = input instanceof Date ? input : new Date(input);
    const diffMs = Date.now() - date.getTime();
    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (sec < 60) return rtf.format(-sec, "second");
    if (min < 60) return rtf.format(-min, "minute");
    if (hr < 24) return rtf.format(-hr, "hour");
    if (day < 30) return rtf.format(-day, "day");

    // 30+ days: show full date in local format
    return formatDate(date, { dateStyle: "medium" }, locale);
}

/**
 * Pads numbers to two digits (helper for manual formatting).
 */
function pad(n: number) {
    return n.toString().padStart(2, "0");
}

/**
 * Formats as `YYYY‑MM‑DD`.
 */
export function formatISODate(input: Date | string | number): string {
    const d = input instanceof Date ? input : new Date(input);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Formats as `HH:MM:SS` (24‑hour).
 */
export function formatISOTime(input: Date | string | number): string {
    const d = input instanceof Date ? input : new Date(input);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * Returns `YYYY‑MM‑DDTHH:MM:SS±HH:MM` in the local timezone.
 */
export function formatLocalISOString(input: Date | string | number): string {
    const d = input instanceof Date ? input : new Date(input);
    const tzOffset = -d.getTimezoneOffset();
    const sign = tzOffset >= 0 ? "+" : "-";
    const hoursOffset = pad(Math.floor(Math.abs(tzOffset) / 60));
    const minutesOffset = pad(Math.abs(tzOffset) % 60);
    return `${formatISODate(d)}T${formatISOTime(d)}${sign}${hoursOffset}:${minutesOffset}`;
}

/**
 * Parses an ISO‑8601 string safely; returns `null` on invalid input.
 */
export function parseISO(value: string): Date | null {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
}

// --------------------------- Example Usage ---------------------------
// const now = new Date();
// console.log(formatDate(now));           // 11/07/2025, 15:42
// console.log(timeAgo(now));              // now
// console.log(formatISODate(now));        // 2025‑07‑11
// console.log(formatISOTime(now));        // 15:42:07
// console.log(formatLocalISOString(now)); // 2025‑07‑11T15:42:07+05:30
