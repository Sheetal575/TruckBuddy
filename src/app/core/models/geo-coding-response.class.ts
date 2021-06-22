
// To parse this data:
//
//   import { Convert, GeoCodingResponse } from "./file";
//
//   const geoCodingResponse = Convert.toGeoCodingResponse(json);

export class GeoCodingResponse {
    results: Result[];
    status:  string;
}

export class Result {
    address_components: AddressComponent[];
    formatted_address:  string;
    geometry:           Geometry;
    place_id:           string;
    types:              string[];
}

export class AddressComponent {
    long_name:  string;
    short_name: string;
    types:      string[];
}

export class Geometry {
    bounds:        Bounds;
    location:      Location;
    location_type: string;
    viewport:      Bounds;
}

export class Bounds {
    northeast: Location;
    southwest: Location;
}

export class Location {
    lat: number;
    lng: number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toGeoCodingResponse(json: string): GeoCodingResponse {
        return JSON.parse(json);
    }

    public static geoCodingResponseToJson(value: GeoCodingResponse): string {
        return JSON.stringify(value);
    }
}
