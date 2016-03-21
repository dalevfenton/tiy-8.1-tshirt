var React = require('react');
var ReactDOM = require('react-dom');

var models = require('./models');
var orders = new models.OrderCollection();

var Header = require('./components/header.jsx');
var Shirts = require('./components/shirts.jsx');
var Cart = require('./components/cart.jsx');


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
      { orders: orders }
    ),
    document.getElementById('app')
  );
}else{
  ReactDOM.render(
    React.createElement(
      Shirts,
      { orders: orders }
    ),
    document.getElementById('app')
  );
}
