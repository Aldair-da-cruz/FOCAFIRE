import { Suspense } from "react";
import { CompararScreen } from "@/components/screens/CompararScreen";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen bg-ink" />}>
      <CompararScreen />
    </Suspense>
  );
}
