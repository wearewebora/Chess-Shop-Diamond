import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Sliders, Check, Eye } from 'lucide-react';

export interface ChessWallpaperOption {
  id: string;
  name: string;
  author: string;
  url: string;
  thumbnail: string;
  description: string;
}

export const CHESS_WALLPAPERS: ChessWallpaperOption[] = [
  {
    id: 'martin-aerial',
    name: 'Grand Aerial Chessboard',
    author: 'Martin Blaszkiewicz (Unsplash)',
    url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=2400&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=200&q=80',
    description: 'Iconic aerial perspective of the oversized black and white chessboard.',
  },
  {
    id: 'wood-staunton',
    name: 'Luxury Staunton Pieces',
    author: 'Unsplash Chess Collection',
    url: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=2400&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=200&q=80',
    description: 'Carved tournament wooden pieces with deep walnut and boxwood grains.',
  },
  {
    id: 'dark-grandmaster',
    name: 'Grandmaster Spotlight',
    author: 'Unsplash Chess Collection',
    url: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&w=2400&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&w=200&q=80',
    description: 'Dramatic low-key cinematic lighting over the royal pieces.',
  },
  {
    id: 'tactical-knight',
    name: 'Tactical Knight Duel',
    author: 'Unsplash Chess Collection',
    url: 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?auto=format&fit=crop&w=2400&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?auto=format&fit=crop&w=200&q=80',
    description: 'Close-up knight attacking across the chess grid squares.',
  },
];

