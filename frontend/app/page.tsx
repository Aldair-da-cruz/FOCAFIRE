import { Suspense } from "react";
import { HomeScreen } from "@/components/screens/HomeScreen";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen bg-ink" />}>
      <HomeScreen />
    </Suspense>
  );
}
