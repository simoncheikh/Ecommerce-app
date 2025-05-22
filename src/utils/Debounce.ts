export const Debounce = <F extends (...args: any[]) => any>(
    func: F,
    wait: number
): ((...args: Parameters<F>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<F>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};