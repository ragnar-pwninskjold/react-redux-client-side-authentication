import axios from 'axios';
import { browserHistory } from 'react-router';
import { AUTH_USER, AUTH_ERROR, UNAUTH_USER, FETCH_MESSAGE } from './types';

const API_URL = 'http://localhost:3090';


export function signinUser({ email, password }) {

	return function(dispatch) {
	// Submit email/password to server

	axios.post(`${API_URL}/signin`, { email, password })
	.then(response => {
		// If request is good...
		// // update state to indicate authentication
		dispatch({ type: AUTH_USER });
		// // save the jwt token 
		localStorage.setItem('token', response.data.token);
		// // redirect to the route
		browserHistory.push('/feature');
	})
	.catch(() => {
		// If request is bad...
		// // Show an error message
		dispatch(authError('Bad Login Info'));

	});
	
	}
}

export function signupUser({ email, password }) {
	return function(dispatch) {
		axios.post(`${API_URL}/signup`, { email, password })
		.then(response => {
			dispatch({type: AUTH_USER});
			localStorage.setItem('token', response.data.token)
			browserHistory.push('/feature');
		})
		.catch((err) => {
			dispatch(authError(err.response.data.error));
		});

	}
}

export function signoutUser() {
	return function(dispatch){
		localStorage.removeItem('token');
		dispatch({type: UNAUTH_USER});
	}
}

export function authError(error) {
	return {
		type: AUTH_ERROR,
		payload: error
	};
}


export function fetchMessage() {
	return function(dispatch) {
		axios.get(API_URL, {
			headers: { authorization: localStorage.getItem('token') }
		})
		.then(response => {
			dispatch({
				type: FETCH_MESSAGE,
				payload: response.data.message
			})
		});
	}
}




