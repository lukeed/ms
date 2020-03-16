/**
 * Tests ported from zeit/ms
 * @see https://github.com/lukeed/zeit-ms/blob/master/tests.js
 */

import test from 'tape';
import * as ms from '../src';

test.Test.prototype.parse = function (input, expect) {
	const output = ms.parse(input);
	this.is(output, expect, `parse("${input}") ~> ${expect}`);
	this.is(typeof output, typeof expect, `~> returns "${typeof expect}" type`);
}

test.Test.prototype.format = function (input, expect, long) {
	const output = ms.format(input, long);
	this.is(output, expect, `format(${input}) ~> "${expect}"`);
	this.is(typeof output, typeof expect, `~> returns "${typeof expect}" type`);
}

test('exports', t => {
	t.is(typeof ms, 'object', 'exports an object');
	t.is(typeof ms.parse, 'function', '~> has "parse" function');
	t.is(typeof ms.format, 'function', '~> has "format" function');
	t.end();
});


test('parse()', t => {
	t.parse('100', 100);
	t.parse('1m', 60000);
	t.parse('1h', 3600000);
	t.parse('2d', 172800000);
	t.parse('3w', 1814400000);
	t.parse('1s', 1000);
	t.parse('100ms', 100);
	t.parse('1.5h', 5400000);
	t.parse('1   s', 1000);

	t.parse('☃', undefined);
	t.parse('10-.5', undefined);

	t.parse('1.5H', 5400000);
	t.parse('.5ms', 0.5);
	t.parse('-100ms', -100);
	t.parse('-1.5h', -5400000);
	t.parse('-10.5h', -37800000);
	t.parse('-.5h', -1800000);

	t.end();
});


test('parse() :: long', t => {
	t.parse('53 milliseconds', 53);
	t.parse('17 msecs', 17);
	t.parse('1 sec', 1000);
	t.parse('1 min', 60000);
	t.parse('1 hr', 3600000);
	t.parse('2 days', 172800000);
	t.parse('1.5 hours', 5400000);
	t.parse('-100 milliseconds', -100);
	t.parse('-1.5 hours', -5400000);
	t.parse('-.5 hr', -1800000);

	t.end();
});


test('format()', t => {
	t.format(500, '500ms');
	t.format(-500, '-500ms');

	// seconds
	t.format(1000, '1s');
	t.format(10000, '10s');
	t.format(-1000, '-1s');
	t.format(-10000, '-10s');

	// minutes
	t.format(60 * 1000, '1m');
	t.format(60 * 10000, '10m');
	t.format(-1 * 60 * 1000, '-1m');
	t.format(-1 * 60 * 10000, '-10m');

	// hours
	t.format(60 * 60 * 1000, '1h');
	t.format(60 * 60 * 10000, '10h');
	t.format(-1 * 60 * 60 * 1000, '-1h');
	t.format(-1 * 60 * 60 * 10000, '-10h');

	// days
	t.format(24 * 60 * 60 * 1000, '1d');
	t.format(24 * 60 * 60 * 10000, '10d');
	t.format(-1 * 24 * 60 * 60 * 1000, '-1d');
	t.format(-1 * 24 * 60 * 60 * 10000, '-10d');

	// rounding
	t.format(234234234, '3d');
	t.format(-234234234, '-3d');

	t.end();
});


test('format() :: long', t => {
	// milliseconds
	t.format(500, '500 ms', true);
	t.format(-500, '-500 ms', true);

	// seconds
	t.format(1000, '1 second', true);
	t.format(1200, '1 second', true);
	t.format(10000, '10 seconds', true);
	t.format(-1000, '-1 second', true);
	t.format(-1200, '-1 second', true);
	t.format(-10000, '-10 seconds', true);

	// minutes
	t.format(60 * 1000, '1 minute', true);
	t.format(60 * 1200, '1 minute', true);
	t.format(60 * 10000, '10 minutes', true);
	t.format(-1 * 60 * 1000, '-1 minute', true);
	t.format(-1 * 60 * 1200, '-1 minute', true);
	t.format(-1 * 60 * 10000, '-10 minutes', true);

	// hours
	t.format(60 * 60 * 1000, '1 hour', true);
	t.format(60 * 60 * 1200, '1 hour', true);
	t.format(60 * 60 * 10000, '10 hours', true);
	t.format(-1 * 60 * 60 * 1000, '-1 hour', true);
	t.format(-1 * 60 * 60 * 1200, '-1 hour', true);
	t.format(-1 * 60 * 60 * 10000, '-10 hours', true);

	// days
	t.format(24 * 60 * 60 * 1000, '1 day', true);
	t.format(24 * 60 * 60 * 1200, '1 day', true);
	t.format(24 * 60 * 60 * 10000, '10 days', true);
	t.format(-1 * 24 * 60 * 60 * 1000, '-1 day', true);
	t.format(-1 * 24 * 60 * 60 * 1200, '-1 day', true);
	t.format(-1 * 24 * 60 * 60 * 10000, '-10 days', true);

  // rounding
	t.format(234234234, '3 days', true);
	t.format(-234234234, '-3 days', true);

	t.end();
});
