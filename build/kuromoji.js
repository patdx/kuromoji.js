'use strict'
var __create = Object.create
var __defProp = Object.defineProperty
var __getOwnPropDesc = Object.getOwnPropertyDescriptor
var __getOwnPropNames = Object.getOwnPropertyNames
var __getProtoOf = Object.getPrototypeOf
var __hasOwnProp = Object.prototype.hasOwnProperty
var __commonJS = (cb, mod) =>
	function __require() {
		return (
			mod ||
				(0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod),
			mod.exports
		)
	}
var __export = (target, all) => {
	for (var name in all)
		__defProp(target, name, { get: all[name], enumerable: true })
}
var __copyProps = (to, from, except, desc) => {
	if ((from && typeof from === 'object') || typeof from === 'function') {
		for (let key of __getOwnPropNames(from))
			if (!__hasOwnProp.call(to, key) && key !== except)
				__defProp(to, key, {
					get: () => from[key],
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
				})
	}
	return to
}
var __toESM = (mod, isNodeMode, target) => (
	(target = mod != null ? __create(__getProtoOf(mod)) : {}),
	__copyProps(
		// If the importer is in node compatibility mode or this is not an ESM
		// file that has been converted to a CommonJS file using a Babel-
		// compatible transform (i.e. "__esModule" has not been set), then set
		// "default" to the CommonJS "module.exports" for node compatibility.
		isNodeMode || !mod || !mod.__esModule
			? __defProp(target, 'default', { value: mod, enumerable: true })
			: target,
		mod,
	)
)
var __toCommonJS = (mod) =>
	__copyProps(__defProp({}, '__esModule', { value: true }), mod)

