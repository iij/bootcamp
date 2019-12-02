import React from 'react';

export default class Peoples extends React.Component {
    render() {
        return (
            <div>
                <p>peoples works!</p>
                <table border="1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.peoples.map((people) => {
                                return (
                                    <tr key={people.id}>
                                        <td>{people.id}</td>
                                        <td>{people.name}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}
