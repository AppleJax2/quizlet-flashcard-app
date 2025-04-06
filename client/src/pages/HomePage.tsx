import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

export default function HomePage() {
  const features = [
    {
      title: 'Text Processing',
      description:
        'Process any text content and automatically generate flashcards from it.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
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
      description:
        'Automatically extract content from any webpage and convert it to flashcards.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
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
      description:
        'Upload PDF, Word, or other document types and convert them to flashcards.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
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
      description:
        'Edit, customize, and organize your flashcards for optimal learning.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
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

  // References for animated elements
  const heroRef = useRef<HTMLDivElement>(null);
  const [animatedFeatures, setAnimatedFeatures] = useState<boolean[]>(new Array(features.length).fill(false));
  
  // Animation on load
  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.classList.add('animate-fadeInUp');
    }
    
    // Add animation classes to features with delay
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setAnimatedFeatures(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    
    document.querySelectorAll('.feature-card').forEach((card) => {
      observer.observe(card);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section with enhanced design */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-28 text-white">
        {/* Enhanced decorative elements */}
        <div className="absolute left-1/3 top-0 h-96 w-96 rounded-full bg-secondary-500/30 opacity-20 blur-[120px] animate-pulse-subtle"></div>
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent-500/30 opacity-20 blur-[120px] animate-pulse-subtle animation-delay-200"></div>
        <div className="absolute -bottom-24 -left-24 h-[500px] w-[500px] rounded-full bg-primary-500/20 opacity-10 blur-[150px]"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute h-2 w-2 rounded-full bg-white/30 top-1/4 left-1/4 animate-float"></div>
          <div className="absolute h-3 w-3 rounded-full bg-white/20 top-1/3 right-1/3 animate-float animation-delay-500"></div>
          <div className="absolute h-2 w-2 rounded-full bg-white/30 bottom-1/4 right-1/4 animate-float animation-delay-1000"></div>
          <div className="absolute h-4 w-4 rounded-full bg-white/10 bottom-1/3 left-1/3 animate-float animation-delay-700"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:30px_30px]"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={heroRef}>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm backdrop-blur-sm border border-white/10 shadow-inner-soft">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500"></span>
                </span>
                <span>AI-powered learning tools</span>
              </div>
              
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block">FlashLeap</span>
                <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-200 to-secondary-200">Learn Faster, Remember Longer</span>
              </h1>
              
              <p className="mt-6 text-xl leading-8 text-primary-100">
                Transform text, web content, and documents into effective
                flashcards powered by advanced AI. Take the leap in your learning journey.
              </p>
              
              <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link
                  to="/register"
                  className="group relative rounded-xl bg-white/95 px-6 py-3.5 text-center text-lg font-semibold text-primary-700 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-white/20 hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10">Get Started for Free</span>
                  <span className="absolute inset-0 -z-10 bg-gradient-to-r from-white/0 via-white/40 to-white/0 opacity-0 blur-sm transition-opacity duration-1000 group-hover:opacity-100 group-hover:animate-shimmer"></span>
                </Link>
                
                <Link
                  to="/features"
                  className="group relative overflow-hidden rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-center text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5"
                >
                  <span className="relative z-10">Learn More</span>
                  <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
            </div>
            
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-8 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-xl rounded-full opacity-50 animate-pulse-subtle"></div>
              <div className="relative aspect-[4/3] w-full max-w-lg rounded-xl bg-white/5 p-1.5 shadow-2xl ring-1 ring-white/20 backdrop-blur-sm transition-all duration-500 hover:shadow-primary-500/20 sm:p-2 overflow-hidden">
                <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-xl bg-primary-500/40 opacity-50 blur-xl"></div>
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-xl bg-secondary-500/40 opacity-50 blur-xl"></div>
                
                <div className="relative h-full w-full overflow-hidden rounded-lg bg-gradient-to-br from-neutral-900/90 to-neutral-800/90 backdrop-blur-md">
                  <div className="absolute left-0 top-0 flex w-full space-x-2 rounded-t-lg bg-neutral-800/90 p-3">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  
                  <div className="flex h-full flex-col pt-10">
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="grid grid-cols-1 gap-3">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 animate-fadeIn animation-delay-${i*200}`}
                          >
                            <div className="h-4 w-3/4 rounded bg-white/20"></div>
                            <div className="mt-3 h-3 w-full rounded bg-white/20"></div>
                            <div className="mt-2 h-3 w-4/5 rounded bg-white/20"></div>
                            <div className="mt-4 flex justify-end">
                              <div className="h-6 w-20 rounded-full bg-primary-500/40"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -right-10 top-1/3 h-16 w-16 animate-float animation-delay-200">
                <div className="relative h-full w-full rounded-lg bg-gradient-to-r from-secondary-500/90 to-secondary-600/90 shadow-lg flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              
              <div className="absolute -left-8 bottom-1/4 h-14 w-14 animate-float animation-delay-500">
                <div className="relative h-full w-full rounded-lg bg-gradient-to-r from-accent-500/90 to-accent-600/90 shadow-lg flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom wave */}
        <div className="absolute -bottom-1 left-0 right-0 h-16 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="h-full w-full">
            <path fill="#F8FAFC" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,250.7C960,235,1056,181,1152,176C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">Powerful Features</h2>
            <p className="mt-4 text-xl text-neutral-600 max-w-3xl mx-auto">
              Everything You Need to Create Effective Flashcards
            </p>
            <p className="mt-2 text-lg text-neutral-500">
              Our intelligent platform handles the heavy lifting so you can focus on learning.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="feature-card group relative"
                data-index={index}
              >
                <div className={`relative overflow-hidden rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary-200/40 hover:-translate-y-1 ${animatedFeatures[index] ? 'animate-fadeInUp' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md">
                      {feature.icon}
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-neutral-900">{feature.title}</h3>
                    <p className="text-neutral-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-primary-800 to-secondary-900 py-20 text-white">
        {/* Decorative elements */}
        <div className="absolute -top-1 left-0 right-0 h-16 w-full transform rotate-180">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="h-full w-full">
            <path fill="#F8FAFC" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,250.7C960,235,1056,181,1152,176C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute h-2 w-2 rounded-full bg-white/20 top-1/4 left-1/4 animate-float"></div>
          <div className="absolute h-3 w-3 rounded-full bg-white/10 top-1/3 right-1/3 animate-float animation-delay-500"></div>
          <div className="absolute h-2 w-2 rounded-full bg-white/20 bottom-1/4 right-1/4 animate-float animation-delay-1000"></div>
          <div className="absolute h-4 w-4 rounded-full bg-white/10 bottom-1/3 left-1/3 animate-float animation-delay-700"></div>
        </div>
        
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:30px_30px]"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Ready to Take a Leap in Your Learning?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/80 mb-8">
            Join thousands of students and educators who have already improved their learning efficiency with our flashcard generator.
          </p>
          <Link
            to="/register"
            className="group relative overflow-hidden rounded-xl bg-white px-8 py-4 text-lg font-semibold text-primary-700 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
          >
            <span className="relative z-10">Sign Up Now — It's Free</span>
            <span className="absolute inset-0 -z-10 bg-gradient-to-r from-white/0 via-white/40 to-white/0 opacity-0 blur-sm transition-opacity duration-1000 group-hover:opacity-100 group-hover:animate-shimmer"></span>
          </Link>
          <p className="mt-6 text-white/80">Join 10,000+ students</p>
        </div>
      </section>
    </div>
  );
} 