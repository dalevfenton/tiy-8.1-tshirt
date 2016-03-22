/** @jsx React.DOM */

var React = require('react');
var LoginButton = require('./login.jsx');
var Header = require('./header.jsx');
var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;
var Cookies = require('js-cookie');
var models = require('../models');

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




var Cart = React.createClass({
  render: function(){
    //setup variables to fill render's return
    //==========================================================================
    //setup return if we have items in our cart
    if(this.props.cart.models.length > 0){
      //build the <CartItem /> components for each item in the cart
      var shirts = this.props.cart.map(function(shirt){
        return ( <CartItem model={shirt} removeItem={this.props.removeItem} key={shirt.cid}/> )
      }.bind(this));
      //build an object with the total price and quantity of items in the cart
      var total = this.props.cart.reduce(function(memo, item){
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
        button = (<StripeButton handleCheckout={this.props.handleCheckout} total={total} user={this.props.user} />);
      }else{
        console.log(this.props);
        button = (<LoginButton login={this.props.login} />);
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

var CartPage = React.createClass({
  getInitialState: function(){
    return {
      user: this.props.user,
      accounts: this.props.accounts,
      cart: this.props.cart
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
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  update: function(){
    this.forceUpdate();
  },
  login: function(username, email){
    if(username && email){
      Cookies.set('username', username);
      Cookies.set('email', email);
      var accounts = this.state.accounts;
      if(accounts){
        if(accounts.findWhere({username: username})){
          this.setState({ user: accounts.findWhere({username: username}) });
        }else{
          var user = new models.Account({username: username, email: email });
          this.setState({ user: user });
          user = accounts.add(user);
          user.save();
        }
      }else{
        console.log('error with login, no accounts collection is set');
      }
    }else{
      this.setState({'user': undefined});
    }
  },
  logOut: function(){
    Cookies.remove('username');
    Cookies.remove('email');
    this.setState({'user': undefined});
    this.forceUpdate();
  },
  edit: function(username, email){
    var user = this.state.user;
    user.set({username: username, email: email });
    user.save();
    Cookies.set('username', username);
    Cookies.set('email', email);
    this.setState({'user': user });
  },
  handleCheckout: function(token){
    var user = this.state.user;
    var purchases;
    var purchase = { token: token, cart: this.state.cart.toJSON() };
    if(user.get('purchases')){
      purchases = user.get('purchases');
      purchases.push(purchase);
    }else{
      purchases = [];
      purchases.push(purchase);
    }
    user.set({ 'purchases': purchases });
    user.save();
    localStorage.removeItem('cart');
    this.state.cart.reset();
    this.forceUpdate();
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
    return (
      <div>
        <div id="header">
          <Header user={this.state.user} page={window.location.href} logOut={this.logOut} login={this.login} edit={this.edit} />
        </div>
        <div>
          <Cart user={this.state.user}
            cart={this.state.cart}
            login={this.login}
            removeItem={this.removeItem}
            handleCheckout={this.handleCheckout}/>
        </div>
      </div>
    );
  }
})
module.exports = CartPage;
