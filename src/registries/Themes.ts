// blessed doesnt know QUITE how to deal with 16m color modes
// it will always downsample them to 256. which is fine, but
// blessed's algorithm sucks, and comes out with incorrect
// mappings for certain colors. Instead of dealing with that,
// here, we simply tell chalk to always output ansi256 codes
// instead of upsampling them to 16m codes.
import chalk from 'chalk';
chalk.level = 2;
import merge from 'deepmerge';

type StyleFunction = (text: string) => string;

export type Theme = {
  header: StyleFunction,
  subheader: StyleFunction,
  bright: StyleFunction,
  normal: StyleFunction,
  dimmed: StyleFunction,
  hotkey: StyleFunction,
  tab: {
    normal: StyleFunction,
    selected: StyleFunction
  },
  border: {
    focused: string,
    normal: string
  },
  progressBar: {
    indicator: {
      critical: StyleFunction,
      warning: StyleFunction,
      normal: StyleFunction,
      excellent: StyleFunction,
      buckets: [number, number, number]
    },
    normal: StyleFunction
  },
  status: {
    idle: StyleFunction,
    self: StyleFunction,
    work: StyleFunction
  }
}

export const backupTheme: Theme = {
  header: chalk.ansi256(255),
  subheader: chalk.ansi256(250),
  bright: chalk.ansi256(255),
  normal: chalk.ansi256(250),
  dimmed: chalk.ansi256(245),
  hotkey: chalk.ansi256(40),
  tab: {
    normal: chalk.ansi256(117),
    selected: chalk.ansi256(117).inverse
  },
  border: {
    focused: '#00ff00',
    normal: '#888888'
  },
  progressBar: {
    indicator: {
      critical: chalk.bgAnsi256(235).ansi256(88),
      warning: chalk.bgAnsi256(235).ansi256(202),
      normal: chalk.bgAnsi256(235).ansi256(70),
      excellent: chalk.bgAnsi256(235).ansi256(87),
      buckets: [.1, .25, .95]
    },
    normal: chalk.bgAnsi256(235).ansi256(243)
  },
  status: {
    idle: chalk.ansi256(243),
    self: chalk.ansi256(45),
    work: chalk.ansi256(208)
  }
}

export type ThemeName = string;

let currentTheme = backupTheme;
const themes: Map<ThemeName, Theme> = new Map();

export function registerTheme(name: ThemeName, theme: Partial<Theme>) {
  // console.log('Registered theme', name);
  themes.set(name, merge(backupTheme, theme));
}

export function setTheme(name: ThemeName): void {
  if(!themes.has(name)) return;
  currentTheme = themes.get(name);

  // TODO reset borders and other weird shit that wont just update on a re-render
}

export function getTheme(): Theme {
  return currentTheme;
}

// TODO move this to theme
export const boxStyle = () => {
	return {
		style: {
			border: {
				fg: getTheme().border.normal
			},
			focus: {
				border: {
					fg: getTheme().border.focused
				}
			}
		},
		border: {
			type: 'line'
		}
	};
};