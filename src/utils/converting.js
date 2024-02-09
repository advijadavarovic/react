export const convertCurrency = (priceString) => {
    const cleanedPriceString = priceString.replace('$', '').replace(',', '');
    const amount = parseFloat(cleanedPriceString);
    const conversionRate = 1.81;
    const convertedAmount = amount * conversionRate;
    return convertedAmount.toFixed(2);
};

