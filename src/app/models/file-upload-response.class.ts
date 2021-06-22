// To parse this data:
//
//   import { Convert, FileUploadResponse } from "./file";
//
//   const fileUploadResponse = Convert.toFileUploadResponse(json);

export interface FileUploadResponse {
    id?:        string;
    version?:   number;
    createdAt?: number;
    updatedAt?: number;
    name?:      string;
    bucket?:    string;
    mimeType?:  string;
    size?:      number;
    deleted?:   boolean;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toFileUploadResponse(json: string): FileUploadResponse {
        return JSON.parse(json);
    }

    public static fileUploadResponseToJson(value: FileUploadResponse): string {
        return JSON.stringify(value);
    }
}
