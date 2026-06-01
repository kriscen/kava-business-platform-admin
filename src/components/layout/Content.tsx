import { Link } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
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

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* 面包屑 */}
      <div className="border-b border-border bg-white px-6 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <BreadcrumbItem key={item.path}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbLink
                  render={<Link to={item.path} />}
                  className="inline-flex items-center gap-1"
                >
                  {index === 0 && <Home className="size-4" />}
                  <span>{item.label}</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* 内容区域 */}
      <div className="flex-1 overflow-auto bg-muted/30 p-6">
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </div>
  )
}

export default Content
