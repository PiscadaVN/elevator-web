/**
 * Convert a string from snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Convert a string from camelCase to snake_case
 */
export function camelToSnake(str: string): string {
	return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Check if a value is a plain object (not an array, Date, etc.)
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
	return (
		value !== null &&
		typeof value === 'object' &&
		!Array.isArray(value) &&
		!(value instanceof Date) &&
		!(value instanceof File) &&
		!(value instanceof Blob)
	)
}

/**
 * Convert object keys from snake_case to camelCase recursively
 */
export function keysToCamel<T = unknown>(obj: unknown): T {
	if (Array.isArray(obj)) {
		return obj.map((item) => keysToCamel(item)) as T
	}

	if (isPlainObject(obj)) {
		const converted: Record<string, unknown> = {}
		for (const [key, value] of Object.entries(obj)) {
			const camelKey = snakeToCamel(key)
			converted[camelKey] = keysToCamel(value)
		}
		return converted as T
	}

	return obj as T
}

/**
 * Convert object keys from camelCase to snake_case recursively
 */
export function keysToSnake<T = unknown>(obj: unknown): T {
	if (Array.isArray(obj)) {
		return obj.map((item) => keysToSnake(item)) as T
	}

	if (isPlainObject(obj)) {
		const converted: Record<string, unknown> = {}
		for (const [key, value] of Object.entries(obj)) {
			const snakeKey = camelToSnake(key)
			converted[snakeKey] = keysToSnake(value)
		}
		return converted as T
	}

	return obj as T
}
