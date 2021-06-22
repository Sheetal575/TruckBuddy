import { GenericModel } from '../../core/models/generic-model.class';
import { DataRef } from 'src/app/core/models/dataRef.class';
import { FeatureMapEnum } from './feature-map.enum';
export class FeatureMap extends GenericModel {
    value?: DataRef;
    mappedTo?: DataRef;
    type?: FeatureMapEnum;

    public static toFeatureMap(json: string): FeatureMap {
        return JSON.parse(json);
    }

    public static FeatureMapToJson(value: FeatureMap): string {
        return JSON.stringify(value);
    }
}