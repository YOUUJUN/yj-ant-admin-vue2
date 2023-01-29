/**
 * 添加环境变量到全局变量，代码中的环境变量调用从window._CONFIG中获取
 *
 */
const config = {
	domianURL: process.env.VUE_APP_API_BASE_URL,
	baseURL: process.env.VUE_APP_BASE_URL,
	indexURL: process.env.VUE_APP_INDEX_URL,
}

window._CONFIG = config

export default config
