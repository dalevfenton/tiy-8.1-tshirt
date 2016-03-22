var React = require('react');
var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Input = require('react-bootstrap').Input;
var ButtonInput = require('react-bootstrap').ButtonInput;
var Cookies = require('js-cookie');

var OrdersButton = React.createClass({
  getInitialState() {
    return {
      showModal: false,
     };
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
    return (
        <li onClick={this.open}><a href="#">
          Your Orders
        </a>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Your Orders</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>List of Orders Goes Here</div>
          </Modal.Body>
        </Modal>
        </li>
    );
  }
});

module.exports = OrdersButton;