// node_modules/.pnpm/async@3.2.6/node_modules/async/dist/async.js
var require_async = __commonJS({
	'node_modules/.pnpm/async@3.2.6/node_modules/async/dist/async.js'(
		exports2,
		module2,
	) {
		;(function (global, factory) {
			typeof exports2 === 'object' && typeof module2 !== 'undefined'
				? factory(exports2)
				: typeof define === 'function' && define.amd
					? define(['exports'], factory)
					: ((global =
							typeof globalThis !== 'undefined' ? globalThis : global || self),
						factory((global.async = {})))
		})(exports2, function (exports3) {
			'use strict'
			function apply(fn, ...args) {
				return (...callArgs) => fn(...args, ...callArgs)
			}
			function initialParams(fn) {
				return function (...args) {
					var callback = args.pop()
					return fn.call(this, args, callback)
				}
			}
			var hasQueueMicrotask =
				typeof queueMicrotask === 'function' && queueMicrotask
			var hasSetImmediate = typeof setImmediate === 'function' && setImmediate
			var hasNextTick =
				typeof process === 'object' && typeof process.nextTick === 'function'
			function fallback(fn) {
				setTimeout(fn, 0)
			}
			function wrap(defer) {
				return (fn, ...args) => defer(() => fn(...args))
			}
			var _defer$1
			if (hasQueueMicrotask) {
				_defer$1 = queueMicrotask
			} else if (hasSetImmediate) {
				_defer$1 = setImmediate
			} else if (hasNextTick) {
				_defer$1 = process.nextTick
			} else {
				_defer$1 = fallback
			}
			var setImmediate$1 = wrap(_defer$1)
			function asyncify(func) {
				if (isAsync(func)) {
					return function (...args) {
						const callback = args.pop()
						const promise = func.apply(this, args)
						return handlePromise(promise, callback)
					}
				}
				return initialParams(function (args, callback) {
					var result
					try {
						result = func.apply(this, args)
					} catch (e) {
						return callback(e)
					}
					if (result && typeof result.then === 'function') {
						return handlePromise(result, callback)
					} else {
						callback(null, result)
					}
				})
			}
			function handlePromise(promise, callback) {
				return promise.then(
					(value) => {
						invokeCallback(callback, null, value)
					},
					(err) => {
						invokeCallback(
							callback,
							err && (err instanceof Error || err.message)
								? err
								: new Error(err),
						)
					},
				)
			}
			function invokeCallback(callback, error, value) {
				try {
					callback(error, value)
				} catch (err) {
					setImmediate$1((e) => {
						throw e
					}, err)
				}
			}
			function isAsync(fn) {
				return fn[Symbol.toStringTag] === 'AsyncFunction'
			}
			function isAsyncGenerator(fn) {
				return fn[Symbol.toStringTag] === 'AsyncGenerator'
			}
			function isAsyncIterable(obj) {
				return typeof obj[Symbol.asyncIterator] === 'function'
			}
			function wrapAsync(asyncFn) {
				if (typeof asyncFn !== 'function')
					throw new Error('expected a function')
				return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn
			}
			function awaitify(asyncFn, arity) {
				if (!arity) arity = asyncFn.length
				if (!arity) throw new Error('arity is undefined')
				function awaitable(...args) {
					if (typeof args[arity - 1] === 'function') {
						return asyncFn.apply(this, args)
					}
					return new Promise((resolve, reject2) => {
						args[arity - 1] = (err, ...cbArgs) => {
							if (err) return reject2(err)
							resolve(cbArgs.length > 1 ? cbArgs : cbArgs[0])
						}
						asyncFn.apply(this, args)
					})
				}
				return awaitable
			}
			function applyEach$1(eachfn) {
				return function applyEach2(fns, ...callArgs) {
					const go = awaitify(function (callback) {
						var that = this
						return eachfn(
							fns,
							(fn, cb) => {
								wrapAsync(fn).apply(that, callArgs.concat(cb))
							},
							callback,
						)
					})
					return go
				}
			}
			function _asyncMap(eachfn, arr, iteratee, callback) {
				arr = arr || []
				var results = []
				var counter = 0
				var _iteratee = wrapAsync(iteratee)
				return eachfn(
					arr,
					(value, _, iterCb) => {
						var index2 = counter++
						_iteratee(value, (err, v) => {
							results[index2] = v
							iterCb(err)
						})
					},
					(err) => {
						callback(err, results)
					},
				)
			}
			function isArrayLike(value) {
				return (
					value &&
					typeof value.length === 'number' &&
					value.length >= 0 &&
					value.length % 1 === 0
				)
			}
			const breakLoop = {}
			function once(fn) {
				function wrapper(...args) {
					if (fn === null) return
					var callFn = fn
					fn = null
					callFn.apply(this, args)
				}
				Object.assign(wrapper, fn)
				return wrapper
			}
			function getIterator(coll) {
				return coll[Symbol.iterator] && coll[Symbol.iterator]()
			}
			function createArrayIterator(coll) {
				var i = -1
				var len = coll.length
				return function next() {
					return ++i < len ? { value: coll[i], key: i } : null
				}
			}
			function createES2015Iterator(iterator) {
				var i = -1
				return function next() {
					var item = iterator.next()
					if (item.done) return null
					i++
					return { value: item.value, key: i }
				}
			}
			function createObjectIterator(obj) {
				var okeys = obj ? Object.keys(obj) : []
				var i = -1
				var len = okeys.length
				return function next() {
					var key = okeys[++i]
					if (key === '__proto__') {
						return next()
					}
					return i < len ? { value: obj[key], key } : null
				}
			}
			function createIterator(coll) {
				if (isArrayLike(coll)) {
					return createArrayIterator(coll)
				}
				var iterator = getIterator(coll)
				return iterator
					? createES2015Iterator(iterator)
					: createObjectIterator(coll)
			}
			function onlyOnce(fn) {
				return function (...args) {
					if (fn === null) throw new Error('Callback was already called.')
					var callFn = fn
					fn = null
					callFn.apply(this, args)
				}
			}
			function asyncEachOfLimit(generator, limit, iteratee, callback) {
				let done = false
				let canceled = false
				let awaiting = false
				let running = 0
				let idx = 0
				function replenish() {
					if (running >= limit || awaiting || done) return
					awaiting = true
					generator
						.next()
						.then(({ value, done: iterDone }) => {
							if (canceled || done) return
							awaiting = false
							if (iterDone) {
								done = true
								if (running <= 0) {
									callback(null)
								}
								return
							}
							running++
							iteratee(value, idx, iterateeCallback)
							idx++
							replenish()
						})
						.catch(handleError)
				}
				function iterateeCallback(err, result) {
					running -= 1
					if (canceled) return
					if (err) return handleError(err)
					if (err === false) {
						done = true
						canceled = true
						return
					}
					if (result === breakLoop || (done && running <= 0)) {
						done = true
						return callback(null)
					}
					replenish()
				}
				function handleError(err) {
					if (canceled) return
					awaiting = false
					done = true
					callback(err)
				}
				replenish()
			}
			var eachOfLimit$2 = (limit) => {
				return (obj, iteratee, callback) => {
					callback = once(callback)
					if (limit <= 0) {
						throw new RangeError('concurrency limit cannot be less than 1')
					}
					if (!obj) {
						return callback(null)
					}
					if (isAsyncGenerator(obj)) {
						return asyncEachOfLimit(obj, limit, iteratee, callback)
					}
					if (isAsyncIterable(obj)) {
						return asyncEachOfLimit(
							obj[Symbol.asyncIterator](),
							limit,
							iteratee,
							callback,
						)
					}
					var nextElem = createIterator(obj)
					var done = false
					var canceled = false
					var running = 0
					var looping = false
					function iterateeCallback(err, value) {
						if (canceled) return
						running -= 1
						if (err) {
							done = true
							callback(err)
						} else if (err === false) {
							done = true
							canceled = true
						} else if (value === breakLoop || (done && running <= 0)) {
							done = true
							return callback(null)
						} else if (!looping) {
							replenish()
						}
					}
					function replenish() {
						looping = true
						while (running < limit && !done) {
							var elem = nextElem()
							if (elem === null) {
								done = true
								if (running <= 0) {
									callback(null)
								}
								return
							}
							running += 1
							iteratee(elem.value, elem.key, onlyOnce(iterateeCallback))
						}
						looping = false
					}
					replenish()
				}
			}
			function eachOfLimit(coll, limit, iteratee, callback) {
				return eachOfLimit$2(limit)(coll, wrapAsync(iteratee), callback)
			}
			var eachOfLimit$1 = awaitify(eachOfLimit, 4)
			function eachOfArrayLike(coll, iteratee, callback) {
				callback = once(callback)
				var index2 = 0,
					completed = 0,
					{ length } = coll,
					canceled = false
				if (length === 0) {
					callback(null)
				}
				function iteratorCallback(err, value) {
					if (err === false) {
						canceled = true
					}
					if (canceled === true) return
					if (err) {
						callback(err)
					} else if (++completed === length || value === breakLoop) {
						callback(null)
					}
				}
				for (; index2 < length; index2++) {
					iteratee(coll[index2], index2, onlyOnce(iteratorCallback))
				}
			}
			function eachOfGeneric(coll, iteratee, callback) {
				return eachOfLimit$1(coll, Infinity, iteratee, callback)
			}
			function eachOf(coll, iteratee, callback) {
				var eachOfImplementation = isArrayLike(coll)
					? eachOfArrayLike
					: eachOfGeneric
				return eachOfImplementation(coll, wrapAsync(iteratee), callback)
			}
			var eachOf$1 = awaitify(eachOf, 3)
			function map(coll, iteratee, callback) {
				return _asyncMap(eachOf$1, coll, iteratee, callback)
			}
			var map$1 = awaitify(map, 3)
			var applyEach = applyEach$1(map$1)
			function eachOfSeries(coll, iteratee, callback) {
				return eachOfLimit$1(coll, 1, iteratee, callback)
			}
			var eachOfSeries$1 = awaitify(eachOfSeries, 3)
			function mapSeries(coll, iteratee, callback) {
				return _asyncMap(eachOfSeries$1, coll, iteratee, callback)
			}
			var mapSeries$1 = awaitify(mapSeries, 3)
			var applyEachSeries = applyEach$1(mapSeries$1)
			const PROMISE_SYMBOL = Symbol('promiseCallback')
			function promiseCallback() {
				let resolve, reject2
				function callback(err, ...args) {
					if (err) return reject2(err)
					resolve(args.length > 1 ? args : args[0])
				}
				callback[PROMISE_SYMBOL] = new Promise((res, rej) => {
					;(resolve = res), (reject2 = rej)
				})
				return callback
			}
			function auto(tasks, concurrency, callback) {
				if (typeof concurrency !== 'number') {
					callback = concurrency
					concurrency = null
				}
				callback = once(callback || promiseCallback())
				var numTasks = Object.keys(tasks).length
				if (!numTasks) {
					return callback(null)
				}
				if (!concurrency) {
					concurrency = numTasks
				}
				var results = {}
				var runningTasks = 0
				var canceled = false
				var hasError = false
				var listeners = /* @__PURE__ */ Object.create(null)
				var readyTasks = []
				var readyToCheck = []
				var uncheckedDependencies = {}
				Object.keys(tasks).forEach((key) => {
					var task = tasks[key]
					if (!Array.isArray(task)) {
						enqueueTask(key, [task])
						readyToCheck.push(key)
						return
					}
					var dependencies = task.slice(0, task.length - 1)
					var remainingDependencies = dependencies.length
					if (remainingDependencies === 0) {
						enqueueTask(key, task)
						readyToCheck.push(key)
						return
					}
					uncheckedDependencies[key] = remainingDependencies
					dependencies.forEach((dependencyName) => {
						if (!tasks[dependencyName]) {
							throw new Error(
								'async.auto task `' +
									key +
									'` has a non-existent dependency `' +
									dependencyName +
									'` in ' +
									dependencies.join(', '),
							)
						}
						addListener(dependencyName, () => {
							remainingDependencies--
							if (remainingDependencies === 0) {
								enqueueTask(key, task)
							}
						})
					})
				})
				checkForDeadlocks()
				processQueue()
				function enqueueTask(key, task) {
					readyTasks.push(() => runTask(key, task))
				}
				function processQueue() {
					if (canceled) return
					if (readyTasks.length === 0 && runningTasks === 0) {
						return callback(null, results)
					}
					while (readyTasks.length && runningTasks < concurrency) {
						var run = readyTasks.shift()
						run()
					}
				}
				function addListener(taskName, fn) {
					var taskListeners = listeners[taskName]
					if (!taskListeners) {
						taskListeners = listeners[taskName] = []
					}
					taskListeners.push(fn)
				}
				function taskComplete(taskName) {
					var taskListeners = listeners[taskName] || []
					taskListeners.forEach((fn) => fn())
					processQueue()
				}
				function runTask(key, task) {
					if (hasError) return
					var taskCallback = onlyOnce((err, ...result) => {
						runningTasks--
						if (err === false) {
							canceled = true
							return
						}
						if (result.length < 2) {
							;[result] = result
						}
						if (err) {
							var safeResults = {}
							Object.keys(results).forEach((rkey) => {
								safeResults[rkey] = results[rkey]
							})
							safeResults[key] = result
							hasError = true
							listeners = /* @__PURE__ */ Object.create(null)
							if (canceled) return
							callback(err, safeResults)
						} else {
							results[key] = result
							taskComplete(key)
						}
					})
					runningTasks++
					var taskFn = wrapAsync(task[task.length - 1])
					if (task.length > 1) {
						taskFn(results, taskCallback)
					} else {
						taskFn(taskCallback)
					}
				}
				function checkForDeadlocks() {
					var currentTask
					var counter = 0
					while (readyToCheck.length) {
						currentTask = readyToCheck.pop()
						counter++
						getDependents(currentTask).forEach((dependent) => {
							if (--uncheckedDependencies[dependent] === 0) {
								readyToCheck.push(dependent)
							}
						})
					}
					if (counter !== numTasks) {
						throw new Error(
							'async.auto cannot execute tasks due to a recursive dependency',
						)
					}
				}
				function getDependents(taskName) {
					var result = []
					Object.keys(tasks).forEach((key) => {
						const task = tasks[key]
						if (Array.isArray(task) && task.indexOf(taskName) >= 0) {
							result.push(key)
						}
					})
					return result
				}
				return callback[PROMISE_SYMBOL]
			}
			var FN_ARGS =
				/^(?:async\s)?(?:function)?\s*(?:\w+\s*)?\(([^)]+)\)(?:\s*{)/
			var ARROW_FN_ARGS =
				/^(?:async\s)?\s*(?:\(\s*)?((?:[^)=\s]\s*)*)(?:\)\s*)?=>/
			var FN_ARG_SPLIT = /,/
			var FN_ARG = /(=.+)?(\s*)$/
			function stripComments(string) {
				let stripped = ''
				let index2 = 0
				let endBlockComment = string.indexOf('*/')
				while (index2 < string.length) {
					if (string[index2] === '/' && string[index2 + 1] === '/') {
						let endIndex = string.indexOf('\n', index2)
						index2 = endIndex === -1 ? string.length : endIndex
					} else if (
						endBlockComment !== -1 &&
						string[index2] === '/' &&
						string[index2 + 1] === '*'
					) {
						let endIndex = string.indexOf('*/', index2)
						if (endIndex !== -1) {
							index2 = endIndex + 2
							endBlockComment = string.indexOf('*/', index2)
						} else {
							stripped += string[index2]
							index2++
						}
					} else {
						stripped += string[index2]
						index2++
					}
				}
				return stripped
			}
			function parseParams(func) {
				const src = stripComments(func.toString())
				let match = src.match(FN_ARGS)
				if (!match) {
					match = src.match(ARROW_FN_ARGS)
				}
				if (!match)
					throw new Error('could not parse args in autoInject\nSource:\n' + src)
				let [, args] = match
				return args
					.replace(/\s/g, '')
					.split(FN_ARG_SPLIT)
					.map((arg) => arg.replace(FN_ARG, '').trim())
			}
			function autoInject(tasks, callback) {
				var newTasks = {}
				Object.keys(tasks).forEach((key) => {
					var taskFn = tasks[key]
					var params
					var fnIsAsync = isAsync(taskFn)
					var hasNoDeps =
						(!fnIsAsync && taskFn.length === 1) ||
						(fnIsAsync && taskFn.length === 0)
					if (Array.isArray(taskFn)) {
						params = [...taskFn]
						taskFn = params.pop()
						newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn)
					} else if (hasNoDeps) {
						newTasks[key] = taskFn
					} else {
						params = parseParams(taskFn)
						if (taskFn.length === 0 && !fnIsAsync && params.length === 0) {
							throw new Error(
								'autoInject task functions require explicit parameters.',
							)
						}
						if (!fnIsAsync) params.pop()
						newTasks[key] = params.concat(newTask)
					}
					function newTask(results, taskCb) {
						var newArgs = params.map((name) => results[name])
						newArgs.push(taskCb)
						wrapAsync(taskFn)(...newArgs)
					}
				})
				return auto(newTasks, callback)
			}
			class DLL {
				constructor() {
					this.head = this.tail = null
					this.length = 0
				}
				removeLink(node) {
					if (node.prev) node.prev.next = node.next
					else this.head = node.next
					if (node.next) node.next.prev = node.prev
					else this.tail = node.prev
					node.prev = node.next = null
					this.length -= 1
					return node
				}
				empty() {
					while (this.head) this.shift()
					return this
				}
				insertAfter(node, newNode) {
					newNode.prev = node
					newNode.next = node.next
					if (node.next) node.next.prev = newNode
					else this.tail = newNode
					node.next = newNode
					this.length += 1
				}
				insertBefore(node, newNode) {
					newNode.prev = node.prev
					newNode.next = node
					if (node.prev) node.prev.next = newNode
					else this.head = newNode
					node.prev = newNode
					this.length += 1
				}
				unshift(node) {
					if (this.head) this.insertBefore(this.head, node)
					else setInitial(this, node)
				}
				push(node) {
					if (this.tail) this.insertAfter(this.tail, node)
					else setInitial(this, node)
				}
				shift() {
					return this.head && this.removeLink(this.head)
				}
				pop() {
					return this.tail && this.removeLink(this.tail)
				}
				toArray() {
					return [...this]
				}
				*[Symbol.iterator]() {
					var cur = this.head
					while (cur) {
						yield cur.data
						cur = cur.next
					}
				}
				remove(testFn) {
					var curr = this.head
					while (curr) {
						var { next } = curr
						if (testFn(curr)) {
							this.removeLink(curr)
						}
						curr = next
					}
					return this
				}
			}
			function setInitial(dll, node) {
				dll.length = 1
				dll.head = dll.tail = node
			}
			function queue$1(worker, concurrency, payload) {
				if (concurrency == null) {
					concurrency = 1
				} else if (concurrency === 0) {
					throw new RangeError('Concurrency must not be zero')
				}
				var _worker = wrapAsync(worker)
				var numRunning = 0
				var workersList = []
				const events = {
					error: [],
					drain: [],
					saturated: [],
					unsaturated: [],
					empty: [],
				}
				function on(event, handler) {
					events[event].push(handler)
				}
				function once2(event, handler) {
					const handleAndRemove = (...args) => {
						off(event, handleAndRemove)
						handler(...args)
					}
					events[event].push(handleAndRemove)
				}
				function off(event, handler) {
					if (!event)
						return Object.keys(events).forEach((ev) => (events[ev] = []))
					if (!handler) return (events[event] = [])
					events[event] = events[event].filter((ev) => ev !== handler)
				}
				function trigger(event, ...args) {
					events[event].forEach((handler) => handler(...args))
				}
				var processingScheduled = false
				function _insert(data, insertAtFront, rejectOnError, callback) {
					if (callback != null && typeof callback !== 'function') {
						throw new Error('task callback must be a function')
					}
					q.started = true
					var res, rej
					function promiseCallback2(err, ...args) {
						if (err) return rejectOnError ? rej(err) : res()
						if (args.length <= 1) return res(args[0])
						res(args)
					}
					var item = q._createTaskItem(
						data,
						rejectOnError ? promiseCallback2 : callback || promiseCallback2,
					)
					if (insertAtFront) {
						q._tasks.unshift(item)
					} else {
						q._tasks.push(item)
					}
					if (!processingScheduled) {
						processingScheduled = true
						setImmediate$1(() => {
							processingScheduled = false
							q.process()
						})
					}
					if (rejectOnError || !callback) {
						return new Promise((resolve, reject2) => {
							res = resolve
							rej = reject2
						})
					}
				}
				function _createCB(tasks) {
					return function (err, ...args) {
						numRunning -= 1
						for (var i = 0, l = tasks.length; i < l; i++) {
							var task = tasks[i]
							var index2 = workersList.indexOf(task)
							if (index2 === 0) {
								workersList.shift()
							} else if (index2 > 0) {
								workersList.splice(index2, 1)
							}
							task.callback(err, ...args)
							if (err != null) {
								trigger('error', err, task.data)
							}
						}
						if (numRunning <= q.concurrency - q.buffer) {
							trigger('unsaturated')
						}
						if (q.idle()) {
							trigger('drain')
						}
						q.process()
					}
				}
				function _maybeDrain(data) {
					if (data.length === 0 && q.idle()) {
						setImmediate$1(() => trigger('drain'))
						return true
					}
					return false
				}
				const eventMethod = (name) => (handler) => {
					if (!handler) {
						return new Promise((resolve, reject2) => {
							once2(name, (err, data) => {
								if (err) return reject2(err)
								resolve(data)
							})
						})
					}
					off(name)
					on(name, handler)
				}
				var isProcessing = false
				var q = {
					_tasks: new DLL(),
					_createTaskItem(data, callback) {
						return {
							data,
							callback,
						}
					},
					*[Symbol.iterator]() {
						yield* q._tasks[Symbol.iterator]()
					},
					concurrency,
					payload,
					buffer: concurrency / 4,
					started: false,
					paused: false,
					push(data, callback) {
						if (Array.isArray(data)) {
							if (_maybeDrain(data)) return
							return data.map((datum) => _insert(datum, false, false, callback))
						}
						return _insert(data, false, false, callback)
					},
					pushAsync(data, callback) {
						if (Array.isArray(data)) {
							if (_maybeDrain(data)) return
							return data.map((datum) => _insert(datum, false, true, callback))
						}
						return _insert(data, false, true, callback)
					},
					kill() {
						off()
						q._tasks.empty()
					},
					unshift(data, callback) {
						if (Array.isArray(data)) {
							if (_maybeDrain(data)) return
							return data.map((datum) => _insert(datum, true, false, callback))
						}
						return _insert(data, true, false, callback)
					},
					unshiftAsync(data, callback) {
						if (Array.isArray(data)) {
							if (_maybeDrain(data)) return
							return data.map((datum) => _insert(datum, true, true, callback))
						}
						return _insert(data, true, true, callback)
					},
					remove(testFn) {
						q._tasks.remove(testFn)
					},
					process() {
						if (isProcessing) {
							return
						}
						isProcessing = true
						while (!q.paused && numRunning < q.concurrency && q._tasks.length) {
							var tasks = [],
								data = []
							var l = q._tasks.length
							if (q.payload) l = Math.min(l, q.payload)
							for (var i = 0; i < l; i++) {
								var node = q._tasks.shift()
								tasks.push(node)
								workersList.push(node)
								data.push(node.data)
							}
							numRunning += 1
							if (q._tasks.length === 0) {
								trigger('empty')
							}
							if (numRunning === q.concurrency) {
								trigger('saturated')
							}
							var cb = onlyOnce(_createCB(tasks))
							_worker(data, cb)
						}
						isProcessing = false
					},
					length() {
						return q._tasks.length
					},
					running() {
						return numRunning
					},
					workersList() {
						return workersList
					},
					idle() {
						return q._tasks.length + numRunning === 0
					},
					pause() {
						q.paused = true
					},
					resume() {
						if (q.paused === false) {
							return
						}
						q.paused = false
						setImmediate$1(q.process)
					},
				}
				Object.defineProperties(q, {
					saturated: {
						writable: false,
						value: eventMethod('saturated'),
					},
					unsaturated: {
						writable: false,
						value: eventMethod('unsaturated'),
					},
					empty: {
						writable: false,
						value: eventMethod('empty'),
					},
					drain: {
						writable: false,
						value: eventMethod('drain'),
					},
					error: {
						writable: false,
						value: eventMethod('error'),
					},
				})
				return q
			}
			function cargo$1(worker, payload) {
				return queue$1(worker, 1, payload)
			}
			function cargo(worker, concurrency, payload) {
				return queue$1(worker, concurrency, payload)
			}
			function reduce(coll, memo, iteratee, callback) {
				callback = once(callback)
				var _iteratee = wrapAsync(iteratee)
				return eachOfSeries$1(
					coll,
					(x, i, iterCb) => {
						_iteratee(memo, x, (err, v) => {
							memo = v
							iterCb(err)
						})
					},
					(err) => callback(err, memo),
				)
			}
			var reduce$1 = awaitify(reduce, 4)
			function seq(...functions) {
				var _functions = functions.map(wrapAsync)
				return function (...args) {
					var that = this
					var cb = args[args.length - 1]
					if (typeof cb == 'function') {
						args.pop()
					} else {
						cb = promiseCallback()
					}
					reduce$1(
						_functions,
						args,
						(newargs, fn, iterCb) => {
							fn.apply(
								that,
								newargs.concat((err, ...nextargs) => {
									iterCb(err, nextargs)
								}),
							)
						},
						(err, results) => cb(err, ...results),
					)
					return cb[PROMISE_SYMBOL]
				}
			}
			function compose(...args) {
				return seq(...args.reverse())
			}
			function mapLimit(coll, limit, iteratee, callback) {
				return _asyncMap(eachOfLimit$2(limit), coll, iteratee, callback)
			}
			var mapLimit$1 = awaitify(mapLimit, 4)
			function concatLimit(coll, limit, iteratee, callback) {
				var _iteratee = wrapAsync(iteratee)
				return mapLimit$1(
					coll,
					limit,
					(val, iterCb) => {
						_iteratee(val, (err, ...args) => {
							if (err) return iterCb(err)
							return iterCb(err, args)
						})
					},
					(err, mapResults) => {
						var result = []
						for (var i = 0; i < mapResults.length; i++) {
							if (mapResults[i]) {
								result = result.concat(...mapResults[i])
							}
						}
						return callback(err, result)
					},
				)
			}
			var concatLimit$1 = awaitify(concatLimit, 4)
			function concat(coll, iteratee, callback) {
				return concatLimit$1(coll, Infinity, iteratee, callback)
			}
			var concat$1 = awaitify(concat, 3)
			function concatSeries(coll, iteratee, callback) {
				return concatLimit$1(coll, 1, iteratee, callback)
			}
			var concatSeries$1 = awaitify(concatSeries, 3)
			function constant$1(...args) {
				return function (...ignoredArgs) {
					var callback = ignoredArgs.pop()
					return callback(null, ...args)
				}
			}
			function _createTester(check, getResult) {
				return (eachfn, arr, _iteratee, cb) => {
					var testPassed = false
					var testResult
					const iteratee = wrapAsync(_iteratee)
					eachfn(
						arr,
						(value, _, callback) => {
							iteratee(value, (err, result) => {
								if (err || err === false) return callback(err)
								if (check(result) && !testResult) {
									testPassed = true
									testResult = getResult(true, value)
									return callback(null, breakLoop)
								}
								callback()
							})
						},
						(err) => {
							if (err) return cb(err)
							cb(null, testPassed ? testResult : getResult(false))
						},
					)
				}
			}
			function detect(coll, iteratee, callback) {
				return _createTester(
					(bool) => bool,
					(res, item) => item,
				)(eachOf$1, coll, iteratee, callback)
			}
			var detect$1 = awaitify(detect, 3)
			function detectLimit(coll, limit, iteratee, callback) {
				return _createTester(
					(bool) => bool,
					(res, item) => item,
				)(eachOfLimit$2(limit), coll, iteratee, callback)
			}
			var detectLimit$1 = awaitify(detectLimit, 4)
			function detectSeries(coll, iteratee, callback) {
				return _createTester(
					(bool) => bool,
					(res, item) => item,
				)(eachOfLimit$2(1), coll, iteratee, callback)
			}
			var detectSeries$1 = awaitify(detectSeries, 3)
			function consoleFunc(name) {
				return (fn, ...args) =>
					wrapAsync(fn)(...args, (err, ...resultArgs) => {
						if (typeof console === 'object') {
							if (err) {
								if (console.error) {
									console.error(err)
								}
							} else if (console[name]) {
								resultArgs.forEach((x) => console[name](x))
							}
						}
					})
			}
			var dir = consoleFunc('dir')
			function doWhilst(iteratee, test, callback) {
				callback = onlyOnce(callback)
				var _fn = wrapAsync(iteratee)
				var _test = wrapAsync(test)
				var results
				function next(err, ...args) {
					if (err) return callback(err)
					if (err === false) return
					results = args
					_test(...args, check)
				}
				function check(err, truth) {
					if (err) return callback(err)
					if (err === false) return
					if (!truth) return callback(null, ...results)
					_fn(next)
				}
				return check(null, true)
			}
			var doWhilst$1 = awaitify(doWhilst, 3)
			function doUntil(iteratee, test, callback) {
				const _test = wrapAsync(test)
				return doWhilst$1(
					iteratee,
					(...args) => {
						const cb = args.pop()
						_test(...args, (err, truth) => cb(err, !truth))
					},
					callback,
				)
			}
			function _withoutIndex(iteratee) {
				return (value, index2, callback) => iteratee(value, callback)
			}
			function eachLimit$2(coll, iteratee, callback) {
				return eachOf$1(coll, _withoutIndex(wrapAsync(iteratee)), callback)
			}
			var each = awaitify(eachLimit$2, 3)
			function eachLimit(coll, limit, iteratee, callback) {
				return eachOfLimit$2(limit)(
					coll,
					_withoutIndex(wrapAsync(iteratee)),
					callback,
				)
			}
			var eachLimit$1 = awaitify(eachLimit, 4)
			function eachSeries(coll, iteratee, callback) {
				return eachLimit$1(coll, 1, iteratee, callback)
			}
			var eachSeries$1 = awaitify(eachSeries, 3)
			function ensureAsync(fn) {
				if (isAsync(fn)) return fn
				return function (...args) {
					var callback = args.pop()
					var sync = true
					args.push((...innerArgs) => {
						if (sync) {
							setImmediate$1(() => callback(...innerArgs))
						} else {
							callback(...innerArgs)
						}
					})
					fn.apply(this, args)
					sync = false
				}
			}
			function every(coll, iteratee, callback) {
				return _createTester(
					(bool) => !bool,
					(res) => !res,
				)(eachOf$1, coll, iteratee, callback)
			}
			var every$1 = awaitify(every, 3)
			function everyLimit(coll, limit, iteratee, callback) {
				return _createTester(
					(bool) => !bool,
					(res) => !res,
				)(eachOfLimit$2(limit), coll, iteratee, callback)
			}
			var everyLimit$1 = awaitify(everyLimit, 4)
			function everySeries(coll, iteratee, callback) {
				return _createTester(
					(bool) => !bool,
					(res) => !res,
				)(eachOfSeries$1, coll, iteratee, callback)
			}
			var everySeries$1 = awaitify(everySeries, 3)
			function filterArray(eachfn, arr, iteratee, callback) {
				var truthValues = new Array(arr.length)
				eachfn(
					arr,
					(x, index2, iterCb) => {
						iteratee(x, (err, v) => {
							truthValues[index2] = !!v
							iterCb(err)
						})
					},
					(err) => {
						if (err) return callback(err)
						var results = []
						for (var i = 0; i < arr.length; i++) {
							if (truthValues[i]) results.push(arr[i])
						}
						callback(null, results)
					},
				)
			}
			function filterGeneric(eachfn, coll, iteratee, callback) {
				var results = []
				eachfn(
					coll,
					(x, index2, iterCb) => {
						iteratee(x, (err, v) => {
							if (err) return iterCb(err)
							if (v) {
								results.push({ index: index2, value: x })
							}
							iterCb(err)
						})
					},
					(err) => {
						if (err) return callback(err)
						callback(
							null,
							results.sort((a, b) => a.index - b.index).map((v) => v.value),
						)
					},
				)
			}
			function _filter(eachfn, coll, iteratee, callback) {
				var filter2 = isArrayLike(coll) ? filterArray : filterGeneric
				return filter2(eachfn, coll, wrapAsync(iteratee), callback)
			}
			function filter(coll, iteratee, callback) {
				return _filter(eachOf$1, coll, iteratee, callback)
			}
			var filter$1 = awaitify(filter, 3)
			function filterLimit(coll, limit, iteratee, callback) {
				return _filter(eachOfLimit$2(limit), coll, iteratee, callback)
			}
			var filterLimit$1 = awaitify(filterLimit, 4)
			function filterSeries(coll, iteratee, callback) {
				return _filter(eachOfSeries$1, coll, iteratee, callback)
			}
			var filterSeries$1 = awaitify(filterSeries, 3)
			function forever(fn, errback) {
				var done = onlyOnce(errback)
				var task = wrapAsync(ensureAsync(fn))
				function next(err) {
					if (err) return done(err)
					if (err === false) return
					task(next)
				}
				return next()
			}
			var forever$1 = awaitify(forever, 2)
			function groupByLimit(coll, limit, iteratee, callback) {
				var _iteratee = wrapAsync(iteratee)
				return mapLimit$1(
					coll,
					limit,
					(val, iterCb) => {
						_iteratee(val, (err, key) => {
							if (err) return iterCb(err)
							return iterCb(err, { key, val })
						})
					},
					(err, mapResults) => {
						var result = {}
						var { hasOwnProperty } = Object.prototype
						for (var i = 0; i < mapResults.length; i++) {
							if (mapResults[i]) {
								var { key } = mapResults[i]
								var { val } = mapResults[i]
								if (hasOwnProperty.call(result, key)) {
									result[key].push(val)
								} else {
									result[key] = [val]
								}
							}
						}
						return callback(err, result)
					},
				)
			}
			var groupByLimit$1 = awaitify(groupByLimit, 4)
			function groupBy(coll, iteratee, callback) {
				return groupByLimit$1(coll, Infinity, iteratee, callback)
			}
			function groupBySeries(coll, iteratee, callback) {
				return groupByLimit$1(coll, 1, iteratee, callback)
			}
			var log = consoleFunc('log')
			function mapValuesLimit(obj, limit, iteratee, callback) {
				callback = once(callback)
				var newObj = {}
				var _iteratee = wrapAsync(iteratee)
				return eachOfLimit$2(limit)(
					obj,
					(val, key, next) => {
						_iteratee(val, key, (err, result) => {
							if (err) return next(err)
							newObj[key] = result
							next(err)
						})
					},
					(err) => callback(err, newObj),
				)
			}
			var mapValuesLimit$1 = awaitify(mapValuesLimit, 4)
			function mapValues(obj, iteratee, callback) {
				return mapValuesLimit$1(obj, Infinity, iteratee, callback)
			}
			function mapValuesSeries(obj, iteratee, callback) {
				return mapValuesLimit$1(obj, 1, iteratee, callback)
			}
			function memoize(fn, hasher = (v) => v) {
				var memo = /* @__PURE__ */ Object.create(null)
				var queues = /* @__PURE__ */ Object.create(null)
				var _fn = wrapAsync(fn)
				var memoized = initialParams((args, callback) => {
					var key = hasher(...args)
					if (key in memo) {
						setImmediate$1(() => callback(null, ...memo[key]))
					} else if (key in queues) {
						queues[key].push(callback)
					} else {
						queues[key] = [callback]
						_fn(...args, (err, ...resultArgs) => {
							if (!err) {
								memo[key] = resultArgs
							}
							var q = queues[key]
							delete queues[key]
							for (var i = 0, l = q.length; i < l; i++) {
								q[i](err, ...resultArgs)
							}
						})
					}
				})
				memoized.memo = memo
				memoized.unmemoized = fn
				return memoized
			}
			var _defer
			if (hasNextTick) {
				_defer = process.nextTick
			} else if (hasSetImmediate) {
				_defer = setImmediate
			} else {
				_defer = fallback
			}
			var nextTick = wrap(_defer)
			var _parallel = awaitify((eachfn, tasks, callback) => {
				var results = isArrayLike(tasks) ? [] : {}
				eachfn(
					tasks,
					(task, key, taskCb) => {
						wrapAsync(task)((err, ...result) => {
							if (result.length < 2) {
								;[result] = result
							}
							results[key] = result
							taskCb(err)
						})
					},
					(err) => callback(err, results),
				)
			}, 3)
			function parallel(tasks, callback) {
				return _parallel(eachOf$1, tasks, callback)
			}
			function parallelLimit(tasks, limit, callback) {
				return _parallel(eachOfLimit$2(limit), tasks, callback)
			}
			function queue(worker, concurrency) {
				var _worker = wrapAsync(worker)
				return queue$1(
					(items, cb) => {
						_worker(items[0], cb)
					},
					concurrency,
					1,
				)
			}
			class Heap {
				constructor() {
					this.heap = []
					this.pushCount = Number.MIN_SAFE_INTEGER
				}
				get length() {
					return this.heap.length
				}
				empty() {
					this.heap = []
					return this
				}
				percUp(index2) {
					let p
					while (
						index2 > 0 &&
						smaller(this.heap[index2], this.heap[(p = parent(index2))])
					) {
						let t = this.heap[index2]
						this.heap[index2] = this.heap[p]
						this.heap[p] = t
						index2 = p
					}
				}
				percDown(index2) {
					let l
					while ((l = leftChi(index2)) < this.heap.length) {
						if (
							l + 1 < this.heap.length &&
							smaller(this.heap[l + 1], this.heap[l])
						) {
							l = l + 1
						}
						if (smaller(this.heap[index2], this.heap[l])) {
							break
						}
						let t = this.heap[index2]
						this.heap[index2] = this.heap[l]
						this.heap[l] = t
						index2 = l
					}
				}
				push(node) {
					node.pushCount = ++this.pushCount
					this.heap.push(node)
					this.percUp(this.heap.length - 1)
				}
				unshift(node) {
					return this.heap.push(node)
				}
				shift() {
					let [top] = this.heap
					this.heap[0] = this.heap[this.heap.length - 1]
					this.heap.pop()
					this.percDown(0)
					return top
				}
				toArray() {
					return [...this]
				}
				*[Symbol.iterator]() {
					for (let i = 0; i < this.heap.length; i++) {
						yield this.heap[i].data
					}
				}
				remove(testFn) {
					let j = 0
					for (let i = 0; i < this.heap.length; i++) {
						if (!testFn(this.heap[i])) {
							this.heap[j] = this.heap[i]
							j++
						}
					}
					this.heap.splice(j)
					for (let i = parent(this.heap.length - 1); i >= 0; i--) {
						this.percDown(i)
					}
					return this
				}
			}
			function leftChi(i) {
				return (i << 1) + 1
			}
			function parent(i) {
				return ((i + 1) >> 1) - 1
			}
			function smaller(x, y) {
				if (x.priority !== y.priority) {
					return x.priority < y.priority
				} else {
					return x.pushCount < y.pushCount
				}
			}
			function priorityQueue(worker, concurrency) {
				var q = queue(worker, concurrency)
				var { push, pushAsync } = q
				q._tasks = new Heap()
				q._createTaskItem = ({ data, priority }, callback) => {
					return {
						data,
						priority,
						callback,
					}
				}
				function createDataItems(tasks, priority) {
					if (!Array.isArray(tasks)) {
						return { data: tasks, priority }
					}
					return tasks.map((data) => {
						return { data, priority }
					})
				}
				q.push = function (data, priority = 0, callback) {
					return push(createDataItems(data, priority), callback)
				}
				q.pushAsync = function (data, priority = 0, callback) {
					return pushAsync(createDataItems(data, priority), callback)
				}
				delete q.unshift
				delete q.unshiftAsync
				return q
			}
			function race(tasks, callback) {
				callback = once(callback)
				if (!Array.isArray(tasks))
					return callback(
						new TypeError(
							'First argument to race must be an array of functions',
						),
					)
				if (!tasks.length) return callback()
				for (var i = 0, l = tasks.length; i < l; i++) {
					wrapAsync(tasks[i])(callback)
				}
			}
			var race$1 = awaitify(race, 2)
			function reduceRight(array, memo, iteratee, callback) {
				var reversed = [...array].reverse()
				return reduce$1(reversed, memo, iteratee, callback)
			}
			function reflect(fn) {
				var _fn = wrapAsync(fn)
				return initialParams(function reflectOn(args, reflectCallback) {
					args.push((error, ...cbArgs) => {
						let retVal = {}
						if (error) {
							retVal.error = error
						}
						if (cbArgs.length > 0) {
							var value = cbArgs
							if (cbArgs.length <= 1) {
								;[value] = cbArgs
							}
							retVal.value = value
						}
						reflectCallback(null, retVal)
					})
					return _fn.apply(this, args)
				})
			}
			function reflectAll(tasks) {
				var results
				if (Array.isArray(tasks)) {
					results = tasks.map(reflect)
				} else {
					results = {}
					Object.keys(tasks).forEach((key) => {
						results[key] = reflect.call(this, tasks[key])
					})
				}
				return results
			}
			function reject$2(eachfn, arr, _iteratee, callback) {
				const iteratee = wrapAsync(_iteratee)
				return _filter(
					eachfn,
					arr,
					(value, cb) => {
						iteratee(value, (err, v) => {
							cb(err, !v)
						})
					},
					callback,
				)
			}
			function reject(coll, iteratee, callback) {
				return reject$2(eachOf$1, coll, iteratee, callback)
			}
			var reject$1 = awaitify(reject, 3)
			function rejectLimit(coll, limit, iteratee, callback) {
				return reject$2(eachOfLimit$2(limit), coll, iteratee, callback)
			}
			var rejectLimit$1 = awaitify(rejectLimit, 4)
			function rejectSeries(coll, iteratee, callback) {
				return reject$2(eachOfSeries$1, coll, iteratee, callback)
			}
			var rejectSeries$1 = awaitify(rejectSeries, 3)
			function constant(value) {
				return function () {
					return value
				}
			}
			const DEFAULT_TIMES = 5
			const DEFAULT_INTERVAL = 0
			function retry(opts, task, callback) {
				var options = {
					times: DEFAULT_TIMES,
					intervalFunc: constant(DEFAULT_INTERVAL),
				}
				if (arguments.length < 3 && typeof opts === 'function') {
					callback = task || promiseCallback()
					task = opts
				} else {
					parseTimes(options, opts)
					callback = callback || promiseCallback()
				}
				if (typeof task !== 'function') {
					throw new Error('Invalid arguments for async.retry')
				}
				var _task = wrapAsync(task)
				var attempt = 1
				function retryAttempt() {
					_task((err, ...args) => {
						if (err === false) return
						if (
							err &&
							attempt++ < options.times &&
							(typeof options.errorFilter != 'function' ||
								options.errorFilter(err))
						) {
							setTimeout(retryAttempt, options.intervalFunc(attempt - 1))
						} else {
							callback(err, ...args)
						}
					})
				}
				retryAttempt()
				return callback[PROMISE_SYMBOL]
			}
			function parseTimes(acc, t) {
				if (typeof t === 'object') {
					acc.times = +t.times || DEFAULT_TIMES
					acc.intervalFunc =
						typeof t.interval === 'function'
							? t.interval
							: constant(+t.interval || DEFAULT_INTERVAL)
					acc.errorFilter = t.errorFilter
				} else if (typeof t === 'number' || typeof t === 'string') {
					acc.times = +t || DEFAULT_TIMES
				} else {
					throw new Error('Invalid arguments for async.retry')
				}
			}
			function retryable(opts, task) {
				if (!task) {
					task = opts
					opts = null
				}
				let arity = (opts && opts.arity) || task.length
				if (isAsync(task)) {
					arity += 1
				}
				var _task = wrapAsync(task)
				return initialParams((args, callback) => {
					if (args.length < arity - 1 || callback == null) {
						args.push(callback)
						callback = promiseCallback()
					}
					function taskFn(cb) {
						_task(...args, cb)
					}
					if (opts) retry(opts, taskFn, callback)
					else retry(taskFn, callback)
					return callback[PROMISE_SYMBOL]
				})
			}
			function series(tasks, callback) {
				return _parallel(eachOfSeries$1, tasks, callback)
			}
			function some(coll, iteratee, callback) {
				return _createTester(Boolean, (res) => res)(
					eachOf$1,
					coll,
					iteratee,
					callback,
				)
			}
			var some$1 = awaitify(some, 3)
			function someLimit(coll, limit, iteratee, callback) {
				return _createTester(Boolean, (res) => res)(
					eachOfLimit$2(limit),
					coll,
					iteratee,
					callback,
				)
			}
			var someLimit$1 = awaitify(someLimit, 4)
			function someSeries(coll, iteratee, callback) {
				return _createTester(Boolean, (res) => res)(
					eachOfSeries$1,
					coll,
					iteratee,
					callback,
				)
			}
			var someSeries$1 = awaitify(someSeries, 3)
			function sortBy(coll, iteratee, callback) {
				var _iteratee = wrapAsync(iteratee)
				return map$1(
					coll,
					(x, iterCb) => {
						_iteratee(x, (err, criteria) => {
							if (err) return iterCb(err)
							iterCb(err, { value: x, criteria })
						})
					},
					(err, results) => {
						if (err) return callback(err)
						callback(
							null,
							results.sort(comparator).map((v) => v.value),
						)
					},
				)
				function comparator(left, right) {
					var a = left.criteria,
						b = right.criteria
					return a < b ? -1 : a > b ? 1 : 0
				}
			}
			var sortBy$1 = awaitify(sortBy, 3)
			function timeout(asyncFn, milliseconds, info) {
				var fn = wrapAsync(asyncFn)
				return initialParams((args, callback) => {
					var timedOut = false
					var timer
					function timeoutCallback() {
						var name = asyncFn.name || 'anonymous'
						var error = new Error('Callback function "' + name + '" timed out.')
						error.code = 'ETIMEDOUT'
						if (info) {
							error.info = info
						}
						timedOut = true
						callback(error)
					}
					args.push((...cbArgs) => {
						if (!timedOut) {
							callback(...cbArgs)
							clearTimeout(timer)
						}
					})
					timer = setTimeout(timeoutCallback, milliseconds)
					fn(...args)
				})
			}
			function range(size) {
				var result = Array(size)
				while (size--) {
					result[size] = size
				}
				return result
			}
			function timesLimit(count, limit, iteratee, callback) {
				var _iteratee = wrapAsync(iteratee)
				return mapLimit$1(range(count), limit, _iteratee, callback)
			}
			function times(n, iteratee, callback) {
				return timesLimit(n, Infinity, iteratee, callback)
			}
			function timesSeries(n, iteratee, callback) {
				return timesLimit(n, 1, iteratee, callback)
			}
			function transform(coll, accumulator, iteratee, callback) {
				if (arguments.length <= 3 && typeof accumulator === 'function') {
					callback = iteratee
					iteratee = accumulator
					accumulator = Array.isArray(coll) ? [] : {}
				}
				callback = once(callback || promiseCallback())
				var _iteratee = wrapAsync(iteratee)
				eachOf$1(
					coll,
					(v, k, cb) => {
						_iteratee(accumulator, v, k, cb)
					},
					(err) => callback(err, accumulator),
				)
				return callback[PROMISE_SYMBOL]
			}
			function tryEach(tasks, callback) {
				var error = null
				var result
				return eachSeries$1(
					tasks,
					(task, taskCb) => {
						wrapAsync(task)((err, ...args) => {
							if (err === false) return taskCb(err)
							if (args.length < 2) {
								;[result] = args
							} else {
								result = args
							}
							error = err
							taskCb(err ? null : {})
						})
					},
					() => callback(error, result),
				)
			}
			var tryEach$1 = awaitify(tryEach)
			function unmemoize(fn) {
				return (...args) => {
					return (fn.unmemoized || fn)(...args)
				}
			}
			function whilst(test, iteratee, callback) {
				callback = onlyOnce(callback)
				var _fn = wrapAsync(iteratee)
				var _test = wrapAsync(test)
				var results = []
				function next(err, ...rest) {
					if (err) return callback(err)
					results = rest
					if (err === false) return
					_test(check)
				}
				function check(err, truth) {
					if (err) return callback(err)
					if (err === false) return
					if (!truth) return callback(null, ...results)
					_fn(next)
				}
				return _test(check)
			}
			var whilst$1 = awaitify(whilst, 3)
			function until(test, iteratee, callback) {
				const _test = wrapAsync(test)
				return whilst$1(
					(cb) => _test((err, truth) => cb(err, !truth)),
					iteratee,
					callback,
				)
			}
			function waterfall(tasks, callback) {
				callback = once(callback)
				if (!Array.isArray(tasks))
					return callback(
						new Error(
							'First argument to waterfall must be an array of functions',
						),
					)
				if (!tasks.length) return callback()
				var taskIndex = 0
				function nextTask(args) {
					var task = wrapAsync(tasks[taskIndex++])
					task(...args, onlyOnce(next))
				}
				function next(err, ...args) {
					if (err === false) return
					if (err || taskIndex === tasks.length) {
						return callback(err, ...args)
					}
					nextTask(args)
				}
				nextTask([])
			}
			var waterfall$1 = awaitify(waterfall)
			var index = {
				apply,
				applyEach,
				applyEachSeries,
				asyncify,
				auto,
				autoInject,
				cargo: cargo$1,
				cargoQueue: cargo,
				compose,
				concat: concat$1,
				concatLimit: concatLimit$1,
				concatSeries: concatSeries$1,
				constant: constant$1,
				detect: detect$1,
				detectLimit: detectLimit$1,
				detectSeries: detectSeries$1,
				dir,
				doUntil,
				doWhilst: doWhilst$1,
				each,
				eachLimit: eachLimit$1,
				eachOf: eachOf$1,
				eachOfLimit: eachOfLimit$1,
				eachOfSeries: eachOfSeries$1,
				eachSeries: eachSeries$1,
				ensureAsync,
				every: every$1,
				everyLimit: everyLimit$1,
				everySeries: everySeries$1,
				filter: filter$1,
				filterLimit: filterLimit$1,
				filterSeries: filterSeries$1,
				forever: forever$1,
				groupBy,
				groupByLimit: groupByLimit$1,
				groupBySeries,
				log,
				map: map$1,
				mapLimit: mapLimit$1,
				mapSeries: mapSeries$1,
				mapValues,
				mapValuesLimit: mapValuesLimit$1,
				mapValuesSeries,
				memoize,
				nextTick,
				parallel,
				parallelLimit,
				priorityQueue,
				queue,
				race: race$1,
				reduce: reduce$1,
				reduceRight,
				reflect,
				reflectAll,
				reject: reject$1,
				rejectLimit: rejectLimit$1,
				rejectSeries: rejectSeries$1,
				retry,
				retryable,
				seq,
				series,
				setImmediate: setImmediate$1,
				some: some$1,
				someLimit: someLimit$1,
				someSeries: someSeries$1,
				sortBy: sortBy$1,
				timeout,
				times,
				timesLimit,
				timesSeries,
				transform,
				tryEach: tryEach$1,
				unmemoize,
				until,
				waterfall: waterfall$1,
				whilst: whilst$1,
				// aliases
				all: every$1,
				allLimit: everyLimit$1,
				allSeries: everySeries$1,
				any: some$1,
				anyLimit: someLimit$1,
				anySeries: someSeries$1,
				find: detect$1,
				findLimit: detectLimit$1,
				findSeries: detectSeries$1,
				flatMap: concat$1,
				flatMapLimit: concatLimit$1,
				flatMapSeries: concatSeries$1,
				forEach: each,
				forEachSeries: eachSeries$1,
				forEachLimit: eachLimit$1,
				forEachOf: eachOf$1,
				forEachOfSeries: eachOfSeries$1,
				forEachOfLimit: eachOfLimit$1,
				inject: reduce$1,
				foldl: reduce$1,
				foldr: reduceRight,
				select: filter$1,
				selectLimit: filterLimit$1,
				selectSeries: filterSeries$1,
				wrapSync: asyncify,
				during: whilst$1,
				doDuring: doWhilst$1,
			}
			exports3.all = every$1
			exports3.allLimit = everyLimit$1
			exports3.allSeries = everySeries$1
			exports3.any = some$1
			exports3.anyLimit = someLimit$1
			exports3.anySeries = someSeries$1
			exports3.apply = apply
			exports3.applyEach = applyEach
			exports3.applyEachSeries = applyEachSeries
			exports3.asyncify = asyncify
			exports3.auto = auto
			exports3.autoInject = autoInject
			exports3.cargo = cargo$1
			exports3.cargoQueue = cargo
			exports3.compose = compose
			exports3.concat = concat$1
			exports3.concatLimit = concatLimit$1
			exports3.concatSeries = concatSeries$1
			exports3.constant = constant$1
			exports3.default = index
			exports3.detect = detect$1
			exports3.detectLimit = detectLimit$1
			exports3.detectSeries = detectSeries$1
			exports3.dir = dir
			exports3.doDuring = doWhilst$1
			exports3.doUntil = doUntil
			exports3.doWhilst = doWhilst$1
			exports3.during = whilst$1
			exports3.each = each
			exports3.eachLimit = eachLimit$1
			exports3.eachOf = eachOf$1
			exports3.eachOfLimit = eachOfLimit$1
			exports3.eachOfSeries = eachOfSeries$1
			exports3.eachSeries = eachSeries$1
			exports3.ensureAsync = ensureAsync
			exports3.every = every$1
			exports3.everyLimit = everyLimit$1
			exports3.everySeries = everySeries$1
			exports3.filter = filter$1
			exports3.filterLimit = filterLimit$1
			exports3.filterSeries = filterSeries$1
			exports3.find = detect$1
			exports3.findLimit = detectLimit$1
			exports3.findSeries = detectSeries$1
			exports3.flatMap = concat$1
			exports3.flatMapLimit = concatLimit$1
			exports3.flatMapSeries = concatSeries$1
			exports3.foldl = reduce$1
			exports3.foldr = reduceRight
			exports3.forEach = each
			exports3.forEachLimit = eachLimit$1
			exports3.forEachOf = eachOf$1
			exports3.forEachOfLimit = eachOfLimit$1
			exports3.forEachOfSeries = eachOfSeries$1
			exports3.forEachSeries = eachSeries$1
			exports3.forever = forever$1
			exports3.groupBy = groupBy
			exports3.groupByLimit = groupByLimit$1
			exports3.groupBySeries = groupBySeries
			exports3.inject = reduce$1
			exports3.log = log
			exports3.map = map$1
			exports3.mapLimit = mapLimit$1
			exports3.mapSeries = mapSeries$1
			exports3.mapValues = mapValues
			exports3.mapValuesLimit = mapValuesLimit$1
			exports3.mapValuesSeries = mapValuesSeries
			exports3.memoize = memoize
			exports3.nextTick = nextTick
			exports3.parallel = parallel
			exports3.parallelLimit = parallelLimit
			exports3.priorityQueue = priorityQueue
			exports3.queue = queue
			exports3.race = race$1
			exports3.reduce = reduce$1
			exports3.reduceRight = reduceRight
			exports3.reflect = reflect
			exports3.reflectAll = reflectAll
			exports3.reject = reject$1
			exports3.rejectLimit = rejectLimit$1
			exports3.rejectSeries = rejectSeries$1
			exports3.retry = retry
			exports3.retryable = retryable
			exports3.select = filter$1
			exports3.selectLimit = filterLimit$1
			exports3.selectSeries = filterSeries$1
			exports3.seq = seq
			exports3.series = series
			exports3.setImmediate = setImmediate$1
			exports3.some = some$1
			exports3.someLimit = someLimit$1
			exports3.someSeries = someSeries$1
			exports3.sortBy = sortBy$1
			exports3.timeout = timeout
			exports3.times = times
			exports3.timesLimit = timesLimit
			exports3.timesSeries = timesSeries
			exports3.transform = transform
			exports3.tryEach = tryEach$1
			exports3.unmemoize = unmemoize
			exports3.until = until
			exports3.waterfall = waterfall$1
			exports3.whilst = whilst$1
			exports3.wrapSync = asyncify
			Object.defineProperty(exports3, '__esModule', { value: true })
		})
	},
})

