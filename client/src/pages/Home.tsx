import { useNavigate } from "react-router";
import { Hero } from "../components/Hero";
import { useMovies } from "../contexts/MovieContext";
import { useAuth } from "../contexts/AuthContext";
import { Film, WifiOff, CloudSync, Star } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    name: "Offline First",
    description: "Your movie library is stored locally. Add and edit movies even when you're disconnected from the internet.",
    icon: WifiOff,
  },
  {
    name: "Cloud Sync",
    description: "Sign in to synchronize your local library to the cloud. Access your movie vault from any device.",
    icon: CloudSync,
  },
  {
    name: "Cinematic Experience",
    description: "A dark-mode UI that feels like you're in the theater. Beautifully designed for film enthusiasts.",
    icon: Film,
  },
  {
    name: "Rate & Review",
    description: "Crown your favorites with ratings and jot down personal notes for every film you watch.",
    icon: Star,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { movies } = useMovies();
  const { user } = useAuth();

  const handleAddMovie = () => {
    navigate("/dashboard");
  };

  return (
    <div className="space-y-16 pb-16">
      <Hero 
        onAdd={handleAddMovie} 
        authed={!!user} 
        movieCount={movies.length} 
      />

      <section className="mt-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-display md:text-4xl">Designed for Film Lovers</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            CineRoll gives you complete control over your movie tracking experience, whether you're at home or on the go.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-secondary/30 rounded-2xl p-6 ring-1 ring-border"
            >
              <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}