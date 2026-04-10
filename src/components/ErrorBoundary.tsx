import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '24px',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.8)',
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            오류가 발생했습니다
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
            예상치 못한 문제가 생겼어요.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: 'white',
              color: '#0f172a',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            다시 시작하기
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
