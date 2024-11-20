TODO:

1. github action
2. npm package
3. demo

## Easier loader customization

I want to allow more customization for the loader.

For example in vite we might do

```ts
const moduleUrls = import.meta.glob('./dict/*', {
	query: '?url',
	import: 'default',
	eager: true,
})

// Vite will generate something like:
const moduleUrls = {
	'./dict/tid.dat.gz': '/assets/1122adsd-tid.dat.gz',
	// ...
}

// Then our loader would look like this:
async function loadArrayBuffer(url: string): Promise<ArrayBufferLike> {
	const res = await fetch(moduleUrls['./dist/' + url])
	if (!res.ok) {
		throw new Error(`Failed to fetch ${url}, status: ${res.status}`)
	}
	return res.arrayBuffer()
}
```

## Easy cloud setup

Provide an example in the readme that would just use jsdelivr to
get the dictionary files.
