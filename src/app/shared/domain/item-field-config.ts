export class ItemFieldConfig {

    public static readonly DEFAULT_ACTIVE = true;
    public static readonly DEFAULT_REQUIRED = true;
    public static readonly DEFAULT_EDITABLE = true;
    public static readonly DEFAULT_DATA_SOURCE_NAME = null;
    public static readonly DEFAULT_PREDEFINED_VALUE = null;
    public static readonly DEFAULT_FILTER_REGEX = null;
    public static readonly DEFAULT_CAN_ADD_LATER = false;
    public static readonly DEFAULT_STORE_LAST_USER_INPUT = true;



    constructor(
        public fieldConfigName: string,
        public active: boolean,
        public required: boolean,
        public editable: boolean,
        public dataSourceName: string,
        public predefinedValue: string,
        public filterRegex: string,
        public canAddLater: boolean,
        public storeLastUserInput: boolean,
        public id?: number
    ) {

    }

    public static copy(itemFieldConfig: ItemFieldConfig) {
        return new ItemFieldConfig(
            itemFieldConfig.fieldConfigName,
            itemFieldConfig.active,
            itemFieldConfig.required,
            itemFieldConfig.editable,
            itemFieldConfig.dataSourceName,
            itemFieldConfig.predefinedValue,
            itemFieldConfig.filterRegex,
            itemFieldConfig.canAddLater,
            itemFieldConfig.storeLastUserInput,
            itemFieldConfig.id   
        );
    }

    public static default(fieldConfigName: string): ItemFieldConfig {
        return new ItemFieldConfig(
            fieldConfigName,
            ItemFieldConfig.DEFAULT_ACTIVE,
            ItemFieldConfig.DEFAULT_REQUIRED,
            ItemFieldConfig.DEFAULT_EDITABLE,
            ItemFieldConfig.DEFAULT_DATA_SOURCE_NAME,
            ItemFieldConfig.DEFAULT_PREDEFINED_VALUE,
            ItemFieldConfig.DEFAULT_FILTER_REGEX,
            ItemFieldConfig.DEFAULT_CAN_ADD_LATER,
            ItemFieldConfig.DEFAULT_STORE_LAST_USER_INPUT
        );
    }
}