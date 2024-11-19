export function promisify(fn) {
	return () =>
		new Promise((resolve) => {
			fn(resolve)
		})
}
