'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [operatorEmail, setOperatorEmail] = useState('');
  
  // Modal State
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  // Credentials State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Session & Auth State Observer
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setOperatorEmail(session.user.email || 'Admin');
        fetchLeads();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setOperatorEmail(session.user.email || 'Admin');
        fetchLeads();
      } else {
        setIsAuthenticated(false);
        setOperatorEmail('');
        setLeads([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Data Function
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error: sbError } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (sbError) {
      console.error("Supabase Error:", sbError.message);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  }, []);

  // 3. Real-time Subscription
  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = supabase
      .channel('realtime-leads')
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'contacts' }, 
        (payload) => {
          setLeads((currentLeads) => [payload.new, ...currentLeads]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  const exportToCSV = () => {
    if (leads.length === 0) return alert("No data to export");
    const headers = ["Date", "Name", "Email", "Company", "Vessel", "Message"];
    const csvContent = [
      headers.join(","), 
      ...leads.map(lead => [
        new Date(lead.created_at).toLocaleDateString(),
        `"${lead.Name}"`,
        lead.Email,
        `"${lead.Company}"`,
        lead.vessel_type,
        `"${lead.message?.replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `fleet_leads_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this transmission from the records?")) return;
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) {
      alert("Error deleting record: " + error.message);
    } else {
      setLeads(leads.filter(lead => lead.id !== id));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: emailInput,
      password: passwordInput,
    });

    if (authError) {
      setErrorMessage(authError.message);
      setError(true);
      setTimeout(() => setError(false), 3000);
    } else {
      setEmailInput('');
      setPasswordInput('');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-900 border border-white/10 p-10 rounded-3xl shadow-2xl"
        >
          {/* LOGIN LOGO (2x Size) */}
          <div className="flex items-center justify-center mb-8 mx-auto">
            <img src="/reallogo.png" alt="Logo" className="w-64 h-auto object-contain" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center text-white">System Authentication</h2>
          <p className="text-white/40 text-center text-sm mb-8 uppercase tracking-[0.2em]">Restricted Access</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Operator Email"
              className="w-full p-4 bg-slate-950 border border-white/10 rounded-xl outline-none focus:border-blue-500 transition-all text-white placeholder:text-white/10"
              required
            />
            <input 
              type="password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Access Key"
              className={`w-full p-4 bg-slate-950 border rounded-xl outline-none transition-all ${error ? 'border-red-500 animate-pulse' : 'border-white/10 focus:border-blue-500'} text-white placeholder:text-white/10`}
              required
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all mt-4 text-white">
              Verify Credentials
            </button>
            {error && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-red-500 text-xs text-center mt-4 font-medium"
              >
                {errorMessage}
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/5 pb-8 gap-6">
          <div className="flex items-center gap-8">
            {/* DASHBOARD LOGO (2x Size) */}
            <img src="/reallogo.png" alt="Logo" className="w-40 h-auto object-contain" />
            <div>
              <h1 className="text-3xl font-bold text-blue-500 tracking-tight">Fleet Command</h1>
              <p className="text-white/40 text-sm mt-1">Operator: <span className="text-blue-400/80 font-mono">{operatorEmail}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleSignOut} className="px-4 py-2 text-white/30 hover:text-red-400 text-xs transition-colors">Logoff</button>
            <button onClick={fetchLeads} className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-xl text-sm flex items-center gap-2">
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Sync
            </button>
            <button onClick={exportToCSV} className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 px-6 py-2.5 rounded-xl text-sm text-blue-400 flex items-center gap-2">
              Export CSV
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex justify-center py-40 animate-pulse text-white/20 uppercase tracking-widest text-xs">Syncing Ledger...</div>
          ) : leads.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
              <p className="text-white/20 font-mono uppercase tracking-widest text-xs">No Active Signals Detected</p>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/[0.02] text-[10px] uppercase tracking-widest text-white/40 border-b border-white/5">
                  <tr>
                    <th className="p-6">Date</th>
                    <th className="p-6">Identity</th>
                    <th className="p-6">Vessel</th>
                    <th className="p-6">Request</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leads.map((lead) => (
                    <motion.tr 
                      key={lead.id} 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="hover:bg-blue-500/[0.03] group transition-colors"
                    >
                      <td className="p-6 text-xs font-mono text-white/30">
                        {lead.created_at ? (
                          new Date(lead.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        ) : (
                          <span className="text-orange-500/50 italic">Date Unknown</span>
                        )}
                      </td>
                      <td className="p-6">
                        <div className="font-bold">{lead.Name}</div>
                        <div 
                          className="text-[10px] text-blue-500/60 font-mono mt-0.5 cursor-pointer hover:text-blue-400"
                          onClick={() => {
                            navigator.clipboard.writeText(lead.Email);
                            alert('Signal intercepted: Email copied to clipboard');
                          }}
                          title="Click to copy email"
                        >
                          {lead.Email}
                        </div>
                      </td>
                      <td className="p-6 text-[10px] uppercase text-white/40">{lead.vessel_type}</td>
                      <td 
                        className="p-6 text-sm text-white/60 cursor-pointer hover:bg-white/[0.02] transition-all"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <p className="line-clamp-1 max-w-xs">{lead.message}</p>
                      </td>
                      <td className="p-6 text-right">
                        <button onClick={() => handleDelete(lead.id)} className="p-2 text-white/10 hover:text-red-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AnimatePresence>

        {/* --- FULL REQUEST MODAL --- */}
        <AnimatePresence>
          {selectedLead && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedLead(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} 
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-900 border border-white/10 p-8 rounded-3xl max-w-2xl w-full shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="absolute top-6 right-6 text-white/20 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="flex items-center gap-4 mb-6">
                   <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                   </div>
                   <div>
                    <h3 className="text-blue-500 font-bold uppercase tracking-widest text-xs">Full Transmission</h3>
                    <p className="text-white/40 text-[10px] font-mono">{selectedLead.id}</p>
                   </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-white/20 text-[10px] uppercase tracking-widest mb-1">Origin Details</p>
                    <p className="text-white font-medium">{selectedLead.Name} <span className="text-white/20 mx-2">|</span> {selectedLead.Email}</p>
                    <p className="text-blue-400 text-sm">{selectedLead.Company || 'Private Entity'}</p>
                  </div>

                  <div className="p-6 bg-slate-950 rounded-2xl border border-white/5">
                    <p className="text-white/20 text-[10px] uppercase tracking-widest mb-3">Message Content</p>
                    <p className="text-white/80 text-lg leading-relaxed whitespace-pre-wrap font-light italic break-words">
                      "{selectedLead.message}"
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <p className="text-white/20 text-[10px] font-mono">Timestamp: {new Date(selectedLead.created_at).toLocaleString()}</p>
                  <button 
                    onClick={() => setSelectedLead(null)} 
                    className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl text-xs transition-all border border-white/10"
                  >
                    Close Intercept
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}