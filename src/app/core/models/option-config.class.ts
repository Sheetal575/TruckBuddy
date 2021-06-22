// To parse this data:
//
//   import { Convert, OptionConfig } from "./file";
//
//   const optionConfig = Convert.toOptionConfig(json);

export interface OptionConfig {
    id:           string;
    version:      number;
    createdAt:    number;
    updatedAt:    number;
    displayNames: DisplayName[];
    orderBy:      number;
    type:         string;
    refId:        string;
    deleted:      boolean;
}

export interface DisplayName {
    locale: string;
    text:   string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toOptionConfig(json: string): OptionConfig {
        return JSON.parse(json);
    }

    public static optionConfigToJson(value: OptionConfig): string {
        return JSON.stringify(value);
    }
}
