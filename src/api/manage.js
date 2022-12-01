import request from '@/utils/http'

export function postAction(url, parameter) {
	return request({
		url,
		method: 'post',
		data: parameter,
	})
}

export function putAction(url, parameter) {
	return request({
		url,
		method: 'put',
		data: parameter,
	})
}

export function deleteAction(url, parameter) {
	return request({
		url,
		method: 'delete',
		params: parameter,
	})
}

export function getAction(url, parameter) {
	return request({
		url,
		method: 'get',
		params: parameter,
	})
}
