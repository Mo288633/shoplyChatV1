import React, { useState } from 'react';
import { Layout } from '../app/layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, KeyRound, Bell, Globe, Shield, CreditCard, Receipt, Building2, Wallet, ExternalLink, HelpCircle, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AccountPageProps {
  onNavigateHome: () => void;
}

type Section = 'general' | 'billing' | 'invoices';

function AccountPage({ onNavigateHome }: AccountPageProps) {
  const [activeSection, setActiveSection] = useState<Section>('invoices');
  const [country, setCountry] = useState('US');

  const sections = [
    { id: 'general', label: 'General', icon: <Building2 className="h-4 w-4" /> },
    { id: 'billing', label: 'Billing', icon: <Wallet className="h-4 w-4" /> },
    { id: 'invoices', label: 'Invoices', icon: <Receipt className="h-4 w-4" /> },
  ] as const;

  const invoices = [
    { date: 'Feb 15, 2025', amount: '$0', number: 'SXEOJF-00002', status: 'Paid' },
    { date: 'Jan 15, 2025', amount: '$0', number: 'SXEOJF-00001', status: 'Paid' },
  ];

  return (
    <Layout showNavigation={false} showFooter={false}>
      <div className="min-h-screen bg-gray-50">
        <div className="h-screen">
          <header className="bg-white border-b">
            <div className="container mx-auto px-6 py-8">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Account Settings</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-2xl font-bold text-gray-900 mt-4">Account Settings</h1>
            </div>
          </header>

          <div className="container mx-auto px-6 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Navigation Tabs */}
              <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-8">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium flex-1",
                      activeSection === section.id
                        ? "bg-white text-gray-900 shadow"
                        : "text-gray-500 hover:text-gray-900"
                    )}
                  >
                    {section.icon}
                    {section.label}
                  </button>
                ))}
              </div>

              {/* General Section */}
              {activeSection === 'general' && (
                <div className="space-y-8">
                  {/* Profile Section */}
                  <section className="bg-white rounded-lg border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile</h2>
                    <div className="flex items-start gap-8">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage 
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                            alt="Profile" 
                          />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              First Name
                            </label>
                            <Input defaultValue="John" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              Last Name
                            </label>
                            <Input defaultValue="Doe" />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Email
                          </label>
                          <Input defaultValue="john@example.com" type="email" />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Quick Actions */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { icon: <KeyRound className="h-5 w-5" />, title: "Password", description: "Change your password" },
                      { icon: <Bell className="h-5 w-5" />, title: "Notifications", description: "Manage notifications" },
                      { icon: <Globe className="h-5 w-5" />, title: "Language", description: "Set your language" },
                      { icon: <Shield className="h-5 w-5" />, title: "Security", description: "2FA and security options" },
                    ].map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-start gap-2 hover:border-blue-600 hover:ring-1 hover:ring-blue-600 transition-all"
                      >
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          {action.icon}
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Billing Section */}
              {activeSection === 'billing' && (
                <div className="space-y-6">
                  {/* Subscription Plan */}
                  <section className="bg-white rounded-lg border p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Subscription Plan</h2>
                        <p className="text-sm text-gray-500 mt-1">More information</p>
                      </div>
                      <Button variant="outline" className="flex items-center gap-2">
                        Pricing
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b">
                      <div>
                        <div className="text-sm text-gray-500">This organization is currently on the plan:</div>
                        <div className="text-2xl font-semibold text-emerald-500 mt-1">FREE</div>
                      </div>
                      <Button>Change subscription plan</Button>
                    </div>
                  </section>

                  {/* Billing Breakdown */}
                  <section className="bg-white rounded-lg border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing Breakdown</h2>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-500">Current billing cycle:</div>
                        <div className="font-medium">Feb 15 - Mar 15</div>
                      </div>
                      
                      <div className="border rounded-lg divide-y">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">Free Plan</div>
                            <div className="font-medium">FREE</div>
                          </div>
                          <div className="text-sm text-gray-500">Basic features included</div>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              Current Costs
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="font-medium">$0</div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              Projected Costs
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="font-medium">$0</div>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        It may take up to an hour for addon changes or new projects to show up.
                      </div>
                    </div>
                  </section>

                  {/* Billing Address */}
                  <section className="bg-white rounded-lg border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Billing Address</h2>
                    <p className="text-sm text-gray-500 mb-6">
                      This will be reflected in every upcoming invoice, past invoices are not affected
                    </p>
                    
                    <form className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Address Line 1
                        </label>
                        <Input placeholder="Enter street address" />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Address Line 2
                        </label>
                        <Input placeholder="Apartment, suite, etc. (optional)" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Country
                          </label>
                          <Select value={country} onValueChange={setCountry}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="CA">Canada</SelectItem>
                              <SelectItem value="GB">United Kingdom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Postal Code
                          </label>
                          <Input placeholder="Enter postal code" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            City
                          </label>
                          <Input placeholder="Enter city" />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            State / Province
                          </label>
                          <Input placeholder="Enter state" />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-3">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Address</Button>
                      </div>
                    </form>
                  </section>

                  {/* Tax ID */}
                  <section className="bg-white rounded-lg border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Tax ID</h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Add a tax ID to your invoices. Changes only apply to future invoices.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Tax ID Type
                        </label>
                        <Select defaultValue="none">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tax ID type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="vat">VAT Number</SelectItem>
                            <SelectItem value="gst">GST Number</SelectItem>
                            <SelectItem value="abn">ABN</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-end gap-3">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Tax ID</Button>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* Invoices Section */}
              {activeSection === 'invoices' && (
                <div className="space-y-8">
                  <section className="bg-white rounded-lg border overflow-hidden">
                    {/* Billing Breakdown Header */}
                    <div className="p-6 border-b">
                      <h2 className="text-lg font-semibold text-gray-900">Billing Breakdown</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        The table shows your upcoming invoice, excluding credits. This invoice will continue
                        updating until the end of your billing period on March 15. See usage page for a more
                        detailed usage breakdown.
                      </p>
                    </div>

                    {/* Current Billing Table */}
                    <div className="px-6">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="py-4 text-left text-sm text-gray-500 font-medium">Item</th>
                            <th className="py-4 text-left text-sm text-gray-500 font-medium">Usage</th>
                            <th className="py-4 text-left text-sm text-gray-500 font-medium">Unit price</th>
                            <th className="py-4 text-right text-sm text-gray-500 font-medium">Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-4 text-sm text-gray-900">Free Plan</td>
                            <td className="py-4 text-sm text-gray-900">1</td>
                            <td className="py-4 text-sm text-gray-900">FREE</td>
                            <td className="py-4 text-sm text-gray-900 text-right">$0</td>
                          </tr>
                          <tr className="border-b">
                            <td colSpan={3} className="py-4 text-sm font-medium text-gray-900">Current Costs</td>
                            <td className="py-4 text-sm font-medium text-gray-900 text-right">$0</td>
                          </tr>
                          <tr>
                            <td colSpan={3} className="py-4 text-sm font-medium text-gray-900">Projected Costs</td>
                            <td className="py-4 text-sm font-medium text-gray-900 text-right">$0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Invoice History */}
                    <div className="border-t mt-8">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-6 py-4 text-left text-sm text-gray-500 font-medium">Date</th>
                            <th className="px-6 py-4 text-left text-sm text-gray-500 font-medium">Amount</th>
                            <th className="px-6 py-4 text-left text-sm text-gray-500 font-medium">Invoice number</th>
                            <th className="px-6 py-4 text-left text-sm text-gray-500 font-medium">Status</th>
                            <th className="px-6 py-4 text-right text-sm text-gray-500 font-medium">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.map((invoice, index) => (
                            <tr key={invoice.number} className={index !== invoices.length - 1 ? 'border-b' : ''}>
                              <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-3">
                                <Receipt className="h-4 w-4" />
                                {invoice.date}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{invoice.amount}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{invoice.number}</td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                  {invoice.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="px-6 py-4 border-t text-sm text-gray-500 flex items-center justify-between">
                        <div>Showing 1 to 2 out of 2 invoices</div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" disabled>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" disabled>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AccountPage;