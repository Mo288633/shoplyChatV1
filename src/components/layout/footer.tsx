import React from 'react';
import { Logo } from '../ui/Logo';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

const footerSections = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#' },
      { label: 'Integrations', href: '#' },
      { label: 'Pricing', action: 'pricing' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'Blog', href: '#' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Contact', href: '#' }
    ]
  }
];

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-50 py-16 md:py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Logo onClick={() => onNavigate?.('home')} />
            <p className="text-gray-600 mb-4 max-w-sm mt-4">
              AI-powered conversational commerce platform that helps businesses sell more through messaging apps.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'linkedin', 'github'].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">{social}</span>
                  <div className="h-6 w-6 bg-current rounded"></div>
                </a>
              ))}
            </div>
          </div>
          {footerSections.map((section, index) => (
            <div key={index} className="col-span-1">
              <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    {link.action ? (
                      <button
                        onClick={() => onNavigate?.(link.action)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a href={link.href} className="text-gray-600 hover:text-gray-900">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-12 md:mt-16 pt-8 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Shoply. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}