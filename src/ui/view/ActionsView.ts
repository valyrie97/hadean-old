import { getTheme } from "@themes";
import { Game } from "../../Game.js";
import { Renderable } from "../UI.js";
import { View } from "../View.js";
import { actions } from "@actions";

export class ActionsView extends View {
  actionIdx: number = 0;

  constructor() {
    super();
    this.name = 'Actions';
  }

  keypress(key: {full: string}) {
    if(key.full === 'up') {
      this.actionIdx --;
    } else if (key.full === 'down') {
      this.actionIdx ++;
    } else if (key.full === 'enter') {
      actions[this.actionIdx].invoke(1);
    }
  }
  render() {
    return actions.map((action, idx) => `${(() => {
      if(this.actionIdx === idx) {
        return getTheme().bright('  ❯ ' + action.name);
      } else {
        return getTheme().normal('    ' + action.name);
      }
    })()}`).join('\n');
  }
}