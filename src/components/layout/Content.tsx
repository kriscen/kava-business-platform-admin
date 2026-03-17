import { Breadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import type { ReactNode } from 'react'

interface ContentProps {
  children: ReactNode
}

const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '16px 24px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Breadcrumb
          items={[
            {
              href: '/',
              title: (
                <>
                  <HomeOutlined />
                  <span>首页</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div
        style={{
          flex: 1,
          padding: 24,
          overflow: 'auto',
          background: '#f5f5f5',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default Content