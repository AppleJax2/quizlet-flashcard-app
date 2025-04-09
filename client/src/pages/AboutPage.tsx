import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AboutPage() {
  const { isAuthenticated } = useAuth();
  const ctaPath = isAuthenticated ? '/dashboard' : '/register';
  const ctaText = isAuthenticated ? 'Go to Dashboard' : 'Get Started for Free';

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
            About FlashLeap
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-white/80 mb-8 animate-fadeInUp animation-delay-200">
            Transforming learning through intelligent AI-powered flashcards
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-12 bg-gradient-to-br from-white to-primary-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Why "FlashLeap"?</h2>
            <p className="text-lg text-neutral-700 leading-relaxed">
              Our name represents the significant leap forward in learning that our AI-powered 
              flashcards provide. Just as a leap requires momentum and direction, FlashLeap 
              propels your knowledge acquisition forward with intelligent tools that adapt to your needs.
            </p>
            <p className="text-lg text-neutral-700 leading-relaxed mt-4">
              We believe learning should be dynamic, efficient, and tailored to each person's journey.
              That's why we're committed to helping you learn faster and remember longer.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Our Mission</h2>
            <p className="text-xl text-neutral-700 leading-relaxed">
              At FlashLeap, we're dedicated to helping students and professionals learn more efficiently. 
              We believe that technology should enhance the learning REPLACED, not complicate it.
              Our mission is to create tools that transform any content into effective learning materials,
              making knowledge more accessible and retention more achievable.
            </p>
          </div>
        </div>
      </section>

      {/* App Description */}
      <section className="py-16 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">What We Do</h2>
              <p className="text-lg text-neutral-700 mb-6">
                FlashLeap is an intelligent flashcard generator that leverages advanced AI to convert various content sources into effective study materials.
              </p>
              <p className="text-lg text-neutral-700 mb-6">
                Whether you're preparing for an exam, learning a new subject, or trying to retain important information, our platform helps you create customized flashcards that optimize your learning experience.
              </p>
              <p className="text-lg text-neutral-700">
                We support multiple input formats including raw text, web content, and documents, making it easy to transform any information into a personalized learning resource.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl blur-xl opacity-50"></div>
              <div className="relative bg-white p-6 rounded-xl shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-50 p-5 rounded-lg">
                    <div className="text-primary-600 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-neutral-900">Text Processing</h3>
                    <p className="text-sm text-neutral-600 mt-1">Convert notes and text into flashcards</p>
                  </div>
                  <div className="bg-secondary-50 p-5 rounded-lg">
                    <div className="text-secondary-600 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-neutral-900">URL Processing</h3>
                    <p className="text-sm text-neutral-600 mt-1">Extract web content for learning</p>
                  </div>
                  <div className="bg-accent-50 p-5 rounded-lg">
                    <div className="text-accent-600 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-neutral-900">Document Processing</h3>
                    <p className="text-sm text-neutral-600 mt-1">Convert PDFs and documents into study cards</p>
                  </div>
                  <div className="bg-neutral-100 p-5 rounded-lg">
                    <div className="text-neutral-600 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-neutral-900">Customization</h3>
                    <p className="text-sm text-neutral-600 mt-1">Personalize flashcards to your learning style</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">Why Choose FlashLeap</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-50 p-6 rounded-xl shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Time Efficiency</h3>
              <p className="text-neutral-700">
                Convert any content into flashcards in seconds, saving hours of manual creation time. Focus on studying, not preparation.
              </p>
            </div>
            
            <div className="bg-neutral-50 p-6 rounded-xl shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">AI Intelligence</h3>
              <p className="text-neutral-700">
                Leverage advanced AI to identify key concepts and create effective question-answer pairs that optimize retention and understanding.
              </p>
            </div>
            
            <div className="bg-neutral-50 p-6 rounded-xl shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Flexibility</h3>
              <p className="text-neutral-700">
                Process content from various sources in different formats. Customize flashcards to match your preferred learning style and focus areas.
              </p>
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
            Join thousands of students and professionals who have already improved their learning efficiency with our intelligent flashcard generator.
          </p>
          <Link
            to={ctaPath}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-white px-8 py-4 font-bold text-primary-700 transition-all duration-300 hover:bg-white/90"
          >
            <span className="relative">{ctaText}</span>
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