export const ChessWallpaperBackground: React.FC = () => {
  const [activeWallpaperId, setActiveWallpaperId] = useState<string>(() => {
    return localStorage.getItem('chess_selected_wallpaper') || 'martin-aerial';
  });

  const [dimLevel, setDimLevel] = useState<'deep' | 'balanced' | 'ambient'>(() => {
    return (localStorage.getItem('chess_wallpaper_dim') as any) || 'balanced';
  });

  const [showFloatingPieces, setShowFloatingPieces] = useState<boolean>(() => {
    return localStorage.getItem('chess_floating_pieces') !== 'false';
  });

  const [isControlOpen, setIsControlOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('chess_selected_wallpaper', activeWallpaperId);
  }, [activeWallpaperId]);

  useEffect(() => {
    localStorage.setItem('chess_wallpaper_dim', dimLevel);
  }, [dimLevel]);

  useEffect(() => {
    localStorage.setItem('chess_floating_pieces', String(showFloatingPieces));
  }, [showFloatingPieces]);

  const currentWallpaper = CHESS_WALLPAPERS.find(w => w.id === activeWallpaperId) || CHESS_WALLPAPERS[0];

  // Opacity overlays based on dim level
  const overlayClass = {
    deep: 'bg-[#141312]/92',      // Highest contrast
    balanced: 'bg-[#181715]/82',  // Balanced rich wallpaper visibility
    ambient: 'bg-[#181715]/70',   // Wallpaper prominently visible
  }[dimLevel];

  return (
    <>
      {/* Fixed Fullscreen Chess Wallpaper Layer */}
      <div 
        className="fixed inset-0 pointer-events-none -z-30 bg-cover bg-center bg-no-repeat transition-all duration-700 transform scale-[1.02]"
        style={{
          backgroundImage: `url('${currentWallpaper.url}')`,
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Dark Chessboard Color Filter & Vignette */}
      <div 
        className={`fixed inset-0 pointer-events-none -z-20 ${overlayClass} backdrop-blur-[1.5px] transition-all duration-500`}
      />

      {/* Atmospheric radial gradient highlights & vignettes */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10 bg-radial from-transparent via-[#161513]/40 to-[#0e0d0c]/85"
      />

      {/* Chessboard Subtle Checkerboard Grid Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10 opacity-20 chessboard-subtle-pattern"
      />

      {/* Subtle Floating Ambient Chess Pieces */}
      {showFloatingPieces && (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
          <div className="absolute top-[12%] left-[4%] text-6xl text-white/5 font-serif animate-pulse transform -rotate-12 duration-[7000ms]">
            ♚
          </div>
          <div className="absolute top-[25%] right-[5%] text-7xl text-white/5 font-serif transform rotate-6 animate-bounce duration-[9000ms]">
            ♞
          </div>
          <div className="absolute top-[55%] left-[2%] text-5xl text-white/5 font-serif transform -rotate-6">
            ♜
          </div>
          <div className="absolute top-[70%] right-[3%] text-6xl text-white/5 font-serif transform rotate-12">
            ♛
          </div>
          <div className="absolute top-[85%] left-[6%] text-5xl text-white/5 font-serif">
            ♝
          </div>
        </div>
      )}

      {/* Rank & File Ambient Chess Notation Coordinates on Screen Edges (Hidden on mobile) */}
      <div className="hidden xl:flex fixed left-2 top-0 bottom-0 flex-col justify-around py-24 text-[10px] font-mono text-[#ebecd0]/20 pointer-events-none -z-10 select-none">
        {['8', '7', '6', '5', '4', '3', '2', '1'].map((rank) => (
          <span key={rank} className="font-bold">{rank}</span>
        ))}
      </div>
      <div className="hidden xl:flex fixed right-2 top-0 bottom-0 flex-col justify-around py-24 text-[10px] font-mono text-[#ebecd0]/20 pointer-events-none -z-10 select-none">
        {['8', '7', '6', '5', '4', '3', '2', '1'].map((rank) => (
          <span key={rank} className="font-bold">{rank}</span>
        ))}
      </div>

      {/* Quick Wallpaper Switcher Floating Button (Bottom-Right) */}
      <div className="fixed bottom-4 right-4 z-40">
        {!isControlOpen ? (
          <button
            onClick={() => setIsControlOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#262421]/90 hover:bg-[#312e2b] border border-[#4a443c] text-[#ebecd0] text-xs font-semibold shadow-2xl backdrop-blur-md transition group hover:scale-105"
            title="Customize Chess Wallpaper & Atmosphere"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#81b64c] animate-pulse"></span>
            <ImageIcon className="w-3.5 h-3.5 text-[#81b64c]" />
            <span className="hidden sm:inline text-[11px]">Chess Wallpaper</span>
          </button>
        ) : (
          <div className="w-80 bg-[#262421]/95 border border-[#443e37] rounded-2xl shadow-2xl backdrop-blur-xl p-4 text-[#edeae4] space-y-3.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-[#3d3731] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-base">♟️</span>
                <div>
                  <h4 className="text-xs font-bold text-[#ebecd0]">Chess Wallpaper & Theme</h4>
                  <p className="text-[10px] text-stone-400">Select authentic chess background</p>
                </div>
              </div>
              <button
                onClick={() => setIsControlOpen(false)}
                className="text-stone-400 hover:text-white text-xs px-2 py-1 rounded bg-[#312e2b] hover:bg-[#3d3731]"
              >
                ✕
              </button>
            </div>

            {/* Wallpapers List */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Background Wallpaper
              </span>
              <div className="grid grid-cols-2 gap-2">
                {CHESS_WALLPAPERS.map((wp) => {
                  const isSelected = wp.id === activeWallpaperId;
                  return (
                    <button
                      key={wp.id}
                      onClick={() => setActiveWallpaperId(wp.id)}
                      className={`relative rounded-xl overflow-hidden border p-1 text-left transition group ${
                        isSelected 
                          ? 'border-[#81b64c] bg-[#81b64c]/10 shadow-md' 
                          : 'border-[#3d3731] hover:border-stone-500 bg-[#1e1d1a]'
                      }`}
                    >
                      <img 
                        src={wp.thumbnail} 
                        alt={wp.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-14 object-cover rounded-lg group-hover:scale-105 transition"
                      />
                      <div className="pt-1.5 px-0.5">
                        <span className="text-[10px] font-bold block truncate text-stone-200">
                          {wp.name}
                        </span>
                        <span className="text-[9px] text-stone-400 block truncate">
                          {wp.author}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#81b64c] text-white flex items-center justify-center text-[9px] font-black shadow-xs">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Opacity / Dim Control */}
            <div className="space-y-1.5 pt-1 border-t border-[#3d3731]">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold uppercase tracking-wider text-stone-400">Contrast / Dim</span>
                <span className="text-stone-300 font-mono capitalize">{dimLevel}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-medium">
                {(['deep', 'balanced', 'ambient'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDimLevel(level)}
                    className={`py-1.5 px-2 rounded-lg border text-center capitalize transition ${
                      dimLevel === level
                        ? 'bg-[#81b64c] border-[#81b64c] text-white font-bold'
                        : 'bg-[#1e1d1a] border-[#38332d] text-stone-300 hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Floating pieces toggle */}
            <div className="flex items-center justify-between pt-1 border-t border-[#3d3731] text-[11px]">
              <span className="text-stone-300 flex items-center gap-1.5">
                <span>♔</span>
                <span>Ambient Chess Pieces</span>
              </span>
              <button
                onClick={() => setShowFloatingPieces(!showFloatingPieces)}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                  showFloatingPieces ? 'bg-[#81b64c]' : 'bg-[#3d3731]'
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    showFloatingPieces ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
