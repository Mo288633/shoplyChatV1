import React, { useState } from 'react';
import { Layout } from '../app/layout';
import { Search, ChevronRight, FileText, Book, Lightbulb, Wrench, Zap, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface DocsPageProps {
  onSignIn?: () => void;
  onNavigate?: (page: string) => void;
  isAuthenticated?: boolean;
}

const guides = [
  { icon: <Book className="h-5 w-5" />, title: "Getting Started", description: "Quick start guide to set up your first chatbot" },
  { icon: <Lightbulb className="h-5 w-5" />, title: "Best Practices", description: "Learn how to build effective conversational flows" },
  { icon: <Wrench className="h-5 w-5" />, title: "Configuration", description: "Detailed configuration options and customization" },
  { icon: <Zap className="h-5 w-5" />, title: "AI Features", description: "Advanced AI capabilities and implementation" },
  { icon: <Lock className="h-5 w-5" />, title: "Security", description: "Security best practices and compliance" },
  { icon: <FileText className="h-5 w-5" />, title: "API Reference", description: "Complete API documentation and examples" },
];

export default function DocsPage({ onSignIn, onNavigate, isAuthenticated }: DocsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout onSignIn={onSignIn} onNavigate={onNavigate} isAuthenticated={isAuthenticated}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-6 py-16">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbSeparator />
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbPage>Documentation</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-8 max-w-4xl">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
              <p className="text-lg text-gray-600 mb-8">
                Everything you need to know about building conversational commerce experiences with Shoply.
              </p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="search"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-lg w-full max-w-2xl"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-16">
          {/* Popular Guides */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Guides</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-start gap-4 hover:border-blue-600 hover:ring-1 hover:ring-blue-600 transition-all"
                >
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    {guide.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      {guide.title}
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </h3>
                    <p className="text-sm text-gray-600">{guide.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </section>

          {/* Recent Updates */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Recent Updates</h2>
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                View changelog
              </Button>
            </div>
            <div className="space-y-6">
              {[
                {
                  version: "v2.4.0",
                  date: "March 15, 2025",
                  title: "Enhanced AI Models and Performance Improvements",
                  description: "Introducing new AI models for better understanding of customer intent and improved response generation."
                },
                {
                  version: "v2.3.2",
                  date: "March 8, 2025",
                  title: "Bug Fixes and Security Updates",
                  description: "Fixed several minor bugs and enhanced security measures for data protection."
                },
                {
                  version: "v2.3.0",
                  date: "February 28, 2025",
                  title: "Multi-language Support",
                  description: "Added support for 10 new languages and improved translation accuracy."
                }
              ].map((update, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border hover:border-blue-600 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {update.version}
                      </span>
                      <span className="text-sm text-gray-500">{update.date}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Read more
                    </Button>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{update.title}</h3>
                  <p className="text-sm text-gray-600">{update.description}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}