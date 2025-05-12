import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowUpRight, 
  ChevronLeft, 
  ChevronRight, 
  Code, 
  Clock, 
  LayoutGrid 
} from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
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
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 bg-neutral-50 border-b flex items-center justify-between">
            <div className="flex items-center">
              <LayoutGrid className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="font-medium text-neutral-800">Developer Analytics Dashboard</h3>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-neutral-50 rounded-lg p-4 border">
                <div className="text-sm text-neutral-500 mb-1">Total Time Tracked</div>
                <div className="text-2xl font-bold text-neutral-800">5,280 hrs</div>
                <div className="mt-4 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="bg-neutral-50 rounded-lg p-4 border">
                <div className="text-sm text-neutral-500 mb-1">Monthly Revenue</div>
                <div className="text-2xl font-bold text-neutral-800">$2,475</div>
                <div className="mt-4 flex items-center text-xs text-green-500">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                  <span>+12.5% from last month</span>
                </div>
              </div>
              
              <div className="bg-neutral-50 rounded-lg p-4 border">
                <div className="text-sm text-neutral-500 mb-1">Active Websites</div>
                <div className="text-2xl font-bold text-neutral-800">24</div>
                <div className="mt-4 text-xs text-neutral-500">
                  <span className="text-primary-500 font-medium">8 premium</span> websites contributing to revenue
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-lg border mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Time Distribution by Website</h4>
                <div className="text-xs text-neutral-500">Last 30 days</div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CodeEditor Pro</span>
                    <span className="font-medium">32%</span>
                  </div>
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>DesignStudio</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-500 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>TaskMaster Pro</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>DevCollab</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="text-neutral-500">View full analytics in dashboard →</div>
              <div className="flex space-x-2">
                <div className="bg-neutral-100 p-1 rounded">
                  <ChevronLeft className="h-4 w-4 text-neutral-500" />
                </div>
                <div className="bg-neutral-100 p-1 rounded">
                  <ChevronRight className="h-4 w-4 text-neutral-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
