import { Hero }                  from "@/sections/Hero";
import { About }                 from "@/sections/About";
import { WorkIndex, CaseStudy }  from "@/sections/Work";
import { ExtendedAbout }         from "@/sections/ExtendedAbout";
import { Brands }                from "@/sections/Brands";
import { Contact }               from "@/sections/Contact";
import { getProjectsFromCMS }    from "@/lib/cms-projects";

export default async function Home() {
  const projects = await getProjectsFromCMS();

  return (
    <main>
      {/* ── 1. Hero (200vh wrapper, splits on scroll) ── */}
      <Hero />

      {/* ── 2. About Me (bars auto-reveal on viewport entry) ── */}
      <About />

      {/* ── 3. Work Index (rows stagger in on scroll) ── */}
      <WorkIndex projects={projects} />

      {/* ── 4. Case Studies (100vh each) ── */}
      {projects.map((p) => (
        <CaseStudy key={p.id} project={p} />
      ))}

      {/* ── 5. Extended About (prose with inline Brier accents) ── */}
      <ExtendedAbout />

      {/* ── 6. Clients grid ── */}
      <Brands />

      {/* ── 7. Contact / washing-label footer ── */}
      <Contact />
    </main>
  );
}
