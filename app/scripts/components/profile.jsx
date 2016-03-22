var React = require('react');
var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Input = require('react-bootstrap').Input;
var ButtonInput = require('react-bootstrap').ButtonInput;
var Cookies = require('js-cookie');

var ProfileButton = React.createClass({
  getInitialState() {
    console.log(this.props.user);
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
  close() {
    this.setState({ showModal: false });
  },
  open() {
    this.setState({ showModal: true });
  },
  render() {
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
          </Modal.Body>
        </Modal>
        </li>
    );
  }
});

module.exports = ProfileButton;
