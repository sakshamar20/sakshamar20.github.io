import NavBar from "@/components/NavBar";
import Contact from "@/components/Contact";

export const metadata = {
  title: "Contact — Saksham Arora",
  description: "Get in touch with Saksham Arora.",
};

export default function ContactPage() {
  return (
    <>
      <NavBar />
      <main>
        <Contact />
      </main>
    </>
  );
}
