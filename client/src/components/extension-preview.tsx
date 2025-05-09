import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function ExtensionPreview() {
  return (
    <div className="bg-neutral-100 rounded-xl p-8 relative overflow-hidden shadow-lg">
      {/* Extension icon preview */}
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 rounded-xl shadow-md bg-primary-500 gradient-bg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-center mb-6">JagJar Time Tracker</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 text-center shadow">
          <div className="text-3xl font-bold text-primary-500 mb-2">42:15</div>
          <div className="text-sm text-neutral-600">Time Used This Month</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center shadow">
          <div className="text-3xl font-bold text-secondary-500 mb-2">5</div>
          <div className="text-sm text-neutral-600">JagJar Sites Visited</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Monthly Limit (Free Plan)</span>
          <span className="text-sm text-neutral-500">70% used</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2.5">
          <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
        </div>
        <div className="mt-2 text-sm text-neutral-500 text-right">42:15 / 60:00 hours</div>
      </div>
      
      <div className="text-center">
        <Link href="/pricing">
          <Button className="bg-secondary-500 hover:bg-secondary-600">
            Upgrade to Premium
          </Button>
        </Link>
      </div>
      
      {/* Chrome Web Store badge */}
      <div className="absolute bottom-4 right-4">
        <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">Chrome Web Store</div>
      </div>
    </div>
  );
}
