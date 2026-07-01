import dynamic                   from "next/dynamic";
import { Hero }                  from "@/sections/Hero";
import { About }                 from "@/sections/About";
import { WorkIndex, CaseStudy }  from "@/sections/Work";
import { getProjectsFromCMS }    from "@/lib/cms-projects";
import { HashScroll }            from "@/components/HashScroll";

/* Below-fold sections — loaded in a separate JS chunk to reduce initial bundle size */
const ExtendedAbout = dynamic(() => import("@/sections/ExtendedAbout").then(m => ({ default: m.ExtendedAbout })));
const Brands        = dynamic(() => import("@/sections/Brands").then(m => ({ default: m.Brands })));
const Contact       = dynamic(() => import("@/sections/Contact").then(m => ({ default: m.Contact })));

export default async function Home() {
  const projects = await getProjectsFromCMS();

  return (
    <main>
      <HashScroll />
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
