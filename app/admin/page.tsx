'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contacts:', error);
    } else {
      setContacts(data || []);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Maritime Admin</h1>
          <button onClick={fetchContacts} className="text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-white">Refresh Logs</button>
        </div>

        {loading ? (
          <p className="font-mono text-xs animate-pulse">LOADING TRANSMISSIONS...</p>
        ) : (
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <p className="text-white/40">No transmissions found in the database.</p>
            ) : (
              contacts.map((contact) => (
                <div key={contact.id} className="bg-white/5 border border-white/10 p-6 hover:border-blue-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold uppercase">{contact.Name || contact.name}</h3>
                      <p className="text-blue-400 text-xs font-mono">{contact.Email || contact.email}</p>
                    </div>
                    <span className="text-[10px] text-white/30 font-mono">
                      {new Date(contact.created_at).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-[10px] font-bold uppercase tracking-widest text-white/50">
                    <div>
                      <p className="text-blue-500/60 mb-1">Company</p>
                      <p className="text-white">{contact.Company || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-blue-500/60 mb-1">Vessel</p>
                      <p className="text-white">{contact.vessel_type || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-blue-500/60 mb-1">Service</p>
                      <p className="text-white">{contact.service_type || 'General'}</p>
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 border border-white/5 rounded">
                    <p className="text-sm text-white/80 whitespace-pre-wrap">{contact.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
