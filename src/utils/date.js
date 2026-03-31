export function toShortLocalDate(date) {
    const d = new Date(date); // на случай если приходит строка

    return d.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}