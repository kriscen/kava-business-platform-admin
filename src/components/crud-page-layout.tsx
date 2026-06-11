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
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      {searchSlot}
      {toolbarSlot}
      {table}
      {formModal}
    </div>
  )
}
