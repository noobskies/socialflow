
import React, { useState } from 'react';
import { Zap, ShoppingBag, MessageSquare, Rss, Plus, ArrowRight, Power, CheckCircle2, Bot, Loader2, Slack, Globe, Mail } from 'lucide-react';
import { Workflow, Integration } from '../types';
import { suggestWorkflows } from '../services/geminiService';

// Mock Data
const MOCK_INTEGRATIONS: Integration[] = [
  { id: '1', name: 'Shopify', category: 'ecommerce', icon: 'shopping-bag', connected: true },
  { id: '2', name: 'Slack', category: 'communication', icon: 'slack', connected: false },
  { id: '3', name: 'WordPress', category: 'content', icon: 'globe', connected: true },
  { id: '4', name: 'Mailchimp', category: 'communication', icon: 'mail', connected: false },
];

const MOCK_WORKFLOWS: Workflow[] = [
  { 
    id: '1', 
    name: 'Promote New Products', 
    description: 'When a new product is added to Shopify, generate and schedule a post.',
    trigger: 'New Shopify Product',
    action: 'Draft Social Post',
    active: true,
    stats: { runs: 12, lastRun: '2 hours ago' },
    icon: 'shopping-bag'
  },
  { 
    id: '2', 
    name: 'Blog Cross-Post', 
    description: 'Auto-share new WordPress posts to LinkedIn and Twitter.',
    trigger: 'New WP Post',
    action: 'Publish to Socials',
    active: true,
    stats: { runs: 45, lastRun: '1 day ago' },
    icon: 'globe'
  },
  { 
    id: '3', 
    name: 'Negative Sentiment Alert', 
    description: 'If a comment has negative sentiment, send a Slack notification.',
    trigger: 'Negative Comment',
    action: 'Notify Team',
    active: false,
    stats: { runs: 0, lastRun: 'Never' },
    icon: 'alert-triangle'
  }
];

