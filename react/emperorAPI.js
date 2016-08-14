//  assigns global Fetch variable since it's a polyfill
import 'fetch';

const API_URL = 'http://localhost:3000/api/emperors';

class EmperorAPI {

	load () {
		return fetch(API_URL).then(function (response) {
			return response.json()
		});
	}

}

export default new EmperorAPI();