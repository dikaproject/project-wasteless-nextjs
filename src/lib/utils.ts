export const formatCurrency = (value: number | string) => {
    if (typeof value === 'number') {
      return new Intl.NumberFormat("id-ID").format(value);
    }
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(Number(number));
  };