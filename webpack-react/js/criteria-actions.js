export default {

	initial : function (criteria) {
		return {
			type : 'INITIAL',
			data : criteria
		};
	},

	yearFrom : function (yearFrom) {
		return {
			type : 'YEAR_FROM',
			yearFrom : yearFrom
		};
	},

	yearTo : function (yearTo) {
		return {
			type : 'YEAR_TO',
			yearTo : yearTo
		};
	},

	dynasty : function (dynasty) {
		return {
			type : 'DYNASTY',
			dynasty : dynasty
		}
	},

	sortOrder : function (sortOrder) {
		return {
			type : 'SORT_ORDER',
			sortOrder : sortOrder
		};
	}
};