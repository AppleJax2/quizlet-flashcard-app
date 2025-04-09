import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/90 via-white to-primary-50/80 -z-10"></div>
        <div className="absolute top-24 right-0 w-80 h-80 rounded-full bg-primary-100 opacity-60 blur-[100px] -z-10"></div>
        <div className="absolute -left-20 top-80 w-60 h-60 rounded-full bg-accent-50 opacity-50 blur-[80px] -z-10"></div>
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[length:20px_20px] -z-10"></div>
        
        <div className="container px-4 mx-auto max-w-6xl relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex mb-5 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium">
                <span className="flex items-center">
                  <svg className="mr-1.5 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.99991 19.9999L4.99991 16.9999H4.00003C3.47249 16.9999 2.95138 16.8025 2.51249 16.4317C2.07359 16.0608 1.7501 15.5606 1.58613 15.0004C1.42217 14.4401 1.4258 13.8454 1.59661 13.2873C1.76743 12.7293 2.09683 12.2336 2.54 11.87L6.55991 8.63996C6.85227 8.40001 7.19267 8.23048 7.55582 8.14525C7.91897 8.06002 8.29573 8.06152 8.6581 8.14963C9.02046 8.23774 9.35923 8.40996 9.64931 8.65215C9.93939 8.89435 10.1729 9.20092 10.332 9.54656" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.2881 18.1702C15.5809 18.5171 15.9453 18.7908 16.3524 18.9723C16.7594 19.1538 17.199 19.2386 17.6417 19.2203C18.0844 19.202 18.5167 19.0811 18.9087 18.8671C19.3007 18.6531 19.6429 18.3512 19.9085 17.9845L21.5219 16.0252C21.7934 15.6988 21.9825 15.3162 22.0751 14.9096C22.1677 14.5029 22.1616 14.0822 22.0572 13.6786C21.9528 13.275 21.7529 12.8987 21.4723 12.5811C21.1917 12.2634 20.8379 12.013 20.4392 11.8487" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.2349 13.8456L18.5261 9.55438" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.5823 10.0178L5.97704 5.41255" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Learn Faster, Remember Longer
                </span>
              </div>
              
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
                Boost your learning journey with <span className="relative text-primary-600">FlashLeap<span className="absolute bottom-1 left-0 w-full h-3 bg-primary-100 -z-10"></span></span>
              </h1>
              
              <p className="text-lg text-secondary-700 mb-8 max-w-lg mx-auto lg:mx-0">
                Create, share, and master flashcards that help you learn any subject effortlessly. Experience the power of spaced repetition learning.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button
                  as={Link}
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  variant="primary"
                  size="lg"
                  className="shadow-lg shadow-primary-500/20"
                  rightIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                </Button>
                
                <Button
                  as="a"
                  href="#how-it-works"
                  variant="outline"
                  size="lg"
                  className="border-secondary-300"
                >
                  Learn More
                </Button>
              </div>
              
              <div className="mt-10 flex items-center justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                      style={{ 
                        background: `hsl(${100 + i * 30}, ${60 + i * 5}%, ${50 + i * 5}%)`,
                        zIndex: 6 - i
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-white text-xs font-medium">
                        {String.fromCharCode(64 + i)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <div className="font-medium text-secondary-900">Trusted by 10,000+ learners</div>
                  <div className="text-sm text-secondary-600">From students to professionals</div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 relative">
              <div className="relative mx-auto w-full max-w-md">
                {/* Abstract decorative elements */}
                <div className="absolute top-0 -right-4 h-24 w-24 rounded-full bg-accent-200 opacity-30 -z-10"></div>
                <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-primary-200 opacity-30 -z-10"></div>
                
                {/* Flashcard Preview */}
                <div className="relative max-w-md mx-auto perspective-1000">
                  <div className="transform rotate-6 translate-y-4 translate-x-2 shadow-2xl">
                    <Card className="bg-white h-52 p-5 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs text-secondary-600 mb-1">BIOLOGY</div>
                        <div className="text-xl font-semibold text-secondary-900">What are the phases of mitosis?</div>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="transform -rotate-3 -translate-y-48 shadow-2xl">
                    <Card className="bg-secondary-50 h-52 p-5 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs text-secondary-600 mb-1">ANSWER</div>
                        <div className="text-lg font-medium text-secondary-900">Prophase, Metaphase, Anaphase, Telophase</div>
                        <div className="mt-4 flex justify-center gap-2">
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Hard</span>
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">Biology</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex mb-3 px-4 py-1.5 rounded-full bg-secondary-50 border border-secondary-100 text-secondary-700 text-sm font-medium">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                  <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914z" />
                  <path d="M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.472 9 8.998v2.24c0 1.519 1.147 2.839 2.711 2.935.214.013.428.024.642.034.2.009.385.09.518.224l2.35 2.35a.75.75 0 001.28-.531v-2.07c1.453-.195 2.5-1.463 2.5-2.915V8.998c0-1.526-1.157-2.85-2.729-2.936A41.645 41.645 0 0014 6z" />
                </svg>
                Key Features
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-secondary-900 mb-4">Why Choose FlashLeap?</h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Our platform is designed to help you learn and retain information effectively using proven learning techniques.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Customizable Flashcards</h3>
                <p className="text-secondary-600 mb-4">
                  Create personalized flashcards with rich text, images, and formatting options to match your learning style.
                </p>
                <ul className="space-y-2">
                  {['Rich text editor', 'Image support', 'Custom categories', 'Tags and labels'].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary-600 mr-2">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-secondary-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Feature Card 2 */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center text-accent-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Spaced Repetition</h3>
                <p className="text-secondary-600 mb-4">
                  Our intelligent algorithm schedules review sessions at optimal intervals to maximize long-term retention.
                </p>
                <ul className="space-y-2">
                  {['Smart scheduling', 'Forgetting curve algorithm', 'Progress tracking', 'Dynamic difficulty'].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-accent-600 mr-2">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-secondary-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Feature Card 3 */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 w-12 h-12 rounded-lg bg-secondary-100 flex items-center justify-center text-secondary-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Collaborative Learning</h3>
                <p className="text-secondary-600 mb-4">
                  Share decks with friends, classmates, or study groups. Learn together and motivate each other.
                </p>
                <ul className="space-y-2">
                  {['Shared decks', 'Real-time collaboration', 'Study groups', 'Discussion threads'].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-secondary-600 mr-2">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-secondary-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        <div className="container px-4 mx-auto max-w-6xl relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to transform your learning experience?
            </h2>
            <p className="text-lg md:text-xl text-primary-50 mb-8">
              Join thousands of students, teachers, and professionals using FlashLeap to achieve their learning goals.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                as={Link}
                to="/register"
                variant="secondary"
                size="lg"
                className="shadow-lg shadow-primary-700/20 bg-white text-primary-600 hover:bg-primary-50"
              >
                Get Started Free
              </Button>
              
              <Button
                as={Link}
                to="/login"
                variant="outline"
                size="lg"
                className="border-primary-200 text-white hover:bg-primary-400/20"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 