export const convertCurrency = (currency: string) => {
    return (value: number) => {
        switch (currency) {
            case "USD":
                return value * 1.16;
            default:
                return value;
        }
    };
};