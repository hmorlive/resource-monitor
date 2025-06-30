import { useEffect, useState } from "react";

export default function useSystemStats() {
  const [memory, setMemory] = useState({ total: 0, used: 0 });
  const [cpu, setCpu] = useState({ load: 0 });
  const [storage, setStorage] = useState({ total: 0, used: 0 });
  const [host, setHost] = useState("");
  const [network, setNetwork] = useState({ upload: 0, download: 0 });

  useEffect(() => {
    if (window?.electron?.getSystemHost) {
      window.electron.getSystemHost().then(setHost);
    }
  }, []);

  useEffect(() => {
    if (window?.electron?.onResourceUsage) {
      const handleResourceUsage = (data) => {
        setMemory(data.memory);
        setCpu(data.cpu);
        setStorage(data.storage);
        setNetwork(data.network);
      };
      window.electron.onResourceUsage(handleResourceUsage);
      return () => window.electron.removeListener("resource-usage", handleResourceUsage);
    }
  }, []);

  return { memory, cpu, storage, network, host };
}