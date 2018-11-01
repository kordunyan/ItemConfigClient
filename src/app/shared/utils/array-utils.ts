export class ArrayUtils {

  public static remove<T>(array: T[], element: T): T[] {
    const index = array.indexOf(element);
    if (index < 0) {
      return null;
    }
    return array.splice(index, 1);
  }

  public static sort(array: any[], getFieldToCompare) {
    array.sort((elementA, elementB) => {
      let a = getFieldToCompare(elementA);
      let b = getFieldToCompare(elementB);
      if (a === b) {
        return 0;
      }
      return (a > b) ? 1 : -1;
    });
  }

  public static isEmpty(array): boolean {
    return !array || array.length === 0;
  }

  public static isNotEmpty(array): boolean {
    return !ArrayUtils.isEmpty(array);
  }
}
