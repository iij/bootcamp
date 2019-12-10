import {SET_FETCHING, FETCH_PEOPLES, ADD_PEOPLE} from '../actionTypes';

const initialState = {
    inFetching: false,
    peoples: [],
};

export default function(state = initialState, action) {
    console.log("PEOPLES Reducer");
    console.dir(state);
    console.dir(action);
    switch (action.type) {
        case SET_FETCHING:
            return {
                inFetching: true,
                peoples: [],
            };
        case FETCH_PEOPLES:
            return {
                inFetching: false,
                peoples: action.peoples,
            };
        case ADD_PEOPLE:
            const peoples = [];
            let maxId = 0;
            state.peoples.forEach((p) => {
                const id = Number(p.id);
               if (maxId < id) {
                   maxId = id;
               }
               peoples.push(p);
            });
            const newPeople = {
                id: maxId + 1,
                name: action.name,
            };
            peoples.push(newPeople);
            return {
                inFetching: state.inFetching,
                peoples,
            };
        default:
            return state;
    }
}
