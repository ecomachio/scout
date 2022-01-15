import { ActionEnum } from "../enum/action.enum";

export class Step {
  id: number;
  action: ActionEnum;
  route: (arg: string) => string;
  nextStep: number | null;
  isOptional?: boolean;
  isHidden?: boolean;
  metadata?: {
    decision?: boolean;
  };
}
