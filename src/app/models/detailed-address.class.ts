import { GeoAddress } from './geolocation.class';
export class DetailedAddress {
    city?: string;
    state?: string;
    geoAddress?: GeoAddress = new GeoAddress();
    localArea?: string;
}