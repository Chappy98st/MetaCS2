import React, { useState, useEffect } from 'react';
import { MapPin, Crosshair, Search, Filter, Map, X, Youtube, Play, Plus, LogIn, LogOut } from 'lucide-react';
import { supabase } from './supabase';
import toast, { Toaster } from 'react-hot-toast';

type MapType = 'mirage' | 'dust2' | 'inferno' | 'overpass' | 'ancient' | 'vertigo' | 'anubis' | 'nuke';
type GrenadeType = 'smoke' | 'flash' | 'molotov' | 'he';
type Position = 'A Site' | 'B Site' | 'Mid' | 'CT Spawn' | 'T Spawn' | 'Ramp' | 'Outside' | 'Secret' | 'Heaven' | 'Hell';
type Site = 'A Site' | 'B Site' | 'Mid';

interface Lineup {
  id: number;
  map: MapType;
  type: GrenadeType;
  title: string;
  description: string;
  imageUrl: string;
  setupImageUrl: string;
  throwImageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  position: Position;
  site: Site;
  videoUrl: string;
  tickrate: '64' | '128' | 'both';
  technique: 'jump throw' | 'running throw' | 'standing throw' | 'crouch throw';
  steps: string[];
}

const lineups: Lineup[] = [
  {
    id: 1,
    map: 'mirage',
    type: 'smoke',
    title: 'A Site - CT Smoke',
    description: 'Perfect smoke for CT spawn from T ramp',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    setupImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    throwImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    difficulty: 'easy',
    position: 'A Site',
    site: 'A Site',
    tickrate: 'both',
    technique: 'jump throw',
    videoUrl: 'https://www.youtube.com/embed/example1',
    steps: [
      'Stand in the corner of T ramp',
      'Aim at the middle antenna',
      'Jump throw'
    ]
  },
  {
    id: 2,
    map: 'dust2',
    type: 'flash',
    title: 'Long A Flash',
    description: 'Pop flash for long push',
    imageUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80',
    setupImageUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80',
    throwImageUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80',
    difficulty: 'medium',
    position: 'A Site',
    site: 'A Site',
    tickrate: '128',
    technique: 'running throw',
    videoUrl: 'https://www.youtube.com/embed/example2',
    steps: [
      'Run to the blue container',
      'Line up with the edge',
      'Running throw while pressing W'
    ]
  },
  {
    id: 3,
    map: 'inferno',
    type: 'molotov',
    title: 'B Default Plant Molly',
    description: 'Molotov for default plant position from banana',
    imageUrl: 'https://images.unsplash.com/photo-1561141037-b9a2d4ac9bc3?auto=format&fit=crop&w=800&q=80',
    setupImageUrl: 'https://images.unsplash.com/photo-1561141037-b9a2d4ac9bc3?auto=format&fit=crop&w=800&q=80',
    throwImageUrl: 'https://images.unsplash.com/photo-1561141037-b9a2d4ac9bc3?auto=format&fit=crop&w=800&q=80',
    difficulty: 'hard',
    position: 'B Site',
    site: 'B Site',
    tickrate: '128',
    technique: 'jump throw',
    videoUrl: 'https://www.youtube.com/embed/example3',
    steps: [
      'Stand in the corner of banana',
      'Aim at the top of the wall',
      'Jump throw with run-up'
    ]
  },
  {
    id: 4,
    map: 'vertigo',
    type: 'smoke',
    title: 'A Ramp Smoke',
    description: 'Smoke to block vision from A ramp',
    imageUrl: 'https://images.unsplash.com/photo-1590784176250-6879e9e99b1e?auto=format&fit=crop&w=800&q=80',
    setupImageUrl: 'https://images.unsplash.com/photo-1590784176250-6879e9e99b1e?auto=format&fit=crop&w=800&q=80',
    throwImageUrl: 'https://images.unsplash.com/photo-1590784176250-6879e9e99b1e?auto=format&fit=crop&w=800&q=80',
    difficulty: 'medium',
    position: 'Ramp',
    site: 'A Site',
    tickrate: 'both',
    technique: 'standing throw',
    videoUrl: 'https://www.youtube.com/embed/example4',
    steps: [
      'Stand in the marked corner',
      'Aim at the edge of the building',
      'Standing throw'
    ]
  },
  {
    id: 5,
    map: 'nuke',
    type: 'smoke',
    title: 'Outside Smoke',
    description: 'Smoke for outside take',
    imageUrl: 'https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&w=800&q=80',
    setupImageUrl: 'https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&w=800&q=80',
    throwImageUrl: 'https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&w=800&q=80',
    difficulty: 'hard',
    position: 'Outside',
    site: 'Mid',
    tickrate: '128',
    technique: 'jump throw',
    videoUrl: 'https://www.youtube.com/embed/example5',
    steps: [
      'Position yourself at T roof',
      'Line up with the antenna',
      'Jump throw'
    ]
  },
  {
    id: 6,
    map: 'anubis',
    type: 'flash',
    title: 'Mid Flash',
    description: 'Flash for mid control',
    imageUrl: 'https://images.unsplash.com/photo-1584722064669-95c332c94c56?auto=format&fit=crop&w=800&q=80',
    setupImageUrl: 'https://images.unsplash.com/photo-1584722064669-95c332c94c56?auto=format&fit=crop&w=800&q=80',
    throwImageUrl: 'https://images.unsplash.com/photo-1584722064669-95c332c94c56?auto=format&fit=crop&w=800&q=80',
    difficulty: 'easy',
    position: 'Mid',
    site: 'Mid',
    tickrate: 'both',
    technique: 'standing throw',
    videoUrl: 'https://www.youtube.com/embed/example6',
    steps: [
      'Stand at mid entrance',
      'Aim above the doorway',
      'Standing throw'
    ]
  }
];

