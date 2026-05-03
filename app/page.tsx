import { Hero }                  from "@/sections/Hero";
import { About }                 from "@/sections/About";
import { WorkIndex, CaseStudy }  from "@/sections/Work";
import { Brands }                from "@/sections/Brands";
import { Contact }               from "@/sections/Contact";
import { PROJECTS }              from "@/lib/projects";

export default function Home() {
  return (
    <main>
      {/*
       * Sequential DOM flow — no z-index stacking, no negative margins.
       *
       * Scroll timeline:
       *   0 – 60vh    Hero static (scramble animating)
       *   60 – 170vh  Hero panels split apart
       *   170 – 200vh Split complete; About enters from below
       *   200vh +     About in normal flow → Work Index → Case Studies
       */}

      {/* ── 1. Hero (200vh wrapper, splits on scroll) ── */}
      <Hero />

      {/* ── 2. About Me (bars auto-reveal on viewport entry) ── */}
      <About />

      {/* ── 3. Work Index (rows stagger in on scroll) ── */}
      <WorkIndex />

      {/* ── 4. Case Studies (100vh each) ── */}
      {PROJECTS.map((p) => (
        <CaseStudy key={p.id} project={p} />
      ))}

      {/* ── 5. Clients grid ── */}
      <Brands />

      {/* ── 6. Contact / washing-label footer ── */}
      <Contact />
    </main>
  );
}
