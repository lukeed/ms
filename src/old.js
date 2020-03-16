var RGX = /^(-?(?:\d+)?\.?\d+) *([a-z]+)?$/,
	SEC = 1e3,
	MIN = SEC * 60,
	HOUR = MIN * 60,
	DAY = HOUR * 24,
	YEAR = DAY * 365.25;

export function parse(val) {
	var num, arr = val.toLowerCase().match(RGX);
	if (arr != null && (num = parseFloat(arr[1]))) {
		switch (arr[2]) {
			case 'years':
			case 'year':
			case 'yrs':
			case 'yr':
			case 'y':
				return num * YEAR;
			case 'weeks':
			case 'week':
			case 'w':
				return num * DAY * 7;
			case 'days':
			case 'day':
			case 'd':
				return num * DAY;
			case 'hours':
			case 'hour':
			case 'hrs':
			case 'hr':
			case 'h':
				return num * HOUR;
			case 'minutes':
			case 'minute':
			case 'mins':
			case 'min':
			case 'm':
				return num * MIN;
			case 'seconds':
			case 'second':
			case 'secs':
			case 'sec':
			case 's':
				return num * SEC;
		}
		return num;
	}
}

function fmt(val, neg, str, long) {
	var num = (val | 0) === val ? val : ~~(val + 0.5);
	return (neg ? '-' : '') + num + (long ? (' ' + str + (num != 1 ? 's' : '')) : str[0]);
}

export function format(num, long) {
	var neg = num < 0, abs = neg ? -num : num;
	if (abs < SEC) return num + (long ? ' ms' : 'ms');
	if (abs < MIN) return fmt(abs / SEC, neg, 'second', long);
	if (abs < HOUR) return fmt(abs / MIN, neg, 'minute', long);
	if (abs < DAY) return fmt(abs / HOUR, neg, 'hour', long);
	// if (abs < YEAR) return fmt(abs / DAY, neg, 'day', long);
	// return fmt(abs / YEAR, neg, 'year', long);
	return fmt(abs / DAY, neg, 'day', long);
}
