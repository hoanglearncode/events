import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { TFunction } from "i18next";

dayjs.extend(relativeTime);

export function convertToUTC(utcString: string): Date | undefined {
  if (!utcString) return;
  return new Date(utcString + "Z");
}

export function formatDate(dateString: string) {
  return dayjs(dateString).format("DD/MM/YYYY");
}

export function formatDateRelative(
  dateStr: string | Date,
  t: TFunction
): string {
  const date = dayjs(dateStr);
  const now = dayjs();

  if (!date.isValid()) {
    return t("date.relative.invalid");
  }
  if (date.isSame(now, "day")) {
    const diffMinutes = now.diff(date, "minute");
    const diffHours = now.diff(date, "hour");

    if (diffHours >= 1) {
      return t("date.relative.hoursAgo", { count: diffHours });
    }
    if (diffMinutes >= 1) {
      return t("date.relative.minutesAgo", { count: diffMinutes });
    }
    return t("date.relative.justNow");
  }

  return date.format(t("date.relative.dateFormat"));
}
