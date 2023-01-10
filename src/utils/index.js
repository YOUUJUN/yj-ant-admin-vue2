/**
 * 验证是否为url
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
	const reg =
		/^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
	return reg.test(url)
}

export function deepClone(obj, hash = new WeakMap()) {
	if (hash.has(obj)) {
		return obj
	}
	let res = null
	const reference = [Date, RegExp, Set, WeakSet, Map, WeakMap, Error]

	if (reference.includes(obj.constructor)) {
		res = new obj.constructor(obj)
	} else if (Array.isArray(obj)) {
		res = []
		obj.forEach((e, i) => {
			res[i] = deepClone(e)
		})
	} else if (typeof obj === 'Object' && obj !== null) {
		res = {}
		for (const key in obj) {
			if (Object.hasOwnProperty.call(obj, key)) {
				res[key] = deepClone(obj[key])
			}
		}
	} else {
		res = obj
	}
	hash.set(obj, res)
	return res
}

//template中使用可选链
export const useChain = (target) => {
	return new Proxy(target, {
		get: (target, key) => {
			const keys = key.split('?.')
			return keys.reduce((a, b) => a?.[b], target)
		},
	})
}

export function timeFix() {
	const time = new Date()
	const hour = time.getHours()
	return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

//deep equal
export function equal(a, b) {
	if (a === b) return true

	if (a && b && typeof a == 'object' && typeof b == 'object') {
		if (a.constructor !== b.constructor) return false

		var length, i, keys
		if (Array.isArray(a)) {
			length = a.length
			if (length != b.length) return false
			for (i = length; i-- !== 0; ) if (!equal(a[i], b[i])) return false
			return true
		}

		if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags
		if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf()
		if (a.toString !== Object.prototype.toString) return a.toString() === b.toString()

		keys = Object.keys(a)
		length = keys.length
		if (length !== Object.keys(b).length) return false

		for (i = length; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false

		for (i = length; i-- !== 0; ) {
			var key = keys[i]

			if (!equal(a[key], b[key])) return false
		}

		return true
	}

	// true if both NaN, false otherwise
	return a !== a && b !== b
}

/**
 * better error handler for async func
 *
 * @param asyncFunc
 * @param params
 * @returns {Promise<*[]>}
 */

export async function errorCaptured(asyncFunc, ...params) {
	try {
		const res = await asyncFunc(...params)
		return [null, res]
	} catch (e) {
		return [e, null]
	}
}
