/**
 * 自动导入 @/icons/svg 目录下的所有svg图片，构建全局 svg-icon 组件
 * 
 */

import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'

Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)