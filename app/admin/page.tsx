"use client";

import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    import("decap-cms-app").then((CMS) => {
      CMS.default.init();
    });
  }, []);

  return <div id="nc-root" />;
}
