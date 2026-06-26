export function formatNumber(prefix: string | undefined, nr: number | undefined): string {
    if (!nr) {
        return "N/A";
    }
    return (prefix || "") + String(nr).padStart(2, '0')
}
