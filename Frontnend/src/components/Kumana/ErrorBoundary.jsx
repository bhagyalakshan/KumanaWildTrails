import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
          <h3>Something went wrong in this section.</h3>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
