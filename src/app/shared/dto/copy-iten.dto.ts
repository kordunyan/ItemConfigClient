import { Item } from "../domain/item";

export class CopyItemDto {
    constructor(public items: Item[], public copyItemId: number) {
    }
}