import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Clock, DollarSign, LayoutDashboard, LineChart, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary-500 opacity-5 -skew-y-6 transform origin-top-left"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">
              Monetize Your Web Applications with <span className="text-primary-500">JagJar</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              The simple way to earn revenue based on actual user engagement. Integrated time tracking, browser extension, and developer API all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/developers">
                <Button size="lg" className="shadow-lg hover:shadow-xl">
                  For Developers
                </Button>
              </Link>
              <Link href="/extension">
                <Button size="lg" variant="outline" className="shadow-lg hover:shadow-xl">
                  Get Browser Extension
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-xl shadow-2xl p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <LayoutDashboard className="h-6 w-6 text-primary-500 mr-2" />
                  <h3 className="font-semibold text-neutral-800">JagJar Analytics Dashboard</h3>
                </div>
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Live</div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                <Card className="shadow-sm border border-neutral-200">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-neutral-500">Total Time</div>
                        <div className="text-lg font-bold">842 hrs</div>
                      </div>
                      <Clock className="h-6 w-6 text-primary-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm border border-neutral-200">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-neutral-500">Active Users</div>
                        <div className="text-lg font-bold">1,248</div>
                      </div>
                      <Users className="h-6 w-6 text-secondary-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm border border-neutral-200">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-neutral-500">Earnings</div>
                        <div className="text-lg font-bold">$1,423</div>
                      </div>
                      <DollarSign className="h-6 w-6 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-5 gap-2 h-16 bg-neutral-50 rounded-lg overflow-hidden mb-4">
                {[30, 45, 25, 60, 40, 70, 55, 65, 50, 80].map((value, index) => (
                  <div key={index} className="flex items-end">
                    <div 
                      className="w-full bg-primary-500 rounded-t-sm"
                      style={{ height: `${value}%` }}
                    ></div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-neutral-700">Top Applications</h4>
                <BarChart className="h-4 w-4 text-neutral-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary-500 mr-2"></div>
                    <span className="text-xs">CodeJar App</span>
                  </div>
                  <span className="text-xs">42%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-secondary-500 mr-2"></div>
                    <span className="text-xs">DevStream</span>
                  </div>
                  <span className="text-xs">28%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-xs">WebStudio Pro</span>
                  </div>
                  <span className="text-xs">18%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
