import React from 'react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

interface WithLoadingProps {
  isLoading?: boolean;
  error?: Error | null;
}

export function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithLoadingComponent(
    props: P & WithLoadingProps
  ) {
    const { isLoading, error, ...componentProps } = props;

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={error.message} />;
    }

    return <WrappedComponent {...(componentProps as P)} />;
  };
}
