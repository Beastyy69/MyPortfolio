import { Component } from 'react';

/** Keeps a failing decorative/interactive widget from taking down the page. */
export default class SafeBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.warn('Widget failed and was hidden:', error);
  }

  render() {
    return this.state.failed ? this.props.fallback ?? null : this.props.children;
  }
}
