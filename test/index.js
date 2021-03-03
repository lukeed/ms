/**
 * Tests ported from zeit/ms
 * @see https://github.com/lukeed/zeit-ms/blob/master/tests.js
 */

import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as ms from '../src';

function parse(input, expect) {
	const output = ms.parse(input);
	assert.is(output, expect, `parse("${input}") ~> ${expect}`);
	assert.is(typeof output, typeof expect, `~> returns "${typeof expect}" type`);
}

function format(input, expect, long) {
	const output = ms.format(input, long);
	assert.is(output, expect, `format(${input}) ~> "${expect}"`);
	assert.is(typeof output, typeof expect, `~> returns "${typeof expect}" type`);
}

// ---

test('exports an object', () => {
	assert.type(ms, 'object');
});

test('exports "parse" function', () => {
	assert.type(ms.parse, 'function');
});

test('exports "format" function', () => {
	assert.type(ms.format, 'function');
});


test('parse()', () => {
	parse('100', 100);
	parse('1m', 60000);
	parse('1h', 3600000);
	parse('2d', 172800000);
	parse('3w', 1814400000);
	parse('1s', 1000);
	parse('100ms', 100);
	parse('1.5h', 5400000);
	parse('1   s', 1000);

	parse('☃', undefined);
	parse('10-.5', undefined);

	parse('1.5H', 5400000);
	parse('.5ms', 0.5);
	parse('-100ms', -100);
	parse('-1.5h', -5400000);
	parse('-10.5h', -37800000);
	parse('-.5h', -1800000);

	parse('1.5y', 31557600000 * 1.5);
});


test('parse() :: long', () => {
	parse('53 milliseconds', 53);
	parse('17 msecs', 17);
	parse('1 sec', 1000);
	parse('1 min', 60000);
	parse('1 hr', 3600000);
	parse('2 days', 172800000);
	parse('1.5 hours', 5400000);
	parse('-100 milliseconds', -100);
	parse('-1.5 hours', -5400000);
	parse('-.5 hr', -1800000);

	const YEAR = 31557600000;
	parse('1.5 years', YEAR * 1.5);
	parse('-12yr', YEAR * -12);
	parse('6 yrs', YEAR * 6);
});


test('format()', () => {
	format(500, '500ms');
	format(-500, '-500ms');

	// seconds
	format(1000, '1s');
	format(10000, '10s');
	format(-10000, '-10s');
	format(-1000, '-1s');

	// minutes
	const MIN = 60 * 1000;
	format(MIN, '1m');
	format(MIN * 10, '10m');
	format(MIN * -10, '-10m');
	format(MIN * -1, '-1m');

	// hours
	const HOUR = 60 * MIN;
	format(HOUR, '1h');
	format(HOUR * 10, '10h');
	format(HOUR * -10, '-10h');
	format(HOUR * -1, '-1h');

	// days
	const DAY = HOUR * 24;
	format(DAY, '1d');
	format(DAY * 10, '10d');
	format(DAY * -10, '-10d');
	format(DAY * -1, '-1d');

	// years
	const YEAR = 31557600000; // internal
	format(3.154e10, '365d'); // via Google
	format(YEAR, '1y');
	format(YEAR * 10, '10y');
	format(YEAR * -10, '-10y');
	format(YEAR * -1, '-1y');

	// rounding
	format(234234234, '3d');
	format(-234234234, '-3d');
});


test('format() :: long', () => {
	// milliseconds
	format(500, '500 ms', true);
	format(-500, '-500 ms', true);

	// seconds
	format(1000, '1 second', true);
	format(1200, '1 second', true);
	format(10000, '10 seconds', true);
	format(-1000, '-1 second', true);
	format(-1200, '-1 second', true);
	format(-10000, '-10 seconds', true);

	// minutes
	format(60 * 1000, '1 minute', true);
	format(60 * 1200, '1 minute', true);
	format(60 * 10000, '10 minutes', true);
	format(-1 * 60 * 1000, '-1 minute', true);
	format(-1 * 60 * 1200, '-1 minute', true);
	format(-1 * 60 * 10000, '-10 minutes', true);

	// hours
	format(60 * 60 * 1000, '1 hour', true);
	format(60 * 60 * 1200, '1 hour', true);
	format(60 * 60 * 10000, '10 hours', true);
	format(-1 * 60 * 60 * 1000, '-1 hour', true);
	format(-1 * 60 * 60 * 1200, '-1 hour', true);
	format(-1 * 60 * 60 * 10000, '-10 hours', true);

	// days
	format(24 * 60 * 60 * 1000, '1 day', true);
	format(24 * 60 * 60 * 1200, '1 day', true);
	format(24 * 60 * 60 * 10000, '10 days', true);
	format(-1 * 24 * 60 * 60 * 1000, '-1 day', true);
	format(-1 * 24 * 60 * 60 * 1200, '-1 day', true);
	format(-1 * 24 * 60 * 60 * 10000, '-10 days', true);

	// years
	const YEAR = 31557600000; // internal
	format(3.154e10, '365 days', true); // via Google
	format(YEAR, '1 year', true);
	format(YEAR * 10, '10 years', true);
	format(YEAR * -10, '-10 years', true);
	format(YEAR * -1, '-1 year', true);

  // rounding
	format(234234234, '3 days', true);
	format(-234234234, '-3 days', true);
});


test.run();
