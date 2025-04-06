import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function FeaturesPage() {
  const { isAuthenticated } = useAuth();
  const actionPath = isAuthenticated ? '/dashboard' : '/register';
  const actionText = isAuthenticated ? 'Go to Dashboard' : 'Sign Up for Free';
  
  // References for animated elements
  const [animatedSections, setAnimatedSections] = useState<boolean[]>(new Array(4).fill(false));
  
  // Animation on intersection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setAnimatedSections(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    
    document.querySelectorAll('.feature-section').forEach((section) => {
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);

  // Feature sections with detailed information
  const features = [
    {
      title: 'Text Processing',
      description: 'Convert any text content into effective flashcards with our intelligent parser.',
      details: [
        'Paste any text and automatically generate question-answer pairs',
        'Smart parsing identifies key concepts and terms',
        'Intelligent algorithms generate concise, effective flashcards',
        'Edit and refine generated cards before saving',
        'Compatible with lecture notes, textbooks, articles, and more'
      ],
      image: '/images/features/text-processing.svg',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      ),
    },
    {
      title: 'URL Content Extraction',
      description: 'Turn web content into flashcards with a single click.',
      details: [
        'Extract relevant content from any webpage by simply providing the URL',
        'Automatic filtering of navigation, ads, and other non-essential content',
        'Support for articles, research papers, encyclopedia entries, and more',
        'Preview extracted content before generating flashcards',
        'Process multiple URLs in batch mode to create comprehensive sets'
      ],
      image: '/images/features/url-extraction.svg',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>
      ),
    },
    {
      title: 'Document Processing',
      description: 'Extract knowledge from documents and convert them to flashcards.',
      details: [
        'Upload PDF, DOCX, PPT, and other document formats',
        'Intelligent text extraction preserves document structure',
        'Table and image extraction with context-aware processing',
        'Support for complex formatting and multi-column layouts',
        'Process lengthy documents while maintaining context across sections'
      ],
      image: '/images/features/document-processing.svg',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
      ),
    },
    {
      title: 'Customizable Flashcards',
      description: 'Tailor your flashcards to your personal learning style.',
      details: [
        'Edit both questions and answers to match your learning preferences',
        'Organize flashcards into sets and categories for structured learning',
        'Add images, formatting, and custom styling to enhance memorization',
        'Adjust difficulty levels to focus on challenging content',
        'Create study sessions with spaced repetition for optimal retention'
      ],
      image: '/images/features/customizable-cards.svg',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
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
            Powerful Learning Features
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-white/80 mb-8 animate-fadeInUp animation-delay-200">
            Advanced tools that transform how you create and study with flashcards
          </p>
        </div>
      </section>

      {/* Detailed Feature Sections */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {features.map((feature, index) => (
          <section 
            key={feature.title}
            className={`feature-section relative mb-24 last:mb-0 ${index % 2 ? 'lg:flex-row-reverse' : ''}`}
            data-index={index}
          >
            <div className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-2 ${
              animatedSections[index] ? 'animate-fadeInUp' : 'opacity-0'
            }`} style={{ animationDelay: `${index * 100}ms` }}>
              {/* Text Content */}
              <div className="p-6">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg">
                  {feature.icon}
                </div>

                <h2 className="mb-4 text-3xl font-bold text-neutral-900">{feature.title}</h2>
                <p className="mb-6 text-xl text-neutral-700">{feature.description}</p>
                
                <ul className="mb-8 space-y-3">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="mr-3 h-6 w-6 flex-shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-neutral-600">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Feature Illustration/Mockup */}
              <div className="relative rounded-xl bg-white p-4 shadow-xl">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-100 flex items-center justify-center">
                  {/* You would normally have real images here */}
                  <div className="flex h-48 w-full items-center justify-center">
                    <div className="text-7xl text-primary-500">
                      {feature.icon}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-800 to-secondary-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Ready to Start Creating Effective Flashcards?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/80 mb-8">
            Our intelligent tools make it easier than ever to convert any content into engaging learning materials. Get started today and transform how you study.
          </p>
          <Link
            to={actionPath}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-white px-8 py-4 font-bold text-primary-700 transition-all duration-300 hover:bg-white/90"
          >
            <span className="relative">{actionText}</span>
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