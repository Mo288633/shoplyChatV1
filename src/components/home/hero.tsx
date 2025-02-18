import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

interface HeroProps {
  onSignIn: () => void;
}

export function Hero({ onSignIn }: HeroProps) {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Transform Your Business with AI-Powered Chat Commerce
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Automate sales and support across messaging platforms with AI that understands your customers and drives growth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button 
              onClick={onSignIn}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Get started <ArrowRight className="h-5 w-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-900 px-6 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              Schedule a demo
            </button>
          </div>
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>4.9/5 rating</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>No credit card required</span>
            <span className="hidden sm:inline">•</span>
            <span>14-day free trial</span>
          </div>
        </div>
      </div>
    </section>
  );
}