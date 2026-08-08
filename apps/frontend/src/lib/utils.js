import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export function formatDate(dateString) {
    if (!dateString)
        return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
export function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}
export function truncateUrl(url, maxLength = 45) {
    if (url.length <= maxLength)
        return url;
    return url.substring(0, maxLength) + '...';
}
