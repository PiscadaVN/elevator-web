export const toDateTimeLocalValue = (timestamp?: number | null): string => {
	if (!timestamp) return ''

	return new Date(timestamp * 1000).toISOString().slice(0, 16)
}

export const toUnixSeconds = (dateTimeLocal?: string): number | undefined => {
	if (!dateTimeLocal) return undefined

	const millis = Date.parse(dateTimeLocal)
	if (Number.isNaN(millis)) return undefined

	return Math.floor(millis / 1000)
}
