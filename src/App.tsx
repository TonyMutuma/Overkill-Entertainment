import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { HomeView } from './components/HomeView';
import { MixesView } from './components/MixesView';
import { ServicesView } from './components/ServicesView';
import { CalendarView } from './components/CalendarView';
import { FaqView } from './components/FaqView';
import { BookingModal } from './components/BookingModal';
import { AdminTopBar } from './components/admin/AdminTopBar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { useCMS } from './context/CMSContext';
import { MixTrack } from './types';
import { soundEngine } from './utils/soundEngine';
import { Sliders, EyeOff, ArrowRight } from 'lucide-react';

export function App() {
  const {
    currentUser,
    isAdminOpen,
    openAdmin,
    closeAdmin,
    pageVisibility,
    mixTracks
  } = useCMS();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentTrack, setCurrentTrack] = useState<MixTrack>(mixTracks[0] || {
    id: 'default',
    title: 'Nairobi Underground Tech-House Vol. 1',
    category: 'club',
    duration: '48:15',
    bpm: 126,
    coverUrl: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=800&auto=format&fit=crop',
    waveformStyle: 'cyan',
    audioKey: 'club-tech'
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  
  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingPackageId, setBookingPackageId] = useState<string>('corporate');
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingAddOns, setBookingAddOns] = useState<string[]>([]);

  // Synchronize currentTrack with mixTracks if needed
  useEffect(() => {
    if (mixTracks && mixTracks.length > 0) {
      const exists = mixTracks.some((t) => t.id === currentTrack.id);
      if (!exists) {
        setCurrentTrack(mixTracks[0]);
      }
    }
  }, [mixTracks]);

  // Scroll to top on tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayMix = (track: MixTrack) => {
    if (currentTrack.id === track.id) {
      // Toggle play/pause
      const nextPlayState = !isPlaying;
      setIsPlaying(nextPlayState);
      if (nextPlayState) {
        soundEngine.playTrack(track.id, track.audioKey, track.bpm);
      } else {
        soundEngine.pause();
      }
    } else {
      // Switch track and start playing
      setCurrentTrack(track);
      setIsPlaying(true);
      soundEngine.playTrack(track.id, track.audioKey, track.bpm);
    }
  };

  const handleTogglePlay = () => {
    const nextPlayState = !isPlaying;
    setIsPlaying(nextPlayState);
    if (nextPlayState) {
      soundEngine.playTrack(currentTrack.id, currentTrack.audioKey, currentTrack.bpm);
    } else {
      soundEngine.pause();
    }
  };

  const handleNextTrack = () => {
    const trackList = mixTracks.length > 0 ? mixTracks : [currentTrack];
    const currentIndex = trackList.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % trackList.length;
    const nextTrack = trackList[nextIndex];
    setCurrentTrack(nextTrack);
    if (isPlaying) {
      soundEngine.playTrack(nextTrack.id, nextTrack.audioKey, nextTrack.bpm);
    }
  };

  const handlePrevTrack = () => {
    const trackList = mixTracks.length > 0 ? mixTracks : [currentTrack];
    const currentIndex = trackList.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + trackList.length) % trackList.length;
    const prevTrack = trackList[prevIndex];
    setCurrentTrack(prevTrack);
    if (isPlaying) {
      soundEngine.playTrack(prevTrack.id, prevTrack.audioKey, prevTrack.bpm);
    }
  };

  const handleOpenBookingModal = (packageId = 'corporate', date = '', addOns: string[] = []) => {
    setBookingPackageId(packageId);
    setBookingDate(date);
    setBookingAddOns(addOns);
    setIsBookingModalOpen(true);
  };

  // Keep track of sound engine cleanup on unmount
  useEffect(() => {
    return () => {
      soundEngine.pause();
    };
  }, []);

  const isCurrentPageDisabled = !pageVisibility?.pages?.[activeTab as keyof typeof pageVisibility.pages] && !currentUser;

  return (
    <div className={`min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col selection:bg-[#00daf8] selection:text-[#00363f] relative overflow-x-hidden ${currentUser ? 'pt-11' : ''}`}>
      {/* Background Atmosphere Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#00daf8]/[0.03] blur-[150px] rounded-full" />
      </div>

      {/* Admin Crew Top Bar (Sticky when authenticated) */}
      <AdminTopBar onOpenDashboard={openAdmin} />

      {/* Main Navigation */}
      <Navbar
        activeTab={activeTab as any}
        setActiveTab={handleTabChange}
        onSelectTab={handleTabChange}
        isPlayingMix={isPlaying}
        onOpenBooking={() => handleOpenBookingModal('corporate')}
      />

      {/* Primary Route Views */}
      <main className="flex-grow relative z-10">
        {isCurrentPageDisabled ? (
          <div className="pt-40 pb-32 px-6 max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-6">
              <EyeOff className="w-8 h-8" />
            </div>
            <div className="font-mono-jb text-xs text-amber-400 uppercase tracking-widest mb-2 font-bold">
              Page Temporarily Offline
            </div>
            <h1 className="font-sora text-3xl md:text-4xl font-bold text-[#e5e2e1] mb-4">
              This Section is Currently Disabled by DJ & Crew
            </h1>
            <p className="font-hanken text-[#bac9cd] mb-8 leading-relaxed">
              This page has been paused in the live CMS controls. Please explore our other active sections or return to the main showcase.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleTabChange('home')}
                className="px-6 py-3 bg-[#00daf8] text-[#00363f] font-sora font-bold text-sm rounded-xl uppercase tracking-wider hover:bg-[#00e0ff] transition-all flex items-center gap-2 cursor-pointer"
              >
                Return to Home
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-6 py-3 bg-white/5 text-[#bac9cd] hover:text-white font-mono-jb text-xs rounded-xl border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
              >
                Crew Login to Enable
              </button>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                setActiveTab={handleTabChange}
                onNavigateToBooking={() => handleOpenBookingModal('corporate')}
                onNavigateToMixes={() => handleTabChange('mixes')}
                onNavigateToServices={() => handleTabChange('services')}
                onNavigateToCalendar={() => handleTabChange('calendar')}
                onPlayFeaturedMix={handlePlayMix}
                currentPlayingId={isPlaying ? currentTrack.id : null}
                onOpenBooking={() => handleOpenBookingModal('corporate')}
              />
            )}

            {activeTab === 'mixes' && (
              <MixesView
                setActiveTab={handleTabChange}
                onNavigateToCalendar={() => handleTabChange('calendar')}
                onNavigateToServices={() => handleTabChange('services')}
                currentPlayingId={isPlaying ? currentTrack.id : null}
                currentPlayingTrack={isPlaying ? currentTrack : null}
                isPlaying={isPlaying}
                onPlayMix={handlePlayMix}
              />
            )}

            {activeTab === 'services' && (
              <ServicesView
                setActiveTab={handleTabChange}
                onNavigateToCalendar={() => handleTabChange('calendar')}
                onSelectPackageForBooking={(pkgId, addOns, total) =>
                  handleOpenBookingModal(pkgId, '', addOns)
                }
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                setActiveTab={handleTabChange}
                onNavigateToServices={() => handleTabChange('services')}
                onNavigateToFaq={() => handleTabChange('faq')}
                onNavigateToBooking={() => handleOpenBookingModal('corporate')}
                onSelectDateForBooking={(dateStr) =>
                  handleOpenBookingModal('corporate', dateStr)
                }
              />
            )}

            {activeTab === 'faq' && (
              <FaqView
                setActiveTab={handleTabChange}
                onNavigateToBooking={() => handleOpenBookingModal('corporate')}
                onNavigateToCalendar={() => handleTabChange('calendar')}
                onNavigateToServices={() => handleTabChange('services')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={handleTabChange}
        onNavigate={handleTabChange}
        onOpenBooking={() => handleOpenBookingModal('corporate')}
        onOpenContact={() => handleTabChange('faq')}
        onOpenCrewLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Persistent Audio Player Bar */}
      {isAudioPlayerVisible && (pageVisibility?.sections?.audioPlayerBar ?? true) && (
        <AudioPlayerBar
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onNextTrack={handleNextTrack}
          onPrevTrack={handlePrevTrack}
          onClose={() => {
            soundEngine.pause();
            setIsPlaying(false);
            setIsAudioPlayerVisible(false);
          }}
          onClosePlayer={() => {
            soundEngine.pause();
            setIsPlaying(false);
            setIsAudioPlayerVisible(false);
          }}
        />
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialPackageId={bookingPackageId}
        initialDate={bookingDate}
        initialAddOns={bookingAddOns}
      />

      {/* Admin Dashboard Drawer / Modal */}
      <AdminDashboard isOpen={isAdminOpen} onClose={closeAdmin} />

      {/* Admin Login Modal */}
      <AdminLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}

export default App;
