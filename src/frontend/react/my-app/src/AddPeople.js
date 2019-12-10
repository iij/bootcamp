import React from 'react';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

class AddPeople extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ name: event.target.value });
    }

    handleSubmit(event) {
        if (!this.state.name) {
            alert('please input name.');
        } else {
            this.props.addPeople(this.state.name);
            this.setState({ name: ''});
        }
        event.preventDefault();
    }

    render() {
        return(
          <form onSubmit={this.handleSubmit}>
              <input type="text" onChange={this.handleChange} value={this.state.name} />
              <input type="submit" value="add" />
          </form>
        );
    }
}

const makeDispatchToProps = (dispatch) => {
  return {
      addPeople(name) {
          const action = actions.addPeople(name);
          dispatch(action);
      }
  }
};

export default connect(null, makeDispatchToProps)(AddPeople);