export class SearchByRegexField {
  constructor(
    public fieldName: string,
    public regex: string = ''
  ) {

  }

  public static copy(searchByRegexField: SearchByRegexField): SearchByRegexField {
    return new SearchByRegexField(
      searchByRegexField.fieldName,
      searchByRegexField.regex
    );
  }
}
