import dynamic from "next/dynamic";
import React from "react";

import ClientOnly from "./ClientOnly";

export default function Page() {
  return <ClientOnly />;
}
