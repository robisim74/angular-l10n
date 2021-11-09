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

export const convertLength = (to: string) => {
    return (value: number) => {
        switch (to) {
            case "mile":
                return value * 0.621371;
            default:
                return value;
        }
    };
};