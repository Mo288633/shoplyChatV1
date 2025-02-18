import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '../app/layout';

interface PricingPageProps {
  onSignIn?: () => void;
  onNavigate?: (page: string) => void;
  isAuthenticated?: boolean;
}

function PricingPage({ onSignIn, onNavigate, isAuthenticated }: PricingPageProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [productCount, setProductCount] = useState(50);

  const plans = [
    {
      name: "Free",
      price: 0,
      features: ["Sell up to 10 products", "Basic AI chat", "3% transaction fee"],
    },
    {
      name: "Starter",
      price: 29,
      features: ["Unlimited products", "AI recommendations", "Custom branding", "2% transaction fee"],
    },
    {
      name: "Pro",
      price: 79,
      features: ["Abandoned cart recovery", "Multi-language support", "Analytics dashboard", "1% transaction fee"],
    },
    {
      name: "Enterprise",
      price: 199,
      features: ["Custom AI models", "API access", "0% transaction fee", "Dedicated support"],
    },
  ];

  const adjustedPrice = (price: number) => {
    const yearlyPrice = price * 10;
    return isYearly ? yearlyPrice * 0.8 : price; // 20% discount for yearly
  };

  return (
    <Layout onSignIn={onSignIn} onNavigate={onNavigate} isAuthenticated={isAuthenticated}>
      {/* Pricing Header */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Choose Your Plan
            </h1>
            <p className="text-lg text-gray-600">
              Scale your business with the right plan. All plans include a 14-day free trial.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex justify-center items-center gap-4 pt-6">
              <span className={`text-sm ${!isYearly ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                <span
                  className={`${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
              <span className={`text-sm ${isYearly ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                Yearly (Save 20%)
              </span>
            </div>

            {/* Product Count Slider */}
            <div className="max-w-md mx-auto pt-8">
              <div className="text-sm text-gray-600 mb-2 flex justify-between">
                <span>Number of Products</span>
                <span className="font-semibold text-gray-900">{productCount}</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={productCount}
                onChange={(e) => setProductCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10</span>
                <span>1000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className={`h-full rounded-2xl p-8 ${
                  plan.name === "Pro" 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-600 ring-offset-2' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <div className="mb-6">
                    <h3 className={`text-2xl font-bold mb-2 ${
                      plan.name === "Pro" ? 'text-white' : 'text-gray-900'
                    }`}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold ${
                        plan.name === "Pro" ? 'text-white' : 'text-gray-900'
                      }`}>
                        ${adjustedPrice(plan.price)}
                      </span>
                      <span className={
                        plan.name === "Pro" ? 'text-blue-100' : 'text-gray-600'
                      }>
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className={`h-5 w-5 mt-0.5 ${
                          plan.name === "Pro" ? 'text-blue-100' : 'text-blue-600'
                        }`} />
                        <span className={
                          plan.name === "Pro" ? 'text-blue-100' : 'text-gray-600'
                        }>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={onSignIn}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      plan.name === "Pro"
                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Get started
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-8">
              {[
                {
                  q: 'How does the product limit work?',
                  a: "The product limit applies to the number of active products you can have in your store at any time. You can always adjust your plan as your business grows."
                },
                {
                  q: 'What are the transaction fees?',
                  a: "Transaction fees are calculated as a percentage of each sale. They decrease as you upgrade your plan, with Enterprise users paying no transaction fees."
                },
                {
                  q: 'Can I change plans later?',
                  a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing."
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards, including Visa, Mastercard, and American Express. Enterprise customers can also pay via invoice.'
                }
              ].map((faq, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="bg-blue-600 rounded-2xl text-white p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Start your 14-day free trial today. No credit card required.
            </p>
            <button 
              onClick={onSignIn}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Start free trial
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default PricingPage;