// node_modules/.pnpm/doublearray@0.0.2/node_modules/doublearray/doublearray.js
var require_doublearray = __commonJS({
	'node_modules/.pnpm/doublearray@0.0.2/node_modules/doublearray/doublearray.js'(
		exports2,
		module2,
	) {
		;(function () {
			'use strict'
			var TERM_CHAR = '\0',
				TERM_CODE = 0,
				ROOT_ID = 0,
				NOT_FOUND = -1,
				BASE_SIGNED = true,
				CHECK_SIGNED = true,
				BASE_BYTES = 4,
				CHECK_BYTES = 4,
				MEMORY_EXPAND_RATIO = 2
			var newBC = function (initial_size) {
				if (initial_size == null) {
					initial_size = 1024
				}
				var initBase = function (_base, start, end) {
					for (var i = start; i < end; i++) {
						_base[i] = -i + 1
					}
					if (0 < check.array[check.array.length - 1]) {
						var last_used_id = check.array.length - 2
						while (0 < check.array[last_used_id]) {
							last_used_id--
						}
						_base[start] = -last_used_id
					}
				}
				var initCheck = function (_check, start, end) {
					for (var i = start; i < end; i++) {
						_check[i] = -i - 1
					}
				}
				var realloc = function (min_size) {
					var new_size = min_size * MEMORY_EXPAND_RATIO
					var base_new_array = newArrayBuffer(base.signed, base.bytes, new_size)
					initBase(base_new_array, base.array.length, new_size)
					base_new_array.set(base.array)
					base.array = null
					base.array = base_new_array
					var check_new_array = newArrayBuffer(
						check.signed,
						check.bytes,
						new_size,
					)
					initCheck(check_new_array, check.array.length, new_size)
					check_new_array.set(check.array)
					check.array = null
					check.array = check_new_array
				}
				var first_unused_node = ROOT_ID + 1
				var base = {
					signed: BASE_SIGNED,
					bytes: BASE_BYTES,
					array: newArrayBuffer(BASE_SIGNED, BASE_BYTES, initial_size),
				}
				var check = {
					signed: CHECK_SIGNED,
					bytes: CHECK_BYTES,
					array: newArrayBuffer(CHECK_SIGNED, CHECK_BYTES, initial_size),
				}
				base.array[ROOT_ID] = 1
				check.array[ROOT_ID] = ROOT_ID
				initBase(base.array, ROOT_ID + 1, base.array.length)
				initCheck(check.array, ROOT_ID + 1, check.array.length)
				return {
					getBaseBuffer: function () {
						return base.array
					},
					getCheckBuffer: function () {
						return check.array
					},
					loadBaseBuffer: function (base_buffer) {
						base.array = base_buffer
						return this
					},
					loadCheckBuffer: function (check_buffer) {
						check.array = check_buffer
						return this
					},
					size: function () {
						return Math.max(base.array.length, check.array.length)
					},
					getBase: function (index) {
						if (base.array.length - 1 < index) {
							return -index + 1
						}
						return base.array[index]
					},
					getCheck: function (index) {
						if (check.array.length - 1 < index) {
							return -index - 1
						}
						return check.array[index]
					},
					setBase: function (index, base_value) {
						if (base.array.length - 1 < index) {
							realloc(index)
						}
						base.array[index] = base_value
					},
					setCheck: function (index, check_value) {
						if (check.array.length - 1 < index) {
							realloc(index)
						}
						check.array[index] = check_value
					},
					setFirstUnusedNode: function (index) {
						first_unused_node = index
					},
					getFirstUnusedNode: function () {
						return first_unused_node
					},
					shrink: function () {
						var last_index = this.size() - 1
						while (true) {
							if (0 <= check.array[last_index]) {
								break
							}
							last_index--
						}
						base.array = base.array.subarray(0, last_index + 2)
						check.array = check.array.subarray(0, last_index + 2)
					},
					calc: function () {
						var unused_count = 0
						var size = check.array.length
						for (var i = 0; i < size; i++) {
							if (check.array[i] < 0) {
								unused_count++
							}
						}
						return {
							all: size,
							unused: unused_count,
							efficiency: (size - unused_count) / size,
						}
					},
					dump: function () {
						var dump_base = ''
						var dump_check = ''
						var i
						for (i = 0; i < base.array.length; i++) {
							dump_base = dump_base + ' ' + this.getBase(i)
						}
						for (i = 0; i < check.array.length; i++) {
							dump_check = dump_check + ' ' + this.getCheck(i)
						}
						console.log('base:' + dump_base)
						console.log('chck:' + dump_check)
						return 'base:' + dump_base + ' chck:' + dump_check
					},
				}
			}
			function DoubleArrayBuilder(initial_size) {
				this.bc = newBC(initial_size)
				this.keys = []
			}
			DoubleArrayBuilder.prototype.append = function (key, record) {
				this.keys.push({ k: key, v: record })
				return this
			}
			DoubleArrayBuilder.prototype.build = function (keys, sorted) {
				if (keys == null) {
					keys = this.keys
				}
				if (keys == null) {
					return new DoubleArray(this.bc)
				}
				if (sorted == null) {
					sorted = false
				}
				var buff_keys = keys.map(function (k) {
					return {
						k: stringToUtf8Bytes2(k.k + TERM_CHAR),
						v: k.v,
					}
				})
				if (sorted) {
					this.keys = buff_keys
				} else {
					this.keys = buff_keys.sort(function (k1, k2) {
						var b1 = k1.k
						var b2 = k2.k
						var min_length = Math.min(b1.length, b2.length)
						for (var pos = 0; pos < min_length; pos++) {
							if (b1[pos] === b2[pos]) {
								continue
							}
							return b1[pos] - b2[pos]
						}
						return b1.length - b2.length
					})
				}
				buff_keys = null
				this._build(ROOT_ID, 0, 0, this.keys.length)
				return new DoubleArray(this.bc)
			}
			DoubleArrayBuilder.prototype._build = function (
				parent_index,
				position,
				start,
				length,
			) {
				var children_info = this.getChildrenInfo(position, start, length)
				var _base = this.findAllocatableBase(children_info)
				this.setBC(parent_index, children_info, _base)
				for (var i = 0; i < children_info.length; i = i + 3) {
					var child_code = children_info[i]
					if (child_code === TERM_CODE) {
						continue
					}
					var child_start = children_info[i + 1]
					var child_len = children_info[i + 2]
					var child_index = _base + child_code
					this._build(child_index, position + 1, child_start, child_len)
				}
			}
			DoubleArrayBuilder.prototype.getChildrenInfo = function (
				position,
				start,
				length,
			) {
				var current_char = this.keys[start].k[position]
				var i = 0
				var children_info = new Int32Array(length * 3)
				children_info[i++] = current_char
				children_info[i++] = start
				var next_pos = start
				var start_pos = start
				for (; next_pos < start + length; next_pos++) {
					var next_char = this.keys[next_pos].k[position]
					if (current_char !== next_char) {
						children_info[i++] = next_pos - start_pos
						children_info[i++] = next_char
						children_info[i++] = next_pos
						current_char = next_char
						start_pos = next_pos
					}
				}
				children_info[i++] = next_pos - start_pos
				children_info = children_info.subarray(0, i)
				return children_info
			}
			DoubleArrayBuilder.prototype.setBC = function (
				parent_id,
				children_info,
				_base,
			) {
				var bc = this.bc
				bc.setBase(parent_id, _base)
				var i
				for (i = 0; i < children_info.length; i = i + 3) {
					var code = children_info[i]
					var child_id = _base + code
					var prev_unused_id = -bc.getBase(child_id)
					var next_unused_id = -bc.getCheck(child_id)
					if (child_id !== bc.getFirstUnusedNode()) {
						bc.setCheck(prev_unused_id, -next_unused_id)
					} else {
						bc.setFirstUnusedNode(next_unused_id)
					}
					bc.setBase(next_unused_id, -prev_unused_id)
					var check = parent_id
					bc.setCheck(child_id, check)
					if (code === TERM_CODE) {
						var start_pos = children_info[i + 1]
						var value = this.keys[start_pos].v
						if (value == null) {
							value = 0
						}
						var base = -value - 1
						bc.setBase(child_id, base)
					}
				}
			}
			DoubleArrayBuilder.prototype.findAllocatableBase = function (
				children_info,
			) {
				var bc = this.bc
				var _base
				var curr = bc.getFirstUnusedNode()
				while (true) {
					_base = curr - children_info[0]
					if (_base < 0) {
						curr = -bc.getCheck(curr)
						continue
					}
					var empty_area_found = true
					for (var i = 0; i < children_info.length; i = i + 3) {
						var code = children_info[i]
						var candidate_id = _base + code
						if (!this.isUnusedNode(candidate_id)) {
							curr = -bc.getCheck(curr)
							empty_area_found = false
							break
						}
					}
					if (empty_area_found) {
						return _base
					}
				}
			}
			DoubleArrayBuilder.prototype.isUnusedNode = function (index) {
				var bc = this.bc
				var check = bc.getCheck(index)
				if (index === ROOT_ID) {
					return false
				}
				if (check < 0) {
					return true
				}
				return false
			}
			function DoubleArray(bc) {
				this.bc = bc
				this.bc.shrink()
			}
			DoubleArray.prototype.contain = function (key) {
				var bc = this.bc
				key += TERM_CHAR
				var buffer = stringToUtf8Bytes2(key)
				var parent = ROOT_ID
				var child = NOT_FOUND
				for (var i = 0; i < buffer.length; i++) {
					var code = buffer[i]
					child = this.traverse(parent, code)
					if (child === NOT_FOUND) {
						return false
					}
					if (bc.getBase(child) <= 0) {
						return true
					} else {
						parent = child
						continue
					}
				}
				return false
			}
			DoubleArray.prototype.lookup = function (key) {
				key += TERM_CHAR
				var buffer = stringToUtf8Bytes2(key)
				var parent = ROOT_ID
				var child = NOT_FOUND
				for (var i = 0; i < buffer.length; i++) {
					var code = buffer[i]
					child = this.traverse(parent, code)
					if (child === NOT_FOUND) {
						return NOT_FOUND
					}
					parent = child
				}
				var base = this.bc.getBase(child)
				if (base <= 0) {
					return -base - 1
				} else {
					return NOT_FOUND
				}
			}
			DoubleArray.prototype.commonPrefixSearch = function (key) {
				var buffer = stringToUtf8Bytes2(key)
				var parent = ROOT_ID
				var child = NOT_FOUND
				var result = []
				for (var i = 0; i < buffer.length; i++) {
					var code = buffer[i]
					child = this.traverse(parent, code)
					if (child !== NOT_FOUND) {
						parent = child
						var grand_child = this.traverse(child, TERM_CODE)
						if (grand_child !== NOT_FOUND) {
							var base = this.bc.getBase(grand_child)
							var r = {}
							if (base <= 0) {
								r.v = -base - 1
							}
							r.k = utf8BytesToString2(arrayCopy(buffer, 0, i + 1))
							result.push(r)
						}
						continue
					} else {
						break
					}
				}
				return result
			}
			DoubleArray.prototype.traverse = function (parent, code) {
				var child = this.bc.getBase(parent) + code
				if (this.bc.getCheck(child) === parent) {
					return child
				} else {
					return NOT_FOUND
				}
			}
			DoubleArray.prototype.size = function () {
				return this.bc.size()
			}
			DoubleArray.prototype.calc = function () {
				return this.bc.calc()
			}
			DoubleArray.prototype.dump = function () {
				return this.bc.dump()
			}
			var newArrayBuffer = function (signed, bytes, size) {
				if (signed) {
					switch (bytes) {
						case 1:
							return new Int8Array(size)
						case 2:
							return new Int16Array(size)
						case 4:
							return new Int32Array(size)
						default:
							throw new RangeError(
								'Invalid newArray parameter element_bytes:' + bytes,
							)
					}
				} else {
					switch (bytes) {
						case 1:
							return new Uint8Array(size)
						case 2:
							return new Uint16Array(size)
						case 4:
							return new Uint32Array(size)
						default:
							throw new RangeError(
								'Invalid newArray parameter element_bytes:' + bytes,
							)
					}
				}
			}
			var arrayCopy = function (src, src_offset, length) {
				var buffer = new ArrayBuffer(length)
				var dstU8 = new Uint8Array(buffer, 0, length)
				var srcU8 = src.subarray(src_offset, length)
				dstU8.set(srcU8)
				return dstU8
			}
			var stringToUtf8Bytes2 = function (str) {
				var bytes = new Uint8Array(new ArrayBuffer(str.length * 4))
				var i = 0,
					j = 0
				while (i < str.length) {
					var unicode_code
					var utf16_code = str.charCodeAt(i++)
					if (utf16_code >= 55296 && utf16_code <= 56319) {
						var upper = utf16_code
						var lower = str.charCodeAt(i++)
						if (lower >= 56320 && lower <= 57343) {
							unicode_code =
								(upper - 55296) * (1 << 10) + (1 << 16) + (lower - 56320)
						} else {
							return null
						}
					} else {
						unicode_code = utf16_code
					}
					if (unicode_code < 128) {
						bytes[j++] = unicode_code
					} else if (unicode_code < 1 << 11) {
						bytes[j++] = (unicode_code >>> 6) | 192
						bytes[j++] = (unicode_code & 63) | 128
					} else if (unicode_code < 1 << 16) {
						bytes[j++] = (unicode_code >>> 12) | 224
						bytes[j++] = ((unicode_code >> 6) & 63) | 128
						bytes[j++] = (unicode_code & 63) | 128
					} else if (unicode_code < 1 << 21) {
						bytes[j++] = (unicode_code >>> 18) | 240
						bytes[j++] = ((unicode_code >> 12) & 63) | 128
						bytes[j++] = ((unicode_code >> 6) & 63) | 128
						bytes[j++] = (unicode_code & 63) | 128
					} else {
					}
				}
				return bytes.subarray(0, j)
			}
			var utf8BytesToString2 = function (bytes) {
				var str = ''
				var code, b1, b2, b3, b4, upper, lower
				var i = 0
				while (i < bytes.length) {
					b1 = bytes[i++]
					if (b1 < 128) {
						code = b1
					} else if (b1 >> 5 === 6) {
						b2 = bytes[i++]
						code = ((b1 & 31) << 6) | (b2 & 63)
					} else if (b1 >> 4 === 14) {
						b2 = bytes[i++]
						b3 = bytes[i++]
						code = ((b1 & 15) << 12) | ((b2 & 63) << 6) | (b3 & 63)
					} else {
						b2 = bytes[i++]
						b3 = bytes[i++]
						b4 = bytes[i++]
						code =
							((b1 & 7) << 18) |
							((b2 & 63) << 12) |
							((b3 & 63) << 6) |
							(b4 & 63)
					}
					if (code < 65536) {
						str += String.fromCharCode(code)
					} else {
						code -= 65536
						upper = 55296 | (code >> 10)
						lower = 56320 | (code & 1023)
						str += String.fromCharCode(upper, lower)
					}
				}
				return str
			}
			var doublearray3 = {
				builder: function (initial_size) {
					return new DoubleArrayBuilder(initial_size)
				},
				load: function (base_buffer, check_buffer) {
					var bc = newBC(0)
					bc.loadBaseBuffer(base_buffer)
					bc.loadCheckBuffer(check_buffer)
					return new DoubleArray(bc)
				},
			}
			if ('undefined' === typeof module2) {
				window.doublearray = doublearray3
			} else {
				module2.exports = doublearray3
			}
		})()
	},
})

