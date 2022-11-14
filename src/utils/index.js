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
