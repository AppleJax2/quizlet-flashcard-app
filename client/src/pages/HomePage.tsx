import React from 'react';
import { Link } from 'react-router-dom';

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

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 to-primary-700 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Generate Flashcards from Any Source
              </h1>
              <p className="mt-6 text-xl leading-8 text-primary-100">
                Transform text, web content, and documents into effective
                flashcards powered by advanced AI. Study smarter, not harder.
              </p>
              <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link
                  to="/register"
                  className="rounded-lg bg-white px-6 py-3 text-center text-lg font-semibold text-primary-700 shadow-sm hover:bg-primary-50"
                >
                  Get Started for Free
                </Link>
                <Link
                  to="/features"
                  className="rounded-lg border border-white px-6 py-3 text-center text-lg font-semibold text-white hover:bg-white/10"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative aspect-[4/3] w-full max-w-lg rounded-xl bg-white/5 p-4 shadow-2xl ring-1 ring-white/10 sm:p-6">
                <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-xl bg-primary-500 opacity-50 blur-xl"></div>
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-xl bg-secondary-500 opacity-50 blur-xl"></div>
                <div className="relative h-full w-full overflow-hidden rounded-lg">
                  <div className="flex h-full flex-col">
                    <div className="flex-1 overflow-y-auto">
                      <div className="grid grid-cols-1 gap-3 p-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-white/10 p-4 backdrop-blur-sm"
                          >
                            <div className="h-4 w-3/4 rounded bg-white/20"></div>
                            <div className="mt-3 h-3 w-full rounded bg-white/20"></div>
                            <div className="mt-2 h-3 w-4/5 rounded bg-white/20"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Everything You Need to Create Effective Flashcards
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
              Our intelligent platform handles the heavy lifting so you can focus
              on learning.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-b from-primary-800 to-primary-900 px-6 py-12 shadow-2xl sm:px-16 sm:py-16 md:max-w-3xl md:mx-auto">
            <div className="absolute -top-24 right-0 -z-10 h-64 w-64 rounded-full bg-primary-600 opacity-30 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 -z-10 h-64 w-64 rounded-full bg-secondary-600 opacity-30 blur-3xl"></div>
            
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Transform Your Learning?
              </h2>
              <p className="mt-4 max-w-xl text-lg text-primary-100">
                Join thousands of students and educators who have already
                improved their learning efficiency with our flashcard generator.
              </p>
              <div className="mt-8">
                <Link
                  to="/register"
                  className="rounded-lg bg-white px-6 py-3 text-center text-lg font-semibold text-primary-700 shadow-sm hover:bg-primary-50"
                >
                  Sign Up Now — It's Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 