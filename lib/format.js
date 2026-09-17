import timeAr from 'time-ar';

const arabicTime = timeAr();

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('ar', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatDateWithRelativeTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';

  return `كُتب يوم ${formatDate(dateStr)} - ${arabicTime.getTimeAr(date, arabicTime.format.iso8601)}`;
}

export function readingTimeLabel(minutes) {
  const n = Math.max(1, minutes);
  if (n === 1) return 'دقيقة واحدة للقراءة';
  if (n === 2) return 'دقيقتان للقراءة';
  if (n >= 3 && n <= 10) return `${n} دقائق للقراءة`;
  return `${n} دقيقة للقراءة`;
}
