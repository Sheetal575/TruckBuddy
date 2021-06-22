import { GenericModel } from '../../core/models/generic-model.class';
import { Dimension } from '../dimension.class';
export class VehicleCategory extends GenericModel {

    maxLoadWeight?: number;
    minLoadWeight?: number;
    wheel?: number;
    dimension?: Dimension;
    referenceTexts?: string[];
    imageId?: string;
    sizeFeet?: number;

    public static toVehicleCategory(json: string): VehicleCategory {
        return JSON.parse(json);
    }

    public static VehicleCategoryToJson(value: VehicleCategory): string {
        return JSON.stringify(value);
    }
}