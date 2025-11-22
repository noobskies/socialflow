
import React from 'react';
import { X, Check, Star, Zap, Shield } from 'lucide-react';
import { PlanTier } from '../types';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PlanTier;
  onUpgrade: (plan: PlanTier) => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, currentPlan, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
        
        {/* Header / Sidebar (Mobile/Desktop) */}
        <div className="bg-indigo-600 p-8 md:w-1/4 flex flex-col justify-between text-white relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Unlock Your Potential</h2>
              <p className="text-indigo-100 mb-8">Upgrade to access advanced AI tools, unlimited scheduling, and agency features.</p>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg"><Zap className="w-5 h-5" /></div>
                    <span className="font-medium">Unlimited AI</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg"><Star className="w-5 h-5" /></div>
                    <span className="font-medium">Competitor Analysis</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg"><Shield className="w-5 h-5" /></div>
                    <span className="font-medium">White-Labeling</span>
                 </div>
              </div>
           </div>
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500 to-indigo-700 opacity-50"></div>
           <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-400 rounded-full blur-3xl opacity-30"></div>
        </div>

        {/* Plans Grid */}
        <div className="flex-1 p-6 md:p-8 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Choose your plan</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                 <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Free Plan */}
              <div className={`p-6 rounded-2xl border ${currentPlan === 'free' ? 'border-indigo-500 ring-1 ring-indigo-500 bg-white dark:bg-slate-900' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'} flex flex-col`}>
                 <div className="mb-4">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Free</h4>
                    <p className="text-2xl font-bold mt-2">$0 <span className="text-sm font-normal text-slate-500">/mo</span></p>
                    <p className="text-xs text-slate-500 mt-1">Forever free</p>
                 </div>
                 <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-8 flex-1">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 3 Social Accounts</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 10 AI Credits/mo</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Basic Scheduling</li>
                 </ul>
                 <button 
                   onClick={() => onUpgrade('free')}
                   disabled={currentPlan === 'free'}
                   className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors ${currentPlan === 'free' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default' : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700'}`}
                 >
                    {currentPlan === 'free' ? 'Current Plan' : 'Downgrade'}
                 </button>
              </div>

              {/* Pro Plan */}
              <div className={`p-6 rounded-2xl border relative ${currentPlan === 'pro' ? 'border-indigo-500 ring-1 ring-indigo-500 bg-white dark:bg-slate-900' : 'border-indigo-200 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-900/10'} flex flex-col`}>
                 {currentPlan !== 'pro' && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>}
                 <div className="mb-4">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Pro</h4>
                    <p className="text-2xl font-bold mt-2 text-indigo-600 dark:text-indigo-400">$15 <span className="text-sm font-normal text-slate-500">/mo</span></p>
                    <p className="text-xs text-slate-500 mt-1">For growing creators</p>
                 </div>
                 <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-8 flex-1">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-indigo-500 shrink-0" /> 10 Social Accounts</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-indigo-500 shrink-0" /> 100 AI Credits/mo</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-indigo-500 shrink-0" /> Advanced Analytics</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-indigo-500 shrink-0" /> Link in Bio Pro</li>
                 </ul>
                 <button 
                   onClick={() => onUpgrade('pro')}
                   disabled={currentPlan === 'pro'}
                   className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors ${currentPlan === 'pro' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30'}`}
                 >
                    {currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
                 </button>
              </div>

              {/* Agency Plan */}
              <div className={`p-6 rounded-2xl border ${currentPlan === 'agency' ? 'border-indigo-500 ring-1 ring-indigo-500 bg-white dark:bg-slate-900' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'} flex flex-col`}>
                 <div className="mb-4">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Agency</h4>
                    <p className="text-2xl font-bold mt-2">$45 <span className="text-sm font-normal text-slate-500">/mo</span></p>
                    <p className="text-xs text-slate-500 mt-1">For teams & businesses</p>
                 </div>
                 <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-8 flex-1">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 25 Social Accounts</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Unlimited AI</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> White-Label Reports</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Team Collaboration</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> API Access</li>
                 </ul>
                 <button 
                   onClick={() => onUpgrade('agency')}
                   disabled={currentPlan === 'agency'}
                   className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors ${currentPlan === 'agency' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default' : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800'}`}
                 >
                    {currentPlan === 'agency' ? 'Current Plan' : 'Upgrade to Agency'}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
