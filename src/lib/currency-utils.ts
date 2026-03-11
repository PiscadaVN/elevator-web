export const formatCurrency = (amount: number | undefined | null) => {
	if (!amount) return '-'

	return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}
