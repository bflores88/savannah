import React, { Component } from 'react';
import './UserItems.scss';
import InactiveItems from '../../components/InactiveItems';
import ActiveItems from '../../components/ActiveItems';
import { connect } from 'react-redux';
import { grabUsername } from '../../actions';

class UserItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: '',
    };
  }

  componentDidMount() {
    this.props.grabUsername(this.props.match.params.id);
    if (this.props.currentUser) {
      this.setState({
        userID: this.props.currentUser.id,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentUser !== prevProps.currentUser) {
      if (this.props.currentUser) {
        this.setState({
          userID: this.props.currentUser.id,
        });
      }
    }
  }

  render() {
    let isUserOnOwnPage = false;

    if (this.state.userID) {
      const userPage = this.props.match.params.id;
      isUserOnOwnPage = this.state.userID === parseInt(userPage);
    }

    const username = this.props.username.username;

    if (isUserOnOwnPage) {
      return (
        <>
          <div className="user-items">
            <div className="user-store">
              <h1>{username}'s Store</h1>
            </div>
            <ActiveItems
              id={parseInt(this.props.match.params.id)}
              isUserOnOwnPage={isUserOnOwnPage}
              username={this.props.username.username}
            />
            <br />
            <br />
            <InactiveItems id={parseInt(this.props.match.params.id)} />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="user-items">
            <div className="user-store">
              <h1>{username}'s Store</h1>
            </div>
            <ActiveItems id={parseInt(this.props.match.params.id)} isUserOnOwnPage={isUserOnOwnPage} />
          </div>
        </>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.itemReducer.username,
    currentUser: state.userReducer.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    grabUsername: (userID) => dispatch(grabUsername(userID)),
  };
};

UserItems = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserItems);

export default UserItems;
