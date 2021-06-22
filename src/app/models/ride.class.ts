import { DetailedAddress } from "./detailed-address.class";
export class RideDetails {
  timeStats: TimeStats;
  source: DetailedAddress;
  destination: DetailedAddress;
}

export class TimeStats {
  visitAt: number;
  loadAt: number;
  reachedAt: number;
  unloadAt: number;
}
