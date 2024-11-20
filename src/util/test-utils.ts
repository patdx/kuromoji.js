export function promisify(fn: (done: () => void) => unknown) {
	return () =>
		new Promise<void>((resolve) => {
			fn(resolve)
		})
}
