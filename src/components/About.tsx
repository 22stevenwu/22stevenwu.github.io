import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Music2, ExternalLink, SkipForward, Code2, Palette, Zap } from "lucide-react";
import headshot from "../assets/headshot.jpg"; 

const tracks = [
  { name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop" },
  { name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", albumArt: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop" },
  { name: "Good 4 U", artist: "Olivia Rodrigo", album: "SOUR", albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop" },
  { name: "Heat Waves", artist: "Glass Animals", album: "Dreamland", albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop" },
  { name: "Stay", artist: "The Kid LAROI & Justin Bieber", album: "F*ck Love 3: Over You", albumArt: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop" },
  { name: "Save Your Tears", artist: "The Weeknd", album: "After Hours", albumArt: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop" },
  { name: "Peaches", artist: "Justin Bieber ft. Daniel Caesar", album: "Justice", albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop" },
  { name: "drivers license", artist: "Olivia Rodrigo", album: "SOUR", albumArt: "https://images.unsplash.com/photo-1484876065684-b683cf17d276?w=300&h=300&fit=crop" },
  { name: "Montero", artist: "Lil Nas X", album: "MONTERO", albumArt: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop" },
  { name: "Kiss Me More", artist: "Doja Cat ft. SZA", album: "Planet Her", albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop" },
];

const skills = [
  { icon: Code2, label: "Frontend", tech: "React, TypeScript, Tailwind" },
  { icon: Zap, label: "Backend", tech: "Node.js, PostgreSQL, APIs" },
  { icon: Palette, label: "Design", tech: "Figma, UI/UX, Animation" },
];

export const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isPlaying = true;
  const currentTrack = tracks[currentIndex];

  const handleSkip = () => setCurrentIndex((prev) => (prev + 1) % tracks.length);

  return (
    <section className="min-h-screen flex items-center px-6 py-24 bg-secondary/30">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile */}
        <Card className="p-8 h-full bg-card shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-soft)] transition-all duration-300 border-border/50 md:col-span-2">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-border/50 bg-muted/30">
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
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
                <h2 className="text-3xl font-bold mb-2">Steven Wu</h2>
                <p className="text-xl text-muted-foreground mb-4">
                  Software Developer & Problem Solver
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">React</Badge>
                  <Badge variant="secondary" className="text-xs">TypeScript</Badge>
                  <Badge variant="secondary" className="text-xs">Python</Badge>
                  <Badge variant="secondary" className="text-xs">UI/UX</Badge>
                  <Badge variant="secondary" className="text-xs">Version Control</Badge>
                </div>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Hello! I’m Steven Wu, a software engineer with experience in full-stack development, 
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
        <Card className="p-6 h-full bg-card shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-soft)] transition-all duration-300 border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Music2 className="h-5 w-5 text-primary" />
            <h3 className="font-semi-bold">Now Playing</h3>
            {isPlaying && (
              <Badge variant="secondary" className="ml-auto text-xs bg-primary/10 text-primary">
                Live
              </Badge>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSkip}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Album Art */}
            <div className="relative group cursor-pointer" onClick={handleSkip}>
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative aspect-square rounded-lg overflow-hidden border border-border/50">
                <img
                  src={currentTrack.albumArt}
                  alt={currentTrack.album}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ExternalLink className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Track Info */}
            <div className="space-y-2">
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
                    style={{ width: "60%" }}
                  />
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border/50">
              {currentIndex + 1} of {tracks.length} tracks
            </p>
          </div>
        </Card>
        
      </div>
    </section>
  );
};