import RadialGauge from "./RadialGauge";
import { GoCpu } from "react-icons/go";
import { FaThermometerThreeQuarters, FaMemory, FaDesktop } from "react-icons/fa";
import { BsDeviceSsdFill } from "react-icons/bs";
import { IoIosTrendingUp, IoIosTrendingDown } from "react-icons/io";

const CompactStats = ({ cpu, memory, storage, network, host }) => {
  const cpuUsage = Number(cpu?.load?.toFixed(2));
  const cpuTemp = cpu?.temp ?? null;
  const usedMemoryGB = (memory.used / 1024 / 1024 / 1024).toFixed(2);
  const usedStorageGB = (storage.used / 1024 / 1024 / 1024).toFixed(2);
  const totalStorageGB = (storage.total / 1024 / 1024 / 1024).toFixed(2);
  const uploadMb = Number(network.upload);
  const downloadMb = Number(network.download);

  return (
    <div className="flex gap-4 items-center justify-center flex-1 h-full px-2">
      <div className="h-6 min-w-fit max-w-24 mx-auto p-1 px-2 text-xs text-gray-100 flex items-center justify-center gap-2 shadow rounded bg-zinc-900 shadow-zinc-700">
        <FaDesktop />
        <p>{host}</p>
      </div>
      <RadialGauge value={cpuUsage} unit={Number.isFinite(cpuUsage) ? `${cpuUsage.toFixed(1)}%` : "N/A"} icon={GoCpu} />
      <RadialGauge
        value={cpuTemp ? Math.min(100, ((cpuTemp - 30) / 60) * 100) : 0}
        unit={cpuTemp ? `${cpuTemp}°C` : "N/A"}
        icon={FaThermometerThreeQuarters}
      />
      <RadialGauge value={(memory.used / memory.total) * 100} unit={`${usedMemoryGB}GB`} icon={FaMemory} />
      <RadialGauge value={(storage.used / storage.total) * 100} unit={totalStorageGB > 0 ? `${usedStorageGB}GB` : "N/A"} icon={BsDeviceSsdFill} />
      <RadialGauge
        value={uploadMb}
        unit={Number.isFinite(uploadMb) && uploadMb > 0 ? `${uploadMb.toFixed(1)} Mb/s` : "Idle"}
        icon={IoIosTrendingUp}
      />
      <RadialGauge
        value={downloadMb}
        unit={Number.isFinite(downloadMb) && downloadMb > 0 ? `${downloadMb.toFixed(1)} Mb/s` : "Idle"}
        icon={IoIosTrendingDown}
      />
    </div>
  );
};

export default CompactStats;
