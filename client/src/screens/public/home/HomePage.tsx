import { HomeAbout } from "./components/HomeAbout";
import { HomeHero } from "./components/HomeHero";
import { HomeNews } from "./components/HomeNews";
import { HomeProjects } from "./components/HomeProjects";
import { useHomePage } from "./hooks/useHomePage";

export default function HomePage() {
  const home = useHomePage();

  return (
    <>
      <HomeHero labInfo={home.labInfo} isLoading={home.isLabInfoLoading} needsSetup={home.needsSetup} />
      <HomeAbout labInfo={home.labInfo} />
      <HomeProjects projects={home.selectedProjects} />
      <HomeNews posts={home.latestNews} />
    </>
  );
}
