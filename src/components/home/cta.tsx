import React from 'react';

interface CTAProps {
  onSignIn: () => void;
}

export function CTA({ onSignIn }: CTAProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-6">
        <div className="bg-blue-600 rounded-2xl text-white p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to transform your business?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your free trial today and see how Shoply can help you grow your business with AI-powered chat commerce.
          </p>
          <button 
            onClick={onSignIn}
            className="bg-white text-blue-600 px-6 md:px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Get started for free
          </button>
        </div>
      </div>
    </section>
  );
}