// src/kuromoji.js
var kuromoji_exports = {}
__export(kuromoji_exports, {
	default: () => kuromoji_default,
})
module.exports = __toCommonJS(kuromoji_exports)

// src/viterbi/ViterbiNode.js
function ViterbiNode(
	node_name,
	node_cost,
	start_pos,
	length,
	type,
	left_id,
	right_id,
	surface_form,
) {
	this.name = node_name
	this.cost = node_cost
	this.start_pos = start_pos
	this.length = length
	this.left_id = left_id
	this.right_id = right_id
	this.prev = null
	this.surface_form = surface_form
	if (type === 'BOS') {
		this.shortest_cost = 0
	} else {
		this.shortest_cost = Number.MAX_VALUE
	}
	this.type = type
}
var ViterbiNode_default = ViterbiNode

// src/viterbi/ViterbiLattice.js
function ViterbiLattice() {
	this.nodes_end_at = []
	this.nodes_end_at[0] = [new ViterbiNode_default(-1, 0, 0, 0, 'BOS', 0, 0, '')]
	this.eos_pos = 1
}
ViterbiLattice.prototype.append = function (node) {
	var last_pos = node.start_pos + node.length - 1
	if (this.eos_pos < last_pos) {
		this.eos_pos = last_pos
	}
	var prev_nodes = this.nodes_end_at[last_pos]
	if (prev_nodes == null) {
		prev_nodes = []
	}
	prev_nodes.push(node)
	this.nodes_end_at[last_pos] = prev_nodes
}
ViterbiLattice.prototype.appendEos = function () {
	var last_index = this.nodes_end_at.length
	this.eos_pos++
	this.nodes_end_at[last_index] = [
		new ViterbiNode_default(-1, 0, this.eos_pos, 0, 'EOS', 0, 0, ''),
	]
}
var ViterbiLattice_default = ViterbiLattice

