import { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Music2, ExternalLink, SkipForward, Code2, Palette, Zap } from "lucide-react";
import headshot from "../assets/headshot.jpg"; 
// PageBackground removed in favor of a single GlobalBackground
import jerseyGiant from "../assets/jerseygiant.jpeg";
import busyhead from "../assets/busyhead.jpeg";
import lovemenot from "../assets/lovemenot.jpeg";
import takecare from "../assets/takecare.jpeg";
import largerthanlife from "../assets/largerthanlife.jpeg";
import views from "../assets/views.jpeg";
import purgatory from "../assets/purgatory.jpeg";
import honestlynevermind from "../assets/honestlynevermind.jpeg";
import letsstarthere from "../assets/letsstarthere.jpeg";
import neverenough from "../assets/neverenough.jpeg";

const tracks = [
  { name: "Jersey Giant", artist: "Evan Honer ft. Julia DiGrazia", album: "Jersey Giant", albumArt: jerseyGiant },
  { name: "Over My Dead Body", artist: "Drake", album: "Take Care", albumArt: takecare },
  { name: "Best Time", artist: "Brent Faiyaz", album: "Larger Than Life", albumArt: largerthanlife },
  { name: "Love Me Not", artist: "Ravyn Lenae ft. Rex Orange County", album: "Love Me Not", albumArt: lovemenot },
  { name: "Mess", artist: "Noah Kahan", album: "Busyhead", albumArt: busyhead },
  { name: "Feathered Indians", artist: "Tyler Childers", album: "Purgatory", albumArt: purgatory },
  { name: "Feel No Ways", artist: "Drake", album: "Views", albumArt: views},
  { name: "Flight's Booked", artist: "Drake", album: "Honestly, Nevermind", albumArt: honestlynevermind },
  { name: "drive ME crazy!", artist: "Lil Yachty ft. Diana Gordon", album: "Let's Start Here.", albumArt: letsstarthere },
  { name: "Superpowers", artist: "Daniel Caesar", album: "NEVER ENOUGH", albumArt: neverenough },
];

export const About = () => {
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * tracks.length));
  const [animState, setAnimState] = useState<'idle' | 'fadeOut' | 'fadeIn'>('idle');
  const timeoutRef = useRef<number | null>(null);
  const isPlaying = true;
  const currentTrack = tracks[currentIndex];

  const handleSkip = () => {
    if (animState !== 'idle') return; // prevent double clicks while animating
    setAnimState('fadeOut');
    // fade-out duration: 300ms
    timeoutRef.current = window.setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % tracks.length);
      setAnimState('fadeIn');
      // fade-in duration
      timeoutRef.current = window.setTimeout(() => {
        setAnimState('idle');
      }, 300);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <section id="about" className="min-h-screen flex items-center px-6 py-24 text-center md:text-left">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile */}
        <Card className="md:col-span-2 p-8 h-full bg-card shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-soft)] hover:-translate-y-2 transition-all duration-300 border-border/50">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
                <div className="relative group md:mt-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-border/50 bg-muted/30">
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10">
                  <img                  
                    src={headshot}
                    alt="Steven Wu"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-5">Steven Wu</h2>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Hello! I’m Steven Wu, a software engineer from NJ with experience in full-stack development, 
                  QA, and data analysis. I am a current senior at Boston College pursuing a degree in CS,
                  with minors in Finance and Data Science. 
                </p>
                <p>
                  Outside of academics, I’m an avid basketball fan, enjoy golfing (sometimes),
                   and enjoy music of all kinds. Check out what I am currently listening to!
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Spotify Card */}
        <Card className="md:col-span-1 md:row-span-2 p-6 h-full bg-card shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-soft)] hover:-translate-y-2 transition-all duration-300 border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Music2 className="h-5 w-5 text-primary" />
            <h3 className="font-semi-bold">Now Playing</h3>
            {/* {isPlaying && ( --- IGNORE ---
              <Badge variant="secondary" className="ml-auto text-xs bg-primary/10 text-primary"> --- IGNORE ---
                Live
              </Badge>
            )} */}
            <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto" onClick={handleSkip}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Album Art */}
            <div className="relative group cursor-pointer" onClick={handleSkip}>
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className={"relative aspect-square rounded-lg overflow-hidden border border-border/50 transition-all duration-300 ease-out " + (animState === 'fadeOut' ? 'opacity-0 -translate-y-2' : animState === 'fadeIn' ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0')}>
                <img
                  src={currentTrack.albumArt}
                  alt={currentTrack.album}
                  className={"w-full h-full object-cover transition-transform duration-500 " + (animState === 'fadeOut' ? 'scale-95' : 'group-hover:scale-105')}
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ExternalLink className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Track Info */}
            <div className={"space-y-2 transition-all duration-300 ease-out " + (animState === 'fadeOut' ? 'opacity-0 -translate-y-2' : animState === 'fadeIn' ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0')}>
              <p className="font-medium text-foreground leading-snug">{currentTrack.name}</p>
              <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
              <p className="text-xs text-muted-foreground">{currentTrack.album}</p>
            </div>

            {/* Progress / Meta */}
            {isPlaying && (
              <div className="space-y-2">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full animate-pulse"
                    style={{ width: `${((currentIndex + 1) / tracks.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border/50">
              {currentIndex + 1} of {tracks.length} tracks
            </p>
          </div>
        </Card>
        
        {/* Skills */}
        <Card className="md:col-span-2 p-6 h-full bg-card border-border/50 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] hover:-translate-y-2 transition-all duration-300">
          <h2 className="text-3xl font-bold mb-5">Skills</h2>
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              <Badge variant="secondary" className="text-md">Python</Badge>
              <Badge variant="secondary" className="text-md">TypeScript</Badge>
              <Badge variant="secondary" className="text-md">JavaScript</Badge>
              <Badge variant="secondary" className="text-md">Java</Badge>
              <Badge variant="secondary" className="text-md">React</Badge>
              <Badge variant="secondary" className="text-md">Node.js</Badge>
              <Badge variant="secondary" className="text-md">HTML</Badge>
              <Badge variant="secondary" className="text-md">CSS</Badge>
              <Badge variant="secondary" className="text-md">UI/UX</Badge>
              <Badge variant="secondary" className="text-md">Git</Badge>
              <Badge variant="secondary" className="text-md">Jira</Badge>
              <Badge variant="secondary" className="text-md">Agile</Badge>
              <Badge variant="secondary" className="text-md">Playwright</Badge>
              <Badge variant="secondary" className="text-md">Figma</Badge>
            </div>
        </Card>
      </div>
    </section>
  );
};