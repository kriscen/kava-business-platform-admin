/**
 * 自定义 Hooks 导出
 *
 * 在此文件中添加自定义 Hooks
 */
export { usePageTitle } from './usePageTitle'
export { useBreadcrumbs } from './useBreadcrumbs'
export { useCrudPage } from './useCrudPage'
export type {
  CrudPageConfig,
  CrudApi,
  ModalState,
  CrudHandlers,
  CrudTableProps,
  CrudPageReturn,
} from './useCrudPage'
export { useTreeCrudPage } from './useTreeCrudPage'
export type { TreeCrudApi, TreeCrudPageConfig, TreeCrudPageReturn } from './useTreeCrudPage'
