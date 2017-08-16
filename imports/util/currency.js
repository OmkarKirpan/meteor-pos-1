export const formatCurrency = value =>
    `Rp ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
