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
var Shirts = require('./components/shirts.jsx');
var Cart = require('./components/cart.jsx');
var Cookies = require('js-cookie');

// Cookies.set('username', 'Dale');

var stringData = JSON.stringify(data);

if(localStorage.getItem('cart')){
  var rawCart = localStorage.getItem('cart');
  cart = new models.OrderCollection( JSON.parse(rawCart) );
}else{
  cart = new models.OrderCollection();
}

if(Cookies.get('username')){
  user = Cookies.get('username');
}

ReactDOM.render(
  React.createElement(
    Header,
    {page: window.location.href}
  ),
  document.getElementById('header')
);

var sort = window.location.href.slice(-9);

if( sort == 'cart.html' ){
  ReactDOM.render(
    React.createElement(
      Cart,
      { cart: cart,
        user: user
      }
    ),
    document.getElementById('app')
  );
}else{
  ReactDOM.render(
    React.createElement(
      Shirts,
      {
        collection: shirts,
        cart: cart
      }
    ),
    document.getElementById('app')
  );
}
