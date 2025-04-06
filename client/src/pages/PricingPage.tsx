import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  const ctaPath = isAuthenticated ? '/dashboard' : '/register';
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Calculate yearly prices (20% discount)
  const yearlyDiscount = 0.2;
  const paidTierMonthly = 9.99;
  const paidTierYearly = paidTierMonthly * 12 * (1 - yearlyDiscount);

  const plans = [
    {
      name: 'Free',
      description: 'Basic flashcard generation for personal study',
      price: {
        monthly: 0,
        yearly: 0,
      },
      features: [
        'Text-based flashcard generation',
        'Up to 5 flashcard sets',
        '50 cards per set limit',
        'Basic customization options',
        'Personal use only',
        'Standard support'
      ],
      limits: [
        'No AI-powered generation',
        'Limited document processing',
        'No URL content extraction'
      ],
      cta: 'Get Started',
      highlight: false,
    },
    {
      name: 'Pro',
      description: 'Advanced AI tools for enhanced learning',
      price: {
        monthly: paidTierMonthly,
        yearly: paidTierYearly / 12,
      },
      features: [
        'Everything in Free plan',
        'AI-powered flashcard generation',
        'Unlimited flashcard sets',
        'Unlimited cards per set',
        'URL content extraction',
        'Document processing (PDF, DOCX)',
        'Advanced customization options',
        'Priority support'
      ],
      limits: [
        'Limited to our API usage limits',
        'Shared AI processing capacity'
      ],
      cta: 'Upgrade to Pro',
      highlight: true,
    },
    {
      name: 'Custom',
      description: 'Use your own API keys for unlimited access',
      price: {
        monthly: 4.99,
        yearly: 4.99 * 12 * (1 - yearlyDiscount) / 12,
      },
      features: [
        'Everything in Pro plan',
        'Connect your own OpenAI or DeepSeek API key',
        'Unlimited AI processing',
        'Maximum control over generation',
        'Usage analytics and cost tracking',
        'GPT-4o and o1 / DeepSeek R1 access',
        'Study guide generation',
        'Dedicated support'
      ],
      limits: [
        'You pay for your own API usage',
        'Requires external API key'
      ],
      cta: 'Get Custom Plan',
      highlight: false,
    }
  ];

  const comparisons = [
    { feature: 'Flashcard Sets', free: '5 sets', pro: 'Unlimited', custom: 'Unlimited' },
    { feature: 'Cards per Set', free: '50 cards', pro: 'Unlimited', custom: 'Unlimited' },
    { feature: 'Text Processing', free: '✓', pro: '✓', custom: '✓' },
    { feature: 'URL Content Extraction', free: '✕', pro: '✓', custom: '✓' },
    { feature: 'Document Processing', free: 'Basic (text only)', pro: 'Advanced', custom: 'Advanced' },
    { feature: 'AI-Powered Generation', free: '✕', pro: '✓', custom: '✓ (Your API)' },
    { feature: 'GPT-4o / o1 Access', free: '✕', pro: 'Limited', custom: '✓ (Your API)' },
    { feature: 'DeepSeek R1 Access', free: '✕', pro: 'Limited', custom: '✓ (Your API)' },
    { feature: 'Study Guide Generation', free: '✕', pro: 'Limited', custom: '✓' },
    { feature: 'API Usage Analytics', free: '✕', pro: '✕', custom: '✓' },
    { feature: 'Customization Options', free: 'Basic', pro: 'Advanced', custom: 'Advanced' },
    { feature: 'Support', free: 'Standard', pro: 'Priority', custom: 'Dedicated' },
  ];

  const faqs = [
    {
      question: 'How do the subscription plans work?',
      answer: 'We offer three subscription tiers: Free, Pro, and Custom. The Free plan allows basic flashcard creation with some limitations. The Pro plan adds AI-powered generation and removes most limitations. The Custom plan lets you use your own API keys for maximum control and unlimited processing.'
    },
    {
      question: 'What AI models do you support?',
      answer: 'For Pro users, we provide access to OpenAI and DeepSeek models with reasonable usage limits. Custom plan users can connect their own OpenAI (GPT-4o and o1) or DeepSeek (R1) API keys for unlimited processing power.'
    },
    {
      question: 'Can I change plans or cancel my subscription?',
      answer: 'Yes, you can upgrade, downgrade, or cancel your subscription at any time from your account settings. If you downgrade or cancel, you\'ll maintain access to your current plan until the end of your billing period.'
    },
    {
      question: 'How much does API usage cost for the Custom plan?',
      answer: 'API usage costs vary depending on the provider and model you choose. For OpenAI, GPT-4o costs approximately $0.005 per 1K input tokens and $0.015 per 1K output tokens. DeepSeek R1 costs roughly $0.001 per 1K input tokens and $0.002 per 1K output tokens. The average flashcard set generation might cost between $0.02-$0.10 depending on content length and complexity.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'You can use our Free plan indefinitely with its limitations. For Pro features, we offer a 7-day trial when you first sign up, allowing you to test all AI-powered features without commitment.'
    },
    {
      question: 'What happens to my flashcards if I downgrade?',
      answer: 'If you downgrade from Pro or Custom to Free, you\'ll maintain access to all previously created flashcards. However, you may not be able to edit AI-generated sets or create new ones with AI features. Free plan limits will apply to any new sets you create.'
    }
  ];

  return (
    <div className="bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20 text-white">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute h-64 w-64 rounded-full bg-white/10 -top-20 -right-20 blur-3xl"></div>
          <div className="absolute h-64 w-64 rounded-full bg-secondary-500/20 bottom-20 -left-20 blur-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6 animate-fadeInUp">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-white/80 mb-8 animate-fadeInUp animation-delay-200">
            Choose the plan that works best for your learning journey
          </p>
          
          {/* Billing toggle */}
          <div className="mt-12 flex justify-center">
            <div className="relative rounded-full bg-white/10 p-1 backdrop-blur-sm flex">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={cn(
                  "relative rounded-full py-2 px-6 text-sm font-semibold transition-all duration-200",
                  billingPeriod === 'monthly' 
                    ? "bg-white text-primary-700"
                    : "bg-transparent text-white hover:bg-white/5"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={cn(
                  "relative rounded-full py-2 px-6 text-sm font-semibold transition-all duration-200",
                  billingPeriod === 'yearly' 
                    ? "bg-white text-primary-700"
                    : "bg-transparent text-white hover:bg-white/5"
                )}
              >
                Yearly
                <span className="absolute -right-2 -top-2 rounded-full bg-accent-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                  20% off
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-2xl border bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg",
                  plan.highlight
                    ? "border-primary-200 ring-2 ring-primary-500 shadow-primary-100"
                    : "border-neutral-200"
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm">
                    Most Popular
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-2xl font-bold text-neutral-900">{plan.name}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <p className="text-5xl font-bold text-neutral-900">
                    ${plan.price[billingPeriod].toFixed(2)}
                    <span className="text-lg font-medium text-neutral-500">
                      {plan.price[billingPeriod] > 0 ? '/mo' : ''}
                    </span>
                  </p>
                  {billingPeriod === 'yearly' && plan.price.yearly > 0 && (
                    <p className="mt-1 text-sm text-neutral-600">
                      Billed annually (${(plan.price.yearly * 12).toFixed(2)})
                    </p>
                  )}
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg className="mr-3 h-5 w-5 flex-shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limits.length > 0 && (
                  <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold text-neutral-900">Limitations:</p>
                    <ul className="space-y-2">
                      {plan.limits.map((limit) => (
                        <li key={limit} className="flex items-start">
                          <svg className="mr-3 h-5 w-5 flex-shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span className="text-sm text-neutral-600">{limit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link
                  to={ctaPath}
                  className={cn(
                    "block w-full rounded-lg px-4 py-3 text-center text-sm font-medium transition-all duration-200",
                    plan.highlight
                      ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-sm hover:shadow"
                      : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900">Feature Comparison</h2>
            <p className="mt-4 text-lg text-neutral-600">
              A detailed look at what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 rounded-lg border border-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-neutral-900">
                    Feature
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-neutral-900">
                    Free
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-neutral-900 bg-primary-50">
                    Pro
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-neutral-900">
                    Custom
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {comparisons.map((item, index) => (
                  <tr 
                    key={item.feature}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}
                  >
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-neutral-900">
                      {item.feature}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-center text-neutral-700">
                      {item.free}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-center text-neutral-700 bg-primary-50/50">
                      {item.pro}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-center text-neutral-700">
                      {item.custom}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-neutral-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group p-6 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-neutral-900">
                    <h3 className="text-lg font-medium">
                      {faq.question}
                    </h3>

                    <span className="relative h-5 w-5 shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute inset-0 h-5 w-5 opacity-100 group-open:opacity-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute inset-0 h-5 w-5 opacity-0 group-open:opacity-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18 12H6"
                        />
                      </svg>
                    </span>
                  </summary>

                  <p className="mt-4 text-neutral-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-800 to-secondary-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Ready to Take a Leap in Your Learning?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/80 mb-8">
            Join thousands of students and professionals who have already improved their learning efficiency with FlashLeap's intelligent flashcard generator.
          </p>
          <Link
            to={ctaPath}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-white px-8 py-4 font-bold text-primary-700 transition-all duration-300 hover:bg-white/90"
          >
            <span className="relative">Get Started Today</span>
            <span className="absolute right-0 translate-x-full transition-transform duration-300 group-hover:-translate-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
} 