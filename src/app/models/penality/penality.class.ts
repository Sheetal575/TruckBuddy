import { PenaltyChargeStatusEnum } from './penality-charged-status.enum';
import { GenericModel } from '../../core/models/generic-model.class';
export class Penality extends GenericModel {
    status?: PenaltyChargeStatusEnum;
    amount?: number;
    refId?: string;

    public static toPenality(json: string): Penality {
        return JSON.parse(json);
    }

    public static PenalityToJson(value: Penality): string {
        return JSON.stringify(value);
    }
}