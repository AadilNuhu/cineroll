import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";
import heroImg from "../assets/cineroll-hero.png";

interface Props {
  onAdd: () => void;
  authed: boolean;
  movieCount: number;
}

export const Hero = ({ onAdd, authed, movieCount }: Props) => {
  return (
    <section className="relative overflow-hidden rounded-3xl ring-1 ring-border bg-gradient-card scanline">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt=""
          className="h-full w-full object-cover opacity-60"
          width={1536}
          height={1024}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
      </div>
      <div className="relative grid gap-6 p-8 md:p-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground ring-1 ring-border">
            <Sparkles className="h-3 w-3 text-accent" />
            {authed ? "Synced library" : "Guest mode • saved locally"}
          </span>
          <h1 className="mt-5 font-display text-5xl md:text-7xl leading-[0.9]">
            Every film you've <span className="text-gradient">ever loved</span>,
            in one cinematic vault.
          </h1>
          <p className="mt-4 max-w-xl text-base md:text-lg text-muted-foreground">
            Track watched, queue what's next, and crown your favorites. Works offline.
            Sign in to sync everywhere.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button variant="hero" size="lg" onClick={onAdd}>
              <Plus className="h-4 w-4" /> Add a movie
            </Button>
            <div className="grid place-items-center px-4 text-sm text-muted-foreground">
              <span>
                <span className="font-display text-2xl text-foreground mr-2">
                  {movieCount}
                </span>
                in your library
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
