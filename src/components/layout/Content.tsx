import { Link, useLocation } from 'react-router-dom'
import { Fragment } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Home } from 'lucide-react'
import type { ReactNode } from 'react'
import { useBreadcrumbs } from '@/hooks'
import ErrorBoundary from '@/components/ErrorBoundary'

interface ContentProps {
  children: ReactNode
}

const Content: React.FC<ContentProps> = ({ children }) => {
  const breadcrumbs = useBreadcrumbs()
  const location = useLocation()

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* 面包屑 */}
      <div className="border-b border-border bg-background/80 px-4 py-3 sm:px-6">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => {
              const isCurrent = index === breadcrumbs.length - 1

              return (
                <Fragment key={item.path}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {isCurrent ? (
                      <BreadcrumbPage className="inline-flex min-w-0 items-center gap-1">
                        {index === 0 && <Home className="size-4" />}
                        <span className="truncate">{item.label}</span>
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        render={<Link to={item.path} />}
                        className="inline-flex min-w-0 items-center gap-1 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {index === 0 && <Home className="size-4" />}
                        <span className="truncate">{item.label}</span>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* 内容区域 */}
      <div className="flex-1 overflow-auto bg-muted/30 p-4 sm:p-6">
        <ErrorBoundary key={location.pathname}>{children}</ErrorBoundary>
      </div>
    </div>
  )
}

export default Content
