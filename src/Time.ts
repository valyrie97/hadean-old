import chalk from "chalk";
import { Serializable } from "frigid";
import { isThisTypeNode } from "typescript";
import log from "./log.js";

const daysInMonth = [
	31, 28, 31,
	30, 31, 30,
	31, 31, 30,
	31, 30, 31
];

const months = [
	'Jan', 'Feb', 'Mar',
	'Apr', 'May', 'Jun',
	'Jul', 'Aug', 'Sep',
	'Oct', 'Nov', 'Dec'
]

export default class Time extends Serializable{
	rate: number;
	paused = true;

	thing: Tickable;

	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;

	toString() {
		const sym = (this.hour >= 6 && this.hour < 20) ?
			chalk.yellowBright('☼') :
			chalk.blue('☾')

		return `${sym} ${this.hour.toString().padStart(2, ' ')}:${this.minute.toString().padStart(2, '0')} ${months[this.month]} ${this.day + 1}, ${(this.year + 1).toString().padStart(4, '0')}`

		// return '☾' || '☼';
	}

	ctor() {
		this.rate = 60;
		this.minute ??= 0;
		this.hour ??= 0;
		this.day ??= 0;
		this.month ??= 0;
		this.year ??= 0;
	}

	pause() {
		this.paused = true;
	}

	start() {
		this.paused = false;
		setTimeout(this.doTick.bind(this), 0);
	}
	
	advanceTime(minutes) {
		this.minute ++;
		while(this.minute >= 60) {
			this.minute -= 60;
			this.hour ++;
		}
		while(this.hour >= 24) {
			this.hour -= 24;
			this.day ++;
		}
		while(this.day >= daysInMonth[this.month]) {
			this.day -= daysInMonth[this.month];
			this.month ++;
		}
		while(this.month >= 12) {
			this.month -= 12;
			this.year ++;
		}
	}

	async doTick() {
		this.advanceTime(1);
		const timeout = 1000 / this.rate;
		const start = new Date().getTime();
		if(this.thing) {
			await this.thing.tick();
		}
		const elapsed = new Date().getTime() - start;
		const wait = Math.max(timeout - elapsed, 0);
		if(this.paused) return;
		setTimeout(this.doTick.bind(this), wait)
	}
}


export interface Tickable {
	tick: () => Promise<void>
}