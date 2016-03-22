var React = require('react');
var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Input = require('react-bootstrap').Input;
var ButtonInput = require('react-bootstrap').ButtonInput;
var Cookies = require('js-cookie');

var OrderItem = React.createClass({
  render: function(){
    var items = this.props.purchase.map(function(orderObj){
      var shirt = orderObj.shirt;
      var total = Number(orderObj.quantity * shirt.price).toFixed(2);
      return ( <tr key={orderObj.timeAdded}>
        <td>{shirt.name}</td>
        <td>{orderObj.size}</td>
        <td>{orderObj.quantity}</td>
        <td>${Number(shirt.price).toFixed(2)}</td>
        <td>${total}</td>
      </tr> );
    });
    var totalPrice = this.props.purchase.reduce(function(memo, item){
      var total = Number(item.quantity * item.shirt.price);
      return memo += total;
    }, 0);
    console.log(this.props.created);
    var date = new Date( this.props.created );
    console.log(date);
    return (
      <div>
      <h6>Ordered On: { String(date) } </h6>
      <table className="table table-striped">
        <tbody>
          <tr>
            <th>Name: </th>
            <th>Size</th>
            <th>QTY</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
          {items}
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><b>${totalPrice.toFixed(2)}</b></td>
          </tr>
        </tbody>
      </table>
      </div>
    );
  }
});

var ProfileButton = React.createClass({
  getInitialState() {
    return {
      showModal: false,
      username: this.props.user.get('username'),
      email: this.props.user.get('email')
     };
  },
  editProfile: function(e){
    e.preventDefault();
    var username = this.state.username;
    var email = this.state.email;
    this.close();
    this.props.edit(username, email);
  },
  handleName: function(){
    this.setState({
      username: this.refs.username.getValue()
    });
  },
  handleEmail: function(){
    this.setState({
      email: this.refs.email.getValue()
    });
  },
  close(e) {
    e.preventDefault();
    this.setState({ showModal: false });
  },
  open(e) {
    e.preventDefault();
    this.setState({ showModal: true });
  },
  render() {
    var purchases = this.props.user.get('purchases');
    purchases = purchases.map(function(purchase){
      return ( <OrderItem created={purchase.token.created} purchase={purchase.cart} key={purchase.token.created} /> );
    });
    return (
        <li onClick={this.open}><a href="#">
          Edit Profile
        </a>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Your Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.editProfile}>
              <Input type="text"
                value={this.state.username}
                onChange={this.handleName}
                label="Username"
                placeholder="Enter Your Username"
                ref="username" />
              <Input type="email"
                value={this.state.email}
                onChange={this.handleEmail}
                label="Email Address"
                placeholder="Enter Email Address"
                ref="email" />
              <ButtonInput type="submit" bsStyle="primary" value="Edit Profile" />
            </form>

            <hr />
            {purchases}
          </Modal.Body>
        </Modal>
        </li>
    );
  }
});

module.exports = ProfileButton;
