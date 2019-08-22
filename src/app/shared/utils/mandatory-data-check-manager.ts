import {MandatoryDataCheck} from '../domain/mandatory-data-check';
import {ArrayUtils} from './array-utils';

export class MandatoryDataCheckManager {

  public static hasNewMandatoryData(dataCheck: MandatoryDataCheck): boolean {

    if (MandatoryDataCheckManager.existWithoutId(dataCheck.mandatoryTranslations)) {
      return true;
    }

    if (MandatoryDataCheckManager.existWithoutId(dataCheck.mandatoryFields)) {
      return true;
    }

    if (MandatoryDataCheckManager.existWithoutId(dataCheck.mandatoryInstructionCriteriaCodes)) {
      return true;
    }

    if (MandatoryDataCheckManager.existWithoutId(dataCheck.mandatoryInstructionCriteriaFields)) {
      return true;
    }
    return MandatoryDataCheckManager.existWithoutId(dataCheck.mandatoryInstructionCriteriaTranslations);
  }

  private static existWithoutId(fieldList: any[]) {
    if (ArrayUtils.isEmpty(fieldList)) {
      return false;
    }
    return fieldList.find(f => !f.id) !== undefined;
  }

}
