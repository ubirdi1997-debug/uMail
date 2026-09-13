import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Inbox, ShieldAlert, FileText, Rss, Send, Settings,
  Search, PenSquare, Activity, Sparkles, Calendar,
  X, ChevronDown, Reply, ShieldCheck, Tag,
  Maximize2, EyeOff, Menu, ChevronLeft, Archive,
  Trash2, Plus, Edit2, Database, Cpu, Network, Fingerprint, Lock
} from 'lucide-react';
import { EmailThread, AccountOrigin, Workspace } from '../types';
import { mockThreads } from '../data';

export default function UMailWorkspace() {
  const [activeAccount, setActiveAccount] = useState<AccountOrigin | 'all'>('all');
  const [activeFolder, setActiveFolder] = useState<'imbox' | 'screener' | 'paper-trail' | 'the-feed'>('imbox');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [dismissedAura, setDismissedAura] = useState<Record<string, boolean>>({});
  
  // Workspace & Settings State
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: 'primary', label: 'Primary' },
    { id: 'social', label: 'Social' },
    { id: 'promotions', label: 'Promotions' }
  ]);
  const [workspaceViewMode, setWorkspaceViewMode] = useState<'unified' | 'separate'>('separate');
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  // AI Feature State
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [showAiSummary, setShowAiSummary] = useState(false);

  const [viewMode, setViewMode] = useState<'focus' | 'accordion'>('focus');
  const [isComposing, setIsComposing] = useState(false);
  const [composeText, setComposeText] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (!isInput && e.key === 'v') {
        e.preventDefault();
        setViewMode(v => v === 'focus' ? 'accordion' : 'focus');
      }
      
      if (e.key === '\\' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsComposing(prev => !prev);
      }

      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsComposing(prev => {
          if (!prev) {
            setActiveThreadId(null);
          }
          return false;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredThreads = mockThreads.filter(t => {
    const matchesAccount = activeAccount === 'all' || t.origin === activeAccount;
    const matchesFolder = t.folder === activeFolder;
    const matchesWorkspace = workspaceViewMode === 'unified' || activeWorkspaceId === 'all' || t.workspaceId === activeWorkspaceId;
    return matchesAccount && matchesFolder && matchesWorkspace;
  });

  const activeThread = activeThreadId ? mockThreads.find(t => t.id === activeThreadId) : null;
  const showAuraBanner = activeThread?.aiActions && activeThread.aiActions.length > 0 && !dismissedAura[activeThread.id];

  return (
    <div className="flex h-screen w-full bg-[#0E0E10] text-gray-300 font-sans overflow-hidden selection:bg-[#7E78D2]/30">
      
      {/* Settings Modal Overlay */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E0E10]/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#14161D] border border-[#232836] rounded-[22px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#232836] bg-[#181A22]">
                <h3 className="text-lg font-medium text-gray-200 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#DDA15E]" />
                  Preferences
                </h3>
                <button onClick={() => setIsSettingsOpen(false)} className="text-gray-500 hover:text-white p-1 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh]">
                {/* View Mode Architecture */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Inbox Architecture</h4>
                  <div className="flex bg-[#0E0E10] border border-[#232836] rounded-[14px] p-1">
                    <button 
                      onClick={() => setWorkspaceViewMode('unified')}
                      className={`flex-1 py-2 text-sm font-medium rounded-[10px] transition-colors ${workspaceViewMode === 'unified' ? 'bg-[#232836] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      Unified View
                    </button>
                    <button 
                      onClick={() => setWorkspaceViewMode('separate')}
                      className={`flex-1 py-2 text-sm font-medium rounded-[10px] transition-colors ${workspaceViewMode === 'separate' ? 'bg-[#232836] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      Separate Workspaces
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {workspaceViewMode === 'unified' 
                      ? 'All emails flow into a single master stream regardless of their workspace categorization.' 
                      : 'Emails are categorized into highly focused tabs, allowing you to isolate contexts.'}
                  </p>
                </div>

                {/* Workspace Management */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Custom Workspaces</h4>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {workspaces.map(ws => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          key={ws.id} 
                          className="flex items-center justify-between bg-[#181A22] border border-[#232836] p-3 rounded-[14px] overflow-hidden"
                        >
                          <span className="text-sm font-medium text-gray-300 truncate pr-4">{ws.label}</span>
                          <div className="flex gap-1 shrink-0">
                            <button 
                              onClick={() => {
                                const newLabel = prompt('Rename workspace:', ws.label);
                                if (newLabel && newLabel.trim()) {
                                  setWorkspaces(workspaces.map(w => w.id === ws.id ? { ...w, label: newLabel.trim() } : w));
                                }
                              }}
                              className="p-1.5 text-gray-500 hover:text-[#DDA15E] transition-colors rounded-lg hover:bg-[#232836]"
                              title="Rename Workspace"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setWorkspaces(workspaces.filter(w => w.id !== ws.id))}
                              className="p-1.5 text-gray-500 hover:text-[#E07A5F] transition-colors rounded-lg hover:bg-[#232836]"
                              title="Delete Workspace"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newWorkspaceName.trim()) {
                        const id = newWorkspaceName.toLowerCase().replace(/\\s+/g, '-');
                        if (!workspaces.find(w => w.id === id)) {
                          setWorkspaces([...workspaces, { id, label: newWorkspaceName.trim() }]);
                          setNewWorkspaceName('');
                        }
                      }
                    }}
                    className="flex items-center gap-2 mt-4"
                  >
                    <input 
                      type="text" 
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      placeholder="New workspace name..."
                      className="flex-1 bg-[#0E0E10] border border-[#232836] rounded-[12px] py-2 px-3 text-sm text-gray-200 focus:outline-none focus:border-[#DDA15E] transition-colors"
                    />
                    <button 
                      type="submit"
                      disabled={!newWorkspaceName.trim()}
                      className="p-2 bg-[#232836] text-white rounded-[12px] hover:bg-[#32394d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Save Footer */}
              <div className="p-4 border-t border-[#232836] bg-[#181A22] flex justify-end">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-6 py-2.5 rounded-[12px] bg-gradient-to-r from-[#DDA15E] to-[#E07A5F] text-[#0E0E10] font-bold text-sm shadow-[0_0_15px_rgba(221,161,94,0.3)] hover:shadow-[0_0_20px_rgba(221,161,94,0.5)] transition-all active:scale-95"
                >
                  Save & Apply Config
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#0E0E10]/80 z-30 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebars (Dock & Folders) */}
      <div className={`fixed inset-y-0 left-0 z-40 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex h-full lg:static shadow-2xl lg:shadow-none`}>
        {/* Global Sovereign Dock */}
        <nav className="w-[72px] shrink-0 bg-[#0E0E10] border-r border-[#232836] flex flex-col items-center py-6 relative">
          
          {/* High-end Geometric Logo */}
          <div className="relative group cursor-pointer mb-10">
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#DDA15E]/40 to-[#E07A5F]/40 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#1A1D24] to-[#0E0E10] border border-[#232836] shadow-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
              <div className="w-6 h-6 border-[3px] border-[#DDA15E] rounded-b-xl border-t-0 shadow-[0_4px_10px_rgba(221,161,94,0.3)] relative flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#E07A5F] rounded-full absolute -top-1" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 flex-1 w-full items-center">
            <DockButton icon={<Inbox />} active />
            <DockButton icon={<Send />} />
            <DockButton icon={<Archive />} />
          </div>
          <div className="flex flex-col gap-6 w-full items-center mb-4">
            <button className="text-[#52B788] hover:bg-[#52B788]/10 p-3 rounded-[14px] transition-colors group relative">
              <Activity className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#52B788] rounded-full animate-ping"></span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#52B788] rounded-full"></span>
            </button>
            <DockButton icon={<Settings />} onClick={() => setIsSettingsOpen(true)} title="Preferences" />
            <button className="text-[#E07A5F] hover:bg-[#E07A5F]/10 p-3 rounded-[14px] transition-colors mt-2" title="Duress Wipe">
              <ShieldAlert className="w-5 h-5" />
            </button>
          </div>
        </nav>

        {/* Multi-Account Folders */}
        <aside className="w-[220px] shrink-0 bg-[#14161D] border-r border-[#232836] flex flex-col">
          <div className="p-4 border-b border-[#232836] flex items-center justify-between">
            <button 
              className="w-full flex items-center justify-between bg-[#181A22] border border-[#232836] rounded-[16px] px-3 py-2 text-sm font-medium hover:bg-[#232836]/50 transition-colors shadow-sm"
              onClick={() => { setIsComposing(true); setIsMobileMenuOpen(false); }}
            >
              <span>Compose</span>
              <PenSquare className="w-4 h-4 text-[#DDA15E]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-6">
            <div className="space-y-1">
              <div className="px-3 text-[11px] font-bold tracking-wider text-gray-500 uppercase mb-2">Identities</div>
              <AccountNavItem label="All Unified" active={activeAccount === 'all'} onClick={() => { setActiveAccount('all'); setIsMobileMenuOpen(false); }} />
              <AccountNavItem label="@usafe.in" icon={<ShieldCheck className="w-4 h-4 text-[#52B788]" />} active={activeAccount === 'sovereign'} onClick={() => { setActiveAccount('sovereign'); setIsMobileMenuOpen(false); }} />
              <AccountNavItem label="Gmail Bridge" icon={<div className="w-2 h-2 rounded-full bg-[#4A6FA5]" />} active={activeAccount === 'gmail'} onClick={() => { setActiveAccount('gmail'); setIsMobileMenuOpen(false); }} />
              <AccountNavItem label="Outlook Bridge" icon={<div className="w-2 h-2 rounded-full bg-[#4A6FA5]" />} active={activeAccount === 'outlook'} onClick={() => { setActiveAccount('outlook'); setIsMobileMenuOpen(false); }} />
            </div>

            <div className="space-y-1">
              <div className="px-3 text-[11px] font-bold tracking-wider text-gray-500 uppercase mb-2">Aura Screener</div>
              <FolderNavItem label="Imbox" icon={<Inbox className="w-4 h-4" />} active={activeFolder === 'imbox'} onClick={() => { setActiveFolder('imbox'); setIsMobileMenuOpen(false); }} count={2} />
              <FolderNavItem label="Screener" icon={<ShieldAlert className="w-4 h-4" />} active={activeFolder === 'screener'} onClick={() => { setActiveFolder('screener'); setIsMobileMenuOpen(false); }} />
              <FolderNavItem label="Paper Trail" icon={<FileText className="w-4 h-4" />} active={activeFolder === 'paper-trail'} onClick={() => { setActiveFolder('paper-trail'); setIsMobileMenuOpen(false); }} />
              <FolderNavItem label="The Feed" icon={<Rss className="w-4 h-4" />} active={activeFolder === 'the-feed'} onClick={() => { setActiveFolder('the-feed'); setIsMobileMenuOpen(false); }} />
            </div>
          </div>
        </aside>
      </div>

      {/* Master Thread Index */}
      <motion.section 
        layout
        className={`bg-[#0E0E10] border-r border-[#232836] flex flex-col z-10 shrink-0 w-full md:w-[320px] lg:w-[380px] ${activeThreadId ? 'hidden md:flex' : 'flex'}`}
      >
        <div className="h-16 flex items-center px-4 border-b border-[#232836] gap-3 shrink-0">
          <button className="lg:hidden text-gray-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search enclave..." 
              className="w-full bg-[#181A22] border border-[#232836] rounded-[14px] py-1.5 pl-9 pr-4 text-sm text-gray-200 focus:outline-none focus:border-[#DDA15E] transition-colors placeholder:text-gray-600"
            />
          </div>
        </div>
        
        {/* Workspaces Tab Bar */}
        {workspaceViewMode === 'separate' && workspaces.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#232836] overflow-x-auto no-scrollbar shrink-0">
            <button 
              onClick={() => setActiveWorkspaceId('all')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeWorkspaceId === 'all' ? 'bg-[#232836] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-[#181A22]'}`}
            >
              All Mail
            </button>
            {workspaces.map(ws => (
              <button 
                key={ws.id}
                onClick={() => setActiveWorkspaceId(ws.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeWorkspaceId === ws.id ? 'bg-[#232836] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-[#181A22]'}`}
              >
                {ws.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {filteredThreads.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-gray-600">
              <Inbox className="w-8 h-8 mb-3 opacity-20" />
              <p className="text-sm">No messages found.</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredThreads.map((thread, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.2 }}
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`p-4 border-b border-[#232836]/50 cursor-pointer transition-colors ${activeThreadId === thread.id ? 'bg-[#14161D]' : 'hover:bg-[#14161D]/50'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      {thread.isUnread && <div className="w-2 h-2 rounded-full bg-[#DDA15E] shrink-0" />}
                      <span className="text-sm font-semibold text-gray-200 truncate">
                        {thread.messages[thread.messages.length - 1].sender.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0 ml-2">{thread.messages[thread.messages.length - 1].timestamp}</span>
                  </div>
                  
                  <h4 className="text-sm text-gray-300 font-medium mb-1 truncate">{thread.subject}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {thread.messages[thread.messages.length - 1].bodyHtml.replace(/<[^>]*>?/gm, '')}
                  </p>
                  
                  <div className="mt-3 flex items-center gap-2 overflow-hidden">
                    <OriginBadge origin={thread.origin} />
                    {thread.aiActions && thread.aiActions.length > 0 && (
                      <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7E78D2]/10 text-[#7E78D2] shrink-0">
                        <Sparkles className="w-3 h-3" />
                        AURA
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.section>

      {/* Reading Canvas & Right Dashboard Sidebar */}
      <main className={`flex-1 flex bg-[#0E0E10] relative overflow-hidden min-w-0 ${!activeThreadId ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Center: Reading Canvas or Empty State */}
        <div className="flex-1 flex flex-col relative bg-[#0E0E10] min-w-0 h-full">
          <AnimatePresence mode="popLayout" initial={false}>
            {activeThread ? (
              <motion.div 
                key="reading-canvas"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-full h-full flex flex-col relative bg-[#0E0E10] min-w-0"
              >
            {/* Ambient Cryptographic Watermark */}
          {activeThread.origin !== 'sovereign' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.03, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 pointer-events-none flex items-center justify-center text-[8vw] font-black text-[#4A6FA5] -rotate-12 uppercase select-none whitespace-nowrap z-0"
            >
              {activeThread.origin} IMPORT
            </motion.div>
          )}

          {/* Header Actions */}
          <header className="h-16 shrink-0 border-b border-[#232836] flex items-center justify-between px-4 lg:px-6 z-10 bg-[#0E0E10]/90 backdrop-blur-md">
            <div className="flex items-center gap-3 min-w-0">
              <button className="md:hidden p-1 -ml-1 text-gray-400 hover:text-white transition-colors shrink-0" onClick={() => setActiveThreadId(null)}>
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-base lg:text-lg font-medium text-gray-100 truncate pr-2">{activeThread.subject}</h2>
              <div className="hidden sm:block shrink-0">
                <OriginBadge origin={activeThread.origin} />
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button 
                onClick={() => setShowAiSummary(!showAiSummary)}
                className={`p-2 rounded-[12px] transition-colors relative ${showAiSummary ? 'bg-[#7E78D2]/20 text-[#7E78D2]' : 'text-gray-400 hover:text-[#7E78D2] hover:bg-[#7E78D2]/10'}`}
                title="Aura AI Summary"
              >
                <Sparkles className="w-5 h-5" />
                {!showAiSummary && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#7E78D2] rounded-full animate-ping" />}
              </button>
              <div className="hidden md:flex items-center gap-1 bg-[#14161D] rounded-[12px] p-1 border border-[#232836]">
                <button onClick={() => setViewMode('focus')} className={`p-1.5 rounded-[8px] transition-colors ${viewMode === 'focus' ? 'bg-[#232836] text-white' : 'text-gray-500 hover:text-gray-300'}`} title="Focus Canvas (v)">
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('accordion')} className={`p-1.5 rounded-[8px] transition-colors ${viewMode === 'accordion' ? 'bg-[#232836] text-white' : 'text-gray-500 hover:text-gray-300'}`} title="Accordion Stack (v)">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => setIsComposing(true)}
                className="p-2 text-gray-400 hover:text-[#DDA15E] hover:bg-[#DDA15E]/10 transition-colors rounded-[12px]" 
                title="Split Compose (Ctrl+\\)"
              >
                <PenSquare className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setActiveThreadId(null)}
                className="p-2 text-gray-400 hover:text-[#E07A5F] hover:bg-[#E07A5F]/10 transition-colors rounded-[12px] hidden md:block" 
                title="Close Thread (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden z-10 relative">
            {/* Reading View */}
            <motion.div layout className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth min-w-0">
              
              {/* Aura AI Summary Banner */}
              <AnimatePresence>
                {showAiSummary && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="max-w-3xl mx-auto overflow-hidden"
                  >
                    <div className="p-5 rounded-[22px] bg-gradient-to-r from-[#7E78D2]/10 to-transparent border border-[#7E78D2]/20 relative group">
                      <div className="flex items-center gap-2 text-[#7E78D2] font-semibold text-xs uppercase tracking-widest mb-3">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        Aura Executive Summary
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
                        This thread discusses the Q4 deployment timeline. The sender is requesting confirmation on the frontend architecture freeze before Friday. <strong>Urgent: Action required on database schema approval.</strong>
                      </p>
                      <button 
                        onClick={() => setShowAiSummary(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Aura Action Extraction Banner */}
              <AnimatePresence>
                {showAuraBanner && (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="max-w-3xl mx-auto mb-6 overflow-hidden"
                  >
                    <div className="p-4 rounded-[22px] bg-[#7E78D2]/10 border border-[#7E78D2]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
                      <button 
                        onClick={() => setDismissedAura(prev => ({...prev, [activeThread.id]: true}))}
                        className="absolute top-3 right-3 text-[#7E78D2]/60 hover:text-[#7E78D2] p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-3 pr-8">
                        <div className="w-8 h-8 rounded-full bg-[#7E78D2]/20 flex items-center justify-center text-[#7E78D2] shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#7E78D2]">Action Detected — Aura RAM Scan</div>
                          <div className="text-xs text-gray-400 mt-0.5">{activeThread.aiActions![0].description}</div>
                        </div>
                      </div>
                      <button className="w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded-full bg-[#7E78D2] text-white text-xs font-semibold hover:bg-[#6c66bd] transition-colors shrink-0">
                        Add to Calendar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="max-w-3xl mx-auto space-y-6 pb-20">
                {viewMode === 'focus' ? (
                  <AnimatePresence mode="popLayout">
                    {activeThread.messages.map((msg) => (
                      <motion.div key={msg.id} layout>
                        <MessageCard msg={msg} isExpanded={true} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <AccordionThread messages={activeThread.messages || []} />
                )}
              </div>
            </motion.div>

            {/* Split Composer Overlay / Drawer */}
            <AnimatePresence>
              {isComposing && (
                <motion.div 
                  initial={{ width: 0, opacity: 0, x: 50 }}
                  animate={{ width: 'auto', opacity: 1, x: 0 }}
                  exit={{ width: 0, opacity: 0, x: 50 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="absolute inset-0 md:relative md:inset-auto h-full border-l border-[#232836] bg-[#14161D] shadow-2xl z-20 flex shrink-0 overflow-hidden"
                >
                  <div className="w-full md:w-[400px] xl:w-[480px] h-full flex flex-col bg-[#14161D]">
                    <div className="h-14 shrink-0 border-b border-[#232836] flex items-center justify-between px-4 bg-[#14161D]">
                      <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <PenSquare className="w-4 h-4 text-[#DDA15E]" />
                        Draft Reply
                      </span>
                      <div className="flex gap-1">
                        <button className="text-gray-500 hover:text-gray-300 transition-colors p-1.5 rounded-lg hover:bg-[#232836]">
                          <Maximize2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setIsComposing(false)} className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#E07A5F]/20 hover:text-[#E07A5F]">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="shrink-0 p-4 border-b border-[#232836] space-y-3 bg-[#0E0E10]">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm w-8">To:</span>
                        <input 
                          type="text" 
                          defaultValue={activeThread.messages[0].sender.email}
                          className="flex-1 bg-transparent border-none text-sm text-gray-200 focus:outline-none placeholder:text-gray-600"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm w-8">Sub:</span>
                        <input 
                          type="text" 
                          defaultValue={activeThread.subject.startsWith('Re:') ? activeThread.subject : `Re: ${activeThread.subject}`}
                          className="flex-1 bg-transparent border-none text-sm text-gray-200 focus:outline-none placeholder:text-gray-600"
                        />
                      </div>
                    </div>

                    <div className="flex-1 relative bg-[#0E0E10]/50 flex flex-col min-h-0">
                      <div className="absolute top-3 right-4 flex gap-2 z-10">
                        <button 
                          onClick={() => {
                            setIsAiDrafting(true);
                            setTimeout(() => { setIsAiDrafting(false); setComposeText('Attached is the finalized draft for your review. Let me know if further adjustments are required.\n\nBest,\nSovereign ID'); }, 1500);
                          }}
                          disabled={isAiDrafting}
                          className="px-3 py-1.5 rounded-full bg-[#181A22] border border-[#232836] text-[11px] text-[#7E78D2] font-medium flex items-center gap-1.5 hover:bg-[#232836] transition-colors shadow-sm disabled:opacity-50"
                        >
                          {isAiDrafting ? <div className="w-3 h-3 rounded-full border-2 border-[#7E78D2] border-t-transparent animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          <span className="hidden sm:inline">Make Formal</span><span className="sm:hidden">Formal</span>
                        </button>
                        <button 
                          onClick={() => {
                            setIsAiDrafting(true);
                            setTimeout(() => { setIsAiDrafting(false); setComposeText('• Approved timeline.\n• Awaiting backend sync.\n• Will deploy EOD.'); }, 1500);
                          }}
                          disabled={isAiDrafting}
                          className="px-3 py-1.5 rounded-full bg-[#181A22] border border-[#232836] text-[11px] text-[#7E78D2] font-medium flex items-center gap-1.5 hover:bg-[#232836] transition-colors shadow-sm disabled:opacity-50"
                        >
                          {isAiDrafting ? <div className="w-3 h-3 rounded-full border-2 border-[#7E78D2] border-t-transparent animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          <span className="hidden xl:inline">Exec 3-Bullet</span><span className="xl:hidden">3-Bullet</span>
                        </button>
                      </div>

                      <div className="relative flex-1 flex flex-col">
                        <AnimatePresence>
                          {isAiDrafting && (
                            <motion.div 
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-[#0E0E10]/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center pointer-events-none"
                            >
                              <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                  <motion.div 
                                    key={i}
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                                    className="w-2 h-2 rounded-full bg-[#7E78D2]"
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-[#7E78D2] mt-3 font-medium tracking-wide">Aura AI Synthesizing...</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <textarea
                          className="flex-1 w-full bg-transparent resize-none p-4 pt-14 text-sm text-gray-200 focus:outline-none placeholder:text-gray-600 leading-relaxed"
                          placeholder="Type your encrypted reply... (Sub-50ms Smart Compose active)"
                          value={composeText}
                          onChange={(e) => setComposeText(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="shrink-0 p-4 border-t border-[#232836] bg-[#14161D] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] font-medium text-[#52B788] bg-[#52B788]/10 px-3 py-1.5 rounded-full truncate mr-2">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Local Memory DLP: Safe</span>
                      </div>
                      <button className="px-5 sm:px-6 py-2 rounded-[14px] bg-[#DDA15E] hover:bg-[#c99252] text-[#0E0E10] text-sm font-bold transition-colors flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 shrink-0">
                        <Send className="w-4 h-4" />
                        Dispatch
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="flex-1 hidden md:flex items-center justify-center bg-[#0E0E10]"
            >
              <div className="text-gray-600 text-center flex flex-col items-center">
                <Inbox className="w-16 h-16 mb-4 opacity-10" />
                <p className="text-lg font-medium text-gray-500 mb-2">Zero-Knowledge Enclave Active</p>
                <p className="text-sm max-w-sm text-gray-600">Select a sovereign thread or external bridge message to begin deep work.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* Right Sidebar: Command Dashboard (30% of right side) */}
        <AnimatePresence>
          {!isComposing && (
            <motion.aside
              initial={{ width: 0, opacity: 0, borderLeftWidth: 0 }}
              animate={{ width: '30%', opacity: 1, borderLeftWidth: 1 }}
              exit={{ width: 0, opacity: 0, borderLeftWidth: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="hidden lg:block bg-[#14161D] border-[#232836] shrink-0 overflow-hidden min-w-[260px] max-w-[340px]"
            >
              <div className="w-[30vw] min-w-[260px] max-w-[340px] h-full overflow-y-auto">
                <CommandDashboard />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

/* Subcomponents */

function CommandDashboard() {
  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Enclave Stats</h2>
        <div className="flex items-center gap-1.5 bg-[#52B788]/10 text-[#52B788] px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] animate-pulse" />
          Live
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Aura AI Stats */}
        <div className="bg-[#181A22] border border-[#232836] rounded-[16px] p-4 flex flex-col justify-between hover:border-[#7E78D2]/50 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-8 h-8 rounded-[10px] bg-[#7E78D2]/10 flex items-center justify-center text-[#7E78D2]">
              <Cpu className="w-4 h-4" />
            </div>
            <Sparkles className="w-3 h-3 text-gray-600 group-hover:text-[#7E78D2] transition-colors" />
          </div>
          <div>
            <div className="text-2xl font-light text-gray-200 mb-0.5">1,204</div>
            <div className="text-xs font-medium text-[#7E78D2]">Trackers Stripped</div>
          </div>
        </div>

        {/* Local Vault Storage */}
        <div className="bg-[#181A22] border border-[#232836] rounded-[16px] p-4 flex flex-col justify-between hover:border-[#DDA15E]/50 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-8 h-8 rounded-[10px] bg-[#DDA15E]/10 flex items-center justify-center text-[#DDA15E]">
              <Database className="w-4 h-4" />
            </div>
            <Lock className="w-3 h-3 text-gray-600 group-hover:text-[#DDA15E] transition-colors" />
          </div>
          <div>
            <div className="text-2xl font-light text-gray-200 mb-0.5">1.4 <span className="text-sm text-gray-500">GB</span></div>
            <div className="text-xs font-medium text-[#DDA15E]">AES-256 Vault</div>
            <div className="w-full bg-[#0E0E10] h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#DDA15E] w-[28%] h-full rounded-full" />
            </div>
          </div>
        </div>

        {/* Bridge Status */}
        <div className="bg-[#181A22] border border-[#232836] rounded-[16px] p-4 flex flex-col justify-between hover:border-[#4A6FA5]/50 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-8 h-8 rounded-[10px] bg-[#4A6FA5]/10 flex items-center justify-center text-[#4A6FA5]">
              <Network className="w-4 h-4" />
            </div>
            <Settings className="w-3 h-3 text-gray-600 group-hover:text-[#4A6FA5] transition-colors" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#52B788]" />
                Gmail
              </div>
              <span className="text-[10px] text-gray-500">Synced 2m</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DDA15E]" />
                Outlook
              </div>
              <span className="text-[10px] text-[#DDA15E]">Syncing</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#52B788]" />
                Sovereign
              </div>
              <span className="text-[10px] text-gray-500">Connected</span>
            </div>
          </div>
        </div>
        
        {/* Security Events */}
        <div className="mt-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recent Events</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-[#52B788]/10 flex items-center justify-center text-[#52B788] shrink-0">
                <Fingerprint className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-200 text-xs truncate">Biometric Handshake</div>
                <div className="text-[10px] text-gray-500 truncate">Device MAC: 8A:3B:...</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-[#E07A5F]/10 flex items-center justify-center text-[#E07A5F] shrink-0">
                <EyeOff className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-200 text-xs truncate">Quarantine: Suspicious</div>
                <div className="text-[10px] text-gray-500 truncate">invoice_urgent.pdf</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function DockButton({ icon, active = false, onClick, title }: { icon: React.ReactNode, active?: boolean, onClick?: () => void, title?: string }) {
  return (
    <button 
      onClick={onClick} 
      title={title} 
      className={`p-3 rounded-[14px] transition-all ${active ? 'bg-[#232836] text-white shadow-sm' : 'text-gray-500 hover:bg-[#181A22] hover:text-gray-300'}`}
    >
      {icon}
    </button>
  );
}

function AccountNavItem({ label, icon, active, onClick }: { label: string, icon?: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-[12px] text-sm transition-colors ${active ? 'bg-[#232836] text-white font-medium' : 'text-gray-400 hover:bg-[#181A22]'}`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}

function FolderNavItem({ label, icon, active, count, onClick }: { label: string, icon: React.ReactNode, active: boolean, count?: number, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-[12px] text-sm transition-colors ${active ? 'bg-[#232836] text-white font-medium' : 'text-gray-400 hover:bg-[#181A22]'}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#181A22] text-gray-300">
          {count}
        </span>
      )}
    </button>
  );
}

function OriginBadge({ origin }: { origin: AccountOrigin }) {
  if (origin === 'sovereign') return null;
  return (
    <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4A6FA5]/10 text-[#4A6FA5] uppercase tracking-wide shrink-0">
      <Tag className="w-3 h-3" />
      <span className="hidden sm:inline">{origin} IMPORT</span>
      <span className="sm:hidden">{origin}</span>
    </div>
  );
}

function MessageCard({ msg, isExpanded, onClick }: { msg: any, isExpanded: boolean, onClick?: () => void }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#181A22] border border-[#232836] rounded-[22px] overflow-hidden transition-all ${!isExpanded ? 'cursor-pointer hover:bg-[#1c1f28]' : 'shadow-md'}`}
      onClick={!isExpanded ? onClick : undefined}
    >
      <motion.div layout="position" className="p-4 sm:p-5 flex items-start justify-between bg-[#14161D]/50 border-b border-[#232836]/50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#232836] flex items-center justify-center text-gray-300 font-bold shrink-0">
            {msg.sender.name.charAt(0)}
          </div>
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-200 truncate">{msg.sender.name}</span>
              <span className="text-xs text-gray-500 hidden sm:inline truncate">&lt;{msg.sender.email}&gt;</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5 truncate">To: {msg.recipient.name} <span className="hidden sm:inline">&lt;{msg.recipient.email}&gt;</span></div>
          </div>
        </div>
        <div className="text-xs text-gray-500 flex flex-col items-end gap-2 shrink-0">
          <span>{msg.timestamp}</span>
          {msg.strippedTrackers > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#E07A5F] bg-[#E07A5F]/10 px-2 py-0.5 rounded-full" title="Tracking Beacon Stripper active">
              <EyeOff className="w-3 h-3" />
              <span className="hidden sm:inline">{msg.strippedTrackers} BLOCKED</span>
              <span className="sm:hidden">{msg.strippedTrackers}</span>
            </span>
          )}
        </div>
      </motion.div>
      
      <AnimatePresence mode="popLayout">
        {isExpanded ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 sm:p-6 text-sm text-gray-300 leading-relaxed bg-[#181A22]"
          >
            <div dangerouslySetInnerHTML={{ __html: msg.bodyHtml }} className="break-words" />
            
            <div className="mt-8 flex gap-2">
              <button className="px-4 py-1.5 rounded-[12px] bg-[#232836] text-gray-300 text-xs font-medium hover:bg-[#32394d] transition-colors flex items-center gap-2">
                <Reply className="w-4 h-4" /> Reply
              </button>
              <button className="px-3 py-1.5 rounded-[12px] border border-[#232836] text-gray-400 hover:bg-[#232836] hover:text-white transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 px-5 text-sm text-gray-500 truncate bg-[#181A22]"
          >
            {msg.bodyHtml.replace(/<[^>]*>?/gm, '')}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AccordionThread({ messages }: { messages: any[] }) {
  const [expandedId, setExpandedId] = useState<string>(messages[messages.length - 1]?.id);

  return (
    <div className="space-y-[-12px]">
      <AnimatePresence>
        {messages.map((msg, idx) => {
          const isExpanded = msg.id === expandedId;
          return (
            <motion.div 
              layout
              key={msg.id} 
              className="relative"
              style={{ zIndex: isExpanded ? 10 : idx }}
            >
              <MessageCard 
                msg={msg} 
                isExpanded={isExpanded} 
                onClick={() => setExpandedId(msg.id)} 
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