// src/util/SurrogateAwareString.js
function SurrogateAwareString(str) {
	this.str = str
	this.index_mapping = []
	for (var pos = 0; pos < str.length; pos++) {
		var ch = str.charAt(pos)
		this.index_mapping.push(pos)
		if (SurrogateAwareString.isSurrogatePair(ch)) {
			pos++
		}
	}
	this.length = this.index_mapping.length
}
SurrogateAwareString.prototype.slice = function (index) {
	if (this.index_mapping.length <= index) {
		return ''
	}
	var surrogate_aware_index = this.index_mapping[index]
	return this.str.slice(surrogate_aware_index)
}
SurrogateAwareString.prototype.charAt = function (index) {
	if (this.str.length <= index) {
		return ''
	}
	var surrogate_aware_start_index = this.index_mapping[index]
	var surrogate_aware_end_index = this.index_mapping[index + 1]
	if (surrogate_aware_end_index == null) {
		return this.str.slice(surrogate_aware_start_index)
	}
	return this.str.slice(surrogate_aware_start_index, surrogate_aware_end_index)
}
SurrogateAwareString.prototype.charCodeAt = function (index) {
	if (this.index_mapping.length <= index) {
		return NaN
	}
	var surrogate_aware_index = this.index_mapping[index]
	var upper = this.str.charCodeAt(surrogate_aware_index)
	var lower
	if (
		upper >= 55296 &&
		upper <= 56319 &&
		surrogate_aware_index < this.str.length
	) {
		lower = this.str.charCodeAt(surrogate_aware_index + 1)
		if (lower >= 56320 && lower <= 57343) {
			return (upper - 55296) * 1024 + lower - 56320 + 65536
		}
	}
	return upper
}
SurrogateAwareString.prototype.toString = function () {
	return this.str
}
SurrogateAwareString.isSurrogatePair = function (ch) {
	var utf16_code = ch.charCodeAt(0)
	if (utf16_code >= 55296 && utf16_code <= 56319) {
		return true
	} else {
		return false
	}
}
var SurrogateAwareString_default = SurrogateAwareString

