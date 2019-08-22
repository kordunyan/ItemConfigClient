import {MandatoryField} from './mandatory-field';
import {MandatoryTranslation} from './mandatory-translation';
import {MandatoryInstructionCriteriaCode} from './mandatory-instruction-criteria-code';
import {MandatoryInstructionCriteriaField} from './mandatory-instruction-criteria-field';
import {MandatoryInstructionCriteriaTranslation} from './mandatory-instruction-criteria-translation';

export class MandatoryDataCheck {
  id: number;
  mandatoryFields: MandatoryField[] = [];
  mandatoryTranslations: MandatoryTranslation[] = [];
  mandatoryInstructionCriteriaCodes: MandatoryInstructionCriteriaCode[] = [];
  mandatoryInstructionCriteriaFields: MandatoryInstructionCriteriaField[] = [];
  mandatoryInstructionCriteriaTranslations: MandatoryInstructionCriteriaTranslation[] = [];
}
