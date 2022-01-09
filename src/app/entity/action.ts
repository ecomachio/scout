import { Player } from "./player";
import { Match } from "./match";
import { ActionEnum } from "../enum/action.enum";
import { Step } from "./step";

export class Action {
  id: string;
  name: string;
  description: string;
  decision: boolean;
  player: Player;
  match: Match;
  steps: number;
  matchTime: string;

  constructor(description?: string) {
    this.id = null;
    this.description = description;
    this.decision = null;
  }
}

type ActionStepConfig = {
  [key in ActionEnum]?: {
    steps: Step[];
  };
};

export const ACTION_STEP_CONFIG: ActionStepConfig = {
  [ActionEnum.GOAL]: {
    steps: [
      {
        id: 1,
        action: ActionEnum.GOAL,
        route: (categoryId) => `choose-teams/${categoryId}`,
        nextStep: 2,
      },
      {
        id: 2,
        action: ActionEnum.GOAL,
        route: (categoryId) => `choose-players/${categoryId}`,
        nextStep: 3,
      },
      {
        id: 3,
        action: ActionEnum.ASSIST,
        route: (categoryId) => `choose-players/${categoryId}`,
        nextStep: null,
        isOptional: true,
      },
    ],
  },
  [ActionEnum.FINISH]: {
    steps: [
      {
        id: 1,
        action: ActionEnum.FINISH,
        route: (categoryId) => `choose-players/${categoryId}`,
        nextStep: 2,
      },
      {
        id: 2,
        action: ActionEnum.FINISH,
        route: () => `confirmation-step`,
        nextStep: null,
      },
    ],
  },
  [ActionEnum.TACKLE]: {
    steps: [
      {
        id: 1,
        action: ActionEnum.TACKLE,
        route: (categoryId) => `choose-players/${categoryId}`,
        nextStep: null,
      },
    ],
  },
  [ActionEnum.PASS]: {
    steps: [
      {
        id: 1,
        action: ActionEnum.PASS,
        route: (categoryId) => `choose-players/${categoryId}`,
        nextStep: null,
      },
    ],
  },
  [ActionEnum.FOUL]: {
    steps: [
      {
        id: 1,
        action: ActionEnum.FOUL,
        route: (categoryId) => `choose-teams/${categoryId}`,
        nextStep: 2,
      },
      {
        id: 2,
        action: ActionEnum.FOUL,
        route: (categoryId) => `choose-players/${categoryId}`,
        nextStep: null,
      },
    ],
  },
  [ActionEnum.GOALKEEPERSAVE]: {
    steps: [
      {
        id: 1,
        action: ActionEnum.GOALKEEPERSAVE,
        route: (categoryId) => `choose-players/${categoryId}`,
        nextStep: null,
      },
    ],
  },
  [ActionEnum.REDCARD]: {
    steps: [
      {
        id: 1,
        action: ActionEnum.REDCARD,
        route: (categoryId) => `choose-players/${categoryId}`,
        nextStep: null,
      },
    ],
  },
  [ActionEnum.YELLOWCARD]: {
    steps: [
      {
        id: 1,
        action: ActionEnum.YELLOWCARD,
        route: (categoryId) => `choose-players/${categoryId}`,
        nextStep: null,
      },
    ],
  },
  [ActionEnum.PLAYEROFTHEMATCH]: {
    steps: [
      {
        id: 1,
        action: ActionEnum.PLAYEROFTHEMATCH,
        route: (categoryId) => `choose-players/${categoryId}`,
        nextStep: null,
      },
    ],
  },
  [ActionEnum.NOTES]: {
    steps: [
      {
        id: 1,
        action: ActionEnum.NOTES,
        route: () => `notes`,
        nextStep: null,
      },
    ],
  },
};