// src/viterbi/ViterbiBuilder.js
function ViterbiBuilder(dic) {
	this.trie = dic.trie
	this.token_info_dictionary = dic.token_info_dictionary
	this.unknown_dictionary = dic.unknown_dictionary
}
ViterbiBuilder.prototype.build = function (sentence_str) {
	var lattice = new ViterbiLattice_default()
	var sentence = new SurrogateAwareString_default(sentence_str)
	var key, trie_id, left_id, right_id, word_cost
	for (var pos = 0; pos < sentence.length; pos++) {
		var tail = sentence.slice(pos)
		var vocabulary = this.trie.commonPrefixSearch(tail)
		for (var n = 0; n < vocabulary.length; n++) {
			trie_id = vocabulary[n].v
			key = vocabulary[n].k
			var token_info_ids = this.token_info_dictionary.target_map[trie_id]
			for (var i = 0; i < token_info_ids.length; i++) {
				var token_info_id = parseInt(token_info_ids[i])
				left_id = this.token_info_dictionary.dictionary.getShort(token_info_id)
				right_id = this.token_info_dictionary.dictionary.getShort(
					token_info_id + 2,
				)
				word_cost = this.token_info_dictionary.dictionary.getShort(
					token_info_id + 4,
				)
				lattice.append(
					new ViterbiNode_default(
						token_info_id,
						word_cost,
						pos + 1,
						key.length,
						'KNOWN',
						left_id,
						right_id,
						key,
					),
				)
			}
		}
		var surrogate_aware_tail = new SurrogateAwareString_default(tail)
		var head_char = new SurrogateAwareString_default(
			surrogate_aware_tail.charAt(0),
		)
		var head_char_class = this.unknown_dictionary.lookup(head_char.toString())
		if (
			vocabulary == null ||
			vocabulary.length === 0 ||
			head_char_class.is_always_invoke === 1
		) {
			key = head_char
			if (
				head_char_class.is_grouping === 1 &&
				1 < surrogate_aware_tail.length
			) {
				for (var k = 1; k < surrogate_aware_tail.length; k++) {
					var next_char = surrogate_aware_tail.charAt(k)
					var next_char_class = this.unknown_dictionary.lookup(next_char)
					if (head_char_class.class_name !== next_char_class.class_name) {
						break
					}
					key += next_char
				}
			}
			var unk_ids = this.unknown_dictionary.target_map[head_char_class.class_id]
			for (var j = 0; j < unk_ids.length; j++) {
				var unk_id = parseInt(unk_ids[j])
				left_id = this.unknown_dictionary.dictionary.getShort(unk_id)
				right_id = this.unknown_dictionary.dictionary.getShort(unk_id + 2)
				word_cost = this.unknown_dictionary.dictionary.getShort(unk_id + 4)
				lattice.append(
					new ViterbiNode_default(
						unk_id,
						word_cost,
						pos + 1,
						key.length,
						'UNKNOWN',
						left_id,
						right_id,
						key.toString(),
					),
				)
			}
		}
	}
	lattice.appendEos()
	return lattice
}
var ViterbiBuilder_default = ViterbiBuilder

// src/viterbi/ViterbiSearcher.js
function ViterbiSearcher(connection_costs) {
	this.connection_costs = connection_costs
}
ViterbiSearcher.prototype.search = function (lattice) {
	lattice = this.forward(lattice)
	return this.backward(lattice)
}
ViterbiSearcher.prototype.forward = function (lattice) {
	var i, j, k
	for (i = 1; i <= lattice.eos_pos; i++) {
		var nodes = lattice.nodes_end_at[i]
		if (nodes == null) {
			continue
		}
		for (j = 0; j < nodes.length; j++) {
			var node = nodes[j]
			var cost = Number.MAX_VALUE
			var shortest_prev_node
			var prev_nodes = lattice.nodes_end_at[node.start_pos - 1]
			if (prev_nodes == null) {
				continue
			}
			for (k = 0; k < prev_nodes.length; k++) {
				var prev_node = prev_nodes[k]
				var edge_cost
				if (node.left_id == null || prev_node.right_id == null) {
					console.log('Left or right is null')
					edge_cost = 0
				} else {
					edge_cost = this.connection_costs.get(
						prev_node.right_id,
						node.left_id,
					)
				}
				var _cost = prev_node.shortest_cost + edge_cost + node.cost
				if (_cost < cost) {
					shortest_prev_node = prev_node
					cost = _cost
				}
			}
			node.prev = shortest_prev_node
			node.shortest_cost = cost
		}
	}
	return lattice
}
ViterbiSearcher.prototype.backward = function (lattice) {
	var shortest_path = []
	var eos = lattice.nodes_end_at[lattice.nodes_end_at.length - 1][0]
	var node_back = eos.prev
	if (node_back == null) {
		return []
	}
	while (node_back.type !== 'BOS') {
		shortest_path.push(node_back)
		if (node_back.prev == null) {
			return []
		}
		node_back = node_back.prev
	}
	return shortest_path.reverse()
}
var ViterbiSearcher_default = ViterbiSearcher

// src/util/IpadicFormatter.js
function IpadicFormatter() {}
IpadicFormatter.prototype.formatEntry = function (
	word_id,
	position,
	type,
	features,
) {
	var token = {}
	token.word_id = word_id
	token.word_type = type
	token.word_position = position
	token.surface_form = features[0]
	token.pos = features[1]
	token.pos_detail_1 = features[2]
	token.pos_detail_2 = features[3]
	token.pos_detail_3 = features[4]
	token.conjugated_type = features[5]
	token.conjugated_form = features[6]
	token.basic_form = features[7]
	token.reading = features[8]
	token.pronunciation = features[9]
	return token
}
IpadicFormatter.prototype.formatUnknownEntry = function (
	word_id,
	position,
	type,
	features,
	surface_form,
) {
	var token = {}
	token.word_id = word_id
	token.word_type = type
	token.word_position = position
	token.surface_form = surface_form
	token.pos = features[1]
	token.pos_detail_1 = features[2]
	token.pos_detail_2 = features[3]
	token.pos_detail_3 = features[4]
	token.conjugated_type = features[5]
	token.conjugated_form = features[6]
	token.basic_form = features[7]
	return token
}
var IpadicFormatter_default = IpadicFormatter

// src/Tokenizer.js
var PUNCTUATION = /、|。/
function Tokenizer(dic) {
	this.token_info_dictionary = dic.token_info_dictionary
	this.unknown_dictionary = dic.unknown_dictionary
	this.viterbi_builder = new ViterbiBuilder_default(dic)
	this.viterbi_searcher = new ViterbiSearcher_default(dic.connection_costs)
	this.formatter = new IpadicFormatter_default()
}
Tokenizer.splitByPunctuation = function (input) {
	var sentences = []
	var tail = input
	while (true) {
		if (tail === '') {
			break
		}
		var index = tail.search(PUNCTUATION)
		if (index < 0) {
			sentences.push(tail)
			break
		}
		sentences.push(tail.substring(0, index + 1))
		tail = tail.substring(index + 1)
	}
	return sentences
}
Tokenizer.prototype.tokenize = function (text) {
	var sentences = Tokenizer.splitByPunctuation(text)
	var tokens = []
	for (var i = 0; i < sentences.length; i++) {
		var sentence = sentences[i]
		this.tokenizeForSentence(sentence, tokens)
	}
	return tokens
}
Tokenizer.prototype.tokenizeForSentence = function (sentence, tokens) {
	if (tokens == null) {
		tokens = []
	}
	var lattice = this.getLattice(sentence)
	var best_path = this.viterbi_searcher.search(lattice)
	var last_pos = 0
	if (tokens.length > 0) {
		last_pos = tokens[tokens.length - 1].word_position
	}
	for (var j = 0; j < best_path.length; j++) {
		var node = best_path[j]
		var token, features, features_line
		if (node.type === 'KNOWN') {
			features_line = this.token_info_dictionary.getFeatures(node.name)
			if (features_line == null) {
				features = []
			} else {
				features = features_line.split(',')
			}
			token = this.formatter.formatEntry(
				node.name,
				last_pos + node.start_pos,
				node.type,
				features,
			)
		} else if (node.type === 'UNKNOWN') {
			features_line = this.unknown_dictionary.getFeatures(node.name)
			if (features_line == null) {
				features = []
			} else {
				features = features_line.split(',')
			}
			token = this.formatter.formatUnknownEntry(
				node.name,
				last_pos + node.start_pos,
				node.type,
				features,
				node.surface_form,
			)
		} else {
			token = this.formatter.formatEntry(
				node.name,
				last_pos + node.start_pos,
				node.type,
				[],
			)
		}
		tokens.push(token)
	}
	return tokens
}
Tokenizer.prototype.getLattice = function (text) {
	return this.viterbi_builder.build(text)
}
var Tokenizer_default = Tokenizer

// src/loader/NodeDictionaryLoader.js
var import_fs = __toESM(require('fs'))
var import_zlib = __toESM(require('zlib'))

// src/loader/DictionaryLoader.js
var import_path = __toESM(require('path'))
var import_async = __toESM(require_async())

// src/dict/DynamicDictionaries.js
var import_doublearray = __toESM(require_doublearray())

// src/util/ByteBuffer.js
var stringToUtf8Bytes = function (str) {
	var bytes = new Uint8Array(str.length * 4)
	var i = 0,
		j = 0
	while (i < str.length) {
		var unicode_code
		var utf16_code = str.charCodeAt(i++)
		if (utf16_code >= 55296 && utf16_code <= 56319) {
			var upper = utf16_code
			var lower = str.charCodeAt(i++)
			if (lower >= 56320 && lower <= 57343) {
				unicode_code = (upper - 55296) * (1 << 10) + (1 << 16) + (lower - 56320)
			} else {
				return null
			}
		} else {
			unicode_code = utf16_code
		}
		if (unicode_code < 128) {
			bytes[j++] = unicode_code
		} else if (unicode_code < 1 << 11) {
			bytes[j++] = (unicode_code >>> 6) | 192
			bytes[j++] = (unicode_code & 63) | 128
		} else if (unicode_code < 1 << 16) {
			bytes[j++] = (unicode_code >>> 12) | 224
			bytes[j++] = ((unicode_code >> 6) & 63) | 128
			bytes[j++] = (unicode_code & 63) | 128
		} else if (unicode_code < 1 << 21) {
			bytes[j++] = (unicode_code >>> 18) | 240
			bytes[j++] = ((unicode_code >> 12) & 63) | 128
			bytes[j++] = ((unicode_code >> 6) & 63) | 128
			bytes[j++] = (unicode_code & 63) | 128
		} else {
		}
	}
	return bytes.subarray(0, j)
}
var utf8BytesToString = function (bytes) {
	var str = ''
	var code, b1, b2, b3, b4, upper, lower
	var i = 0
	while (i < bytes.length) {
		b1 = bytes[i++]
		if (b1 < 128) {
			code = b1
		} else if (b1 >> 5 === 6) {
			b2 = bytes[i++]
			code = ((b1 & 31) << 6) | (b2 & 63)
		} else if (b1 >> 4 === 14) {
			b2 = bytes[i++]
			b3 = bytes[i++]
			code = ((b1 & 15) << 12) | ((b2 & 63) << 6) | (b3 & 63)
		} else {
			b2 = bytes[i++]
			b3 = bytes[i++]
			b4 = bytes[i++]
			code = ((b1 & 7) << 18) | ((b2 & 63) << 12) | ((b3 & 63) << 6) | (b4 & 63)
		}
		if (code < 65536) {
			str += String.fromCharCode(code)
		} else {
			code -= 65536
			upper = 55296 | (code >> 10)
			lower = 56320 | (code & 1023)
			str += String.fromCharCode(upper, lower)
		}
	}
	return str
}
function ByteBuffer(arg) {
	var initial_size
	if (arg == null) {
		initial_size = 1024 * 1024
	} else if (typeof arg === 'number') {
		initial_size = arg
	} else if (arg instanceof Uint8Array) {
		this.buffer = arg
		this.position = 0
		return
	} else {
		throw typeof arg + ' is invalid parameter type for ByteBuffer constructor'
	}
	this.buffer = new Uint8Array(initial_size)
	this.position = 0
}
ByteBuffer.prototype.size = function () {
	return this.buffer.length
}
ByteBuffer.prototype.reallocate = function () {
	var new_array = new Uint8Array(this.buffer.length * 2)
	new_array.set(this.buffer)
	this.buffer = new_array
}
ByteBuffer.prototype.shrink = function () {
	this.buffer = this.buffer.subarray(0, this.position)
	return this.buffer
}
ByteBuffer.prototype.put = function (b) {
	if (this.buffer.length < this.position + 1) {
		this.reallocate()
	}
	this.buffer[this.position++] = b
}
ByteBuffer.prototype.get = function (index) {
	if (index == null) {
		index = this.position
		this.position += 1
	}
	if (this.buffer.length < index + 1) {
		return 0
	}
	return this.buffer[index]
}
ByteBuffer.prototype.putShort = function (num) {
	if (65535 < num) {
		throw num + ' is over short value'
	}
	var lower = 255 & num
	var upper = (65280 & num) >> 8
	this.put(lower)
	this.put(upper)
}
ByteBuffer.prototype.getShort = function (index) {
	if (index == null) {
		index = this.position
		this.position += 2
	}
	if (this.buffer.length < index + 2) {
		return 0
	}
	var lower = this.buffer[index]
	var upper = this.buffer[index + 1]
	var value = (upper << 8) + lower
	if (value & 32768) {
		value = -((value - 1) ^ 65535)
	}
	return value
}
ByteBuffer.prototype.putInt = function (num) {
	if (4294967295 < num) {
		throw num + ' is over integer value'
	}
	var b0 = 255 & num
	var b1 = (65280 & num) >> 8
	var b2 = (16711680 & num) >> 16
	var b3 = (4278190080 & num) >> 24
	this.put(b0)
	this.put(b1)
	this.put(b2)
	this.put(b3)
}
ByteBuffer.prototype.getInt = function (index) {
	if (index == null) {
		index = this.position
		this.position += 4
	}
	if (this.buffer.length < index + 4) {
		return 0
	}
	var b0 = this.buffer[index]
	var b1 = this.buffer[index + 1]
	var b2 = this.buffer[index + 2]
	var b3 = this.buffer[index + 3]
	return (b3 << 24) + (b2 << 16) + (b1 << 8) + b0
}
ByteBuffer.prototype.readInt = function () {
	var pos = this.position
	this.position += 4
	return this.getInt(pos)
}
ByteBuffer.prototype.putString = function (str) {
	var bytes = stringToUtf8Bytes(str)
	for (var i = 0; i < bytes.length; i++) {
		this.put(bytes[i])
	}
	this.put(0)
}
ByteBuffer.prototype.getString = function (index) {
	var buf = [],
		ch
	if (index == null) {
		index = this.position
	}
	while (true) {
		if (this.buffer.length < index + 1) {
			break
		}
		ch = this.get(index++)
		if (ch === 0) {
			break
		} else {
			buf.push(ch)
		}
	}
	this.position = index
	return utf8BytesToString(buf)
}
var ByteBuffer_default = ByteBuffer

