// To parse this data:
//
//   import { Convert, ReverseGeoCodingResponse } from "./file";
//
//   const reverseGeoCodingResponse = Convert.toReverseGeoCodingResponse(json);

export class ReverseGeoCodingResponse {
    plus_code: PlusCode;
    results:   Result[];
    status:    string;
}

export class PlusCode {
    compound_code: string;
    global_code:   string;
}

export class Result {
    address_components: AddressComponent[];
    formatted_address:  string;
    geometry:           Geometry;
    place_id:           string;
    plus_code?:         PlusCode;
    types:              string[];
}

export class AddressComponent {
    long_name:  string;
    short_name: string;
    types:      string[];
}

export class Geometry {
    location:      Location;
    location_type: string;
    viewport:      Bounds;
    bounds?:       Bounds;
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
    public static toReverseGeoCodingResponse(json: string): ReverseGeoCodingResponse {
        return JSON.parse(json);
    }

    public static reverseGeoCodingResponseToJson(value: ReverseGeoCodingResponse): string {
        return JSON.stringify(value);
    }
}
