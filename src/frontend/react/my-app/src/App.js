import React from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import Peoples from './Peoples';
import AddPeople from './AddPeople';
import * as actions from './redux/actions';

let lastFetching = null;

class App extends React.Component {
    render() {
        console.log('App render');
        console.dir(this.props);
        if (this.props.peoples.length === 0 && !this.props.isFetching) {
            const now = Date.now();
            if (lastFetching === null) {
                lastFetching = now;
                console.log("FETCH_PEOPLES");
                this.props.fetchPeoples();
            }
            return (
                <div>fetch peoples</div>
            );
        }
        if (this.props.isFetching) {
            return (
                <div>now loading</div>
            );
        }

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        <code>src/App.js</code>を編集し、保存して、リロードしてみよう。
                    </p>
                    <Peoples peoples={this.props.peoples} />
                    <AddPeople />
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Reactを学ぶ。
                    </a>
                </header>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.dir(state);
    const props = {
        isFetching: state.peoples.isFetching,
        peoples: state.peoples.peoples,
    }
    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPeoples() {
            const action = actions.fetchPeoples();
            dispatch(action);
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
