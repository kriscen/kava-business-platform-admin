export interface CrudPageLayoutProps {
  title: string
  description?: string
  searchSlot?: React.ReactNode
  toolbarSlot?: React.ReactNode
  table: React.ReactNode
  formModal?: React.ReactNode
}

export function CrudPageLayout({
  title,
  description,
  searchSlot,
  toolbarSlot,
  table,
  formModal,
}: CrudPageLayoutProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold">{title}</h2>
          {description && (
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {toolbarSlot && <div className="flex shrink-0 flex-wrap gap-2">{toolbarSlot}</div>}
      </div>

      {searchSlot && <div className="rounded-lg border bg-card p-4 shadow-sm">{searchSlot}</div>}
      {table}
      {formModal}
    </div>
  )
}
