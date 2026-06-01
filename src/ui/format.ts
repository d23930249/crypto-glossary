export function shortAddress(addr: string, lead = 4, tail = 4): string {
  if (!addr) return '';
  if (addr.length <= lead + tail + 1) return addr;
  return `${addr.slice(0, lead)}…${addr.slice(-tail)}`;
}

export function formatEth(wei: bigint, decimals = 4): string {
  const eth = Number(wei) / 1e18;
  if (!Number.isFinite(eth)) return '0';
  return eth.toFixed(decimals).replace(/0+$/, '').replace(/\.$/, '');
}

export function explorerAddress(addr: string): string {
  return `https://sepolia.etherscan.io/address/${addr}`;
}
