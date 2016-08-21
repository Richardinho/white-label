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
			yearFrom
		};
	},

	yearTo : function (yearTo) {
		return {
			type : 'YEAR_TO',
			yearTo
		};
	},

	dynasty : function (dynasty) {
		return {
			type : 'DYNASTY',
			dynasty
		}
	},

	sortOrder : function (sortOrder) {
		return {
			type : 'SORT_ORDER',
			sortOrder
		};
	}
};