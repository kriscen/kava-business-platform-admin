/**
 * 布局相关类型定义
 */

import type { ReactNode } from 'react'

/**
 * 菜单项配置
 */
export interface MenuItem {
  /** 菜单唯一标识 */
  key: string
  /** 菜单显示文本 */
  label: string
  /** 菜单图标 */
  icon?: ReactNode
  /** 路由路径 */
  path?: string
  /** 子菜单项 */
  children?: MenuItem[]
}

/**
 * 布局组件的配置项
 */
export interface LayoutConfig {
  /** Logo 元素 */
  logo?: ReactNode
  /** 标题 */
  title?: string
  /** 菜单项列表 */
  menus?: MenuItem[]
  /** 侧边栏宽度（展开状态） */
  sidebarWidth?: number
  /** 侧边栏宽度（折叠状态） */
  collapsedWidth?: number
}