function App() {
  const [selectedMap, setSelectedMap] = useState<MapType | 'all'>('all');
  const [selectedType, setSelectedType] = useState<GrenadeType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLineup, setSelectedLineup] = useState<Lineup | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddLineupModal, setShowAddLineupModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) throw error;

      setShowLoginModal(false);
      toast.success('Successfully logged in!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredLineups = lineups.filter(lineup => {
    const matchesMap = selectedMap === 'all' || lineup.map === selectedMap;
    const matchesType = selectedType === 'all' || lineup.type === selectedType;
    const matchesSearch = lineup.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lineup.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMap && matchesType && matchesSearch;
  });

  const groupedLineups = filteredLineups.reduce((acc, lineup) => {
    if (!acc[lineup.map]) {
      acc[lineup.map] = {
        'A Site': [],
        'B Site': [],
        'Mid': []
      };
    }
    acc[lineup.map][lineup.site].push(lineup);
    return acc;
  }, {} as Record<MapType, Record<Site, Lineup[]>>);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-gray-800 py-6 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crosshair className="w-8 h-8 text-green-500" />
              <h1 className="text-2xl font-bold">CS Meta 2</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search lineups..."
                  className="bg-gray-700 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowAddLineupModal(true)}
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Lineup</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6 sticky top-20 bg-gray-900 z-40">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Map className="w-5 h-5 text-gray-400" />
            <select
              className="bg-gray-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedMap}
              onChange={(e) => setSelectedMap(e.target.value as MapType | 'all')}
            >
              <option value="all">All Maps</option>
              <option value="mirage">Mirage</option>
              <option value="dust2">Dust 2</option>
              <option value="inferno">Inferno</option>
              <option value="overpass">Overpass</option>
              <option value="ancient">Ancient</option>
              <option value="vertigo">Vertigo</option>
              <option value="anubis">Anubis</option>
              <option value="nuke">Nuke</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="bg-gray-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as GrenadeType | 'all')}
            >
              <option value="all">All Types</option>
              <option value="smoke">Smoke</option>
              <option value="flash">Flash</option>
              <option value="molotov">Molotov</option>
              <option value="he">HE Grenade</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Sections */}
      <div className="container mx-auto px-4 py-6">
        {Object.entries(groupedLineups).map(([map, sites]) => (
          <div key={map} className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-green-500 uppercase">{map}</h2>
            
            {/* Video Player Section */}
            {activeVideoId && Object.values(sites).flat().find(l => l.id === activeVideoId) && (
              <div className="mb-8 bg-gray-800 rounded-lg p-4">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <iframe
                    src={Object.values(sites).flat().find(l => l.id === activeVideoId)?.videoUrl}
                    className="w-full h-[500px] rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {Object.values(sites).flat().find(l => l.id === activeVideoId)?.title}
                </h3>
                <button
                  onClick={() => setActiveVideoId(null)}
                  className="text-gray-400 hover:text-white"
                >
                  Close Video
                </button>
              </div>
            )}

            {/* Site Sections */}
            {(['A Site', 'B Site', 'Mid'] as const).map(site => (
              sites[site].length > 0 && (
                <div key={site} className="mb-12">
                  <h3 className="text-2xl font-semibold mb-6 text-yellow-500">{site}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sites[site].map(lineup => (
                      <div
                        key={lineup.id}
                        className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200"
                      >
                        <div className="relative group">
                          <img src={lineup.imageUrl} alt={lineup.title} className="w-full h-48 object-cover" />
                          <button
                            onClick={() => setActiveVideoId(lineup.id)}
                            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <Play className="w-12 h-12 text-green-500" />
                          </button>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-green-500 uppercase">{lineup.type}</span>
                            <span className={`text-sm px-2 py-1 rounded ${
                              lineup.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                              lineup.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {lineup.difficulty}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold mb-2">{lineup.title}</h3>
                          <p className="text-gray-400 text-sm">{lineup.description}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-400">{lineup.position}</span>
                            </div>
                            <button
                              onClick={() => setSelectedLineup(lineup)}
                              className="text-green-500 hover:text-green-400 text-sm font-medium"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        ))}
      </div>

      {/* Lineup Modal */}
      {selectedLineup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedLineup.title}</h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-green-500 uppercase">{selectedLineup.map}</span>
                    <span className="text-gray-400">{selectedLineup.position}</span>
                    <span className="text-gray-400">{selectedLineup.tickrate} tick</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLineup(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Setup Position</h3>
                  <img
                    src={selectedLineup.setupImageUrl}
                    alt="Setup position"
                    className="rounded-lg w-full"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Throw Position</h3>
                  <img
                    src={selectedLineup.throwImageUrl}
                    alt="Throw position"
                    className="rounded-lg w-full"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Steps</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {selectedLineup.steps.map((step, index) => (
                    <li key={index} className="text-gray-300">{step}</li>
                  ))}
                </ol>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded ${
                    selectedLineup.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                    selectedLineup.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedLineup.difficulty}
                  </span>
                  <span className="text-gray-400">{selectedLineup.technique}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedLineup(null);
                    setActiveVideoId(selectedLineup.id);
                  }}
                  className="flex items-center space-x-2 text-green-500 hover:text-green-400"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Video</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Login</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 py-2 rounded-lg transition-colors font-medium"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Lineup Modal */}
      {showAddLineupModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Lineup</h2>
                <button
                  onClick={() => setShowAddLineupModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* Add lineup form will be implemented here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;