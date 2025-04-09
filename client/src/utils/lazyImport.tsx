import React, { Suspense, ComponentType, lazy } from 'react';

/**
 * Default fallback component for lazy loading
 */
export const DefaultLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

/**
 * Type for component imports with named exports
 */
type ComponentModule<T = any> = {
  default: ComponentType<T>;
} & Record<string, ComponentType<any>>;

/**
 * Options for lazy loading
 */
interface LazyLoadOptions {
  fallback?: React.ReactNode;
}

/**
 * Lazy load a component with proper TypeScript types
 * 
 * @param importFn Function that imports the component
 * @param options Loading options including fallback component
 * @returns Lazy loaded component with Suspense
 */
export function lazyImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): T {
  const LazyComponent = lazy(importFn);
  const fallback = options.fallback || <DefaultLoadingFallback />;

  // Cast is necessary because React.lazy doesn't preserve type info
  return ((props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  )) as unknown as T;
}

/**
 * Lazy load a component with named exports
 * 
 * @param importFn Function that imports the module
 * @param exportName The name of the exported component to use
 * @param options Loading options including fallback component
 * @returns Lazy loaded component with Suspense
 */
export function lazyNamedImport<T extends ComponentType<any>>(
  importFn: () => Promise<ComponentModule>,
  exportName: string,
  options: LazyLoadOptions = {}
): T {
  const LazyComponent = lazy(async () => {
    const module = await importFn();
    return { default: module[exportName] };
  });

  const fallback = options.fallback || <DefaultLoadingFallback />;

  // Cast is necessary because React.lazy doesn't preserve type info
  return ((props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  )) as unknown as T;
}

/**
 * Create a lazy-loaded component with the given fallback
 * 
 * @param importFn Function that imports the component
 * @param fallback Optional fallback component
 * @returns Lazy loaded component
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
): T {
  return lazyImport(importFn, { fallback });
}

export default lazyImport; 