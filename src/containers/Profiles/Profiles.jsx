import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import './Profiles.scss';
import { loadSingleUser, grabShipping, grabPayments } from '../../actions';
import moment from 'moment';
import EditProfile from '../../components/EditProfile';
import UserAddress from '../../components/UserAddress';
import UserPayments from '../../components/UserPayments';

class Profiles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userProfileDisplay: 'display-div',
      editProfileDisplay: 'hide-div',
      editSuccessDisplay: 'hide-div',
      user: '',

      paymentOptions: '',
      addressOptions: this.props.shipping,

      primaryAddress: '',
      primaryPayment: '',
      redirectSuccess: false,
    };

    this.handleClickToEdit = this.handleClickToEdit.bind(this);
    this.handleClickToEdit = this.handleClickToEdit.bind(this);
    this.editSuccess = this.editSuccess.bind(this);
    this.handlePaymentReload = this.handlePaymentReload.bind(this);
    this.handleAddressReload = this.handleAddressReload.bind(this);
  }

  getLast4(card) {
    if (!card) {
      return;
    }
    const cardLength = card.length;
    const last = card
      .split('')
      .splice(cardLength - 4)
      .join('');
    return `****${last}`;
  }

  successUpdate() {
    this.setState({ redirectSuccess: true });
  }

  componentDidMount() {
    const user = this.props.match.params.id;
    this.props.loadSingleUser(user);
    this.props.grabShipping().then((result) => {
      this.setState({ addressOptions: result.payload });
      const findPrimaryShipping = result.payload.filter((address) => address.primary);
      const primaryShipping = findPrimaryShipping[0];
      this.setState({ primaryAddress: primaryShipping });
    });
    this.props.grabPayments().then((result) => {
      this.setState({ paymentOptions: result.payload });
      const findPrimaryPayment = result.payload.filter((card) => card.primary);
      const primaryPayment = findPrimaryPayment[0];
      this.setState({
        primaryPayment: {
          cardHolder: primaryPayment.card_name,
          cardNumber: this.getLast4(primaryPayment.card_number),
        },
      });
    });
  }

  componentDidUpdate(prevProps) {
  }

  handlePaymentReload(e) {
    e.preventDefault();
    this.setState({ primaryPayment: '', paymentOptions: '' });
    this.props.grabPayments().then((result) => {
      this.setState({ paymentOptions: result.payload });
      const findPrimaryPayment = result.payload.filter((card) => card.primary);
      const primaryPayment = findPrimaryPayment[0];
      this.setState({
        primaryPayment: {
          cardHolder: primaryPayment.card_name,
          cardNumber: this.getLast4(primaryPayment.card_number),
        },
      });
    });
  }

  handleAddressReload(e) {
    e.preventDefault();
    this.setState({ primaryAddress: '', addressOptions: '' });
    this.props.grabShipping().then((result) => {
      this.setState({ addressOptions: result.payload });
      const findPrimaryShipping = result.payload.filter((address) => address.primary);
      const primaryShipping = findPrimaryShipping[0];
      this.setState({ primaryAddress: primaryShipping });
      return result;
    });
  }

  handleClickToEdit(e) {
    e.preventDefault();

    if (this.state.userProfileDisplay === 'hide-div') {
      this.setState((prevState) => ({
        userProfileDisplay: 'display-div',
        editProfileDisplay: 'hide-div',
        editSuccessDisplay: 'hide-div',
      }));
    } else {
      this.setState((prevState) => ({
        userProfileDisplay: 'hide-div',
        editProfileDisplay: 'display-div',
      }));
    }
  }

  editSuccess(e) {
    e.preventDefault();

    this.setState((prevState) => ({
      userProfileDisplay: 'display-div',
      editProfileDisplay: 'hide-div',
      editSuccessDisplay: 'display-div',
    }));
    const user = this.props.match.params.id;
    this.props.loadSingleUser(user).then((result) => {
      this.setState({ user: result.payload });
    });
  }

  render() {
    if (!this.props.user) {
      return <Redirect to="/not-authorized" />;
    } else if (this.props.user.role_id !== 1 && parseInt(this.props.match.params.id) !== this.props.user.id) {
      return <Redirect to="/not-authorized" />;
    } else if (this.props.match.params.id !== 'all') {
      if (this.state.redirectSuccess) {
        return <Redirect to="/" />;
      }
      if (!this.props.user.roles) {
        return (
          <>
            <div>Page Loading...</div>
          </>
        );
      } else {
        const user = {
          id: this.props.user.id,
          username: this.props.user.username,
          name: this.props.user.name,
          email: this.props.user.email,
          image: this.props.user.profile_image_url,
          role: this.props.user.roles.role_name,
          active: this.props.user.active,
          memberSince: this.props.user.created_at,
        };

        let memberSince = moment(new Date(user.memberSince)).format('MMM DD YYYY');

        let status;
        if (user.active) {
          status = 'ACTIVE';
        } else {
          status = 'INACTIVE';
        }

        const altDetail = `image-user${user.id}`;

        let shippingAddress = '';
        if (this.state.addressOptions) {
          shippingAddress = this.state.addressOptions.map((address) => {
            return <UserAddress address={address} reload={this.handleAddressReload} />;
          });
        }

        let paymentOptions = '';
        if (this.state.paymentOptions) {
          paymentOptions = this.state.paymentOptions.map((card) => {
            return <UserPayments card={card} lastFour={this.getLast4} reload={this.handlePaymentReload} />;
          });
        }

        return (
          <div className="user-profile">
            <div className="profile-sub-div">
              <div className="user-img">
                <img className="prof-img" src={user.image} alt={altDetail} />
              </div>

              <div className="user-details">
                <div className={this.state.userProfileDisplay}>
                  <div className={this.state.editSuccessDisplay}>
                    <h2>Successfully Updated Profile!</h2>
                  </div>

                  <h2>Username:&nbsp;{user.username}</h2>

                  <p className="user-detail">Name:&nbsp;{user.name}</p>
                  <p className="user-detail">Email:&nbsp;{user.email}</p>
                  <p className="user-detail">Role:&nbsp;{user.role}</p>
                  <p className="user-detail">Status:&nbsp;{status}</p>
                  <p className="user-detail">Member Since:&nbsp;{memberSince}</p>
                  <br />
                  <div className="profile-button">
                    <button onClick={this.handleClickToEdit}>Edit Profile</button>
                  </div>
                </div>

                <div className={this.state.editProfileDisplay}>
                  <EditProfile
                    close={this.handleClickToEdit}
                    name={user.name}
                    email={user.email}
                    success={this.editSuccess}
                    id={user.id}
                  />
                </div>
              </div>
            </div>

            <div className="profile-sub-div">
              <h2>My Addresses</h2>
              <div className="section">
                <div className="primary-address-card">
                  <div className="sub-div">
                    <h5>Your Shipping Preference</h5>
                  </div>

                  <div className="sub-div">
                    <p>{this.state.primaryAddress.address_name}</p>
                    <p>{this.state.primaryAddress.street}</p>
                    <p>{this.state.primaryAddressapt_suite}</p>
                    <p>
                      {this.state.primaryAddress.city}, {this.state.primaryAddress.state}{' '}
                      {this.state.primaryAddress.zip}
                    </p>
                  </div>

                  <div className="sub-div">
                    <p className="primary">{this.state.primary}</p>
                  </div>
                </div>
                <h3>Manage Shipping Addresses</h3>
                <br />
                <div className="shipping-addresses">{shippingAddress}</div> <br/><br />
                <div className="shipping-addresses"><Link to="/add-address"><button className="add-option">+ Shipping Option</button></Link></div>
              </div>
            </div>

            <div className="profile-sub-div">
              <h2>My Payment Options</h2>

              <div className="section">
                <div className="primary-address-card">
                  <div className="sub-div">
                    <h5>Your Payment Preference</h5>
                  </div>

                  <div className="sub-div">
                    <p>{this.state.primaryPayment.cardHolder}</p>
                    <p>{this.state.primaryPayment.cardNumber}</p>
                  </div>
                </div>
                <h3>Manage Payment Options</h3>
                <br />
                <div className="shipping-addresses" id="payment-options">
                  {paymentOptions}
                </div><br /><br />
                <div className="shipping-addresses"><button className="add-option">+ Payment Option</button></div>
              </div>
            </div>
          </div>
        );
      }
    } else {
      return <h1>Users Page</h1>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
    shipping: state.itemReducer.shipping,
    payments: state.itemReducer.payments,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadSingleUser: (user) => dispatch(loadSingleUser(user)),
    grabShipping: () => dispatch(grabShipping()),
    grabPayments: () => dispatch(grabPayments()),
  };
};

Profiles = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profiles);

export default Profiles;
