import React from 'react';
import Peoples from './Peoples';
import renderer from 'react-test-renderer';

const peoples = [
    { "id": "1", "name": "bob" },
    { "id": "2", "name": "alice" },
    { "id": "3", "name": "John" }
];

it('renders with peoples correctly', () => {
    const peoplesTable = renderer.create(<Peoples peoples={peoples} />).toJSON();
    expect(peoplesTable).toMatchSnapshot();
});
