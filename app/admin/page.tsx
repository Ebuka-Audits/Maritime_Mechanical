'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function MaritimeMechanicalApp() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [page, setPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [responseTime, setResponseTime] = useState('2.4');

  useEffect(() => {
    const interval = setInterval(() => {
      setResponseTime((2 + Math.random()).toFixed(1));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const navigateTo = (pageName: string) => {
    setPage(pageName);
    setSelectedService(null);
    setSelectedMission(null);
    setIsMenuOpen(false); 
    window.scrollTo(0, 0);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const submissionData = Object.fromEntries(formData.entries());

    const { error } = await supabase
      .from('contacts')
      .insert([submissionData]);

    if (error) {
      alert("Error: " + error.message);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      setIsSent(true); 
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setIsSent(false), 3000);
    }
  };

  const navLinks = ['Home', 'About', 'Founder', 'Services', 'Contact', 'Quote'];

  const serviceData = [
    { 
      name: 'Hull Repair', 
      img: 'fiberglass b &a.png', 
      desc: 'Professional restoration and structural repairs for ship hulls.',
      longDesc: 'Our team handles everything from emergency structural repairs to routine maintenance.',
      specs: { material: 'Composite & Steel', certification: 'Industry Standard', service: 'Worldwide' },
      features: ['Fiberglass Repair', 'Steel Welding', 'Structural Inspections', 'Surface Refinishing']
    },
    { 
      name: 'Mechanical Repair', 
      img: 'mechanical repair.jpg', 
      desc: 'Expert repairs for engines, hydraulics, and electrical systems.',
      longDesc: 'We provide clear diagnostics and reliable repairs for all shipboard machinery.',
      specs: { focus: 'Precision Repair', tools: 'Advanced Testing', speed: 'Fast Turnaround' },
      features: ['Hydraulic Service', 'Electrical Troubleshooting', 'Pump & Valve Repair', 'System Alignment']
    },
    { 
      name: 'Engine Overhaul', 
      img: 'Engine overhaul.webp', 
      desc: 'Complete engine rebuilds and maintenance services.',
      longDesc: 'From minor adjustments to full engine rebuilds, we keep propulsion systems at peak performance.',
      specs: { capacity: 'All Engine Sizes', quality: 'OEM Standards', testing: 'Full Verification' },
      features: ['Detailed Engine Teardowns', 'Parts Reconditioning', 'Turbocharger Service', 'Performance Testing']
    },
    { 
      name: 'Retrofitting', 
      img: 'fire damage before and after.webp', 
      desc: 'Updating old systems and repairing major damage.',
      longDesc: 'We help modernize older vessels with new technology to extend the life of your fleet.',
      specs: { update: 'Modern Systems', type: 'Full Upgrades', schedule: 'Project Based' },
      features: ['System Modernization', 'Electronics Installation', 'Structural Rebuilds', 'Safety Compliance']
    },
    { 
      name: 'Deep Cleaning', 
      img: 'cleaning.webp', 
      desc: 'Specialized sanitation for engine rooms, tanks, and ship systems.',
      longDesc: 'Professional deep cleaning designed to improve safety and operational efficiency.',
      specs: { standard: 'Environmentally Safe', application: 'Tanks & Bilges', quality: 'Deep Sanitation' },
      features: ['Bilge & Tank Cleaning', 'Degreasing Operations', 'HVAC Sanitation', 'Rust & Scale Removal']
    },
    { 
      name: 'Maintenance', 
      img: 'supervisors.webp', 
      desc: 'Scheduled upkeep and preventative care to prevent breakdowns.',
      longDesc: 'Regular maintenance is the best way to avoid costly emergency repairs.',
      specs: { schedule: 'Flexible', focus: 'Prevention', reporting: 'Full Status Logs' },
      features: ['Preventative Inspections', 'Oil & Filter Changes', 'Seal & Bearing Checks', 'Safety System Testing']
    }
  ];

  const missionLogs = [
    {
      id: 'Project 042',
      title: 'Engine Room Restoration',
      img: 'fire damage before and after.webp',
      summary: 'Complete electrical and engine repair after a fire.',
      vessel: 'Valkyrie Horizon',
      location: 'North Atlantic',
      challenge: 'The engine room suffered significant fire damage, requiring a total rewire.',
      solution: 'Our team replaced damaged wiring and bypassed failed systems.',
      outcome: 'Successfully restored power.'
    },
    {
      id: 'Project 089',
      title: 'Hull Integrity Repair',
      img: 'fiberglass b &a.png',
      summary: 'Specialized fiberglass repair performed without dry-docking.',
      vessel: 'Blue Marlin',
      location: 'Singapore',
      challenge: 'A significant crack in the hull needed immediate attention.',
      solution: 'Used specialized underwater materials to seal the hull.',
      outcome: 'Repair completed in 36 hours.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      <nav className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 cursor-pointer" onClick={() => navigateTo('home')}>
          <img src="/reallogo.png" alt="Logo" className="w-10 md:w-12 h-auto" />
          <div className="hidden sm:block">
            <h1 className="font-black text-sm md:text-lg tracking-tighter uppercase">MARITIME MECHANICAL</h1>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] text-green-500 font-mono uppercase tracking-widest leading-none">Response Time: {responseTime} HRS</span>
            </div>
          </div>
        </motion.div>
        
        {/* Desktop Navigation - Hidden on Mobile */}
        <div className="hidden md:flex gap-8 text-xs font-bold tracking-widest">
          {navLinks.map((p) => (
            <button key={p} onClick={() => navigateTo(p.toLowerCase())} className={`hover:text-blue-400 transition relative ${page === p.toLowerCase() ? 'text-blue-400' : 'text-white/50'}`}>
              {p === 'Quote' ? 'Get a Quote' : p}
              {page === p.toLowerCase() && <motion.div layoutId="navline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400" />}
            </button>
          ))}
        </div>

        {/* Mobile Menu Toggle - Visible on Mobile Only */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex flex-col gap-1.5 p-2 focus:outline-none z-50 relative">
            <motion.span animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="w-6 h-0.5 bg-white block" />
            <motion.span animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-6 h-0.5 bg-white block" />
            <motion.span animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="w-6 h-0.5 bg-white block" />
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-slate-950 pt-24 px-8 flex flex-col gap-6 md:hidden"
          >
            {navLinks.map((p) => (
              <button 
                key={p} 
                onClick={() => navigateTo(p.toLowerCase())} 
                className="text-4xl font-black uppercase text-left tracking-tighter hover:text-blue-500 transition-colors"
              >
                {p === 'Quote' ? 'Get a Quote' : p}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative">
        <AnimatePresence mode="wait">
          
          {selectedMission ? (
            <motion.div key="mission-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-8 py-12 max-w-6xl mx-auto text-left">
              <button onClick={() => setSelectedMission(null)} className="mb-8 text-blue-400 font-bold text-xs uppercase tracking-widest">← Back to Projects</button>
              <div className="relative border border-blue-500/30 bg-slate-900/50 backdrop-blur-xl p-6 md:p-12">
                <h1 className="text-3xl md:text-5xl font-black uppercase mb-12">{selectedMission.title}</h1>
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8 text-white/80 text-lg md:text-xl font-light">
                    <section><h3 className="text-blue-500 font-bold text-xs uppercase mb-2">The Problem</h3><p>{selectedMission.challenge}</p></section>
                    <section><h3 className="text-blue-500 font-bold text-xs uppercase mb-2">Our Solution</h3><p>{selectedMission.solution}</p></section>
                  </div>
                  <div className="bg-white/5 p-8 border border-white/10 space-y-4">
                    <img src={selectedMission.img} className="w-full border border-white/10 mb-4" alt="Project Detail" />
                    <div><h4 className="text-blue-500 font-bold text-[10px] uppercase">Vessel</h4><p className="font-bold">{selectedMission.vessel}</p></div>
                    <div><h4 className="text-blue-500 font-bold text-[10px] uppercase">Result</h4><p className="font-bold text-green-400">{selectedMission.outcome}</p></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : selectedService ? (
            <motion.div key="service-detail" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="px-8 py-12 max-w-7xl mx-auto text-left">
               <button onClick={() => setSelectedService(null)} className="mb-8 text-blue-400 font-bold text-xs uppercase">← Back to Services</button>
               <div className="grid md:grid-cols-12 gap-12">
                  <div className="md:col-span-7">
                    <img src={selectedService.img} className="w-full h-[300px] md:h-[450px] object-cover mb-8 border border-white/10" alt="Service" />
                    <h1 className="text-4xl md:text-6xl font-black uppercase mb-8">{selectedService.name}</h1>
                    <p className="text-xl md:text-2xl font-light text-white/60 mb-10 leading-relaxed">{selectedService.longDesc}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedService.features.map((f: string) => (
                        <div key={f} className="p-4 border border-white/5 bg-white/5 text-xs font-bold uppercase tracking-widest">{f}</div>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-5 h-fit sticky top-32">
                    <div className="p-8 border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm">
                      <h3 className="font-bold text-xs text-blue-500 mb-8 tracking-widest uppercase">Service Details</h3>
                      {Object.entries(selectedService.specs).map(([k, v]: any) => (
                        <div key={k} className="flex justify-between border-b border-white/10 py-4 uppercase text-xs">
                          <span className="text-white/40">{k.replace('_', ' ')}</span>
                          <span className="font-bold">{v}</span>
                        </div>
                      ))}
                      <button onClick={() => navigateTo('quote')} className="w-full bg-blue-600 mt-12 py-6 font-black uppercase text-sm hover:bg-blue-500 transition-all">Get a Quote</button>
                    </div>
                  </div>
               </div>
            </motion.div>
          ) : (
            <>
              {page === 'home' && (
                <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <section className="relative h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                    <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-40">
                      <source src="/marine-hero.mp4" type="video/mp4" />
                    </video>
                    <div className="relative z-10 max-w-5xl">
                      <h1 className="text-5xl md:text-[clamp(3rem,10vw,8rem)] font-black tracking-tighter uppercase leading-[0.85] mb-8">Ship Repair <br /><span className="text-blue-500">Anywhere</span></h1>
                      <p className="text-lg md:text-2xl text-white/60 mb-12 font-light uppercase tracking-widest">Global Support // Since 2014</p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => navigateTo('services')} className="bg-blue-600 px-12 py-5 font-black uppercase text-xs tracking-widest">Our Services</button>
                        <button onClick={() => navigateTo('quote')} className="border border-white/20 px-12 py-5 font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all">Get a Quote</button>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {page === 'about' && (
                <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-8 py-32 max-w-7xl mx-auto text-left">
                  <div className="grid md:grid-cols-2 gap-20 items-center mb-32">
                    <div>
                      <h1 className="text-6xl font-black uppercase mb-12">About Us</h1>
                      <p className="text-2xl text-white/70 font-light mb-8 leading-relaxed">Dedicated ship repair agency focused on quality and speed.</p>
                      <p className="text-lg text-white/40 leading-relaxed">We understand that time in port is expensive. Our teams are designed to be mobile, meeting your vessel wherever it is needed.</p>
                    </div>
                    <div className="border border-white/10 p-2"><img src="supervisors.webp" alt="Team" className="opacity-80" /></div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/10 py-16">
                    {[
                      { val: '500+', label: 'Vessels Serviced' },
                      { val: '24/7', label: 'Availability' },
                      { val: '12', label: 'Global Ports' },
                      { val: '10Y', label: 'Excellence' }
                    ].map((stat) => (
                      <div key={stat.label}>
                        <h4 className="text-4xl md:text-6xl font-black text-blue-500">{stat.val}</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {page === 'founder' && (
                <motion.div key="founder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-8 py-32 max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center text-left">
                  <div className="flex justify-center">
                    <div className="w-full max-w-sm aspect-square border border-white/10 rounded-full overflow-hidden p-1 bg-slate-900/50">
                      <img src="CEO.png" alt="Thomas Giovanni" className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-blue-500 font-bold text-xs tracking-widest mb-4 uppercase">Our Leadership</h4>
                    <h1 className="text-7xl font-black uppercase mb-2 leading-tight">Thomas <br /> Giovanni</h1>
                    <p className="text-blue-400 font-bold text-sm tracking-[0.2em] uppercase mb-8">CEO and Founder</p>
                    <p className="text-2xl font-light italic border-l-4 border-blue-600 pl-8 mb-8 text-white/70">"Reliable service is the foundation of our industry."</p>
                  </div>
                </motion.div>
              )}

              {page === 'services' && (
                <motion.div key="services" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-8 py-32 max-w-7xl mx-auto text-left">
                  <h1 className="text-6xl font-black uppercase mb-20">What We Do</h1>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1 bg-white/5 border border-white/5">
                    {serviceData.map((s) => (
                      <div key={s.name} onClick={() => setSelectedService(s)} className="group relative bg-slate-950 p-12 cursor-pointer transition-all duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                        <h3 className="text-3xl font-black uppercase mb-4 text-blue-500 group-hover:text-white">{s.name}</h3>
                        <p className="text-sm text-white/40 group-hover:text-white/80">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {page === 'contact' && (
                <motion.div key="contact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-8 py-24 max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row gap-16">
                    <div className="md:w-1/3 space-y-12">
                      <div>
                        <h1 className="text-7xl font-black uppercase leading-none mb-4">Get In<br /><span className="text-blue-600">Touch</span></h1>
                        <p className="text-white/40 font-mono text-xs tracking-[0.2em] uppercase">Global Logistics Center // HQ</p>
                      </div>
                      <div className="space-y-8">
                        <div className="group">
                          <h4 className="text-blue-500 font-bold text-[10px] mb-2 uppercase tracking-widest border-l-2 border-blue-600 pl-4">Direct Line</h4>
                          <p className="text-2xl font-black group-hover:text-blue-400 transition-colors">+1 (734) 584-4717</p>
                        </div>
                        <div className="group">
                          <h4 className="text-blue-500 font-bold text-[10px] mb-2 uppercase tracking-widest border-l-2 border-blue-600 pl-4">Operations Email</h4>
                          <p className="text-2xl font-black group-hover:text-blue-400 transition-colors">ops@maritimemechanical.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-2/3 bg-white/5 border border-white/10 p-10 md:p-16 relative">
                      <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Full Name</label>
                            <input name="Name" placeholder="JOHN DOE" className="w-full bg-slate-900/50 border-b border-white/20 p-4 font-bold text-sm outline-none focus:border-blue-500 transition-colors" required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Address</label>
                            <input name="Email" placeholder="OFFICER@VESSEL.COM" type="email" className="w-full bg-slate-900/50 border-b border-white/20 p-4 font-bold text-sm outline-none focus:border-blue-500 transition-colors" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Transmission / Message</label>
                          <textarea name="message" placeholder="SPECIFY TECHNICAL REQUIREMENTS OR EMERGENCY STATUS..." rows={5} className="w-full bg-slate-900/50 border border-white/10 p-4 font-bold text-sm outline-none focus:border-blue-500 transition-colors resize-none" required />
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full py-6 font-black uppercase tracking-[0.3em] text-xs bg-blue-600 hover:bg-blue-500 transition-all flex items-center justify-center gap-3 group">
                          {isSubmitting ? <span className="animate-pulse">Transmitting...</span> : isSent ? "Message Logged" : "Send Transmission"}
                          <span className="group-hover:translate-x-2 transition-transform">→</span>
                        </button>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

              {page === 'quote' && (
                <motion.div key="quote" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-8 py-32 max-w-6xl mx-auto text-left">
                  <h1 className="text-6xl font-black uppercase mb-12">Get a Quote</h1>
                  <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
                    <input name="Name" placeholder="CONTACT NAME" className="col-span-2 md:col-span-1 bg-slate-900 border border-white/10 p-5 font-bold text-xs outline-none focus:border-blue-500" required />
                    <input name="Email" placeholder="EMAIL ADDRESS" type="email" className="col-span-2 md:col-span-1 bg-slate-900 border border-white/10 p-5 font-bold text-xs outline-none focus:border-blue-500" required />
                    <input name="Company" placeholder="COMPANY NAME" className="col-span-2 md:col-span-1 bg-slate-900 border border-white/10 p-5 font-bold text-xs outline-none focus:border-blue-500" required />
                    <input name="vessel_type" placeholder="VESSEL TYPE" className="col-span-2 md:col-span-1 bg-slate-900 border border-white/10 p-5 font-bold text-xs outline-none focus:border-blue-500" required />
                    <select name="service_type" className="col-span-2 bg-slate-900 border border-white/10 p-5 font-bold text-xs outline-none focus:border-blue-500 appearance-none uppercase" required>
                      <option value="">Select Service Required</option>
                      {serviceData.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                    <textarea name="message" placeholder="DESCRIBE THE ISSUE IN DETAIL" rows={6} className="col-span-2 bg-slate-900 border border-white/10 p-5 font-bold text-xs outline-none focus:border-blue-500" required />
                    <button type="submit" className="col-span-2 py-6 font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 transition-all">
                      {isSubmitting ? "Processing..." : isSent ? "Request Sent" : "Submit Quote Request"}
                    </button>
                  </form>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      <footer className="px-8 py-12 border-t border-white/10 bg-slate-950 text-white/30 text-center">
        <p className="font-bold text-[10px] uppercase tracking-widest">Maritime Mechanical // Global Ship Repair</p>
      </footer>
    </div>
  );
}