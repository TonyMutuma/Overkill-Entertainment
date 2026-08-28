import React, { useState } from 'react';
import { FAQ_ITEMS, DJ_ASSETS } from '../data/mockData';
import { ChevronDown, HelpCircle, MessageSquare, ShieldCheck, Mail, Send, CheckCircle } from 'lucide-react';
import { VertexCorners } from './VertexCorners';

interface FaqViewProps {
  onNavigateToBooking?: () => void;
  setActiveTab?: (tab: string) => void;
}

export const FaqView: React.FC<FaqViewProps> = ({
  onNavigateToBooking,
  setActiveTab
}) => {
  const [openIds, setOpenIds] = useState<string[]>(['faq-1']);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customQuestionSubmitted, setCustomQuestionSubmitted] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customEmail, setCustomEmail] = useState<string>('');
  const [customMsg, setCustomMsg] = useState<string>('');

  const handleBookingNavigation = () => {
    if (onNavigateToBooking) onNavigateToBooking();
    else if (setActiveTab) setActiveTab('mixes');
  };

  const categories = ['All', 'Technical', 'Curation', 'Policies', 'Logistics'];
  const toggleFaq = (id: string) => {
    if (openIds.includes(id)) setOpenIds(openIds.filter((item) => item !== id));
    else setOpenIds([...openIds, id]);
  };
  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const handleCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customEmail || !customMsg) return;
    setCustomQuestionSubmitted(true);
    setTimeout(() => { setCustomName(''); setCustomEmail(''); setCustomMsg(''); }, 1500);
  };

  return (
    <div className="w-full bg-[#070b11] text-white">
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-28 sm:pt-32 pb-8">
        <span className="inline-block font-mono text-[10px] sm:text-xs tracking-[0.2em] text-blue-500 uppercase font-bold mb-3">Clear Protocols</span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.05] tracking-tight max-w-3xl">Frequently Asked <span className="text-blue-500">Questions</span></h1>
        <p className="font-sans text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mt-4 leading-relaxed">Everything you need to know about technical riders, backup redundancy, musical curation, and contractual peace of mind.</p>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer border rounded-full ${activeCategory === cat ? 'bg-white text-black border-white font-bold shadow-md' : 'bg-[#0b0f17] text-slate-400 border-slate-700/60 hover:text-white hover:border-slate-700/60'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="w-full md:w-72">
            <input type="text" placeholder="Search questions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#0b0f17] border-2 border-slate-700/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors font-sans" />
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pb-20 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8 space-y-3 sm:space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="vertex-card bg-[#0b0f17] border-2 border-slate-700/60 p-10 text-center">
                <VertexCorners variant="slate" size={16} />
                <HelpCircle className="w-10 h-10 text-blue-500 mx-auto mb-3 opacity-60" />
                <h4 className="font-serif text-lg font-bold text-white mb-2">No matching questions found</h4>
                <p className="font-sans text-sm text-slate-400">Try adjusting your search keywords or submit your question directly to management.</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openIds.includes(faq.id);
                return (
                  <div key={faq.id} className={`vertex-card bg-[#0b0f17] border-2 overflow-hidden transition-colors relative ${isOpen ? 'border-blue-500/30' : 'border-slate-700/60'}`}><VertexCorners variant={isOpen ? 'blue' : 'white'} size={16} thickness={2} />
                    <img src={DJ_ASSETS.djMixerGear} alt='' className='absolute inset-0 w-full h-full object-cover opacity-[0.04] pointer-events-none' />
                    <div className='absolute inset-0 bg-gradient-to-br from-[#0b0f17] via-[#0b0f17]/94 to-[#0b0f17]/55 pointer-events-none' />
                    <button onClick={() => toggleFaq(faq.id)} className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left gap-3 sm:gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                        <span className="font-mono text-[10px] text-blue-400 px-2 py-1 bg-blue-500/10 border border-blue-500/20 shrink-0 w-fit uppercase tracking-wider font-bold">{faq.category}</span>
                        <h3 className="font-serif text-sm sm:text-base font-bold text-white leading-snug">{faq.question}</h3>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-blue-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'opacity-60'}`} />
                    </button>
                    {isOpen && <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-2 text-sm font-sans text-slate-400 leading-relaxed border-t border-slate-700/60"><p className="mt-2">{faq.answer}</p></div>}
                  </div>
                );
              })
            )}
          </div>

          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            <div className="vertex-card bg-[#0b0f17] border-2 border-slate-700/60 p-6 relative overflow-hidden">
              <VertexCorners variant="blue" size={18} />
              <img src={DJ_ASSETS.festivalStage} alt='' className='absolute inset-0 w-full h-full object-cover opacity-[0.05] pointer-events-none' />
              <div className='absolute inset-0 bg-gradient-to-br from-[#0b0f17] via-[#0b0f17]/92 to-[#0b0f17]/55 pointer-events-none' />
              <div className="flex items-center gap-3 mb-3 relative">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
                <h3 className="font-serif text-base font-bold text-white">Zero-Downtime Guarantee</h3>
              </div>
              <p className="font-sans text-xs sm:text-sm text-slate-400 mb-4 leading-relaxed">Every booking includes standby hardware redundancy, $2M liability insurance, and an expedited 24/7 direct artist contact line.</p>
              <button onClick={handleBookingNavigation} className="w-full py-3 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors cursor-pointer rounded-xl">Check Date Availability</button>
            </div>

            <div className="vertex-card bg-[#0b0f17] border-2 border-slate-700/60 p-6 relative overflow-hidden">
              <VertexCorners variant="white" size={18} />
              <img src={DJ_ASSETS.corporateLounge} alt='' className='absolute inset-0 w-full h-full object-cover opacity-[0.05] pointer-events-none' />
              <div className='absolute inset-0 bg-gradient-to-br from-[#0b0f17] via-[#0b0f17]/92 to-[#0b0f17]/55 pointer-events-none' />
              <div className="flex items-center gap-2 mb-3 relative">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <h3 className="font-serif text-base font-bold text-white">Ask Management</h3>
              </div>
              <p className="font-sans text-xs text-slate-400 mb-4">Have a unique venue spec or custom rider? Get a response in under 2 hours.</p>
              {customQuestionSubmitted ? (
                <div className="vertex-card p-4 bg-blue-500/10 border border-blue-500/20 text-center">
                  <VertexCorners variant="blue" size={12} thickness={1.6} />
                  <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-serif text-sm font-bold text-white mb-1">Inquiry Dispatched</h4>
                  <p className="font-sans text-xs text-slate-400">Our team is reviewing your specs and will reply shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleCustomQuestion} className="space-y-3">
                  <input type="text" required placeholder="Your Name" value={customName} onChange={(e) => setCustomName(e.target.value)} className="w-full bg-[#04060a] border-2 border-slate-700/60 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50" />
                  <input type="email" required placeholder="Your Email" value={customEmail} onChange={(e) => setCustomEmail(e.target.value)} className="w-full bg-[#04060a] border-2 border-slate-700/60 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50" />
                  <textarea rows={3} required placeholder="Specific questions or rider inquiries..." value={customMsg} onChange={(e) => setCustomMsg(e.target.value)} className="w-full bg-[#04060a] border-2 border-slate-700/60 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 resize-none" />
                  <button type="submit" className="w-full py-3 bg-blue-500 text-white font-bold text-xs hover:bg-blue-600 transition-colors cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider rounded-xl">
                    <Send className="w-3.5 h-3.5" /> Submit Inquiry
                  </button>
                </form>
              )}
              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Mail className="w-3.5 h-3.5 text-blue-500" /><span>management@overkill-ent.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
