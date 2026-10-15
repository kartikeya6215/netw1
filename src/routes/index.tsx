import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/ledger/dashboard";
import { ensureAnchor, useLedgerPersistence } from "@/lib/ledger/store";

export const Route = createFileRoute("/")({
  loader: () => ({ now: new Date().toISOString() }),
  component: Home,
});

function Home() {
  const { now } = Route.useLoaderData();
  useState(() => {
    ensureAnchor(now);
    return now;
  });
  useLedgerPersistence();
  return <Dashboard />;
}
