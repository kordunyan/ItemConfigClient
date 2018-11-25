import { Item } from "../domain/item";

export class CopyItemDto {
    constructor(
        public items: Item[], 
        public copyItemNumber: string,
        public copyItemId: number,
        public withItemFieldConfigs: boolean,
        public copyFieldsStrategy: CopyFieldsStrategy,
        public withMandatoryData: boolean) {
    }
}

export enum CopyFieldsStrategy {
    FROM_COPY_ITEM = 'FROM_COPY_ITEM',
    FROM_SUITABLE_ITEM = 'FROM_SUITABLE_ITEM'
}