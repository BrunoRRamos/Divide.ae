export const centsToFloat = (cents: number) => {
  if (cents === 0) {
    return 0;
  }

  return cents / 100;
};

export const floatToCents = (value: number) => {
  return value * 100;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("default", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
