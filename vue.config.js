/**
 * Based on @vue/cli-service": "^4.5.13",
 *  Which webpack version is "webpack": "^4.0.0"
 *
 */

const fs = require('fs')
const path = require('path')

const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const AliasPlugin = require('alias-jsconfig-webpack-plugin')

const productionGzipExtensions = ['js', 'css']
const isProd = process.env.NODE_ENV === 'production'

const cdnBaseHttp = 'https://cdn.bootcss.com'

const externalConfig = [
	// {name : 'vue', scope: 'Vue', js: 'vue.min.js'},
	// {name : 'vue-router', scope: 'VueRouter', js: 'vue-router.min.js'},
	// {name : 'vuex', scope: 'Vuex', js: 'vuex.min.js'},
	// {name: 'axios', scope: 'axios', js: 'axios.min.js'},
	// {name: 'element-ui', scope: 'ELEMENT', js: 'index.js', css: 'theme-chalk/index.css'},
	// {name: 'echarts', scope: 'echarts', js: 'echarts.min.js', includes : ['contact']},
]

/**
 * 读取生产环境第三方依赖版本
 * @returns 
 */
//不支持高版本node
const getModulesVersion = () => {
	let mvs = {}
	let regexp = /^npm_package_.{0,3}dependencies_/gi
	for (let m in process.env) {
		if (regexp.test(m)) {
			mvs[m.replace(regexp, '').replace(/_/g, '-')] = process.env[m].replace(/(~|\^)/g, '')
		}
	}

	return mvs
}

/**
 * 读取生产环境第三方依赖版本
 * @returns 
 */
//兼容高版本node
const getDependenciesVersion = () => {
	let mvs = {}

	let json = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
	let dependencies = json.dependencies
	for (let key in dependencies) {
		mvs[key] = dependencies[key].replace(/(~|\^)/g, '')
	}

	return mvs
}

/**
 * 根据配置和版本号自动构建cdn，返回externals配置
 * @param {array} config cdn配置
 * @returns externals配置
 */
const getExternalModules = (config) => {
	let externals = {}
	let dependencieModules = getDependenciesVersion()
	config.forEach((item) => {
		if (item.name in dependencieModules) {
			let version = dependencieModules[item.name]

			item.css = item.css && [cdnBaseHttp, item.name, version, item.css].join('/')
			item.js = item.js && [cdnBaseHttp, item.name, version, item.js].join('/')

			externals[item.name] = item.scope
		} else {
			throw new Error('相关依赖未安装，请先执行npm install ' + item.name)
		}
	})

	return externals
}

let externalModules = getExternalModules(externalConfig)

delete require.cache[module.id]

let publicPath = !isProd ? '/' : '/amis-web/static/ElderlyManagement/'

module.exports = function () {
	return {
		publicPath,
		outputDir: './ElderlyManagement',
		assetsDir: 'static',
		filenameHashing: true,
		devServer: {
			port: 8082,
			hotOnly: true,
			open: false, //是否自动打开浏览器
			proxy: {
				'/api': {
					target: process.env.VUE_APP_PROXY_BASE_URL,
					ws: true,
					secure: false,
					changOrigin: true, //是否开启代理
					pathRewrite: {
						//  /api开头的请求会去到target下请求
						'^/api': '', //   替换/api 为空字符
					},
				},
			},
		},
		productionSourceMap: !isProd, //开启后出错的时候，除错工具将直接显示原始代码，而不是转换后的代码。关闭可以减少打包体积
		configureWebpack: {
			plugins: [],

			externals: externalModules,

			resolve: {
				alias: {
					'@': path.resolve(__dirname, 'src'),
					'@assets': path.resolve(__dirname, 'src/assets'),
					'@components': path.resolve(__dirname, 'src/components'),
					'@views': path.resolve(__dirname, 'src/views'),
					'@store': path.resolve(__dirname, 'src/store'),
				},
			},
		},

		chainWebpack: (config) => {
			config
				.plugin(`html`) //自定义插件名称用于移除
				.tap((args) => [
					{
						//动态修改plugin传参
						template: './public/index.html',
						cdnConfig: externalConfig,
						BASE_URL: '/',
					},
				])

			//性能检测
			config.when(process.env.NODE_ENV === 'performance', (config) =>
				config.plugin('webpack-bundle-analyzer').use(
					new BundleAnalyzerPlugin({
						analyzerPort: 'auto',
					}),
				),
			)
			config.when(process.env.NODE_ENV === 'performance', (config) =>
				config.plugin('xcTime').use(SpeedMeasurePlugin),
			)

			//减少moment打包体积
			config.plugin('ignore').use(
				new webpack.IgnorePlugin({
					resourceRegExp: /^\.\/locale$/,
					contextRegExp: /moment$/,
				}),
			)

			//读取alias配置添加到jsconfig.json
			config.plugin('alias').use(
				new AliasPlugin({
					language: 'js', // or 'ts'
					jsx: true, // default to true,
					indentation: 4, // default to 4, the indentation of jsconfig.json file
				}),
			)

			//打包时生成.gz文件
			config
				.plugin('compression-webpack-plugin')
				.use(require('compression-webpack-plugin'), [
					{
						algorithm: 'gzip',
						test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
						threshold: 10240,
						minRatio: 0.8,
					},
				])
				.tap((options) => {
					console.log('options===>', options)
					return options
				})

			//去除生产环境console;
			config.optimization 
				.minimize(true)
				.minimizer('terser')
				.tap((args) => {
					let { terserOptions } = args[0]
					console.log('terserOptions', terserOptions)
					terserOptions.compress.drop_console = true
					terserOptions.compress.drop_debugger = true
					return args
				})
		},

		css: {
			loaderOptions: {
				// 给 less-loader 传递 Less.js 相关选项
				less: {
					// `globalVars` 定义全局对象，可加入全局变量
					globalVars: {
						// primary: '#333'
					},
				},
			},
		},
	}
}
