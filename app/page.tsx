import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Photography from "@/components/Photography";
import SectionDivider from "@/components/SectionDivider";
import { getPhotos } from "@/lib/getPhotos";
import { getProfilePhotos } from "@/lib/getProfilePhotos";

export default async function Page() {
  const photos = await getPhotos();
  const profilePhotos = await getProfilePhotos();
  return (
    <>
      <NavBar />
      <main>
        <Hero profilePhotos={profilePhotos} />
        <SectionDivider />
        <Photography photos={photos} />
      </main>
    </>
  );
}
