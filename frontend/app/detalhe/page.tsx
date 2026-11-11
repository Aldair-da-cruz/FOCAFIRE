import { Suspense } from "react";
import { DetalheScreen } from "@/components/screens/DetalheScreen";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen bg-ink" />}>
      <DetalheScreen />
    </Suspense>
  );
}
