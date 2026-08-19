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
import { MIX_TRACKS } from './data/mockData';
import { MixTrack } from './types';
import { soundEngine } from './utils/soundEngine';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentTrack, setCurrentTrack] = useState<MixTrack>(MIX_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState<boolean>(true);
  
  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingPackageId, setBookingPackageId] = useState<string>('corporate');
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingAddOns, setBookingAddOns] = useState<string[]>([]);

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
    const currentIndex = MIX_TRACKS.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % MIX_TRACKS.length;
    const nextTrack = MIX_TRACKS[nextIndex];
    setCurrentTrack(nextTrack);
    if (isPlaying) {
      soundEngine.playTrack(nextTrack.id, nextTrack.audioKey, nextTrack.bpm);
    }
  };

  const handlePrevTrack = () => {
    const currentIndex = MIX_TRACKS.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + MIX_TRACKS.length) % MIX_TRACKS.length;
    const prevTrack = MIX_TRACKS[prevIndex];
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

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col selection:bg-[#00daf8] selection:text-[#00363f] relative overflow-x-hidden">
      {/* Background Atmosphere Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#00daf8]/[0.03] blur-[150px] rounded-full" />
      </div>

      {/* Main Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        onOpenBooking={() => handleOpenBookingModal('corporate')}
      />

      {/* Primary Route Views */}
      <main className="flex-grow relative z-10">
        {activeTab === 'home' && (
          <HomeView
            onNavigateToBooking={() => handleOpenBookingModal('corporate')}
            onNavigateToMixes={() => handleTabChange('mixes')}
            onNavigateToServices={() => handleTabChange('services')}
            onNavigateToCalendar={() => handleTabChange('calendar')}
            onPlayFeaturedMix={handlePlayMix}
            currentPlayingId={isPlaying ? currentTrack.id : null}
          />
        )}

        {activeTab === 'mixes' && (
          <MixesView
            currentPlayingId={isPlaying ? currentTrack.id : null}
            onPlayMix={handlePlayMix}
          />
        )}

        {activeTab === 'services' && (
          <ServicesView
            onSelectPackageForBooking={(pkgId, addOns) =>
              handleOpenBookingModal(pkgId, '', addOns)
            }
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            onSelectDateForBooking={(dateStr) =>
              handleOpenBookingModal('corporate', dateStr)
            }
          />
        )}

        {activeTab === 'faq' && (
          <FaqView
            onNavigateToBooking={() => handleTabChange('calendar')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleTabChange}
        onOpenBooking={() => handleOpenBookingModal('corporate')}
      />

      {/* Persistent Audio Player Bar */}
      {isAudioPlayerVisible && (
        <AudioPlayerBar
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onNextTrack={handleNextTrack}
          onPrevTrack={handlePrevTrack}
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
    </div>
  );
}

export default App;
