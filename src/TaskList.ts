import { getTheme } from '@themes';
import { Serializable } from 'frigid';
import { Task, TaskState } from './registries/Tasks.js';

export class TaskList extends Serializable {
  tasks: TaskState<unknown, unknown>[] = [];

  clear() {
    for(const task of this.tasks) {
      this.removeTask(task);
    }
  }

  static serializationDependencies(): any[] {
    return [];
  }

  // TODO assign task dependant on pawn skills
  getUnclaimedTask(): TaskState<unknown, unknown> | null {
    // const availableTasks = this.tasks.filter(task => !task.claimed);
    // if(availableTasks.length > 0) {
    //   return availableTasks[0]
    // } else return null;
    return null;
  }

  addTask(task: TaskState<unknown, unknown>) {
    this.tasks = [...this.tasks, task];
  }

  removeTask(task: TaskState<unknown, unknown>) {
    this.tasks = this.tasks.filter(v => v !== task);
  }

  render() {
    // panels.left.setContent(`${this.tasks.map(task => `${
    //   getTheme().normal(task.toString())
    // } ${
    //   getTheme().dimmed(task.worker?.toString() ?? '')
    // }`).join('\n')}`);
    // return '';
  }
}