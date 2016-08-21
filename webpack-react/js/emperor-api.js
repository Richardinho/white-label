
const API_URL = 'http://localhost:3000/api/emperors';

class EmperorAPI {

	load (queryString = '') {
		return fetch(API_URL + queryString).then(function (response) {
			return response.json()
		});
	}
}

export default new EmperorAPI();