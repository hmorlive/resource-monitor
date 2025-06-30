"use client";
import useExpansionState from "./hooks/useExpansionState";
import useSystemStats from "./hooks/useSystemStats";
import CompactStats from "./ui/CompactStats";
import ExpandedStats from "./ui/ExpandedStats";

export default function Home() {
  const { memory, cpu, storage, network, host } = useSystemStats();
  const { isExpanded } = useExpansionState();

  return isExpanded ? (
    <ExpandedStats
      cpu={cpu}
      memory={memory}
      storage={storage}
      network={network}
      host={host}
    />
  ) : (
    <CompactStats
      cpu={cpu}
      memory={memory}
      storage={storage}
      network={network}
      host={host}
    />
  );
}