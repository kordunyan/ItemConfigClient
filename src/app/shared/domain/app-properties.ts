export class AppProperties {
  public static readonly OWNER_ITEM = 'ITEM';

  public static readonly FIELD_D2COMM_ITEM_NUMBER = 'D2COMM_ITEM_NUMBER';

  public static readonly REQUIRED_FIELDS = [
    AppProperties.FIELD_D2COMM_ITEM_NUMBER,
    'CARE_CONFIG_FORMAT_GROUP_NAME'
  ];

  public static readonly DEFAULT_EXLUDED_FIELDS = [
    'ADD_STRAIGHT_CUT_THERMAL_PART_NUMBER',
    'ADD_STRAIGHT_CUT_ROTARY_PART_NUMBER',
    'ADD_BOOKLET_ROTARY_PART_NUMBER',
    'ADD_BOOKLET_THERMAL_PART_NUMBER',
    'IS_EQUALIZE_BLOCKS_LENGTH'
  ];

  public static readonly REQUEST_PARAM_ITEM_ID = 'itemId';
  public static readonly REQUEST_PARAM_RBO = 'rbo';

  public static readonly API_BASE_URL = document.getElementsByTagName('api-href')[0].getAttribute('href');
}
