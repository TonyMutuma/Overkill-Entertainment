import React, { useState } from 'react';
import { useCMS, CREW_USERS } from '../../context/CMSContext';
import { DJ_ASSETS } from '../../data/mockData';
import {
  X,
  Sliders,
  Eye,
  EyeOff,
  Layers,
  FileText,
  Image as ImageIcon,
  Disc3,
  DollarSign,
  Calendar as CalendarIcon,
  HelpCircle,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  RotateCcw,
  Download,
  Upload,
  ExternalLink,
  ShieldCheck,
  Music,
  Users,
  Activity,
  Sparkles,
  Inbox,
  AlertCircle,
  Tag,
  Clock,
  MapPin,
  Flame,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { MixTrack, ServicePackage, AddOnItem, FaqItem, VenueItem, ComparisonRow, StoredBookingInquiry } from '../../types';

type AdminTab =
  | 'overview'
  | 'visibility'
  | 'branding'
  | 'media'
  | 'mixes'
  | 'packages'
  | 'calendar'
  | 'faqs'
  | 'venues'
  | 'backup';

const PRESET_IMAGE_LIBRARY: { name: string; url: string; category: string }[] = [
  {
    name: 'Mainstage Red Lasers',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920&auto=format&fit=crop',
    category: 'Hero / Laser'
  },
  {
    name: 'DJ Studio Headphones',
    url: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=1200&auto=format&fit=crop',
    category: 'Portrait'
  },
  {
    name: 'Packed Arena Crowd Hands Up',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    category: 'Crowd'
  },
  {
    name: 'Pioneer Mixer CDJ Console',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
    category: 'Gear'
  },
  {
    name: 'Cyan Cyber Club Lasers',
    url: 'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=1200&auto=format&fit=crop',
    category: 'Club'
  },
  {
    name: 'Luxury Corporate Lounge',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    category: 'Corporate'
  },
  {
    name: 'Outdoor Festival Lights & Stage',
    url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop',
    category: 'Festival'
  },
  {
    name: 'Golden Hour Sunset Rooftop',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    category: 'Rooftop'
  },
  {
    name: 'Luxury Wedding Ballroom Chandeliers',
    url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop',
    category: 'Wedding'
  }
];

export const AdminDashboard: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    pageVisibility,
    togglePage,
    toggleSection,
    setAllPages,
    siteSettings,
    updateSiteSettings,
    images,
    updateImage,
    resetImages,
    mixTracks,
    addMixTrack,
    updateMixTrack,
    deleteMixTrack,
    servicePackages,
    addPackage,
    updatePackage,
    deletePackage,
    addOnItems,
    addAddOn,
    updateAddOn,
    deleteAddOn,
    calendarOverrides,
    setCalendarOverride,
    clearCalendarOverride,
    faqItems,
    addFaqItem,
    updateFaqItem,
    deleteFaqItem,
    trustVenues,
    addVenue,
    updateVenue,
    deleteVenue,
    comparisonTable,
    updateComparisonRow,
    bookingInquiries,
    updateInquiryStatus,
    deleteInquiry,
    resetAllToDefaults,
    exportDataJSON,
    importDataJSON
  } = useCMS();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for temporary editing
  const [editingMixId, setEditingMixId] = useState<string | null>(null);
  const [mixFormData, setMixFormData] = useState<Partial<MixTrack>>({});
  const [isCreatingMix, setIsCreatingMix] = useState(false);

  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [pkgFormData, setPkgFormData] = useState<Partial<ServicePackage>>({});

  const [editingAddonId, setEditingAddonId] = useState<string | null>(null);
  const [addonFormData, setAddonFormData] = useState<Partial<AddOnItem>>({});

  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqFormData, setFaqFormData] = useState<Partial<FaqItem>>({});
  const [isCreatingFaq, setIsCreatingFaq] = useState(false);

  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // Calendar date form
  const [calDate, setCalDate] = useState('2026-09-15');
  const [calStatus, setCalStatus] = useState<'available' | 'booked' | 'restricted'>('booked');
  const [calNotes, setCalNotes] = useState('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Image Upload helper
  const handleImageFileUpload = (key: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        updateImage(key, e.target.result as string);
        showToast(`Updated image for ${key}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExport = () => {
    const json = exportDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `overkill-dj-cms-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Site data exported successfully!');
  };

  const handleImport = () => {
    if (!importJsonText.trim()) {
      setImportError('Please paste JSON data first');
      return;
    }
    const res = importDataJSON(importJsonText);
    if (res.success) {
      setImportError(null);
      setImportJsonText('');
      showToast('Site data imported and applied successfully!');
    } else {
      setImportError(res.error || 'Import failed');
    }
  };

  const navTabs: { id: AdminTab; label: string; icon: any; count?: number }[] = [
    { id: 'overview', label: 'Overview & Stats', icon: Activity },
    { id: 'visibility', label: 'Page & Section Toggles', icon: Eye },
    { id: 'branding', label: 'Brand & Copy Texts', icon: FileText },
    { id: 'media', label: 'Images & Media Assets', icon: ImageIcon },
    { id: 'mixes', label: 'Mixes Vault Manager', icon: Disc3, count: mixTracks.length },
    { id: 'packages', label: 'Pricing & Add-Ons', icon: DollarSign, count: servicePackages.length },
    { id: 'calendar', label: 'Tour Dates & Inquiries', icon: CalendarIcon, count: bookingInquiries.filter(i => i.status === 'new').length },
    { id: 'faqs', label: 'FAQ & Tech Riders', icon: HelpCircle, count: faqItems.length },
    { id: 'venues', label: 'Venues & Comparison', icon: ShieldCheck },
    { id: 'backup', label: 'Backup, Import & Reset', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200 overflow-hidden">
      <div className="relative w-full max-w-7xl h-[98vh] sm:h-[92vh] bg-[#121212] border border-[#ef4444]/40 rounded-xl sm:rounded-2xl shadow-[0_0_80px_rgba(239,68,68,0.2)] flex flex-col overflow-hidden">
        {/* Top Glow bar */}
        <div className="h-1 bg-gradient-to-r from-[#ef4444] via-[#fecaca] to-[#ef4444] shrink-0" />

        {/* Dashboard Header */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 bg-[#181818] border-b border-white/10 flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/40 flex items-center justify-center text-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.3)] shrink-0">
              <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-sora text-sm sm:text-base md:text-xl font-extrabold text-[#e5e2e1] tracking-tight truncate">
                  OVERKILL Crew CMS
                </h1>
                <span className="bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 font-mono-jb text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0">
                  v2.6
                </span>
              </div>
              <p className="font-hanken text-[11px] sm:text-xs text-[#bac9cd]/70 truncate">
                <span className="hidden sm:inline">Logged in as: </span><strong className="text-[#fecaca]">{currentUser?.name}</strong> <span className="text-[10px] text-[#bac9cd]/50">({currentUser?.roleTitle})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={onClose}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#ef4444] text-[white] hover:bg-[#dc2626] font-sora font-bold text-[11px] sm:text-xs shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all cursor-pointer whitespace-nowrap"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Live Site</span>
              <span className="sm:hidden">Live</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-[#bac9cd]/70 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
              aria-label="Close CMS"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast alert message */}
        {toastMessage && (
          <div className="absolute top-14 sm:top-16 right-3 sm:right-6 z-50 bg-[#ef4444] text-[white] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-2xl font-sora font-bold text-xs flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Body with Sidebar + Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Desktop Sidebar Tabs */}
          <div className="w-64 bg-[#141414] border-r border-white/10 p-3 space-y-1 overflow-y-auto shrink-0 hidden md:block">
            <div className="text-[10px] font-mono-jb text-[#bac9cd]/50 uppercase tracking-widest px-3 py-2">
              MANAGEMENT MODULES
            </div>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-hanken text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#ef4444]/15 text-[#ef4444] font-bold border-l-4 border-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                      : 'text-[#bac9cd] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#ef4444]' : 'text-[#bac9cd]/60'}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] font-mono-jb px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#ef4444] text-[white] font-bold'
                          : 'bg-white/5 text-[#bac9cd]/70'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-white/10 px-3">
              <div className="p-3 rounded-xl bg-[#1c1b1b] border border-white/5 space-y-2">
                <div className="font-mono-jb text-[10px] text-[#ef4444] uppercase font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Live Persistence
                </div>
                <p className="text-[11px] text-[#bac9cd]/60 leading-tight">
                  All changes are saved instantly to local browser state and reflect on the public site in real-time.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Tab Scroller Bar */}
          <div className="md:hidden bg-[#161616] border-b border-white/10 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-2 scrollbar-none no-scrollbar">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sora whitespace-nowrap shrink-0 transition-all ${
                      isActive
                        ? 'bg-[#ef4444] text-[white] font-bold shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : 'bg-[#1f1f1f] text-[#bac9cd] hover:text-white border border-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label.split(' ')[0]}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className={`text-[9px] font-mono-jb px-1 py-0.2 rounded-full ${isActive ? 'bg-[white] text-[#ef4444]' : 'bg-white/10 text-[#bac9cd]'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Pane */}
          <div className="flex-1 bg-[#0e0e0e] overflow-y-auto p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            {/* ========================================================================= */}
            {/* TAB 1: OVERVIEW */}
            {/* ========================================================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-sora text-xl font-bold text-[#e5e2e1] mb-1">
                    Website Status & Crew Overview
                  </h2>
                  <p className="font-hanken text-xs text-[#bac9cd]/70">
                    Live system health, quick statistics, and recent client booking leads.
                  </p>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-2">
                    <div className="flex justify-between items-center text-[#bac9cd] text-xs font-mono-jb">
                      <span>PAGES ONLINE</span>
                      <Layers className="w-4 h-4 text-[#ef4444]" />
                    </div>
                    <div className="font-sora text-2xl font-extrabold text-[#ef4444]">
                      {Object.values(pageVisibility.pages).filter(Boolean).length} / 5
                    </div>
                    <div className="text-[11px] text-[#bac9cd]/60">
                      {pageVisibility.pages.home ? 'Home Online' : 'Home Disabled'} • {pageVisibility.pages.mixes ? 'Mixes Active' : 'Mixes Hidden'}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-2">
                    <div className="flex justify-between items-center text-[#bac9cd] text-xs font-mono-jb">
                      <span>AUDIO MIXES</span>
                      <Disc3 className="w-4 h-4 text-[#fecaca]" />
                    </div>
                    <div className="font-sora text-2xl font-extrabold text-[#e5e2e1]">
                      {mixTracks.length} Sets
                    </div>
                    <div className="text-[11px] text-[#bac9cd]/60">
                      {siteSettings.stats.playsCount} Total Plays Logged
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-2">
                    <div className="flex justify-between items-center text-[#bac9cd] text-xs font-mono-jb">
                      <span>NEW INQUIRIES</span>
                      <Inbox className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="font-sora text-2xl font-extrabold text-emerald-400">
                      {bookingInquiries.filter((i) => i.status === 'new').length} Pending
                    </div>
                    <div className="text-[11px] text-[#bac9cd]/60">
                      {bookingInquiries.length} Total Client Leads
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-2">
                    <div className="flex justify-between items-center text-[#bac9cd] text-xs font-mono-jb">
                      <span>BASE PACKAGES</span>
                      <DollarSign className="w-4 h-4 text-[#ef4444]" />
                    </div>
                    <div className="font-sora text-2xl font-extrabold text-[#e5e2e1]">
                      {servicePackages.length} Tiers
                    </div>
                    <div className="text-[11px] text-[#bac9cd]/60">
                      +{addOnItems.length} Sound & Light Add-ons
                    </div>
                  </div>
                </div>

                {/* Quick Navigation / Action Jump */}
                <div className="p-5 rounded-2xl bg-[#161616] border border-[#ef4444]/20 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-sora text-sm font-bold text-[#e5e2e1] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#ef4444]" />
                      Quick CMS Management Shortcuts
                    </h3>
                    <span className="font-mono-jb text-[10px] text-[#ef4444]">ONE-CLICK ACCESS</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => setActiveTab('visibility')}
                      className="p-3 rounded-xl bg-[#1f1f1f] hover:bg-[#252525] border border-white/5 hover:border-[#ef4444]/40 text-left transition-all group cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-[#ef4444] mb-1 group-hover:scale-110 transition-transform" />
                      <div className="font-sora text-xs font-bold text-[#e5e2e1]">Toggle Pages</div>
                      <div className="text-[10px] text-[#bac9cd]/60">Enable / disable tabs</div>
                    </button>

                    <button
                      onClick={() => setActiveTab('mixes')}
                      className="p-3 rounded-xl bg-[#1f1f1f] hover:bg-[#252525] border border-white/5 hover:border-[#ef4444]/40 text-left transition-all group cursor-pointer"
                    >
                      <Disc3 className="w-4 h-4 text-[#fecaca] mb-1 group-hover:scale-110 transition-transform" />
                      <div className="font-sora text-xs font-bold text-[#e5e2e1]">Add New Mix</div>
                      <div className="text-[10px] text-[#bac9cd]/60">Upload & tag sets</div>
                    </button>

                    <button
                      onClick={() => setActiveTab('packages')}
                      className="p-3 rounded-xl bg-[#1f1f1f] hover:bg-[#252525] border border-white/5 hover:border-[#ef4444]/40 text-left transition-all group cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4 text-[#ef4444] mb-1 group-hover:scale-110 transition-transform" />
                      <div className="font-sora text-xs font-bold text-[#e5e2e1]">Edit Rates</div>
                      <div className="text-[10px] text-[#bac9cd]/60">Change pricing & tier fees</div>
                    </button>

                    <button
                      onClick={() => setActiveTab('media')}
                      className="p-3 rounded-xl bg-[#1f1f1f] hover:bg-[#252525] border border-white/5 hover:border-[#ef4444]/40 text-left transition-all group cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-[#dc2626] mb-1 group-hover:scale-110 transition-transform" />
                      <div className="font-sora text-xs font-bold text-[#e5e2e1]">Change Photos</div>
                      <div className="text-[10px] text-[#bac9cd]/60">Swap DJ & hero imagery</div>
                    </button>
                  </div>
                </div>

                {/* Latest Booking Inquiries Preview */}
                <div className="p-5 rounded-2xl bg-[#161616] border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-sora text-sm font-bold text-[#e5e2e1] flex items-center gap-2">
                        <Inbox className="w-4 h-4 text-emerald-400" />
                        Recent Booking Submissions ({bookingInquiries.length})
                      </h3>
                      <p className="text-xs text-[#bac9cd]/60">Client leads submitted via public modal</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('calendar')}
                      className="text-xs font-sora font-semibold text-[#ef4444] hover:underline"
                    >
                      View All & Manage →
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {bookingInquiries.slice(0, 3).map((inq) => (
                      <div
                        key={inq.id}
                        className="p-3.5 rounded-xl bg-[#1c1b1b] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-sora text-xs font-bold text-[#e5e2e1]">
                              {inq.clientName}
                            </span>
                            <span
                              className={`text-[9px] font-mono-jb uppercase px-2 py-0.5 rounded-full font-semibold ${
                                inq.status === 'confirmed'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : inq.status === 'reviewed'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40'
                              }`}
                            >
                              {inq.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#bac9cd]/70 mt-0.5">
                            {inq.eventType} • Date: <strong className="text-[#fecaca]">{inq.eventDate}</strong> • {inq.venueCity} ({inq.venueName})
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono-jb text-xs font-bold text-[#ef4444]">
                            ${inq.estimatedTotal.toLocaleString()} USD
                          </span>
                          <button
                            onClick={() => {
                              updateInquiryStatus(
                                inq.id,
                                inq.status === 'confirmed' ? 'reviewed' : 'confirmed'
                              );
                              showToast(`Inquiry status updated for ${inq.clientName}`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-[#bac9cd] hover:text-white border border-white/10 font-mono-jb"
                          >
                            Toggle Status
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: VISIBILITY TOGGLES */}
            {/* ========================================================================= */}
            {activeTab === 'visibility' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-sora text-xl font-bold text-[#e5e2e1] mb-1 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-[#ef4444]" />
                      Page & Component Visibility Matrix
                    </h2>
                    <p className="font-hanken text-xs text-[#bac9cd]/70">
                      Enable or disable entire navigation pages or individual page sections in real-time.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setAllPages(true);
                        showToast('All pages enabled');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-sora font-semibold hover:bg-emerald-500/30 transition-colors"
                    >
                      Enable All Pages
                    </button>
                  </div>
                </div>

                {/* Section 1: Main Pages */}
                <div className="p-5 rounded-2xl bg-[#161616] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h3 className="font-sora text-sm font-bold text-[#e5e2e1]">
                        1. Primary Navigation Pages
                      </h3>
                      <p className="text-xs text-[#bac9cd]/60">
                        Disabling a page removes it from the top Navbar and disables direct URL routing
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(
                      [
                        { key: 'home', label: 'Home / Hero & Overview', desc: 'Main landing page & showreel' },
                        { key: 'mixes', label: 'Mixes / Audio Vault', desc: 'Audio tracks, tracklists, filter tags' },
                        { key: 'calendar', label: 'Availability Calendar', desc: '2026 tour route, open dates & booking' },
                        { key: 'services', label: 'Services & Pricing', desc: 'Package rates, custom add-ons & calculator' },
                        { key: 'faq', label: 'Protocols & Tech Rider', desc: 'Technical specs, curation & policies' }
                      ] as const
                    ).map((page) => {
                      const isOnline = pageVisibility.pages[page.key];
                      return (
                        <div
                          key={page.key}
                          className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                            isOnline
                              ? 'bg-[#1c1b1b] border-[#ef4444]/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                              : 'bg-[#141414] border-white/5 opacity-60'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-sora text-xs font-bold text-[#e5e2e1]">
                                {page.label}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#bac9cd]/60 mt-0.5">{page.desc}</p>
                          </div>

                          <button
                            onClick={() => {
                              togglePage(page.key);
                              showToast(`Toggled ${page.label} ${!isOnline ? 'ON' : 'OFF'}`);
                            }}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              isOnline ? 'bg-[#ef4444]' : 'bg-zinc-800'
                            }`}
                          >
                            <span
                              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                isOnline ? 'left-7 bg-[white]' : 'left-1'
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Sub-Component Sections */}
                <div className="p-5 rounded-2xl bg-[#161616] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h3 className="font-sora text-sm font-bold text-[#e5e2e1]">
                        2. Page Sub-Components & Interactive Sections
                      </h3>
                      <p className="text-xs text-[#bac9cd]/60">
                        Selectively show or hide individual widgets across pages
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(
                      [
                        { key: 'hero', label: 'Hero Header Block', desc: 'Main headline, CTA & DJ tagline' },
                        { key: 'trustVenues', label: 'Trusted Venues Bar', desc: 'Muze, Alchemist & Kilifi ticker' },
                        { key: 'liveAudioTeaser', label: 'Live Audio Previewer', desc: 'Audio sound wave teaser on Home' },
                        { key: 'statsTicker', label: 'Key Statistics Strip', desc: '250+ shows, 80K+ plays counter' },
                        { key: 'featuredMix', label: 'Featured Mix Spotlight', desc: 'Neon Nights Vol. 4 highlight' },
                        { key: 'ctaBanner', label: 'Bottom Booking Banner', desc: 'High-octane clearance CTA card' },
                        { key: 'comparisonTable', label: 'DJs Comparison Table', desc: 'Standard DJs vs OVERKILL specs' },
                        { key: 'addOnsBuilder', label: 'Custom Add-Ons Picker', desc: 'Lighting, Sax, CO2 add-on list' },
                        { key: 'currencyBanner', label: 'Currency & Geo Bar', desc: 'KES/USD dynamic localized rate' },
                        { key: 'audioPlayerBar', label: 'Bottom Audio Bar', desc: 'Persistent player bar with waveforms' },
                        { key: 'heroMediaStrip', label: 'DJ Photo Media Grid', desc: 'Studio & crowd photo preview strip' }
                      ] as const
                    ).map((sec) => {
                      const isSecActive = pageVisibility.sections[sec.key];
                      return (
                        <div
                          key={sec.key}
                          className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                            isSecActive
                              ? 'bg-[#1c1b1b] border-white/15'
                              : 'bg-[#141414] border-white/5 opacity-50'
                          }`}
                        >
                          <div>
                            <div className="font-sora text-xs font-bold text-[#e5e2e1]">
                              {sec.label}
                            </div>
                            <p className="text-[11px] text-[#bac9cd]/60 mt-0.5">{sec.desc}</p>
                          </div>

                          <button
                            onClick={() => {
                              toggleSection(sec.key);
                              showToast(`Toggled ${sec.label} ${!isSecActive ? 'ON' : 'OFF'}`);
                            }}
                            className={`w-11 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ml-2 ${
                              isSecActive ? 'bg-[#ef4444]' : 'bg-zinc-800'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${
                                isSecActive ? 'left-6 bg-[white]' : 'left-1 bg-zinc-400'
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: BRANDING & COPY */}
            {/* ========================================================================= */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-sora text-xl font-bold text-[#e5e2e1] mb-1 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#ef4444]" />
                    Site Branding, Bio & Headline Texts
                  </h2>
                  <p className="font-hanken text-xs text-[#bac9cd]/70">
                    Update DJ profile details, hero copy, contact phone/email, and social links.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#161616] border border-white/10 space-y-6">
                  {/* Identity & DJ Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono-jb text-xs text-[#bac9cd] mb-1.5">
                        Brand Name (Navbar Logo)
                      </label>
                      <input
                        type="text"
                        value={siteSettings.brandName}
                        onChange={(e) => updateSiteSettings({ brandName: e.target.value })}
                        className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#e5e2e1] focus:border-[#ef4444] outline-none font-sora font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-mono-jb text-xs text-[#bac9cd] mb-1.5">
                        DJ Stage Name
                      </label>
                      <input
                        type="text"
                        value={siteSettings.djName}
                        onChange={(e) => updateSiteSettings({ djName: e.target.value })}
                        className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#e5e2e1] focus:border-[#ef4444] outline-none font-sora font-bold"
                      />
                    </div>
                  </div>

                  {/* Tagline & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono-jb text-xs text-[#bac9cd] mb-1.5">
                        Tagline / Sub-Branding
                      </label>
                      <input
                        type="text"
                        value={siteSettings.tagline}
                        onChange={(e) => updateSiteSettings({ tagline: e.target.value })}
                        className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#e5e2e1] focus:border-[#ef4444] outline-none font-hanken"
                      />
                    </div>

                    <div>
                      <label className="block font-mono-jb text-xs text-[#bac9cd] mb-1.5">
                        Headquarters & Tour Territory
                      </label>
                      <input
                        type="text"
                        value={siteSettings.location}
                        onChange={(e) => updateSiteSettings({ location: e.target.value })}
                        className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#e5e2e1] focus:border-[#ef4444] outline-none font-hanken"
                      />
                    </div>
                  </div>

                  {/* DJ Bio */}
                  <div>
                    <label className="block font-mono-jb text-xs text-[#bac9cd] mb-1.5">
                      DJ Biography & Profile Summary
                    </label>
                    <textarea
                      rows={3}
                      value={siteSettings.bio}
                      onChange={(e) => updateSiteSettings({ bio: e.target.value })}
                      className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#e5e2e1] focus:border-[#ef4444] outline-none font-hanken leading-relaxed"
                    />
                  </div>

                  {/* Hero Copy */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="font-sora text-sm font-bold text-[#fecaca]">
                      Hero Section Typography
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block font-mono-jb text-xs text-[#bac9cd] mb-1.5">
                          Hero Main Headline
                        </label>
                        <input
                          type="text"
                          value={siteSettings.heroTitle}
                          onChange={(e) => updateSiteSettings({ heroTitle: e.target.value })}
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#e5e2e1] focus:border-[#ef4444] outline-none font-sora font-extrabold"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-jb text-xs text-[#bac9cd] mb-1.5">
                          Hero Subtitle Description
                        </label>
                        <textarea
                          rows={2}
                          value={siteSettings.heroSubtitle}
                          onChange={(e) => updateSiteSettings({ heroSubtitle: e.target.value })}
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#e5e2e1] focus:border-[#ef4444] outline-none font-hanken"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact & Social Links */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="font-sora text-sm font-bold text-[#fecaca]">
                      Agency Contacts & Social Channels
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-mono-jb text-xs text-[#bac9cd] mb-1.5">
                          Bookings Email
                        </label>
                        <input
                          type="email"
                          value={siteSettings.contactEmail}
                          onChange={(e) => updateSiteSettings({ contactEmail: e.target.value })}
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#ef4444] outline-none font-mono-jb"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-jb text-xs text-[#bac9cd] mb-1.5">
                          Tour Phone (Kenya)
                        </label>
                        <input
                          type="text"
                          value={siteSettings.contactPhone}
                          onChange={(e) => updateSiteSettings({ contactPhone: e.target.value })}
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#ef4444] outline-none font-mono-jb"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-jb text-xs text-[#bac9cd] mb-1.5">
                          WhatsApp International Number
                        </label>
                        <input
                          type="text"
                          value={siteSettings.whatsappNumber}
                          onChange={(e) => updateSiteSettings({ whatsappNumber: e.target.value })}
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#ef4444] outline-none font-mono-jb"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-jb text-xs text-[#bac9cd] mb-1.5">
                          Instagram Profile URL
                        </label>
                        <input
                          type="url"
                          value={siteSettings.instagramUrl}
                          onChange={(e) => updateSiteSettings({ instagramUrl: e.target.value })}
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#ef4444] outline-none font-mono-jb"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-jb text-xs text-[#bac9cd] mb-1.5">
                          SoundCloud Channel URL
                        </label>
                        <input
                          type="url"
                          value={siteSettings.soundcloudUrl}
                          onChange={(e) => updateSiteSettings({ soundcloudUrl: e.target.value })}
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#ef4444] outline-none font-mono-jb"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats Counter */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="font-sora text-sm font-bold text-[#fecaca]">
                      Public Performance Counters
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block font-mono-jb text-[11px] text-[#bac9cd] mb-1">
                          Shows Performed
                        </label>
                        <input
                          type="text"
                          value={siteSettings.stats.showsCount}
                          onChange={(e) =>
                            updateSiteSettings({
                              stats: { ...siteSettings.stats, showsCount: e.target.value }
                            })
                          }
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#ef4444] font-bold font-mono-jb"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-jb text-[11px] text-[#bac9cd] mb-1">
                          Streams / Plays
                        </label>
                        <input
                          type="text"
                          value={siteSettings.stats.playsCount}
                          onChange={(e) =>
                            updateSiteSettings({
                              stats: { ...siteSettings.stats, playsCount: e.target.value }
                            })
                          }
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#ef4444] font-bold font-mono-jb"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-jb text-[11px] text-[#bac9cd] mb-1">
                          Countries Toured
                        </label>
                        <input
                          type="text"
                          value={siteSettings.stats.countriesCount}
                          onChange={(e) =>
                            updateSiteSettings({
                              stats: { ...siteSettings.stats, countriesCount: e.target.value }
                            })
                          }
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#ef4444] font-bold font-mono-jb"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-jb text-[11px] text-[#bac9cd] mb-1">
                          Satisfaction Rate
                        </label>
                        <input
                          type="text"
                          value={siteSettings.stats.satisfactionRate}
                          onChange={(e) =>
                            updateSiteSettings({
                              stats: { ...siteSettings.stats, satisfactionRate: e.target.value }
                            })
                          }
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#ef4444] font-bold font-mono-jb"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: IMAGES & MEDIA */}
            {/* ========================================================================= */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-sora text-xl font-bold text-[#e5e2e1] mb-1 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-[#ef4444]" />
                      Imagery & Visual Assets Manager
                    </h2>
                    <p className="font-hanken text-xs text-[#bac9cd]/70">
                      Swap hero background, DJ studio portraits, club lasers, and wedding assets with custom URLs or local uploads.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      resetImages();
                      showToast('Images reset to original assets');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono-jb text-[#bac9cd] hover:text-white border border-white/10 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Images
                  </button>
                </div>

                {/* Preset Quick Library */}
                <div className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-jb text-xs text-[#ef4444] font-bold uppercase">
                      Curated High-Res DJ Preset Library
                    </span>
                    <span className="text-[10px] text-[#bac9cd]/60 font-mono-jb">
                      Click "Set as Hero" or copy URL
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_IMAGE_LIBRARY.map((preset, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-video rounded-lg overflow-hidden border border-white/10 hover:border-[#ef4444] transition-all cursor-pointer"
                        onClick={() => {
                          updateImage('heroBg', preset.url);
                          showToast(`Set "${preset.name}" as Hero Background!`);
                        }}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-1.5 transition-opacity text-[10px] text-white">
                          <span className="font-bold truncate">{preset.name}</span>
                          <span className="text-[#ef4444] text-[9px]">Set as Hero</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Image Slots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(
                    [
                      { key: 'heroBg', label: 'Main Hero Background', aspect: 'aspect-[16/9]' },
                      { key: 'djPortraitStudio', label: 'DJ Studio Portrait', aspect: 'aspect-[4/3]' },
                      { key: 'djPerformingCrowd', label: 'Live Arena Crowd', aspect: 'aspect-[4/3]' },
                      { key: 'djMixerGear', label: 'Pioneer DJM-V10 & CDJs', aspect: 'aspect-[4/3]' },
                      { key: 'clubLaser', label: 'Underground Club Lasers', aspect: 'aspect-[4/3]' },
                      { key: 'corporateLounge', label: 'Corporate Gala Lounge', aspect: 'aspect-[4/3]' },
                      { key: 'festivalStage', label: 'Festival Mainstage Lights', aspect: 'aspect-[4/3]' },
                      { key: 'rooftopSunset', label: 'Rooftop Sunset Vibes', aspect: 'aspect-[4/3]' },
                      { key: 'luxuryWedding', label: 'Luxury Ballroom Wedding', aspect: 'aspect-[4/3]' }
                    ] as const
                  ).map((slot) => {
                    const currentImg = images[slot.key] || DJ_ASSETS[slot.key];
                    return (
                      <div
                        key={slot.key}
                        className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-sora text-xs font-bold text-[#e5e2e1]">
                            {slot.label}
                          </span>
                          <span className="font-mono-jb text-[10px] text-[#ef4444] uppercase">
                            {slot.key}
                          </span>
                        </div>

                        <div className={`relative w-full ${slot.aspect} rounded-xl overflow-hidden bg-black/50 border border-white/10`}>
                          <img
                            src={currentImg}
                            alt={slot.label}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={currentImg}
                            onChange={(e) => updateImage(slot.key, e.target.value)}
                            placeholder="Paste image URL here..."
                            className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#bac9cd] font-mono-jb focus:border-[#ef4444] outline-none truncate"
                          />

                          <div className="flex items-center gap-2">
                            <label className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-sora text-[#bac9cd] hover:text-white cursor-pointer transition-colors">
                              <Upload className="w-3 h-3 text-[#ef4444]" />
                              <span>Upload File</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    handleImageFileUpload(slot.key, e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 5: AUDIO MIXES VAULT */}
            {/* ========================================================================= */}
            {activeTab === 'mixes' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-sora text-xl font-bold text-[#e5e2e1] mb-1 flex items-center gap-2">
                      <Disc3 className="w-5 h-5 text-[#ef4444]" />
                      Mixes Vault & Audio Sets Manager ({mixTracks.length})
                    </h2>
                    <p className="font-hanken text-xs text-[#bac9cd]/70">
                      Add, edit, re-tag, and re-order DJ Wolverine's live recorded audio sets.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsCreatingMix(true);
                      setMixFormData({
                        title: 'New Live Mix Vol. ' + (mixTracks.length + 1),
                        category: 'club',
                        categoryLabel: 'Club',
                        duration: '1h 30m',
                        recordedAt: 'Recorded live at Muze Club, Nairobi',
                        description: 'High-octane tech-house and afro-tech groove set.',
                        date: 'Aug 2026',
                        plays: '1.2k Plays',
                        bpm: 126,
                        imageUrl: images.clubLaser || DJ_ASSETS.clubLaser,
                        audioKey: 'tech-house',
                        tags: ['Tech House', 'Afro Tech', '126 BPM'],
                        tracklistSnippet: [
                          '01. DJ Wolverine - VIP Opening',
                          '02. Chris Lake - In The Yuma (Edit)',
                          '03. DJ Wolverine - Sonic Finish'
                        ]
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#ef4444] text-[white] font-sora font-bold text-xs rounded-xl hover:bg-[#dc2626] transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Audio Mix Track</span>
                  </button>
                </div>

                {/* Create / Edit Form Modal/Drawer */}
                {(isCreatingMix || editingMixId) && (
                  <div className="p-5 rounded-2xl bg-[#161616] border border-[#ef4444]/50 space-y-4 shadow-2xl animate-in fade-in">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <h3 className="font-sora text-sm font-bold text-[#fecaca]">
                        {isCreatingMix ? 'Create New Audio Set' : 'Edit Mix Track Details'}
                      </h3>
                      <button
                        onClick={() => {
                          setIsCreatingMix(false);
                          setEditingMixId(null);
                        }}
                        className="text-[#bac9cd] hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-mono-jb text-[11px] text-[#bac9cd] mb-1">
                          Mix Title
                        </label>
                        <input
                          type="text"
                          value={mixFormData.title || ''}
                          onChange={(e) => setMixFormData({ ...mixFormData, title: e.target.value })}
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#ef4444] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-jb text-[11px] text-[#bac9cd] mb-1">
                          Category
                        </label>
                        <select
                          value={mixFormData.category || 'club'}
                          onChange={(e) => {
                            const cat = e.target.value as any;
                            const label =
                              cat === 'club'
                                ? 'Club'
                                : cat === 'corporate'
                                ? 'Corporate'
                                : cat === 'wedding'
                                ? 'Wedding'
                                : cat === 'festival'
                                ? 'Festival'
                                : 'Private Party';
                            setMixFormData({ ...mixFormData, category: cat, categoryLabel: label });
                          }}
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#ef4444] outline-none"
                        >
                          <option value="club">Club</option>
                          <option value="corporate">Corporate</option>
                          <option value="wedding">Wedding</option>
                          <option value="festival">Festival</option>
                          <option value="private">Private Party</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono-jb text-[11px] text-[#bac9cd] mb-1">
                          BPM & Tempo
                        </label>
                        <input
                          type="number"
                          value={mixFormData.bpm || 128}
                          onChange={(e) =>
                            setMixFormData({ ...mixFormData, bpm: parseInt(e.target.value) || 128 })
                          }
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#ef4444] outline-none font-mono-jb"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-mono-jb text-[11px] text-[#bac9cd] mb-1">
                          Duration (e.g. 1h 45m)
                        </label>
                        <input
                          type="text"
                          value={mixFormData.duration || ''}
                          onChange={(e) => setMixFormData({ ...mixFormData, duration: e.target.value })}
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#ef4444] outline-none font-mono-jb"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-jb text-[11px] text-[#bac9cd] mb-1">
                          Recorded At Venue
                        </label>
                        <input
                          type="text"
                          value={mixFormData.recordedAt || ''}
                          onChange={(e) =>
                            setMixFormData({ ...mixFormData, recordedAt: e.target.value })
                          }
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#ef4444] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-jb text-[11px] text-[#bac9cd] mb-1">
                          Plays Count Metric
                        </label>
                        <input
                          type="text"
                          value={mixFormData.plays || ''}
                          onChange={(e) => setMixFormData({ ...mixFormData, plays: e.target.value })}
                          className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#ef4444] outline-none font-mono-jb"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono-jb text-[11px] text-[#bac9cd] mb-1">
                        Tracklist / Snippet (one per line)
                      </label>
                      <textarea
                        rows={3}
                        value={(mixFormData.tracklistSnippet || []).join('\n')}
                        onChange={(e) =>
                          setMixFormData({
                            ...mixFormData,
                            tracklistSnippet: e.target.value
                              .split('\n')
                              .map((s) => s.trim())
                              .filter(Boolean)
                          })
                        }
                        placeholder="01. Song - Artist&#10;02. Song 2 - Artist 2"
                        className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#ef4444] outline-none font-mono-jb"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => {
                          setIsCreatingMix(false);
                          setEditingMixId(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-white/5 text-xs text-[#bac9cd] hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (isCreatingMix) {
                            addMixTrack(mixFormData as any);
                            showToast(`Created mix: ${mixFormData.title}`);
                          } else if (editingMixId) {
                            updateMixTrack(editingMixId, mixFormData);
                            showToast(`Updated mix: ${mixFormData.title}`);
                          }
                          setIsCreatingMix(false);
                          setEditingMixId(null);
                        }}
                        className="px-5 py-2 rounded-xl bg-[#ef4444] text-[white] font-sora font-bold text-xs hover:bg-[#dc2626]"
                      >
                        Save Track Changes
                      </button>
                    </div>
                  </div>
                )}

                {/* Mix Tracks List */}
                <div className="space-y-3">
                  {mixTracks.map((mix) => (
                    <div
                      key={mix.id}
                      className="p-4 rounded-2xl bg-[#161616] border border-white/10 hover:border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={mix.imageUrl}
                          alt={mix.title}
                          className="w-14 h-14 rounded-xl object-cover border border-[#ef4444]/30 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-sora text-sm font-bold text-[#e5e2e1]">
                              {mix.title}
                            </h3>
                            <span className="font-mono-jb text-[10px] text-[#ef4444] px-2 py-0.5 rounded-full bg-[#ef4444]/15 border border-[#ef4444]/30">
                              {mix.bpm} BPM
                            </span>
                            <span className="font-mono-jb text-[10px] text-[#fecaca] px-2 py-0.5 rounded-full bg-white/5">
                              {mix.categoryLabel}
                            </span>
                          </div>
                          <div className="text-xs text-[#bac9cd]/70 mt-1">
                            {mix.recordedAt} • {mix.duration} • <strong className="text-[#ef4444]">{mix.plays}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingMixId(mix.id);
                            setMixFormData(mix);
                            setIsCreatingMix(false);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#ef4444]/20 hover:text-[#ef4444] text-xs font-sora text-[#bac9cd] transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete mix "${mix.title}"?`)) {
                              deleteMixTrack(mix.id);
                              showToast(`Deleted ${mix.title}`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-[#bac9cd] hover:text-rose-300 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 6: PACKAGES & RATES */}
            {/* ========================================================================= */}
            {activeTab === 'packages' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-sora text-xl font-bold text-[#e5e2e1] mb-1 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#ef4444]" />
                    Service Packages & Add-Ons Rates
                  </h2>
                  <p className="font-hanken text-xs text-[#bac9cd]/70">
                    Adjust base pricing tiers in USD (automatically converted to KES, EUR, GBP via CurrencyContext) and customize add-on features.
                  </p>
                </div>

                {/* Base Packages */}
                <div className="space-y-4">
                  <h3 className="font-sora text-sm font-bold text-[#fecaca]">
                    1. Primary Booking Tiers
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {servicePackages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`p-5 rounded-2xl bg-[#161616] border ${
                          pkg.isPopular ? 'border-[#ef4444]/60 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-white/10'
                        } flex flex-col justify-between space-y-4`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-sora text-base font-bold text-[#e5e2e1]">
                              {pkg.name}
                            </span>
                            <span className="font-mono-jb text-[10px] text-[#ef4444] px-2 py-0.5 rounded-full bg-[#ef4444]/15 font-bold">
                              {pkg.tag}
                            </span>
                          </div>

                          <div className="flex items-baseline gap-1 my-3">
                            <span className="font-sora text-2xl font-extrabold text-[#ef4444]">
                              ${pkg.price}
                            </span>
                            <span className="font-mono-jb text-xs text-[#bac9cd]">
                              {pkg.pricePeriod} (USD Base)
                            </span>
                          </div>

                          <p className="text-xs text-[#bac9cd]/80 leading-relaxed mb-4">
                            {pkg.description}
                          </p>

                          <div className="space-y-1.5 text-xs text-[#bac9cd]">
                            {pkg.features.map((f, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-[#ef4444] shrink-0" />
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                          <button
                            onClick={() => {
                              const newPrice = prompt(
                                `Enter new base USD price for ${pkg.name}:`,
                                pkg.price.toString()
                              );
                              if (newPrice && !isNaN(Number(newPrice))) {
                                updatePackage(pkg.id, { price: Number(newPrice) });
                                showToast(`Updated ${pkg.name} price to $${newPrice}`);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#ef4444]/20 hover:bg-[#ef4444] text-[#ef4444] hover:text-[white] font-sora font-bold text-xs transition-colors"
                          >
                            Edit Rate ($)
                          </button>

                          <button
                            onClick={() => {
                              updatePackage(pkg.id, { isPopular: !pkg.isPopular });
                              showToast(`Toggled popular badge for ${pkg.name}`);
                            }}
                            className="text-[11px] text-[#bac9cd] hover:text-white font-mono-jb"
                          >
                            {pkg.isPopular ? '★ Popular' : 'Set Popular'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add-On Items */}
                <div className="p-5 rounded-2xl bg-[#161616] border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-sora text-sm font-bold text-[#fecaca]">
                      2. Equipment & Production Add-Ons ({addOnItems.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {addOnItems.map((addon) => (
                      <div
                        key={addon.id}
                        className="p-4 rounded-xl bg-[#1c1b1b] border border-white/10 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-sora text-xs font-bold text-[#e5e2e1]">
                            {addon.name}
                          </div>
                          <div className="font-mono-jb text-xs text-[#ef4444] font-bold mt-0.5">
                            +${addon.price} USD
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const newP = prompt(
                              `Enter new USD price for ${addon.name}:`,
                              addon.price.toString()
                            );
                            if (newP && !isNaN(Number(newP))) {
                              updateAddOn(addon.id, { price: Number(newP) });
                              showToast(`Updated ${addon.name} price`);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono-jb text-[#bac9cd] hover:text-[#ef4444] shrink-0"
                        >
                          Change Price
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 7: TOUR DATES & INQUIRIES */}
            {/* ========================================================================= */}
            {activeTab === 'calendar' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-sora text-xl font-bold text-[#e5e2e1] mb-1 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-[#ef4444]" />
                    Tour Dates Schedule & Inquiries Pipeline
                  </h2>
                  <p className="font-hanken text-xs text-[#bac9cd]/70">
                    Set 2026 tour date availability status, lock confirmed festival bookings, and review client submissions.
                  </p>
                </div>

                {/* Calendar Overrides Setter */}
                <div className="p-5 rounded-2xl bg-[#161616] border border-white/10 space-y-4">
                  <h3 className="font-sora text-sm font-bold text-[#fecaca]">
                    Set 2026 Tour Date Availability Override
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="block font-mono-jb text-[11px] text-[#bac9cd] mb-1">
                        Select Date (YYYY-MM-DD)
                      </label>
                      <input
                        type="date"
                        value={calDate}
                        onChange={(e) => setCalDate(e.target.value)}
                        className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] font-mono-jb focus:border-[#ef4444] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-mono-jb text-[11px] text-[#bac9cd] mb-1">
                        Booking Status
                      </label>
                      <select
                        value={calStatus}
                        onChange={(e) => setCalStatus(e.target.value as any)}
                        className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#ef4444] outline-none"
                      >
                        <option value="booked">Booked (Red)</option>
                        <option value="restricted">Restricted / Agency Hold (Yellow)</option>
                        <option value="available">Available (Cyan / Open)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono-jb text-[11px] text-[#bac9cd] mb-1">
                        Venue / Event Note
                      </label>
                      <input
                        type="text"
                        value={calNotes}
                        onChange={(e) => setCalNotes(e.target.value)}
                        placeholder="e.g. Muze Club Nairobi"
                        className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#ef4444] outline-none"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setCalendarOverride(calDate, calStatus, calNotes);
                        showToast(`Set date ${calDate} as ${calStatus}`);
                        setCalNotes('');
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#ef4444] text-[white] font-sora font-bold text-xs hover:bg-[#dc2626] transition-all cursor-pointer"
                    >
                      Save Tour Date
                    </button>
                  </div>

                  {/* Active Overrides List */}
                  <div className="pt-3 border-t border-white/10">
                    <div className="text-xs font-mono-jb text-[#bac9cd]/70 mb-2">
                      Active 2026 Overrides ({Object.keys(calendarOverrides).length}):
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(calendarOverrides).map(([date, rawData]) => {
                        const data = rawData as { status: 'available' | 'booked' | 'restricted'; notes?: string };
                        return (
                          <div
                            key={date}
                            className="p-2 px-3 rounded-lg bg-[#1c1b1b] border border-white/10 flex items-center gap-2 text-xs"
                          >
                            <span className="font-mono-jb font-bold text-[#e5e2e1]">{date}</span>
                            <span
                              className={`text-[9px] font-mono-jb uppercase px-1.5 py-0.2 rounded ${
                                data?.status === 'booked'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : data?.status === 'restricted'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-[#ef4444]/20 text-[#ef4444]'
                              }`}
                            >
                              {data?.status || 'available'}
                            </span>
                            {data?.notes && (
                              <span className="text-[11px] text-[#bac9cd]/60">({data.notes})</span>
                            )}
                            <button
                              onClick={() => {
                                clearCalendarOverride(date);
                                showToast(`Cleared override for ${date}`);
                              }}
                              className="text-rose-400 hover:text-rose-300 ml-1"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Booking Submissions Inquiries */}
                <div className="p-5 rounded-2xl bg-[#161616] border border-white/10 space-y-4">
                  <h3 className="font-sora text-sm font-bold text-[#fecaca]">
                    Client Booking Inquiries Pipeline ({bookingInquiries.length})
                  </h3>

                  <div className="space-y-3">
                    {bookingInquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 rounded-xl bg-[#1c1b1b] border border-white/10 space-y-2.5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="font-sora text-sm font-bold text-[#e5e2e1]">
                              {inq.clientName}
                            </span>
                            <span className="font-mono-jb text-[10px] text-[#ef4444] px-2 py-0.5 rounded bg-[#ef4444]/15 uppercase font-semibold">
                              {inq.eventType}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono-jb text-xs font-bold text-[#ef4444]">
                              ${inq.estimatedTotal.toLocaleString()} USD
                            </span>
                            <select
                              value={inq.status}
                              onChange={(e) => {
                                updateInquiryStatus(inq.id, e.target.value as any);
                                showToast(`Updated status for ${inq.clientName}`);
                              }}
                              className="bg-[#141414] border border-white/10 rounded-lg px-2 py-1 text-xs text-[#e5e2e1] font-mono-jb"
                            >
                              <option value="new">New</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="archived">Archived</option>
                            </select>
                            <button
                              onClick={() => {
                                if (confirm(`Delete inquiry for ${inq.clientName}?`)) {
                                  deleteInquiry(inq.id);
                                  showToast('Inquiry deleted');
                                }
                              }}
                              className="text-[#bac9cd] hover:text-rose-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#bac9cd]/80 font-hanken">
                          <div>
                            <strong>Email:</strong> {inq.email}
                          </div>
                          <div>
                            <strong>Phone:</strong> {inq.phone}
                          </div>
                          <div>
                            <strong>Event Date:</strong> <span className="text-[#ef4444]">{inq.eventDate}</span>
                          </div>
                        </div>

                        <div className="text-xs text-[#bac9cd]/80">
                          <strong>Venue:</strong> {inq.venueName}, {inq.venueCity} ({inq.guestCount} Guests) • Package: <strong className="text-[#fecaca] uppercase">{inq.selectedPackage}</strong>
                        </div>

                        {inq.specialRequests && (
                          <div className="p-2 rounded bg-black/40 text-[11px] text-[#bac9cd] italic font-hanken border-l-2 border-[#ef4444]">
                            "{inq.specialRequests}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 8: FAQ & RIDER */}
            {/* ========================================================================= */}
            {activeTab === 'faqs' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-sora text-xl font-bold text-[#e5e2e1] mb-1 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-[#ef4444]" />
                      Technical Rider & FAQ Protocols ({faqItems.length})
                    </h2>
                    <p className="font-hanken text-xs text-[#bac9cd]/70">
                      Manage sound system specifications, curation guidelines, cancellation policies, and travel riders.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const q = prompt('Enter FAQ Question:');
                      if (q) {
                        const a = prompt('Enter FAQ Answer:') || '';
                        const cat = prompt('Enter Category (Technical, Curation, Policies, Logistics):') || 'General';
                        addFaqItem({ question: q, answer: a, category: cat });
                        showToast('Added new FAQ item');
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ef4444] text-[white] font-sora font-bold text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add FAQ / Rider
                  </button>
                </div>

                <div className="space-y-3">
                  {faqItems.map((faq) => (
                    <div
                      key={faq.id}
                      className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono-jb text-[10px] text-[#ef4444] px-2 py-0.5 rounded bg-[#ef4444]/15 uppercase font-semibold">
                            {faq.category}
                          </span>
                          <h3 className="font-sora text-sm font-bold text-[#e5e2e1] mt-1.5">
                            {faq.question}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              const updatedQ = prompt('Edit Question:', faq.question);
                              if (updatedQ) {
                                const updatedA = prompt('Edit Answer:', faq.answer) || faq.answer;
                                updateFaqItem(faq.id, { question: updatedQ, answer: updatedA });
                                showToast('Updated FAQ');
                              }
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#bac9cd] hover:text-[#ef4444]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete FAQ "${faq.question}"?`)) {
                                deleteFaqItem(faq.id);
                                showToast('FAQ deleted');
                              }
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-[#bac9cd] hover:text-rose-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="font-hanken text-xs text-[#bac9cd]/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 9: VENUES & COMPARISON */}
            {/* ========================================================================= */}
            {activeTab === 'venues' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-sora text-xl font-bold text-[#e5e2e1] mb-1 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#ef4444]" />
                    Trusted Venues Bar & Competitive Comparison
                  </h2>
                  <p className="font-hanken text-xs text-[#bac9cd]/70">
                    Edit residency venues displayed in the trust strip and customize the differentiation matrix.
                  </p>
                </div>

                {/* Venues */}
                <div className="p-5 rounded-2xl bg-[#161616] border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-sora text-sm font-bold text-[#fecaca]">
                      1. Trusted Venues & Residencies ({trustVenues.length})
                    </h3>
                    <button
                      onClick={() => {
                        const name = prompt('Venue Name:');
                        if (name) {
                          const loc = prompt('Location (e.g. Westlands, Nairobi):') || 'Nairobi';
                          addVenue({ name, location: loc });
                          showToast(`Added ${name}`);
                        }
                      }}
                      className="px-3 py-1 rounded-lg bg-[#ef4444]/20 text-[#ef4444] font-sora text-xs font-bold"
                    >
                      + Add Venue
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {trustVenues.map((v) => (
                      <div
                        key={v.id}
                        className="p-3 rounded-xl bg-[#1c1b1b] border border-white/10 flex justify-between items-center"
                      >
                        <div>
                          <div className="font-sora text-xs font-bold text-[#e5e2e1]">{v.name}</div>
                          <div className="text-[11px] text-[#bac9cd]/60">{v.location}</div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Remove venue ${v.name}?`)) {
                              deleteVenue(v.id);
                              showToast('Removed venue');
                            }
                          }}
                          className="text-[#bac9cd] hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comparison Matrix */}
                <div className="p-5 rounded-2xl bg-[#161616] border border-white/10 space-y-4">
                  <h3 className="font-sora text-sm font-bold text-[#fecaca]">
                    2. Standard DJs vs OVERKILL Comparison Rows
                  </h3>
                  <div className="space-y-3">
                    {comparisonTable.map((row) => (
                      <div
                        key={row.id}
                        className="p-4 rounded-xl bg-[#1c1b1b] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center"
                      >
                        <div>
                          <span className="font-mono-jb text-[10px] text-[#bac9cd]/60 uppercase">
                            Feature / Aspect
                          </span>
                          <div className="font-sora text-xs font-bold text-[#e5e2e1]">
                            {row.feature}
                          </div>
                        </div>

                        <div>
                          <span className="font-mono-jb text-[10px] text-rose-400/80 uppercase">
                            Standard DJs
                          </span>
                          <input
                            type="text"
                            value={row.standardDjs}
                            onChange={(e) => updateComparisonRow(row.id, { standardDjs: e.target.value })}
                            className="w-full bg-[#121212] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-[#bac9cd]"
                          />
                        </div>

                        <div>
                          <span className="font-mono-jb text-[10px] text-[#ef4444] uppercase">
                            OVERKILL (DJ Wolverine)
                          </span>
                          <input
                            type="text"
                            value={row.overkill}
                            onChange={(e) => updateComparisonRow(row.id, { overkill: e.target.value })}
                            className="w-full bg-[#121212] border border-[#ef4444]/30 rounded-lg px-2.5 py-1 text-xs text-[#fecaca] font-semibold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 10: BACKUP, IMPORT & RESET */}
            {/* ========================================================================= */}
            {activeTab === 'backup' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-sora text-xl font-bold text-[#e5e2e1] mb-1 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#ef4444]" />
                    Data Backup, JSON Import & Factory Reset
                  </h2>
                  <p className="font-hanken text-xs text-[#bac9cd]/70">
                    Export all site configurations to a backup JSON file or restore default factory settings.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Export */}
                  <div className="p-6 rounded-2xl bg-[#161616] border border-white/10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/40 flex items-center justify-center text-[#ef4444]">
                        <Download className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-sora text-sm font-bold text-[#e5e2e1]">
                          Export Site Data (JSON)
                        </h3>
                        <p className="text-xs text-[#bac9cd]/60">
                          Save mixes, prices, photos, and settings to disk
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[#bac9cd]/80">
                      Creates a full backup snapshot including all custom mix tracks, updated prices, calendar schedules, and page visibility settings.
                    </p>

                    <button
                      onClick={handleExport}
                      className="w-full py-3 bg-[#ef4444] text-[white] font-sora font-bold text-xs rounded-xl hover:bg-[#dc2626] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                    >
                      <Download className="w-4 h-4" />
                      Download Complete Configuration JSON
                    </button>
                  </div>

                  {/* Reset */}
                  <div className="p-6 rounded-2xl bg-[#161616] border border-rose-500/30 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400">
                        <RotateCcw className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-sora text-sm font-bold text-rose-300">
                          Reset to Factory Defaults
                        </h3>
                        <p className="text-xs text-[#bac9cd]/60">
                          Revert all custom data back to original state
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[#bac9cd]/80">
                      This will reset all prices, enable all pages, restore default track lists, and clear calendar overrides.
                    </p>

                    <button
                      onClick={() => {
                        if (
                          confirm(
                            'Are you sure you want to reset all data and revert to factory defaults?'
                          )
                        ) {
                          resetAllToDefaults();
                          showToast('All website data reset to factory defaults');
                        }
                      }}
                      className="w-full py-3 bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white border border-rose-500/40 font-sora font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset Everything to Default
                    </button>
                  </div>
                </div>

                {/* JSON Import Box */}
                <div className="p-6 rounded-2xl bg-[#161616] border border-white/10 space-y-4">
                  <h3 className="font-sora text-sm font-bold text-[#fecaca] flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#ef4444]" />
                    Import Configuration JSON
                  </h3>
                  <textarea
                    rows={4}
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder="Paste previously exported JSON data string here..."
                    className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl p-3 text-xs text-[#e5e2e1] font-mono-jb focus:border-[#ef4444] outline-none"
                  />

                  {importError && (
                    <div className="text-xs text-rose-400 font-mono-jb">{importError}</div>
                  )}

                  <button
                    onClick={handleImport}
                    className="px-5 py-2.5 bg-[#ef4444] text-[white] font-sora font-bold text-xs rounded-xl hover:bg-[#dc2626] transition-all cursor-pointer"
                  >
                    Apply & Restore Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
