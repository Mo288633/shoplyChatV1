import React from 'react';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb({ children }: { children: React.ReactNode }) {
  return <nav>{children}</nav>;
}

export function BreadcrumbList({ children }: { children: React.ReactNode }) {
  return <ol className="flex items-center space-x-2">{children}</ol>;
}

export function BreadcrumbItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <li className={className}>{children}</li>;
}

export function BreadcrumbLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a href={href} className="text-sm text-gray-600 hover:text-gray-900">
      {children}
    </a>
  );
}

export function BreadcrumbPage({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-medium text-gray-900">{children}</span>;
}

export function BreadcrumbSeparator({ className = '' }: { className?: string }) {
  return (
    <ChevronRight 
      className={`h-4 w-4 text-gray-400 ${className}`}
    />
  );
}