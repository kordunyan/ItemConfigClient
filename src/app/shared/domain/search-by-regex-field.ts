export class SearchByRegexField {
  constructor(
    public fieldName: string,
    public regex: string = '',
    public invalidOwner: boolean = false
  ) {

  }
}
