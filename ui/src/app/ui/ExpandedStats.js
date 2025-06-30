import LineGauge from "./LineGauge";
import { FaThermometerThreeQuarters, FaMemory, FaDesktop } from "react-icons/fa";
import { BsDeviceSsdFill } from "react-icons/bs";
import { GoCpu } from "react-icons/go";
import { IoIosTrendingUp, IoIosTrendingDown } from "react-icons/io";

const ExpandedStats = ({ cpu, memory, storage, network, host }) => {
  const cpuUsage = Number(cpu?.load?.toFixed(2));
  const usedMemoryGB = (memory.used / 1024 / 1024 / 1024).toFixed(2);
  const totalMemoryGB = (memory.total / 1024 / 1024 / 1024).toFixed(2);
  const usedStorageGB = (storage.used / 1024 / 1024 / 1024).toFixed(2);
  const totalStorageGB = (storage.total / 1024 / 1024 / 1024).toFixed(2);
  const uploadMb = Number(network.upload);
  const downloadMb = Number(network.download);

  return (
    <div className="font-sans p-6 w-full flex flex-col flex-1">
      <div className="flex flex-col flex-1 items-center justify-center gap-4">
        <LineGauge label="CPU Usage" value={cpuUsage} className="bg-red-500" icon={GoCpu} unit={`${cpuUsage}%`} />
        <LineGauge
          label="CPU Temp"
          icon={FaThermometerThreeQuarters}
          value={cpu.temp ? Math.min(100, ((cpu.temp - 30) / 60) * 100) : 0}
          unit={cpu.temp ? `${cpu.temp}°C` : "Unable to retrieve temp"}
        />
        <LineGauge
          label="Memory"
          value={(memory.used / memory.total) * 100}
          unit={`${usedMemoryGB}GB / ${totalMemoryGB}GB`}
          icon={FaMemory}
        />
        <LineGauge
          label="Storage"
          value={(storage.used / storage.total) * 100}
          unit={totalStorageGB > 0 ? `${usedStorageGB}GB / ${totalStorageGB}GB` : "Unable to retrieve storage"}
          icon={BsDeviceSsdFill}
        />
        <LineGauge
          label="Upload"
          value={uploadMb}
          unit={uploadMb > 0 ? `${uploadMb.toFixed(1)} Mb/s` : "Idle"}
          icon={IoIosTrendingUp}
          thresholdColors={{ high: "bg-emerald-500", mid: "bg-indigo-500", low: "bg-cyan-500" }}
        />
        <LineGauge
          label="Download"
          value={downloadMb}
          unit={downloadMb > 0 ? `${downloadMb.toFixed(1)} Mb/s` : "Idle"}
          icon={IoIosTrendingDown}
          thresholdColors={{ high: "bg-emerald-500", mid: "bg-indigo-500", low: "bg-cyan-500" }}
        />
      </div>
      <div className="h-6 w-fit mx-auto p-1 px-2 text-xs text-gray-100 flex items-center justify-center gap-2 shadow rounded bg-zinc-900 shadow-zinc-700">
        <FaDesktop />
        <p>{host}</p>
      </div>
    </div>
  );
};

export default ExpandedStats;