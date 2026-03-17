import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

/**
 * 应用状态类型定义
 */
export interface AppState {
  /** 侧边栏折叠状态 */
  sidebarCollapsed: boolean
  /** 当前语言 */
  language: string
  /** 主题模式 */
  theme: 'light' | 'dark'
}

/**
 * 应用操作方法
 */
export interface AppActions {
  /** 切换侧边栏折叠状态 */
  toggleSidebar: () => void
  /** 设置侧边栏折叠状态 */
  setSidebarCollapsed: (collapsed: boolean) => void
  /** 设置语言 */
  setLanguage: (lang: string) => void
  /** 设置主题 */
  setTheme: (theme: 'light' | 'dark') => void
}

/**
 * 应用 Store 类型
 */
export type AppStore = AppState & AppActions

/**
 * 初始状态
 */
const initialState: AppState = {
  sidebarCollapsed: false,
  language: 'zh-CN',
  theme: 'light',
}

/**
 * 创建应用 Store
 */
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        toggleSidebar: () =>
          set(
            (state) => ({
              sidebarCollapsed: !state.sidebarCollapsed,
            }),
            false,
            'toggleSidebar'
          ),
        setSidebarCollapsed: (collapsed) =>
          set({ sidebarCollapsed: collapsed }, false, 'setSidebarCollapsed'),
        setLanguage: (lang) => set({ language: lang }, false, 'setLanguage'),
        setTheme: (theme) => set({ theme }, false, 'setTheme'),
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          language: state.language,
          theme: state.theme,
        }),
      }
    ),
    { name: 'AppStore' }
  )
)