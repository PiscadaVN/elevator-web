export const formatDisplayDate = (timestamp: number | undefined | null): string => {
	if (!timestamp) return '-'

	return new Date(timestamp * 1000).toLocaleString('vi-VN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	})
}

export const toDateInputValue = (timestamp?: number | null): string => {
	if (!timestamp) return ''

	return new Date(timestamp).toISOString().slice(0, 10)
}
