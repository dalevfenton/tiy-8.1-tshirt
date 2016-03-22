/** @jsx React.DOM */

var React = require('react');
var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;

var CartItem = React.createClass({
  remove: function(){
    this.props.removeItem(this.props.model);
  },
  render: function(){
    var model = this.props.model;
    var timeLeft = ((60*10*1000) - (Date.now() - model.get('timeAdded') ) )/ (1000);
    var price;
    if(timeLeft <  0 ){
      timeLeft = "Expired"
      price = 0;
    }else{
      var min = ('0' + Math.floor(timeLeft / 60)).slice(-2);
      var secs = ('0' + Math.floor(timeLeft % 60)).slice(-2);
      timeLeft = min + ":" + secs;
      price = model.get('shirt').price;
    }
    return (
      <tr>
        <td>{timeLeft}</td>
        <th scope="row">{model.get('shirt').name}</th>
        <td>{model.get('size')}</td>
        <td>{model.get('quantity')}</td>
        <td>x</td>
        <td>${ Number( price ).toFixed(2) }</td>
        <td>${ Number(model.get('quantity') * price ).toFixed(2) }</td>
        <td>
          <button type="button" className="btn btn-primary" onClick={this.remove}>
            Remove
          </button>
        </td>
      </tr>
    );
  }
});

var StripeButton = React.createClass({
    mixins: [ReactScriptLoaderMixin],
    getScriptURL: function() {
        return 'https://checkout.stripe.com/checkout.js';
    },
    statics: {
        stripeHandler: null,
        scriptDidError: false,
    },
    // Indicates if the user has clicked on the button before the
    // the script has loaded.
    hasPendingClick: false,
    handleCheckout: function(token){
      console.log(token);
      this.props.handleCheckout(token);
    },
    onScriptLoaded: function() {
        // Initialize the Stripe handler on the first onScriptLoaded call.
        // This handler is shared by all StripeButtons on the page.
        if (!StripeButton.stripeHandler) {
            StripeButton.stripeHandler = StripeCheckout.configure({
                key: 'pk_test_ZAHFrqDPM2vUTaYme5ROkMYs',
                image: 'http://unsplash.it/128/128',
                token: function(token){
                  this.handleCheckout(token);
                }.bind(this)
            });
            if (this.hasPendingClick) {
                this.showStripeDialog();
            }
        }
    },
    showLoadingDialog: function() {
        // show a loading dialog
    },
    hideLoadingDialog: function() {
        // hide the loading dialog
    },
    showStripeDialog: function() {
        this.hideLoadingDialog();
        StripeButton.stripeHandler.open({
                name: 'Classy Hound',
                description: this.props.total.quantity + " shirts ($" + Number(this.props.total.total).toFixed(2) + ")",
                amount: this.props.total.total * 100
            });
    },
    onScriptError: function() {
        this.hideLoadingDialog();
        StripeButton.scriptDidError = true;
    },
    onClick: function() {
        if (StripeButton.scriptDidError) {
            console.log('failed to load script');
        } else if (StripeButton.stripeHandler) {
            this.showStripeDialog();
        } else {
            this.showLoadingDialog();
            this.hasPendingClick = true;
        }
    },
    render: function() {
        return (
            <button onClick={this.onClick}>Checkout - ${ Number(this.props.total.total).toFixed(2) }</button>
        );
    }
});


var LoginButton = React.createClass({
  getInitialState() {
    return { showModal: false };
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
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Text in a modal</h4>
            <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>

            <hr />

            <h4>Overflowing text to show scroll behavior</h4>
            <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
            <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
            <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
            <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
            <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
            <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

var Cart = React.createClass({
  getInitialState: function(){
    return {
      cart: this.props.cart,
    }
  },
  componentWillMount: function(){
    this.intervals = [];
  },
  componentWillUnmount: function(){
    this.intervals.forEach(clearInterval);
  },
  componentDidMount: function(){
    this.setInterval( this.update, 1000 );
  },
  update: function(){
    this.forceUpdate();
  },
  handleCheckout: function(token){
    localStorage.removeItem('cart');
    this.state.cart.reset();
    this.forceUpdate();
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  removeItem: function(model){
    var model = this.state.cart.get(model);
    model.destroy();
    var data = this.state.cart.toJSON();
    localStorage.setItem('cart', JSON.stringify(data));
    this.setState({ 'cart': this.state.cart });
    this.forceUpdate();
  },
  render: function(){
    //setup variables to fill render's return
    //==========================================================================
    //setup return if we have items in our cart
    if(this.state.cart.models.length > 0){
      //build the <CartItem /> components for each item in the cart
      var shirts = this.state.cart.map(function(shirt){
        return ( <CartItem model={shirt} removeItem={this.removeItem} key={shirt.cid}/> )
      }.bind(this));
      //build an object with the total price and quantity of items in the cart
      var total = this.state.cart.reduce(function(memo, item){
        //check and make sure we only add items that are not expired
        var timeLeft = ((60*10*1000) - (Date.now() - item.get('timeAdded') ) )/ (1000);
        if(timeLeft > 0){
          memo['total'] += ( item.get('shirt').price * item.get('quantity') );
          memo['quantity'] += Number(item.get('quantity'));
        }
        return memo;
      }, { total: 0, quantity: 0 });
      //add a login button if our user is not logged in, otherwise render the
      //<StripeButton /> component
      var button;
      if(this.props.user){
        button = (<StripeButton handleCheckout={this.handleCheckout} total={total} user={this.props.user} />);
      }else{
        button = (<LoginButton />);
      }
      //do the return for render with items in the cart
      //========================================================================
      return (
        <div className="container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Deal Expires</th>
                <th>Shirt</th>
                <th>Size</th>
                <th>QTY</th>
                <th></th>
                <th>Price</th>
                <th>Sub-Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {shirts}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td><b>${ Number(total.total).toFixed(2) }</b></td>
                <td>Total</td>
              </tr>
            </tbody>
          </table>
          {button}
        </div>
      );
    }else{
      //return screen if our cart is empty
      //=======================================================================
      return (
        <div className="container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Shirt</th><th>Size</th><th>Deal Expires</th><th>QTY</th><th>Price</th><th>Remove</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">There Are No Items In Your Cart</th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }
});

module.exports = Cart;
