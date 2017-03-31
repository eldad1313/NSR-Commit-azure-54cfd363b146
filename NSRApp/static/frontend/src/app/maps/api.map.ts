/**
 * This map defines the set-up of all the API calls the app can make. It is primarily
 * used by the DataService.
 */
import { ApiMap } from '../interfaces/apiMap.interface';
import { configMap } from './config.map';

export const apiMap: ApiMap = {
	login: {
		url: '/auth/login/',
		method: 'post',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		errors: {
			'400': 'login.badCredentialsMsg',
			'403': 'login.wrongPermissionsMsg'
		}
	},
	logout: {
		url: '/auth/logout/',
		method: 'post'
	}
};
