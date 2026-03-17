import { Link } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
import { Home } from 'lucide-react'
import type { ReactNode } from 'react'

interface ContentProps {
  children: ReactNode
}

const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* 面包屑 */}
      <div className="border-b border-border bg-white px-6 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/" />}>
                <Home className="size-4" />
                <span>首页</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* 内容区域 */}
      <div className="flex-1 overflow-auto bg-muted/30 p-6">{children}</div>
    </div>
  )
}

export default Content