import si from 'systeminformation';

export async function getNetworkMbps() {
  try {
    // Fetch network statistics
    const stats = await si.networkStats();

    // Find the first active interface
    const activeInterface = stats.find((iface) => iface.operstate === 'up');

    if (activeInterface) {
      // Convert speeds to Mbps (bytes to bits, then to megabits)
      const downloadMbps = ((activeInterface.rx_sec * 8) / (1024 ** 2)).toFixed(2);
      const uploadMbps = ((activeInterface.tx_sec * 8) / (1024 ** 2)).toFixed(2);

      return { download: downloadMbps, upload: uploadMbps };
    } else {
      console.log('No active network interface found.');
      return { download: 0, upload: 0 };
    }
  } catch (error) {
    console.error('Error retrieving network Mbps:', error);
    return { download: 0, upload: 0 };
  }
}