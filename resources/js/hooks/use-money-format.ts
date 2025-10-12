 export const formatIDR = (value: number | undefined): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0, // Adjust as needed for decimal places (Rupiah typically doesn't use decimals)
    }).format(value!);
  };