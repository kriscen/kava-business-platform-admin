---
name: '{change_name}'
description: '{change_description}'
type: design
created: '{created_date}'
change_id: '{change_id}'
parent_proposal: '{proposal_change_id}'
---

# Design: {change_name}

## Files

### ADDED

<!-- 新增的文件 -->

```diff
+ src/components/NewComponent.tsx
+ src/hooks/useNewHook.ts
```

### MODIFIED

<!-- 修改的文件 -->

```diff
~ src/api/client.ts
~ src/store/ slices/authSlice.ts
```

### REMOVED

<!-- 删除的文件 -->

```diff
- src/old/OldComponent.tsx
```

## Dependencies

### External

<!-- 新增或变更的外部依赖 -->

- `new-package`: "^1.0.0" # 用途描述

### Internal

<!-- 内部模块依赖变更 -->

- `@/components/ui/*` # 新增 UI 组件依赖

## API Contract

### Request

<!-- 接口请求格式 -->

```yaml
POST /api/v1/resource
Content-Type: application/json

{
  "field": "value"
}
```

### Response

<!-- 接口响应格式 -->

```yaml
200 OK
{
  "id": "123",
  "status": "success"
}
```

## Data Model

<!-- 数据结构变更 -->

### Entity: Resource

```typescript
interface Resource {
  id: string
  name: string
  createdAt: Date
}
```

## Migration

<!-- 数据库迁移或数据迁移策略（如适用） -->

## Rollback Plan

<!-- 回滚方案 -->
