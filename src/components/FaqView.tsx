import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/mockData';
import { ChevronDown, HelpCircle, MessageSquare, ShieldCheck, Mail, Send, CheckCircle } from 'lucide-react';

interface FaqViewProps {
  onNavigateToBooking?: () => void;
  onNavigateToCalendar?: () => void;
  onNavigateToServices?: () => void;
  setActiveTab?: (tab: string) => void;
}

export const FaqView: React.FC<FaqViewProps> = ({
  onNavigateToBooking,
  onNavigateToCalendar,
  onNavigateToServices,
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
    if (onNavigateToBooking) {
      onNavigateToBooking();
    } else if (onNavigateToCalendar) {
      onNavigateToCalendar();
    } else if (setActiveTab) {
      setActiveTab('calendar');
    }
  };

  const categories = ['All', 'Music & Style', 'Gear & Tech', 'Booking & Policy'];

  const toggleFaq = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((item) => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customEmail || !customMsg) return;
    setCustomQuestionSubmitted(true);
    setTimeout(() => {
      setCustomName('');
      setCustomEmail('');
      setCustomMsg('');
    }, 1500);
  };

  return (
    <div className="w-full pt-28 pb-24 md:pb-32 px-6 md:px-16 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-block px-3.5 py-1 bg-[#201f1f] rounded-full border border-[#00daf8]/30 mb-4">
          <span className="font-mono-jb text-xs text-[#00daf8] uppercase tracking-widest font-semibold">
            Clear Protocols
          </span>
        </div>

        <h1 className="font-sora text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold text-[#e5e2e1] mb-6 leading-tight text-glow">
          Frequently Asked Questions
        </h1>

        <p className="font-hanken text-lg text-[#bac9cd] leading-relaxed">
          Everything you need to know about technical riders, backup redundancy, musical curation, and contractual peace of mind.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg font-mono-jb text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#00daf8] text-[#00363f] font-bold shadow-[0_0_15px_rgba(0,218,248,0.4)]'
                  : 'bg-[#201f1f] text-[#bac9cd] hover:text-[#e5e2e1] border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1c1b1b] border border-white/10 rounded-lg px-4 py-2 text-sm text-[#e5e2e1] placeholder-[#859397] focus:outline-none focus:border-[#00daf8] transition-colors font-hanken"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Accordion FAQ list */}
        <div className="lg:col-span-8 space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="glass-panel p-10 rounded-xl text-center">
              <HelpCircle className="w-10 h-10 text-[#00daf8] mx-auto mb-3 opacity-60" />
              <h4 className="font-sora text-lg font-bold text-[#e5e2e1] mb-2">No matching questions found</h4>
              <p className="font-hanken text-sm text-[#bac9cd]">
                Try adjusting your search keywords or submit your question below directly to management.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`glass-panel rounded-xl transition-all duration-300 overflow-hidden border ${
                    isOpen ? 'border-[#00daf8]/40 bg-[#1c1b1b]' : 'border-white/5 bg-[#171616]'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono-jb text-xs text-[#00daf8] px-2 py-0.5 rounded bg-[#00daf8]/10 shrink-0">
                        {faq.category}
                      </span>
                      <h3 className="font-sora text-base md:text-lg font-bold text-[#e5e2e1]">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#00daf8] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#baf2ff]' : 'opacity-60'
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm font-hanken text-[#bac9cd] leading-relaxed border-t border-white/5">
                      <p className="mt-2">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Ask a Question / Fast Contact Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick SLA Card */}
          <div className="glass-panel p-6 rounded-xl border border-[#00daf8]/20 bg-gradient-to-br from-[#171616] to-[#201f1f]">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-[#00daf8]" />
              <h3 className="font-sora text-base font-bold text-[#e5e2e1]">
                Zero-Downtime Guarantee
              </h3>
            </div>
            <p className="font-hanken text-xs text-[#bac9cd] mb-4 leading-relaxed">
              Every booking includes standby hardware redundancy, $2M commercial general liability insurance, and an expedited 24/7 direct artist contact line.
            </p>
            <button
              onClick={handleBookingNavigation}
              className="w-full py-2.5 bg-[#00daf8]/20 border border-[#00daf8] text-[#00daf8] font-mono-jb text-xs uppercase font-bold rounded hover:bg-[#00daf8] hover:text-[#00363f] transition-colors cursor-pointer"
            >
              Check Date Availability
            </button>
          </div>

          {/* Custom Question Form */}
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-[#00daf8]" />
              <h3 className="font-sora text-base font-bold text-[#e5e2e1]">
                Ask Management
              </h3>
            </div>
            <p className="font-hanken text-xs text-[#bac9cd] mb-4">
              Have a unique venue specification or custom festival rider? Get a response in under 2 hours.
            </p>

            {customQuestionSubmitted ? (
              <div className="p-4 bg-[#00daf8]/10 border border-[#00daf8]/40 rounded-lg text-center">
                <CheckCircle className="w-8 h-8 text-[#00daf8] mx-auto mb-2" />
                <h4 className="font-sora text-sm font-bold text-[#e5e2e1] mb-1">Inquiry Dispatched</h4>
                <p className="font-hanken text-xs text-[#bac9cd]">
                  Our management team is reviewing your specs and will reply shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCustomQuestion} className="space-y-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-[#131313] border border-white/10 rounded px-3 py-2 text-xs text-[#e5e2e1] placeholder-[#859397] focus:outline-none focus:border-[#00daf8]"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full bg-[#131313] border border-white/10 rounded px-3 py-2 text-xs text-[#e5e2e1] placeholder-[#859397] focus:outline-none focus:border-[#00daf8]"
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Specific questions or rider inquiries..."
                    value={customMsg}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    className="w-full bg-[#131313] border border-white/10 rounded px-3 py-2 text-xs text-[#e5e2e1] placeholder-[#859397] focus:outline-none focus:border-[#00daf8] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#00daf8] text-[#00363f] font-sora font-bold text-xs rounded hover:bg-[#00e0ff] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Inquiry
                </button>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-[#bac9cd]/70 font-mono-jb">
              <Mail className="w-3.5 h-3.5 text-[#00daf8]" />
              <span>management@overkill-ent.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
