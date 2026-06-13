export function formatPostDate(
  date: Date,
  locale: string,
  month: 'short' | 'long'
) {
  const parts = new Map(
    new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month,
      day: 'numeric',
    })
      .formatToParts(date)
      .map(({ type, value }) => [type, value] as const)
  );

  return (['year', 'month', 'day'] as const)
    .map((part) => parts.get(part))
    .join(' ');
}
