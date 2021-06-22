import { DataRef } from 'src/app/core/models/dataRef.class';
import { GenericModel } from '../../core/models/generic-model.class';
import { ExtraData } from '../extra-data.class';
import { DocumentPurposeEnum } from './document-purpose-type.enum';
import { DocumentStatusEnum } from './document-status.enum';
export class DocumentArchive extends GenericModel {

    purpose?: DocumentPurposeEnum;
    fileId?: string;
    profileRef?: DataRef;
    extraData?: string;
    status?: DocumentStatusEnum;

}