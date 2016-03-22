var React = require('react');
var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Input = require('react-bootstrap').Input;
var ButtonInput = require('react-bootstrap').ButtonInput;
var Cookies = require('js-cookie');

var LoginButton = React.createClass({
  getInitialState() {
    return {
      showModal: false,
      username: '',
      email: ''
     };
  },
  login: function(e){
    e.preventDefault();
    var username = this.state.username;
    var email = this.state.email;
    this.props.login(username, email)
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
  close() {
    this.setState({ showModal: false });
  },
  open() {
    this.setState({ showModal: true });
  },
  render() {
    return (
      <div>
        <Button
          bsStyle="primary"
          onClick={this.open}
        >
          Login Now To Checkout
        </Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Login / Signup</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.login}>
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
              <Input type="password" label="Password (Does Not Do Anything)" />
              <ButtonInput type="submit" bsStyle="primary" value="Login" />
            </form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
});

module.exports = LoginButton;
