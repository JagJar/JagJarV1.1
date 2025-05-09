import { MainLayout } from "@/layouts/main-layout";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExtensionPreview } from "@/components/extension-preview";
import { Clock, Shield, ChartBar, CreditCard } from "lucide-react";

export default function ExtensionPage() {
  return (
    <MainLayout>
      <Helmet>
        <title>Browser Extension - JagJar</title>
        <meta name="description" content="Install the JagJar Chrome browser extension to track your time on web applications and manage your subscription." />
        <meta property="og:title" content="JagJar Browser Extension" />
        <meta property="og:description" content="Track time on JagJar-enabled websites with our easy-to-use browser extension." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-neutral-800 mb-4">JagJar Browser Extension</h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Track your time on JagJar-enabled websites and manage your subscription with our easy-to-use Chrome extension.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ExtensionPreview />
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Why Use Our Extension?</h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-secondary-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Accurate Time Tracking</h3>
                    <p className="text-neutral-600">Our extension tracks only the active time you spend on JagJar-enabled websites, not background tabs.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-secondary-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Privacy-Focused</h3>
                    <p className="text-neutral-600">We only track the time you spend on JagJar sites, not your browsing history or personal data.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mr-4">
                    <CreditCard className="h-6 w-6 text-secondary-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Manage Your Subscription</h3>
                    <p className="text-neutral-600">Easily switch between free and premium plans directly from the extension.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mr-4">
                    <ChartBar className="h-6 w-6 text-secondary-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Usage Analytics</h3>
                    <p className="text-neutral-600">View your usage patterns and see which JagJar sites you spend the most time on.</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-left">
                <Button className="bg-neutral-800 hover:bg-neutral-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Extension
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">How It Works</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Understanding how JagJar tracks your time and helps support developers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <span className="text-primary-500 font-bold">1</span>
                </div>
                <CardTitle>Install Extension</CardTitle>
                <CardDescription>Download and install the JagJar Chrome extension</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Go to the Chrome Web Store and add the JagJar extension to your browser. It takes just a few seconds to install.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <span className="text-primary-500 font-bold">2</span>
                </div>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Sign up for a free JagJar account</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Create your free account to track your time across devices and manage your subscription preferences.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <span className="text-primary-500 font-bold">3</span>
                </div>
                <CardTitle>Browse Normally</CardTitle>
                <CardDescription>Use the web as you always do</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  The extension works in the background, tracking only time spent on JagJar-enabled websites. No changes to your browsing habits needed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg mb-8">Download the JagJar extension today and start supporting the developers you love.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-neutral-800 hover:bg-neutral-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download for Chrome
              </Button>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
