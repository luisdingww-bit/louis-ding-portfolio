import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Called once when a child throws — use to fall back to a safe state. */
  onError?: () => void;
  /** What to render instead of children after an error. */
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
}

/**
 * Catches render/runtime errors in its subtree (e.g. a WebGL/three failure in
 * the intro) so a single failing component can never blank-screen the app.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // surfaced for debugging without crashing the page
    // eslint-disable-next-line no-console
    console.warn('[ErrorBoundary] recovered from error:', error);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
