import { Item } from "../domain/item";
import { FieldConfig } from "../domain/field-config";

export abstract class AbstractItemFieldConfigHolder {
    public noActiveFieldConfigs: FieldConfig[] = [];
    
    constructor(
        public item: Item, 
        public fieldConfigs: FieldConfig[]
    ) {
        this.createNoActiveFieldConfigs();
    }

    abstract createNoActiveFieldConfigs();

    sortFieldConfigs(fieldConfigs: FieldConfig[]) {
        this.sortFields(fieldConfigs, (fieldConfig: FieldConfig) => fieldConfig.name.toLowerCase());
    }

    sortFields(fieldConfigs: any[], consumer) {
        fieldConfigs.sort((fieldA: FieldConfig, fieldB: FieldConfig) => {
            let a = consumer(fieldA);
            let b = consumer(fieldB);
            if (a === b) {
                return 0;
            }
            return (a > b)? 1 : -1;
        });
    }

    public removeNoActiveField(fieldConfigName: string) {
        this.noActiveFieldConfigs.splice(this.noActiveFieldConfigs.findIndex(fieldConfig => fieldConfig.name === fieldConfigName), 1);
    }
}