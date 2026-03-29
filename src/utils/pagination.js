export function getPageNumbers(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    let arr = [];

    arr.push(1);

    if (current > 3) {
        arr.push('...');
    }

    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        arr.push(i);
    }

    if (current < total - 2) {
        arr.push('...');
    }

    arr.push(total);

    return arr;
} 