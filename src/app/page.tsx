import { HomeEditorial } from "@/components/home/HomeEditorial";
import { buildMetadata } from "@/lib/metadata";
import { company } from "@/lib/site-content";

export const metadata = buildMetadata({
  title: "We structure what others cannot yet fund",
  description: company.description,
  path: "/",
});

export default function Home() {
  return (
    <main id="main-content">
      <HomeEditorial />
    </main>
  );
}
