import decamelize from 'decamelize';

export default criteria => {
		var queryParams = [
			'sortBy',
			'dynasty',
			'yearFrom',
			'yearTo'
		];

		return queryParams.reduce(function (memo, key, index) {
			var amper = (index > 0) ? '&' : '';
			return memo + amper + decamelize(key, '-') + '=' + criteria[key];
		}, '?');
};