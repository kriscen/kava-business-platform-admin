import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 输出到控制台，预留监控服务接口
    console.error('ErrorBoundary caught:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: Date.now(),
    })
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-8 text-destructive" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">页面出现错误</h2>
            <p className="mb-6 text-muted-foreground">
              抱歉，页面发生了错误。请尝试刷新页面或返回首页。
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={this.handleReset}>
                <RefreshCw className="size-4" />
                重试
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = '/')}>
                <Home className="size-4" />
                返回首页
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary