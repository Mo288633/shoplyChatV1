import React from 'react';
import { Zap, BarChart3, Lock, ChevronRight } from 'lucide-react';

interface FeaturesProps {
  onNavigate: (page: string) => void;
}

const features = [
  {
    icon: <Zap className="h-6 w-6 text-blue-600" />,
    title: "AI-Powered Sales",
    description: "Convert more customers with intelligent conversations that understand intent and context."
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
    title: "Smart Analytics",
    description: "Get real-time insights into customer behavior and optimize your sales strategy."
  },
  {
    icon: <Lock className="h-6 w-6 text-blue-600" />,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.99% uptime guarantee for your peace of mind."
  }
];

export function Features({ onNavigate }: FeaturesProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group p-6 md:p-8 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <button 
                onClick={() => onNavigate('pricing')}
                className="text-blue-600 group-hover:text-blue-700 font-medium inline-flex items-center"
              >
                View pricing <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}