// src/dict/TokenInfoDictionary.js
function TokenInfoDictionary() {
	this.dictionary = new ByteBuffer_default(10 * 1024 * 1024)
	this.target_map = {}
	this.pos_buffer = new ByteBuffer_default(10 * 1024 * 1024)
}
TokenInfoDictionary.prototype.buildDictionary = function (entries) {
	var dictionary_entries = {}
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i]
		if (entry.length < 4) {
			continue
		}
		var surface_form = entry[0]
		var left_id = entry[1]
		var right_id = entry[2]
		var word_cost = entry[3]
		var feature = entry.slice(4).join(',')
		if (!isFinite(left_id) || !isFinite(right_id) || !isFinite(word_cost)) {
			console.log(entry)
		}
		var token_info_id = this.put(
			left_id,
			right_id,
			word_cost,
			surface_form,
			feature,
		)
		dictionary_entries[token_info_id] = surface_form
	}
	this.dictionary.shrink()
	this.pos_buffer.shrink()
	return dictionary_entries
}
TokenInfoDictionary.prototype.put = function (
	left_id,
	right_id,
	word_cost,
	surface_form,
	feature,
) {
	var token_info_id = this.dictionary.position
	var pos_id = this.pos_buffer.position
	this.dictionary.putShort(left_id)
	this.dictionary.putShort(right_id)
	this.dictionary.putShort(word_cost)
	this.dictionary.putInt(pos_id)
	this.pos_buffer.putString(surface_form + ',' + feature)
	return token_info_id
}
TokenInfoDictionary.prototype.addMapping = function (source, target) {
	var mapping = this.target_map[source]
	if (mapping == null) {
		mapping = []
	}
	mapping.push(target)
	this.target_map[source] = mapping
}
TokenInfoDictionary.prototype.targetMapToBuffer = function () {
	var buffer = new ByteBuffer_default()
	var map_keys_size = Object.keys(this.target_map).length
	buffer.putInt(map_keys_size)
	for (var key in this.target_map) {
		var values = this.target_map[key]
		var map_values_size = values.length
		buffer.putInt(parseInt(key))
		buffer.putInt(map_values_size)
		for (var i = 0; i < values.length; i++) {
			buffer.putInt(values[i])
		}
	}
	return buffer.shrink()
}
TokenInfoDictionary.prototype.loadDictionary = function (array_buffer) {
	this.dictionary = new ByteBuffer_default(array_buffer)
	return this
}
TokenInfoDictionary.prototype.loadPosVector = function (array_buffer) {
	this.pos_buffer = new ByteBuffer_default(array_buffer)
	return this
}
TokenInfoDictionary.prototype.loadTargetMap = function (array_buffer) {
	var buffer = new ByteBuffer_default(array_buffer)
	buffer.position = 0
	this.target_map = {}
	buffer.readInt()
	while (true) {
		if (buffer.buffer.length < buffer.position + 1) {
			break
		}
		var key = buffer.readInt()
		var map_values_size = buffer.readInt()
		for (var i = 0; i < map_values_size; i++) {
			var value = buffer.readInt()
			this.addMapping(key, value)
		}
	}
	return this
}
TokenInfoDictionary.prototype.getFeatures = function (token_info_id_str) {
	var token_info_id = parseInt(token_info_id_str)
	if (isNaN(token_info_id)) {
		return ''
	}
	var pos_id = this.dictionary.getInt(token_info_id + 6)
	return this.pos_buffer.getString(pos_id)
}
var TokenInfoDictionary_default = TokenInfoDictionary

// src/dict/ConnectionCosts.js
function ConnectionCosts(forward_dimension, backward_dimension) {
	this.forward_dimension = forward_dimension
	this.backward_dimension = backward_dimension
	this.buffer = new Int16Array(forward_dimension * backward_dimension + 2)
	this.buffer[0] = forward_dimension
	this.buffer[1] = backward_dimension
}
ConnectionCosts.prototype.put = function (forward_id, backward_id, cost) {
	var index = forward_id * this.backward_dimension + backward_id + 2
	if (this.buffer.length < index + 1) {
		throw 'ConnectionCosts buffer overflow'
	}
	this.buffer[index] = cost
}
ConnectionCosts.prototype.get = function (forward_id, backward_id) {
	var index = forward_id * this.backward_dimension + backward_id + 2
	if (this.buffer.length < index + 1) {
		throw 'ConnectionCosts buffer overflow'
	}
	return this.buffer[index]
}
ConnectionCosts.prototype.loadConnectionCosts = function (
	connection_costs_buffer,
) {
	this.forward_dimension = connection_costs_buffer[0]
	this.backward_dimension = connection_costs_buffer[1]
	this.buffer = connection_costs_buffer
}
var ConnectionCosts_default = ConnectionCosts

// src/dict/CharacterClass.js
function CharacterClass(
	class_id,
	class_name,
	is_always_invoke,
	is_grouping,
	max_length,
) {
	this.class_id = class_id
	this.class_name = class_name
	this.is_always_invoke = is_always_invoke
	this.is_grouping = is_grouping
	this.max_length = max_length
}
var CharacterClass_default = CharacterClass

// src/dict/InvokeDefinitionMap.js
function InvokeDefinitionMap() {
	this.map = []
	this.lookup_table = {}
}
InvokeDefinitionMap.load = function (invoke_def_buffer) {
	var invoke_def = new InvokeDefinitionMap()
	var character_category_definition = []
	var buffer = new ByteBuffer_default(invoke_def_buffer)
	while (buffer.position + 1 < buffer.size()) {
		var class_id = character_category_definition.length
		var is_always_invoke = buffer.get()
		var is_grouping = buffer.get()
		var max_length = buffer.getInt()
		var class_name = buffer.getString()
		character_category_definition.push(
			new CharacterClass_default(
				class_id,
				class_name,
				is_always_invoke,
				is_grouping,
				max_length,
			),
		)
	}
	invoke_def.init(character_category_definition)
	return invoke_def
}
InvokeDefinitionMap.prototype.init = function (character_category_definition) {
	if (character_category_definition == null) {
		return
	}
	for (var i = 0; i < character_category_definition.length; i++) {
		var character_class = character_category_definition[i]
		this.map[i] = character_class
		this.lookup_table[character_class.class_name] = i
	}
}
InvokeDefinitionMap.prototype.getCharacterClass = function (class_id) {
	return this.map[class_id]
}
InvokeDefinitionMap.prototype.lookup = function (class_name) {
	var class_id = this.lookup_table[class_name]
	if (class_id == null) {
		return null
	}
	return class_id
}
InvokeDefinitionMap.prototype.toBuffer = function () {
	var buffer = new ByteBuffer_default()
	for (var i = 0; i < this.map.length; i++) {
		var char_class = this.map[i]
		buffer.put(char_class.is_always_invoke)
		buffer.put(char_class.is_grouping)
		buffer.putInt(char_class.max_length)
		buffer.putString(char_class.class_name)
	}
	buffer.shrink()
	return buffer.buffer
}
var InvokeDefinitionMap_default = InvokeDefinitionMap

// src/dict/CharacterDefinition.js
var DEFAULT_CATEGORY = 'DEFAULT'
function CharacterDefinition() {
	this.character_category_map = new Uint8Array(65536)
	this.compatible_category_map = new Uint32Array(65536)
	this.invoke_definition_map = null
}
CharacterDefinition.load = function (
	cat_map_buffer,
	compat_cat_map_buffer,
	invoke_def_buffer,
) {
	var char_def = new CharacterDefinition()
	char_def.character_category_map = cat_map_buffer
	char_def.compatible_category_map = compat_cat_map_buffer
	char_def.invoke_definition_map =
		InvokeDefinitionMap_default.load(invoke_def_buffer)
	return char_def
}
CharacterDefinition.parseCharCategory = function (
	class_id,
	parsed_category_def,
) {
	var category = parsed_category_def[1]
	var invoke = parseInt(parsed_category_def[2])
	var grouping = parseInt(parsed_category_def[3])
	var max_length = parseInt(parsed_category_def[4])
	if (!isFinite(invoke) || (invoke !== 0 && invoke !== 1)) {
		console.log('char.def parse error. INVOKE is 0 or 1 in:' + invoke)
		return null
	}
	if (!isFinite(grouping) || (grouping !== 0 && grouping !== 1)) {
		console.log('char.def parse error. GROUP is 0 or 1 in:' + grouping)
		return null
	}
	if (!isFinite(max_length) || max_length < 0) {
		console.log('char.def parse error. LENGTH is 1 to n:' + max_length)
		return null
	}
	var is_invoke = invoke === 1
	var is_grouping = grouping === 1
	return new CharacterClass_default(
		class_id,
		category,
		is_invoke,
		is_grouping,
		max_length,
	)
}
CharacterDefinition.parseCategoryMapping = function (parsed_category_mapping) {
	var start = parseInt(parsed_category_mapping[1])
	var default_category = parsed_category_mapping[2]
	var compatible_category =
		3 < parsed_category_mapping.length ? parsed_category_mapping.slice(3) : []
	if (!isFinite(start) || start < 0 || start > 65535) {
		console.log('char.def parse error. CODE is invalid:' + start)
	}
	return {
		start,
		default: default_category,
		compatible: compatible_category,
	}
}
CharacterDefinition.parseRangeCategoryMapping = function (
	parsed_category_mapping,
) {
	var start = parseInt(parsed_category_mapping[1])
	var end = parseInt(parsed_category_mapping[2])
	var default_category = parsed_category_mapping[3]
	var compatible_category =
		4 < parsed_category_mapping.length ? parsed_category_mapping.slice(4) : []
	if (!isFinite(start) || start < 0 || start > 65535) {
		console.log('char.def parse error. CODE is invalid:' + start)
	}
	if (!isFinite(end) || end < 0 || end > 65535) {
		console.log('char.def parse error. CODE is invalid:' + end)
	}
	return {
		start,
		end,
		default: default_category,
		compatible: compatible_category,
	}
}
CharacterDefinition.prototype.initCategoryMappings = function (
	category_mapping,
) {
	var code_point
	if (category_mapping != null) {
		for (var i = 0; i < category_mapping.length; i++) {
			var mapping = category_mapping[i]
			var end = mapping.end || mapping.start
			for (code_point = mapping.start; code_point <= end; code_point++) {
				this.character_category_map[code_point] =
					this.invoke_definition_map.lookup(mapping.default)
				for (var j = 0; j < mapping.compatible.length; j++) {
					var bitset = this.compatible_category_map[code_point]
					var compatible_category = mapping.compatible[j]
					if (compatible_category == null) {
						continue
					}
					var class_id = this.invoke_definition_map.lookup(compatible_category)
					if (class_id == null) {
						continue
					}
					var class_id_bit = 1 << class_id
					bitset = bitset | class_id_bit
					this.compatible_category_map[code_point] = bitset
				}
			}
		}
	}
	var default_id = this.invoke_definition_map.lookup(DEFAULT_CATEGORY)
	if (default_id == null) {
		return
	}
	for (
		code_point = 0;
		code_point < this.character_category_map.length;
		code_point++
	) {
		if (this.character_category_map[code_point] === 0) {
			this.character_category_map[code_point] = 1 << default_id
		}
	}
}
CharacterDefinition.prototype.lookupCompatibleCategory = function (ch) {
	var classes = []
	var code = ch.charCodeAt(0)
	var integer
	if (code < this.compatible_category_map.length) {
		integer = this.compatible_category_map[code]
	}
	if (integer == null || integer === 0) {
		return classes
	}
	for (var bit = 0; bit < 32; bit++) {
		if ((integer << (31 - bit)) >>> 31 === 1) {
			var character_class = this.invoke_definition_map.getCharacterClass(bit)
			if (character_class == null) {
				continue
			}
			classes.push(character_class)
		}
	}
	return classes
}
CharacterDefinition.prototype.lookup = function (ch) {
	var class_id
	var code = ch.charCodeAt(0)
	if (SurrogateAwareString_default.isSurrogatePair(ch)) {
		class_id = this.invoke_definition_map.lookup(DEFAULT_CATEGORY)
	} else if (code < this.character_category_map.length) {
		class_id = this.character_category_map[code]
	}
	if (class_id == null) {
		class_id = this.invoke_definition_map.lookup(DEFAULT_CATEGORY)
	}
	return this.invoke_definition_map.getCharacterClass(class_id)
}
var CharacterDefinition_default = CharacterDefinition

