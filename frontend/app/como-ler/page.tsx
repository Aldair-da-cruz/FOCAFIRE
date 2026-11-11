import { Suspense } from "react";
import { ComoLerScreen } from "@/components/screens/ComoLerScreen";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen bg-ink" />}>
      <ComoLerScreen />
    </Suspense>
  );
}
