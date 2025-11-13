export function formatMoney(number: number) {
    const num = Number(number).toFixed(2);

    const [integerPart, decimalPart] = num.split('.');

    const integerFormatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `$${integerFormatted},${decimalPart}`;
}