// src/dict/UnknownDictionary.js
function UnknownDictionary() {
	this.dictionary = new ByteBuffer_default(10 * 1024 * 1024)
	this.target_map = {}
	this.pos_buffer = new ByteBuffer_default(10 * 1024 * 1024)
	this.character_definition = null
}
UnknownDictionary.prototype = Object.create(
	TokenInfoDictionary_default.prototype,
)
UnknownDictionary.prototype.characterDefinition = function (
	character_definition,
) {
	this.character_definition = character_definition
	return this
}
UnknownDictionary.prototype.lookup = function (ch) {
	return this.character_definition.lookup(ch)
}
UnknownDictionary.prototype.lookupCompatibleCategory = function (ch) {
	return this.character_definition.lookupCompatibleCategory(ch)
}
UnknownDictionary.prototype.loadUnknownDictionaries = function (
	unk_buffer,
	unk_pos_buffer,
	unk_map_buffer,
	cat_map_buffer,
	compat_cat_map_buffer,
	invoke_def_buffer,
) {
	this.loadDictionary(unk_buffer)
	this.loadPosVector(unk_pos_buffer)
	this.loadTargetMap(unk_map_buffer)
	this.character_definition = CharacterDefinition_default.load(
		cat_map_buffer,
		compat_cat_map_buffer,
		invoke_def_buffer,
	)
}
var UnknownDictionary_default = UnknownDictionary

// src/dict/DynamicDictionaries.js
function DynamicDictionaries(
	trie,
	token_info_dictionary,
	connection_costs,
	unknown_dictionary,
) {
	if (trie != null) {
		this.trie = trie
	} else {
		this.trie = import_doublearray.default.builder(0).build([{ k: '', v: 1 }])
	}
	if (token_info_dictionary != null) {
		this.token_info_dictionary = token_info_dictionary
	} else {
		this.token_info_dictionary = new TokenInfoDictionary_default()
	}
	if (connection_costs != null) {
		this.connection_costs = connection_costs
	} else {
		this.connection_costs = new ConnectionCosts_default(0, 0)
	}
	if (unknown_dictionary != null) {
		this.unknown_dictionary = unknown_dictionary
	} else {
		this.unknown_dictionary = new UnknownDictionary_default()
	}
}
DynamicDictionaries.prototype.loadTrie = function (base_buffer, check_buffer) {
	this.trie = import_doublearray.default.load(base_buffer, check_buffer)
	return this
}
DynamicDictionaries.prototype.loadTokenInfoDictionaries = function (
	token_info_buffer,
	pos_buffer,
	target_map_buffer,
) {
	this.token_info_dictionary.loadDictionary(token_info_buffer)
	this.token_info_dictionary.loadPosVector(pos_buffer)
	this.token_info_dictionary.loadTargetMap(target_map_buffer)
	return this
}
DynamicDictionaries.prototype.loadConnectionCosts = function (cc_buffer) {
	this.connection_costs.loadConnectionCosts(cc_buffer)
	return this
}
DynamicDictionaries.prototype.loadUnknownDictionaries = function (
	unk_buffer,
	unk_pos_buffer,
	unk_map_buffer,
	cat_map_buffer,
	compat_cat_map_buffer,
	invoke_def_buffer,
) {
	this.unknown_dictionary.loadUnknownDictionaries(
		unk_buffer,
		unk_pos_buffer,
		unk_map_buffer,
		cat_map_buffer,
		compat_cat_map_buffer,
		invoke_def_buffer,
	)
	return this
}
var DynamicDictionaries_default = DynamicDictionaries

// src/loader/DictionaryLoader.js
function DictionaryLoader(dic_path) {
	this.dic = new DynamicDictionaries_default()
	this.dic_path = dic_path
}
DictionaryLoader.prototype.loadArrayBuffer = function (file, callback) {
	throw new Error('DictionaryLoader#loadArrayBuffer should be overwrite')
}
DictionaryLoader.prototype.load = function (load_callback) {
	var dic = this.dic
	var dic_path = this.dic_path
	var loadArrayBuffer = this.loadArrayBuffer
	import_async.default.parallel(
		[
			// Trie
			function (callback) {
				import_async.default.map(
					['base.dat.gz', 'check.dat.gz'],
					function (filename, _callback) {
						loadArrayBuffer(
							import_path.default.join(dic_path, filename),
							function (err, buffer) {
								if (err) {
									return _callback(err)
								}
								_callback(null, buffer)
							},
						)
					},
					function (err, buffers) {
						if (err) {
							return callback(err)
						}
						var base_buffer = new Int32Array(buffers[0])
						var check_buffer = new Int32Array(buffers[1])
						dic.loadTrie(base_buffer, check_buffer)
						callback(null)
					},
				)
			},
			// Token info dictionaries
			function (callback) {
				import_async.default.map(
					['tid.dat.gz', 'tid_pos.dat.gz', 'tid_map.dat.gz'],
					function (filename, _callback) {
						loadArrayBuffer(
							import_path.default.join(dic_path, filename),
							function (err, buffer) {
								if (err) {
									return _callback(err)
								}
								_callback(null, buffer)
							},
						)
					},
					function (err, buffers) {
						if (err) {
							return callback(err)
						}
						var token_info_buffer = new Uint8Array(buffers[0])
						var pos_buffer = new Uint8Array(buffers[1])
						var target_map_buffer = new Uint8Array(buffers[2])
						dic.loadTokenInfoDictionaries(
							token_info_buffer,
							pos_buffer,
							target_map_buffer,
						)
						callback(null)
					},
				)
			},
			// Connection cost matrix
			function (callback) {
				loadArrayBuffer(
					import_path.default.join(dic_path, 'cc.dat.gz'),
					function (err, buffer) {
						if (err) {
							return callback(err)
						}
						var cc_buffer = new Int16Array(buffer)
						dic.loadConnectionCosts(cc_buffer)
						callback(null)
					},
				)
			},
			// Unknown dictionaries
			function (callback) {
				import_async.default.map(
					[
						'unk.dat.gz',
						'unk_pos.dat.gz',
						'unk_map.dat.gz',
						'unk_char.dat.gz',
						'unk_compat.dat.gz',
						'unk_invoke.dat.gz',
					],
					function (filename, _callback) {
						loadArrayBuffer(
							import_path.default.join(dic_path, filename),
							function (err, buffer) {
								if (err) {
									return _callback(err)
								}
								_callback(null, buffer)
							},
						)
					},
					function (err, buffers) {
						if (err) {
							return callback(err)
						}
						var unk_buffer = new Uint8Array(buffers[0])
						var unk_pos_buffer = new Uint8Array(buffers[1])
						var unk_map_buffer = new Uint8Array(buffers[2])
						var cat_map_buffer = new Uint8Array(buffers[3])
						var compat_cat_map_buffer = new Uint32Array(buffers[4])
						var invoke_def_buffer = new Uint8Array(buffers[5])
						dic.loadUnknownDictionaries(
							unk_buffer,
							unk_pos_buffer,
							unk_map_buffer,
							cat_map_buffer,
							compat_cat_map_buffer,
							invoke_def_buffer,
						)
						callback(null)
					},
				)
			},
		],
		function (err) {
			load_callback(err, dic)
		},
	)
}
var DictionaryLoader_default = DictionaryLoader

// src/loader/NodeDictionaryLoader.js
function NodeDictionaryLoader(dic_path) {
	DictionaryLoader_default.apply(this, [dic_path])
}
NodeDictionaryLoader.prototype = Object.create(
	DictionaryLoader_default.prototype,
)
NodeDictionaryLoader.prototype.loadArrayBuffer = function (file, callback) {
	import_fs.default.readFile(file, function (err, buffer) {
		if (err) {
			return callback(err)
		}
		import_zlib.default.gunzip(buffer, function (err2, decompressed) {
			if (err2) {
				return callback(err2)
			}
			var typed_array = new Uint8Array(decompressed)
			callback(null, typed_array.buffer)
		})
	})
}
var NodeDictionaryLoader_default = NodeDictionaryLoader

// src/TokenizerBuilder.js
function TokenizerBuilder(option) {
	if (option.dicPath == null) {
		this.dic_path = 'dict/'
	} else {
		this.dic_path = option.dicPath
	}
}
TokenizerBuilder.prototype.build = function (callback) {
	var loader = new NodeDictionaryLoader_default(this.dic_path)
	loader.load(function (err, dic) {
		callback(err, new Tokenizer_default(dic))
	})
}
var TokenizerBuilder_default = TokenizerBuilder

// src/dict/builder/DictionaryBuilder.js
var import_doublearray2 = __toESM(require_doublearray())

// src/dict/builder/ConnectionCostsBuilder.js
function ConnectionCostsBuilder() {
	this.lines = 0
	this.connection_cost = null
}
ConnectionCostsBuilder.prototype.putLine = function (line) {
	if (this.lines === 0) {
		var dimensions = line.split(' ')
		var forward_dimension = dimensions[0]
		var backward_dimension = dimensions[1]
		if (forward_dimension < 0 || backward_dimension < 0) {
			throw 'Parse error of matrix.def'
		}
		this.connection_cost = new ConnectionCosts_default(
			forward_dimension,
			backward_dimension,
		)
		this.lines++
		return this
	}
	var costs = line.split(' ')
	if (costs.length !== 3) {
		return this
	}
	var forward_id = parseInt(costs[0])
	var backward_id = parseInt(costs[1])
	var cost = parseInt(costs[2])
	if (
		forward_id < 0 ||
		backward_id < 0 ||
		!isFinite(forward_id) ||
		!isFinite(backward_id) ||
		this.connection_cost.forward_dimension <= forward_id ||
		this.connection_cost.backward_dimension <= backward_id
	) {
		throw 'Parse error of matrix.def'
	}
	this.connection_cost.put(forward_id, backward_id, cost)
	this.lines++
	return this
}
ConnectionCostsBuilder.prototype.build = function () {
	return this.connection_cost
}
var ConnectionCostsBuilder_default = ConnectionCostsBuilder

// src/dict/builder/CharacterDefinitionBuilder.js
var CATEGORY_DEF_PATTERN = /^(\w+)\s+(\d)\s+(\d)\s+(\d)/
var CATEGORY_MAPPING_PATTERN =
	/^(0x[0-9A-F]{4})(?:\s+([^#\s]+))(?:\s+([^#\s]+))*/
var RANGE_CATEGORY_MAPPING_PATTERN =
	/^(0x[0-9A-F]{4})\.\.(0x[0-9A-F]{4})(?:\s+([^#\s]+))(?:\s+([^#\s]+))*/
function CharacterDefinitionBuilder() {
	this.char_def = new CharacterDefinition_default()
	this.char_def.invoke_definition_map = new InvokeDefinitionMap_default()
	this.character_category_definition = []
	this.category_mapping = []
}
CharacterDefinitionBuilder.prototype.putLine = function (line) {
	var parsed_category_def = CATEGORY_DEF_PATTERN.exec(line)
	if (parsed_category_def != null) {
		var class_id = this.character_category_definition.length
		var char_class = CharacterDefinition_default.parseCharCategory(
			class_id,
			parsed_category_def,
		)
		if (char_class == null) {
			return
		}
		this.character_category_definition.push(char_class)
		return
	}
	var parsed_category_mapping = CATEGORY_MAPPING_PATTERN.exec(line)
	if (parsed_category_mapping != null) {
		var mapping = CharacterDefinition_default.parseCategoryMapping(
			parsed_category_mapping,
		)
		this.category_mapping.push(mapping)
	}
	var parsed_range_category_mapping = RANGE_CATEGORY_MAPPING_PATTERN.exec(line)
	if (parsed_range_category_mapping != null) {
		var range_mapping = CharacterDefinition_default.parseRangeCategoryMapping(
			parsed_range_category_mapping,
		)
		this.category_mapping.push(range_mapping)
	}
}
CharacterDefinitionBuilder.prototype.build = function () {
	this.char_def.invoke_definition_map.init(this.character_category_definition)
	this.char_def.initCategoryMappings(this.category_mapping)
	return this.char_def
}
var CharacterDefinitionBuilder_default = CharacterDefinitionBuilder

// src/dict/builder/DictionaryBuilder.js
function DictionaryBuilder() {
	this.tid_entries = []
	this.unk_entries = []
	this.cc_builder = new ConnectionCostsBuilder_default()
	this.cd_builder = new CharacterDefinitionBuilder_default()
}
DictionaryBuilder.prototype.addTokenInfoDictionary = function (line) {
	var new_entry = line.split(',')
	this.tid_entries.push(new_entry)
	return this
}
DictionaryBuilder.prototype.putCostMatrixLine = function (line) {
	this.cc_builder.putLine(line)
	return this
}
DictionaryBuilder.prototype.putCharDefLine = function (line) {
	this.cd_builder.putLine(line)
	return this
}
DictionaryBuilder.prototype.putUnkDefLine = function (line) {
	this.unk_entries.push(line.split(','))
	return this
}
DictionaryBuilder.prototype.build = function () {
	var dictionaries = this.buildTokenInfoDictionary()
	var unknown_dictionary = this.buildUnknownDictionary()
	return new DynamicDictionaries_default(
		dictionaries.trie,
		dictionaries.token_info_dictionary,
		this.cc_builder.build(),
		unknown_dictionary,
	)
}
DictionaryBuilder.prototype.buildTokenInfoDictionary = function () {
	var token_info_dictionary = new TokenInfoDictionary_default()
	var dictionary_entries = token_info_dictionary.buildDictionary(
		this.tid_entries,
	)
	var trie = this.buildDoubleArray()
	for (var token_info_id in dictionary_entries) {
		var surface_form = dictionary_entries[token_info_id]
		var trie_id = trie.lookup(surface_form)
		token_info_dictionary.addMapping(trie_id, token_info_id)
	}
	return {
		trie,
		token_info_dictionary,
	}
}
DictionaryBuilder.prototype.buildUnknownDictionary = function () {
	var unk_dictionary = new UnknownDictionary_default()
	var dictionary_entries = unk_dictionary.buildDictionary(this.unk_entries)
	var char_def = this.cd_builder.build()
	unk_dictionary.characterDefinition(char_def)
	for (var token_info_id in dictionary_entries) {
		var class_name = dictionary_entries[token_info_id]
		var class_id = char_def.invoke_definition_map.lookup(class_name)
		unk_dictionary.addMapping(class_id, token_info_id)
	}
	return unk_dictionary
}
DictionaryBuilder.prototype.buildDoubleArray = function () {
	var trie_id = 0
	var words = this.tid_entries.map(function (entry) {
		var surface_form = entry[0]
		return { k: surface_form, v: trie_id++ }
	})
	var builder = import_doublearray2.default.builder(1024 * 1024)
	return builder.build(words)
}
var DictionaryBuilder_default = DictionaryBuilder

// src/kuromoji.js
var kuromoji = {
	builder: function (option) {
		return new TokenizerBuilder_default(option)
	},
	dictionaryBuilder: function () {
		return new DictionaryBuilder_default()
	},
}
var kuromoji_default = kuromoji
