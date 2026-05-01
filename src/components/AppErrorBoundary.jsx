import { Component } from 'react'

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'Falha inesperada ao renderizar a aplicacao.',
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ui] render crash captured by error boundary', {
      error,
      componentStack: errorInfo?.componentStack,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#0d0f12',
          color: '#e5e7eb',
          padding: '24px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        }}>
          <div style={{
            width: 'min(680px, 100%)',
            border: '1px solid #374151',
            background: '#111827',
            borderRadius: '8px',
            padding: '18px',
          }}>
            <div style={{ color: '#fca5a5', fontSize: '12px', marginBottom: '8px' }}>
              ERRO DE RENDERIZACAO
            </div>
            <div style={{ marginBottom: '12px', lineHeight: 1.4 }}>
              {this.state.errorMessage}
            </div>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                border: '1px solid #4b5563',
                background: 'transparent',
                color: '#e5e7eb',
                padding: '8px 12px',
                cursor: 'pointer',
              }}
            >
              Recarregar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
