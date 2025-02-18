import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { persistenceManager } from '@/lib/persistence';
import { chatbotsCollection } from '@/lib/firebase';
import type { Chatbot } from '@/types/database';
import { Bot, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ChatbotFormData {
  name: string;
  description?: string;
  model: string;
  language: string;
  tone: string;
  personality: string;
  maxResponseLength: number;
  temperature: number;
}

const initialFormData: ChatbotFormData = {
  name: '',
  description: '',
  model: 'gpt-3.5-turbo',
  language: 'en',
  tone: 'professional',
  personality: 'helpful',
  maxResponseLength: 150,
  temperature: 0.7
};

export function ChatbotManager() {
  const { currentUser } = useAuth();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ChatbotFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<ChatbotFormData>>({});

  useEffect(() => {
    if (!currentUser) return;
    
    const loadChatbots = async () => {
      try {
        const userChatbots = await persistenceManager.query<Chatbot>(
          chatbotsCollection,
          [where('userId', '==', currentUser.uid)]
        );
        setChatbots(userChatbots);
      } catch (err) {
        setError('Failed to load chatbots. Please try again.');
        console.error('Error loading chatbots:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChatbots();
  }, [currentUser]);

  const validateForm = (): boolean => {
    const errors: Partial<ChatbotFormData> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (formData.maxResponseLength < 50 || formData.maxResponseLength > 500) {
      errors.maxResponseLength = 'Response length must be between 50 and 500';
    }
    
    if (formData.temperature < 0 || formData.temperature > 1) {
      errors.temperature = 'Temperature must be between 0 and 1';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateChatbot = async () => {
    if (!currentUser || !validateForm()) return;

    try {
      const newChatbot: Partial<Chatbot> = {
        userId: currentUser.uid,
        name: formData.name,
        description: formData.description,
        status: 'offline',
        model: formData.model,
        settings: {
          language: formData.language,
          tone: formData.tone,
          personality: formData.personality,
          maxResponseLength: formData.maxResponseLength,
          temperature: formData.temperature
        }
      };

      const chatbotId = await persistenceManager.create(chatbotsCollection, newChatbot);
      const createdChatbot = await persistenceManager.get<Chatbot>(chatbotsCollection, chatbotId);
      
      if (createdChatbot) {
        setChatbots(prev => [...prev, createdChatbot]);
        setIsCreateDialogOpen(false);
        setFormData(initialFormData);
      }
    } catch (err) {
      setError('Failed to create chatbot. Please try again.');
      console.error('Error creating chatbot:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 text-red-600 bg-red-50 rounded-lg">
        <AlertCircle className="h-5 w-5" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Chatbots</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Bot className="mr-2 h-4 w-4" />
          Create Chatbot
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chatbots.map((chatbot) => (
          <div
            key={chatbot.id}
            className="p-4 border rounded-lg hover:border-blue-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{chatbot.name}</h3>
                {chatbot.description && (
                  <p className="text-sm text-gray-600 mt-1">{chatbot.description}</p>
                )}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                chatbot.status === 'online' 
                  ? 'bg-green-100 text-green-700'
                  : chatbot.status === 'training'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {chatbot.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Chatbot</DialogTitle>
            <DialogDescription>
              Configure your chatbot's settings and personality.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                error={formErrors.name}
              />
              {formErrors.name && (
                <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Description (Optional)</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Model</label>
              <Select
                value={formData.model}
                onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Language</label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Tone</label>
                <Select
                  value={formData.tone}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Max Response Length</label>
              <Input
                type="number"
                value={formData.maxResponseLength}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  maxResponseLength: parseInt(e.target.value) 
                }))}
                error={formErrors.maxResponseLength}
              />
              {formErrors.maxResponseLength && (
                <p className="text-sm text-red-600 mt-1">{formErrors.maxResponseLength}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Temperature</label>
              <Input
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  temperature: parseFloat(e.target.value) 
                }))}
                error={formErrors.temperature}
              />
              {formErrors.temperature && (
                <p className="text-sm text-red-600 mt-1">{formErrors.temperature}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateChatbot}>
              Create Chatbot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}