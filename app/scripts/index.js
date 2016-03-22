var React = require('react');
var ReactDOM = require('react-dom');
var Backbone = require('backbone');
var $;
window.jQuery = $ = require('jquery');
require('./bootstrap.min.js');

var data = require('./data');

var models = require('./models');
var shirts = new models.OrderCollection(data);
var cart, user;
var Header = require('./components/header.jsx');
var ShirtsPage = require('./components/shirts.jsx');
var CartPage = require('./components/cart.jsx');
var Cookies = require('js-cookie');

// Cookies.set('username', 'Dale');

var stringData = JSON.stringify(data);

if(localStorage.getItem('cart')){
  var rawCart = localStorage.getItem('cart');
  cart = new models.OrderCollection( JSON.parse(rawCart) );
}else{
  cart = new models.OrderCollection();
}
var accounts = new models.AccountCollection();
accounts.fetch().done(function(){
  if(Cookies.get('username') !== "undefined" && Cookies.get('email') !== "undefined" ){
    user = accounts.findWhere({username: Cookies.get('username'), email: Cookies.get('email') });
  }else{
    user = undefined;
  }

  console.log(user);

  var sort = window.location.href.slice(-9);

  if( sort == 'cart.html' ){
    ReactDOM.render(
      React.createElement(
        CartPage,
        {
          cart: cart,
          user: user,
          accounts: accounts
        }
      ),
      document.getElementById('app')
    );
  }else{
    ReactDOM.render(
      React.createElement(
        ShirtsPage,
        {
          collection: shirts,
          cart: cart,
          user: user,
          accounts: accounts
        }
      ),
      document.getElementById('app')
    );
  }
});
