export class ExprotFieldConfigDto {
  constructor(
    public fieldConfigExportType: FieldConfigExportType,
    public options?: string[]
  ) {
  }
}

export enum FieldConfigExportType {
  ALL = 'ALL',
  BY_OWNERS = 'BY_OWNERS',
  BY_TYPES = 'BY_TYPES',
  BY_NAMES = 'BY_NAMES'
}