const Automations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workflows' | 'integrations'>('workflows');
  const [workflows, setWorkflows] = useState<Workflow[]>(MOCK_WORKFLOWS);
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);
  
  // AI Suggestions
  const [businessType, setBusinessType] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id ? { ...w, active: !w.active } : w
    ));
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(i => 
      i.id === id ? { ...i, connected: !i.connected } : i
    ));
  };

  const handleAiSuggest = async () => {
    if (!businessType) return;
    setIsSuggesting(true);
    const newSuggestions = await suggestWorkflows(businessType);
    setSuggestions(newSuggestions);
    setIsSuggesting(false);
  };

  const addSuggestion = (s: any) => {
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: s.name,
      description: s.description,
      trigger: s.trigger,
      action: s.action,
      active: false,
      stats: { runs: 0, lastRun: 'Never' },
      icon: 'zap'
    };
    setWorkflows([...workflows, newWorkflow]);
    setSuggestions(suggestions.filter(item => item !== s));
  };

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Automations</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Supercharge your workflow with integrations and rules</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
          <button 
            onClick={() => setActiveTab('workflows')}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'workflows' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Zap className="w-4 h-4 mr-2" />
            Workflows
          </button>
          <button 
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'integrations' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Globe className="w-4 h-4 mr-2" />
            Integrations
          </button>
        </div>
      </div>

      {activeTab === 'workflows' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          {/* Main Workflow List */}
          <div className="lg:col-span-2 space-y-6">
            {workflows.map((workflow) => (
              <div key={workflow.id} className={`bg-white dark:bg-slate-900 p-6 rounded-xl border transition-all duration-200 ${workflow.active ? 'border-indigo-200 dark:border-indigo-900/50 shadow-sm' : 'border-slate-200 dark:border-slate-800 opacity-75'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${workflow.active ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                      {workflow.icon === 'shopping-bag' && <ShoppingBag className="w-6 h-6" />}
                      {workflow.icon === 'globe' && <Globe className="w-6 h-6" />}
                      {workflow.icon === 'alert-triangle' && <MessageSquare className="w-6 h-6" />}
                      {workflow.icon === 'zap' && <Zap className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{workflow.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{workflow.description}</p>
                      <div className="flex items-center gap-3 text-xs font-medium">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 flex items-center">
                          If: {workflow.trigger}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 flex items-center">
                          Then: {workflow.action}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <button 
                      onClick={() => toggleWorkflow(workflow.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${workflow.active ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${workflow.active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    {workflow.active && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </span>
                    )}
                  </div>
                </div>
                {workflow.active && (
                   <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex gap-4 text-xs text-slate-400">
                      <span>Runs: {workflow.stats.runs}</span>
                      <span>Last Run: {workflow.stats.lastRun}</span>
                   </div>
                )}
              </div>
            ))}
            
            <button className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-medium hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
              <Plus className="w-5 h-5 mr-2" />
              Build Custom Workflow
            </button>
          </div>

          {/* Sidebar: AI Suggestions */}
          <div className="space-y-6">
             <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                   <Bot className="w-6 h-6 text-indigo-200" />
                   <h3 className="font-bold text-lg">AI Architect</h3>
                </div>
                <p className="text-indigo-100 text-sm mb-4">Tell me about your business, and I'll design the perfect automation strategy.</p>
                
                <div className="flex gap-2 mb-4">
                   <input 
                      type="text" 
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      placeholder="e.g. Coffee Shop, SaaS, Gym"
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-indigo-200 outline-none focus:bg-white/20"
                   />
                   <button 
                     onClick={handleAiSuggest}
                     disabled={!businessType || isSuggesting}
                     className="bg-white text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-50"
                   >
                     {isSuggesting ? <Loader2 className="w-5 h-5 animate-spin"/> : <Zap className="w-5 h-5" />}
                   </button>
                </div>

                {suggestions.length > 0 && (
                  <div className="space-y-3">
                    {suggestions.map((s, i) => (
                      <div key={i} className="bg-white/10 border border-white/10 rounded-lg p-3 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
                         <h4 className="font-bold text-sm">{s.name}</h4>
                         <p className="text-xs text-indigo-100 mb-2 opacity-80">{s.description}</p>
                         <button 
                           onClick={() => addSuggestion(s)}
                           className="w-full py-1.5 bg-indigo-500 hover:bg-indigo-400 rounded text-xs font-bold transition-colors"
                         >
                           Add Workflow
                         </button>
                      </div>
                    ))}
                  </div>
                )}
             </div>
             
             <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Popular Templates</h3>
                <div className="space-y-3">
                   {['RSS to Twitter', 'Instagram to Pinterest', 'Welcome New Followers'].map((t, i) => (
                     <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer group">
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{t}</span>
                        <Plus className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
           {integrations.map(integration => (
             <div key={integration.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center relative overflow-hidden group hover:shadow-md transition-all">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${integration.connected ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                   {integration.icon === 'shopping-bag' && <ShoppingBag className="w-8 h-8" />}
                   {integration.icon === 'slack' && <Slack className="w-8 h-8" />}
                   {integration.icon === 'globe' && <Globe className="w-8 h-8" />}
                   {integration.icon === 'mail' && <Mail className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{integration.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 capitalize mb-6">{integration.category}</p>
                
                <button 
                  onClick={() => toggleIntegration(integration.id)}
                  className={`w-full py-2.5 rounded-lg font-semibold transition-colors ${
                    integration.connected 
                    ? 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-900' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {integration.connected ? 'Manage Connection' : 'Connect App'}
                </button>

                {integration.connected && (
                   <div className="absolute top-4 right-4 text-emerald-500">
                      <CheckCircle2 className="w-5 h-5" />
                   </div>
                )}
             </div>
           ))}
           
           <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
              <Plus className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4 group-hover:text-indigo-500 transition-colors" />
              <h3 className="font-bold text-slate-600 dark:text-slate-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-400">Request Integration</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Don't see your tool?</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default Automations;
