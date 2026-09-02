import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import Stats from "@/components/hero/Stats";
import TournamentSection from "@/components/tournament/TournamentSection";
import GamesSection from "@/components/games/GamesSection";

export default function Home() {
  return (
   <>
  <Navbar />
  <Hero />
  <Stats />
  <TournamentSection />
  <GamesSection />
  <Footer />
</>
  );
}