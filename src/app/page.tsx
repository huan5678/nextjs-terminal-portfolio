import AsciiHero from "@/app/components/AsciiHero";
import Terminal from "@/app/components/Terminal";

export default function Home() {
  return (
    <main className="p-4">
      <AsciiHero />
      <Terminal />
    </main>
  );
}
