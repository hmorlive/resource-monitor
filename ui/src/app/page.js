"use client";

import { useEffect, useState } from "react";
import {
  FaDesktop,
  FaThermometerThreeQuarters,
  FaMemory,
} from "react-icons/fa";
import { BsDeviceSsdFill } from "react-icons/bs";
import { GoCpu } from "react-icons/go";
import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";
import GaugeComponent from "react-gauge-component";

const DEFAULT_THRESHOLD_COLORS = {
  low: "bg-emerald-500",
  mid: "bg-amber-500",
  high: "bg-red-500",
};

const MIN_TEMP = 30; // Minimum temperature for CPU (0% on gauge)
const MAX_TEMP = 90; // Maximum temperature for CPU (100% on gauge)

export default function Home() {
  const [memory, setMemory] = useState({ total: 0, used: 0 });
  const [cpu, setCpu] = useState({ load: 0 });
  const [storage, setStorage] = useState({ total: 0, used: 0 });
  const [host, setHost] = useState("");
  const [network, setNetwork] = useState({ upload: 0, download: 0 });
  const [isCondensed, setIsCondensed] = useState(false);

  useEffect(() => {
    // Ensure Electron's API is available
    if (window?.electron?.getSystemHost) {
      const fetchHost = async () => {
        const host = await window.electron.getSystemHost();
        setHost(host);
      };
      fetchHost();
    }
  }, []);

  useEffect(() => {
    // Ensure Electron's API is available
    if (window?.electron?.onResourceUsage) {
      const handleResourceUsage = (data) => {
        setIsCondensed(data?.isCondensed || false);
        setMemory(data.memory);
        setCpu(data.cpu);
        setStorage(data.storage);
        setNetwork(data.network);
      };

      // Attach the event listener
      window.electron.onResourceUsage(handleResourceUsage);

      // Cleanup listener when component unmounts
      return () => {
        window.electron.removeListener("resource-usage", handleResourceUsage);
      };
    }
  }, []);

  // Convert memory values to GB
  const totalMemoryGB = (memory.total / 1024 / 1024 / 1024).toFixed(2); // Convert bytes to GB
  const usedMemoryGB = (memory.used / 1024 / 1024 / 1024).toFixed(2); // Convert bytes to GB

  // Round CPU usage to 2 decimal places
  const cpuUsage = cpu?.load?.toFixed(2);

  // Convert storage values to GB
  const totalStorageGB = (storage.total / 1024 / 1024 / 1024).toFixed(2); // Convert bytes to GB
  const usedStorageGB = (storage.used / 1024 / 1024 / 1024).toFixed(2); // Convert bytes to GB

  // Convert network values to MB
  const downloadMb = network.download;
  const uploadMb = network.upload;

  
  if (isCondensed) {
    return (
      <div className="font-sans p-6 w-full flex flex-col flex-1">
        <GaugeComponent
        
          value={cpuUsage}
          arc={{
            subArcs: [
              {
                limit: 20,
                
                // green hex neon
                color: "#39FF14",
              },
              {
                limit: 50,
                color: "#FFFF00", // yellow
              },
              {                limit: 80,
                color: "#FF4500", // orange red
              },
              {                limit: 100,
                color: "#FF0000", // red
              },
            ],
          }}
          />
      </div>
    );
  }

  return (
    <div className="font-sans p-6 w-full flex flex-col flex-1">
      <div className="flex flex-col flex-1 items-center justify-center gap-4">
        {/* CPU Usage Gauge */}
        <Gauge
          label="CPU Usage"
          value={cpuUsage}
          className="bg-red-500"
          icon={GoCpu}
          unit={`${cpuUsage}%`}
        />

        {/* CPU Temp Gauge */}
        <Gauge
          label="CPU Temp"
          icon={FaThermometerThreeQuarters}
          value={cpu.temp ? calculateGaugeValue(cpu.temp) : 0} // Map temp to percentage
          unit={cpu.temp ? `${cpu.temp}°C` : "Unable to retrieve temp"}
        />

        {/* RAM Usage Gauge */}
        <Gauge
          label="Memory"
          value={(memory.used / memory.total) * 100}
          unit={`${usedMemoryGB}GB / ${totalMemoryGB}GB`}
          icon={FaMemory}
        />

        {/* Storage Usage Gauge */}

        <Gauge
          label="Storage"
          value={(storage.used / storage.total) * 100}
          unit={
            totalStorageGB > 0
              ? `${usedStorageGB}GB / ${totalStorageGB}GB`
              : "Unable to retrieve storage"
          }
          icon={BsDeviceSsdFill}
        />

        {/* Network Usage Gauge */}
        <Gauge
          label="Upload"
          value={uploadMb}
          unit={uploadMb > 0 ? `${uploadMb} Mb/s` : "Idle"}
          icon={IoIosTrendingUp}
          thresholdColors={{
            high: "bg-emerald-500",
            mid: "bg-indigo-500",
            low: "bg-cyan-500",
          }}
        />

        <Gauge
          label="Download"
          value={downloadMb}
          unit={downloadMb > 0 ? `${downloadMb} Mb/s` : "Idle"}
          icon={IoIosTrendingDown}
          thresholdColors={{
            high: "bg-emerald-500",
            mid: "bg-indigo-500",
            low: "bg-cyan-500",
          }}
        />
      </div>
      <div className="mt-6 w-fit mx-auto flex-1 p-1 px-2 text-xs text-gray-100 flex items-center justify-center gap-2 shadow rounded bg-zinc-900 shadow-zinc-700">
        <FaDesktop />
        <p>{host}</p>
      </div>
    </div>
  );
}

function Gauge({
  label,
  icon = () => null,
  value,
  unit,
  thresholdColors = DEFAULT_THRESHOLD_COLORS,
  width = "",
}) {
  const calculateColor = (value) => {
    if (value < 50) return thresholdColors.low;
    if (value < 80) return thresholdColors.mid;
    return thresholdColors.high;
  };

  const Icon = icon;

  return (
    <div className={`flex flex-col items-center rounded-lg px-2 w-full gap-1 ${width}`}>
      <h2 className="text-xs font-extrabold flex gap-1 items-center justify-center">
        <Icon />
        {label}
      </h2>
      <div className="relative w-32 h-1 overflow-hidden bg-black bg-opacity-60 rounded-full shadow shadow-zinc-600">
        {/* Gauge Fill */}
        <div
          className={`absolute top-0 left-0 w-full h-full origin-bottom transition-all duration-300 ${calculateColor(
            value
          )}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
      <div className="rounded-t-full flex items-center justify-center text-gray-200">
        <span className="text-xs flex font-semibold">
          {unit ? unit : `${value}%`}
        </span>
      </div>
    </div>
  );
}

const calculateGaugeValue = (temp) => {
  if (temp <= MIN_TEMP) return 0; // Below minimum, set to 0%
  if (temp >= MAX_TEMP) return 100; // Above maximum, set to 100%

  // Normalize the temperature to a percentage
  return ((temp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100;
};
