import type { Asset } from '../types/device.types';

type AssetBadgeProps = {
  asset?: Asset;
};

function formatAssetLabel(asset: Asset) {
  if (asset.assetType.toLowerCase() === 'animal') {
    return `Animal · ${asset.serial.replace('CARAVANA-', 'Caravana ')}`;
  }

  return `${asset.assetType} · ${asset.serial}`;
}

export function AssetBadge({ asset }: AssetBadgeProps) {
  if (!asset) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
        Sin asset asociado
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
      {formatAssetLabel(asset)}
    </span>
  );
}
