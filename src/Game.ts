import { Frigid, Serializable } from 'frigid';
import { DEBUG } from 'frigid/out/Serializable.js';
import { Pawn } from './Pawn.js';
import { TaskList } from './TaskList.js';
import { Inventory } from './Inventory.js';
import { Menu } from './ui/Menu.js';
import Time, { Tickable } from './Time.js';
import { render, Renderable, setTitle } from './ui/UI.js';
import log from './log.js';
import { ChopTreeTask } from './tasks/ChopTreeTask.js';
import { Task } from './tasks/Task.js';
import { ready } from './multiplayer/mDNS.js';
import faker from 'faker';

let game = null;

export class Game extends Frigid implements Tickable, Renderable {
	pawns: Pawn[] = [];
	selected: Pawn;
	inventory: Inventory;
	board: TaskList;
	menu: Menu;
	clock: Time;
	name: string;

	[DEBUG] = true;

	static get current(): Game {
		if (!game) throw new Error('Somehow called a game before it existed?');
		return game;
	}

	async tick() {
		for(const pawn of this.pawns) {
			pawn.tick();
		}
		render();
	}

	get inv() { return this.inventory; }

	removePawn(pawn: Pawn) {
		if(pawn === this.selected) {
			if(this.pawns.indexOf(this.selected) === this.pawns.length - 1) this.advanceSelection(-1);
			else this.advanceSelection(1);
		}

		this.pawns = this.pawns.filter(testPawn => {
			return pawn !== testPawn;
		});
	}

	advanceSelection(number) {
		let index = this.pawns.indexOf(this.selected);
		this.selected = this.pawns[Math.min(Math.max(index + number, 0), this.pawns.length - 1)];
	}
	
	ctor () {
		game = this;
		this.name ??= faker.address.city();
		setTitle(this.name);
		this.pawns ??= [];
		this.selected ??= this.pawns[0] || null;
		this.menu = new Menu();
		this.board ??= new TaskList();
		this.inventory ??= new Inventory();
		this.clock ??= new Time();
		this.clock.thing = this;
		this.clock.start();
		ready(this.name);
		render(this);
	}

	static serializationDependencies() {
		return [Pawn, Inventory, TaskList, Time, ChopTreeTask, Task];
	}

	render() {
		this.menu.render();
		this.board.render();
	}
}