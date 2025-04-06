import * as React from 'react';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
  title?: string;
  description?: string;
  onClose?: () => void;
} 