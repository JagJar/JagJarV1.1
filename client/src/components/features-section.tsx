import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Clock, LayoutGrid } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">How JagJar Works</h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            A simple, fair monetization system for web applications based on actual time spent by users.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* For Developers Card */}
          <Card className="bg-neutral-50 card-hover">
            <CardContent className="p-8">
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                <Code className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-3">For Developers</h3>
              <p className="text-neutral-600 mb-4">Generate an API key and integrate JagJar into your web application with a few lines of code.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Easy API integration</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Time tracking analytics</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Revenue share based on usage</span>
                </li>
              </ul>
              <Link href="/developers" className="text-primary-500 font-medium hover:text-primary-600 flex items-center">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </CardContent>
          </Card>
          
          {/* For Users Card */}
          <Card className="bg-neutral-50 card-hover">
            <CardContent className="p-8">
              <div className="w-14 h-14 rounded-full bg-secondary-100 flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-secondary-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-3">For Users</h3>
              <p className="text-neutral-600 mb-4">Install the JagJar browser extension on your favorite browser to access JagJar-enabled websites with time tracking.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Available for Chrome, Firefox, Safari & Edge</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free tier with monthly limit</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Premium for unlimited access</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Cross-device synchronization</span>
                </li>
              </ul>
              <Link href="/extension" className="text-secondary-500 font-medium hover:text-secondary-600 flex items-center">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </CardContent>
          </Card>
          
          {/* JagJar Platform Card */}
          <Card className="bg-neutral-50 card-hover">
            <CardContent className="p-8">
              <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center mb-6">
                <LayoutGrid className="h-6 w-6 text-neutral-700" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-3">JagJar Platform</h3>
              <p className="text-neutral-600 mb-4">The backbone that connects developers and users through fair, usage-based monetization.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Accurate time tracking</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Automated revenue sharing</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Detailed analytics dashboard</span>
                </li>
              </ul>
              <Link href="/pricing" className="text-neutral-700 font-medium hover:text-neutral-800 flex items-center">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-center">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=600" 
            alt="JagJar platform dashboard" 
            className="rounded-xl shadow-lg max-w-full" 
          />
        </div>
      </div>
    </section>
  );
}
