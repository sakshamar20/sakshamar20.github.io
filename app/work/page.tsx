import NavBar from "@/components/NavBar";
import Work from "@/components/Work";

export const metadata = {
  title: "Work — Saksham Arora",
  description:
    "Projects, experience timeline, recognition, and technical skills.",
};

export default function WorkPage() {
  return (
    <>
      <NavBar />
      <main>
        <Work />
      </main>
    </>
  );
}
