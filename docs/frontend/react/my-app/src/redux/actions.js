import { ADD_PEOPLE, FETCH_PEOPLES, SET_FETCHING } from './actionTypes';
import axiosBase from 'axios';

const axios = axiosBase.create({
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    responseType: 'json'
});

function errorHandler(error) {
    alert('failed to call api');
}

export function fetchPeoples() {
    const url = 'https://gh.iiji.jp/pages/iij-bootcamp/iij-bootcamp/test.json';
    return async (dispatch) => {
        dispatch({
            type: SET_FETCHING,
        });
        const response = await axios.get(url).catch((error) => errorHandler(error));
        if (response.status === 200) {
            const peoples = response.data;
            console.log('got!');
            console.dir(peoples);
            dispatch({
                type: FETCH_PEOPLES,
                peoples,
            });
        }
    };
}

export function addPeople(name) {
    return {
        type: ADD_PEOPLE,
        name,
    }
}
