const amountFormatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

export const getFormattedAmount = (amount: number | string) => {
    const normalizedAmount = typeof amount === 'number' ? amount : Number(String(amount).replace(/[,\s]+/g, ''));
    return amountFormatter.format(Number.isFinite(normalizedAmount) ? normalizedAmount : 0);
}
