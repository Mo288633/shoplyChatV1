import React from 'react';

export function SocialProof() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Trusted by innovative companies
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of businesses using Shoply to automate their sales and support.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center justify-items-center opacity-60">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="h-8 md:h-12 w-24 md:w-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </section>
  );
}