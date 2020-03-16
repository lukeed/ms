const zeit = require('ms');
const assert = require('assert');
const { Suite } = require('benchmark');
const ms = require('../dist');

const input_parse = [
	['100', '100', 100],
	['1m', '1 minute', 60000],
	['1m', '1min', 60000],
	['1h', '1hr', 3600000],
	['1h', '1 hr', 3600000],
	['1h', '1 hour', 3600000],
	['2d', '2 days', 172800000],
	['3w', '3 week', 1814400000],
	['3w', '3 weeks', 1814400000],
	['1s', '1 sec', 1000],
	['1s', '1 second', 1000],
	['100ms', '100 milliseconds', 100],
	['1.5h', '1.5 hours', 5400000],
	['1   s', '1 secs', 1000],

	['1.5H', '1.5 HOURS', 5400000],
	['.5ms', '0.5 millisecond', 0.5],
	['-100ms', '-100 ms', -100],
	['-1.5h', '-1.5 hour', -5400000],
	['-10.5h', '-10.5 hours', -37800000],
	['-.5h', '-.5 hour', -1800000],
];

const input_format = [
	[500, '500ms', '500 ms'],
	[-500, '-500ms', '-500 ms'],

	[1000, '1s', '1 second'],
	[10000, '10s', '10 seconds'],
	[-1000, '-1s', '-1 second'],
	[-10000, '-10s', '-10 seconds'],

	[60 * 1000, '1m', '1 minute'],
	[60 * 10000, '10m', '10 minutes'],
	[-1 * 60 * 1000, '-1m', '-1 minute'],
	[-1 * 60 * 10000, '-10m', '-10 minutes'],

	[60 * 60 * 1000, '1h', '1 hour'],
	[60 * 60 * 10000, '10h', '10 hours'],
	[-1 * 60 * 60 * 1000, '-1h', '-1 hour'],
	[-1 * 60 * 60 * 10000, '-10h', '-10 hours'],

	[24 * 60 * 60 * 1000, '1d', '1 day'],
	[24 * 60 * 60 * 10000, '10d', '10 days'],
	[-1 * 24 * 60 * 60 * 1000, '-1d', '-1 day'],
	[-1 * 24 * 60 * 60 * 10000, '-10d', '-10 days'],

	[234234234, '3d', '3 days'],
	[-234234234, '-3d', '-3 days'],
];

const lib_parse = {
	'lukeed/ms': ms.parse,
	'zeit/ms': zeit,
};

const lib_format = {
	'lukeed/ms': (x, long) => ms.format(x, long),
	'zeit/ms': (x, long) => zeit(x, { long }),
};

function pad(str) {
	return str + ' '.repeat(14 - str.length);
}

function runner(title, contenders, items) {
	const isFormat = title === 'format';
	console.log(`\nValidation :: ${title}`);

	Object.keys(contenders).forEach(name => {
		try {
			const lib = contenders[name];
			items.forEach(arr => {
				if (isFormat) {
					assert.equal(lib(arr[0]), arr[1], `short ~> ${arr[0]}`);
					assert.equal(lib(arr[0], true), arr[2], `long ~> ${arr[0]}`);
				} else {
					assert.equal(lib(arr[0]), arr[2], `short ~> ${arr[0]}`);
					assert.equal(lib(arr[1], true), arr[2], `long ~> ${arr[1]}`);
				}
			});
			console.log('  ✔', pad(name));
		} catch (err) {
			console.log('  ✘', pad(name), `(FAILED @ "${err.message}")`);
		}
	});

	console.log(`\nBenchmark :: "${title}"`);
	const bench1 = new Suite().on('cycle', e => {
		console.log('  ' + e.target);
	});

	Object.keys(contenders).forEach(name => {
		const lib = contenders[name];
		bench1.add(pad(name), () => {
			items.forEach(arr => {
				lib(arr[0]);
			});
		});
	});

	bench1.run();

	console.log(`\nBenchmark :: "${title}" (long)`);
	const bench = new Suite().on('cycle', e => {
		console.log('  ' + e.target);
	});

	const IDX = isFormat ? 0 : 1;
	Object.keys(contenders).forEach(name => {
		const lib = contenders[name];
		bench.add(pad(name), () => {
			items.forEach(arr => {
				lib(arr[IDX], true);
			});
		});
	});

	bench.run();
}

// ---

runner('parse', lib_parse, input_parse);
runner('format', lib_format, input_format);
