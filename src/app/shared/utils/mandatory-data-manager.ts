import { ItemFieldConfig } from "../domain/item-field-config";
import { MandatoryTranslation } from "../domain/mandatory-translation";
import { MandatoryField } from "../domain/mandatory-field";
import { ItemFieldConfigManager } from "./item-field-config-manager";
import { ArrayUtils } from "./array-utils";

export class MandatoryDataManager {

    public instructionLanguagesMap: any = {};
    public instructionsFieldsMap: any = {};

    constructor(
        instructionLanguages: any,
        instructionsFields: any
    ) {
        for (let instruction in instructionLanguages) {
            this.instructionLanguagesMap[instruction] = this.createFieldsMap(instructionLanguages[instruction], (l) => l.code);  
        }
        for (let instruction in instructionsFields) {
            this.instructionsFieldsMap[instruction] = this.createFieldsMap(instructionsFields[instruction], (f) => f);
        }
    }

    public copyAllMandatoryData(destItemFieldConfigs: ItemFieldConfig[], srcItemFieldConfig: ItemFieldConfig) {
        const translationsToCopy = srcItemFieldConfig.mandatoryTranslations;
        const fieldsToCopy = srcItemFieldConfig.mandatoryFields;
        this.copyMandatoryData(destItemFieldConfigs, srcItemFieldConfig, translationsToCopy, fieldsToCopy);
    }

    public copyNewMandatoryData(destItemFieldConfigs: ItemFieldConfig[], srcItemFieldConfig: ItemFieldConfig) {
        const translationsToCopy = srcItemFieldConfig.mandatoryTranslations.filter(translation => !translation.id);
        const fieldsToCopy = srcItemFieldConfig.mandatoryFields.filter(field => !field.id);
        this.copyMandatoryData(destItemFieldConfigs, srcItemFieldConfig, translationsToCopy, fieldsToCopy);
    }

    public copyMandatoryData(destItemFieldConfigs: ItemFieldConfig[], srcItemFieldConfig: ItemFieldConfig, 
            translationsToCopy: MandatoryTranslation[], fieldsToCopy: MandatoryField[]) {
        
        const translationsToSelect = srcItemFieldConfig.mandatoryTranslations.filter(translation => translation.selected);
        const fieldsToSelect = srcItemFieldConfig.mandatoryFields.filter(field => field.selected);

        destItemFieldConfigs.forEach(itemFieldConfig => {
            if (this.isSameInstructionType(itemFieldConfig, srcItemFieldConfig)) {
                this.copyAllTranslations(itemFieldConfig, translationsToCopy);
                this.copyAllMandatoryFields(itemFieldConfig, fieldsToCopy);
            } else {
                this.copyAllowedTranslations(itemFieldConfig, translationsToCopy);
                this.copyAllowedMandatoryFields(itemFieldConfig, fieldsToCopy);
            }
            this.selectedTranslations(itemFieldConfig, translationsToSelect);
            this.selectedMandatoryFields(itemFieldConfig, fieldsToSelect);
            itemFieldConfig.hasNewMandatoryData = ItemFieldConfigManager.hasNewMandatoryData(itemFieldConfig);
            itemFieldConfig.hasSelectedMandatoryData = ItemFieldConfigManager.hasSelectedMandatoryData(itemFieldConfig);
        });
    }

    public selectedMandatoryFields(itemFieldConfig: ItemFieldConfig, fields: MandatoryField[]) {
        if (ArrayUtils.isEmpty(fields)) {
            return;
        }
        const itemMandatoryFieldsMap = this.createMandatoryFieldsMap(itemFieldConfig.mandatoryFields);
        fields.forEach(field => {
            const itemField = itemMandatoryFieldsMap[field.fieldConfig.name]; 
            if (itemField) {
                itemField.selected = true;
            }    
        });
    }

    public selectedTranslations(itemFieldConfig: ItemFieldConfig, translations: MandatoryTranslation[]) {
        if (ArrayUtils.isEmpty(translations)) {
            return;
        }
        const itemFieldConfigTranslationsMap = this.createTranslationsMap(itemFieldConfig.mandatoryTranslations);
        translations.forEach(translation => {
            const itemTranslation = itemFieldConfigTranslationsMap[translation.language.code];  
            if (itemTranslation) {
                itemTranslation.selected = true;
            }  
        });
    }

    public copyAllowedTranslations(itemFieldConfig: ItemFieldConfig, translations: MandatoryTranslation[]) {
        const allowedTranslationsMap = this.getAllowedInstructionTranslations(itemFieldConfig);
        const allowedMandatoryTranslations = translations.filter(translation => allowedTranslationsMap[translation.language.code]);
        this.copyAllTranslations(itemFieldConfig, allowedMandatoryTranslations);
    }

    public copyAllowedMandatoryFields(itemFieldConfig: ItemFieldConfig, mandatoryFields: MandatoryField[]) {
        const allowedFieldsMap = this.getAllowedInstructionFields(itemFieldConfig);
        const allowedMandatoryFields = mandatoryFields.filter(field => allowedFieldsMap[field.fieldConfig.name]);
        this.copyAllMandatoryFields(itemFieldConfig, allowedMandatoryFields);
    };

    public copyAllTranslations(itemFieldConfig: ItemFieldConfig, translations: MandatoryTranslation[]) {
        const fieldConfigTranslationsMap = this.createFieldsMap(itemFieldConfig.mandatoryTranslations, (t) => t.language.code);
        translations.forEach(translations => {
            if (!fieldConfigTranslationsMap[translations.language.code]) {
                itemFieldConfig.mandatoryTranslations.push(MandatoryTranslation.copyWithoutId(translations));
            }
        });
    }

    public copyAllMandatoryFields(itemFieldConfig: ItemFieldConfig, mandatoryFields: MandatoryField[]) {
        const mandatoryFieldsMap = this.createMandatoryFieldsMap(itemFieldConfig.mandatoryFields);
        mandatoryFields.forEach(field => {
            if (!mandatoryFieldsMap[field.fieldConfig.name]) {
                itemFieldConfig.mandatoryFields.push(MandatoryField.copyWithoutId(field));    
            }
        });
    }

    public createMandatoryFieldsMap(fields: MandatoryField[]) {
        return this.createFieldsMap(fields, (field) => field.fieldConfig.name);
    }

    public createTranslationsMap(translations: MandatoryTranslation[]) {
        return this.createFieldsMap(translations, (translation) => translation.language.code);
    }

    public createFieldsMap(fields: any[], getFieldKeyValueFunction) {
        let result = {};
        fields.forEach(field => {
            result[getFieldKeyValueFunction(field)] = field;
        });
        return result;
    }

    public isSameInstructionType(field1: ItemFieldConfig, field2: ItemFieldConfig): boolean {
        return field1.fieldConfig.type === field2.fieldConfig.type;
    }
    
    public getAllowedInstructionFields(itemFieldConfig: ItemFieldConfig) {
        return this.instructionsFieldsMap[itemFieldConfig.fieldConfig.type];
    }

    public getAllowedInstructionTranslations(itemFieldConfig: ItemFieldConfig) {
        return this.instructionLanguagesMap[itemFieldConfig.fieldConfig.type];
    }
}