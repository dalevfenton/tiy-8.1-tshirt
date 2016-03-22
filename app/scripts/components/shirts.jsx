var React = require('react');
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;
var Alert = require('react-bootstrap').Alert;
var Header = require('./header.jsx');
var models = require('../models');
var Cookies = require('js-cookie');
var $ = require('jquery');
var _ = require('underscore');
require('../bootstrap.min.js');

var ShirtDetail = React.createClass({
  getInitialState: function(){
    return {
      size: 'Size',
      quantity: '',
      warning: '',
      alertVisible: false,
      successVisible: false
    }
  },
  handleSize: function(e, key){
    var sizes = ['X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large'];
    e.preventDefault();
    this.setState({ size: sizes[key-1] });
  },
  handleQuantity: function(e){
    e.preventDefault();
    this.setState({quantity: e.target.value});
  },
  handleSubmit: function(e){
    e.preventDefault();
    if(this.state.size !== 'Size' && this.state.quantity !== ''){
      var cartItem = $.extend( {}, {
        'shirt': _.omit(this.props.model.toJSON(), 'id'),
        'size': this.state.size, 'quantity': this.state.quantity,
        'timeAdded': Date.now()
      });
      var dataObj = [];
      if(localStorage.getItem('cart')){
        var rawData = localStorage.getItem('cart');
        var dataObj = JSON.parse(rawData);
        dataObj.push(cartItem);
      }else{
        dataObj.push(cartItem);
      }
      localStorage.setItem('cart', JSON.stringify(dataObj));
      this.setState({'size': 'Size',
        'quantity': '', 'alertVisible': false,
        'warning': '', 'successVisible': true });
      setTimeout(this.handleSuccessDismiss, 3000);
    }else if( this.state.size === 'Size' ){
      this.setState({'warning': 'Pick A Size For Your Shirt', 'successVisible': false});
      this.handleAlertShow();
    }else {
      this.setState({'warning': 'Select How Many Shirts You Want', 'successVisible': false})
      this.handleAlertShow();
    }
  },
  dismiss: function(){

  },
  handleAlertDismiss() {
    this.setState({alertVisible: false});
  },
  handleAlertShow() {
    this.setState({alertVisible: true});
  },
  handleSuccessDismiss() {
    this.setState({successVisible: false});
  },
  render: function(){
    var shirt = this.props.model;
    var alert;
    if (this.state.alertVisible) {
     alert = (<Alert bsStyle="danger"
       onDismiss={this.handleAlertDismiss} dismissAfter={2000}>
       {this.state.warning}
     </Alert>);
    }
    if (this.state.successVisible) {
     alert = (
       <Alert bsStyle="success" onDismiss={this.handleSuccessDismiss} dismissAfter={3000}>
           Order Added To Cart <br />
          <a href="cart.html">View Cart</a>
      </Alert>);
    }
    return (
      <div className="col-sm-4">
        <div className="thumbnail">
          <img src={shirt.get('image')} alt={shirt.get('name')} />
          <div className="caption">
            <h3>{shirt.get('name')}</h3>
            <div className="shirt-description">{shirt.get('description')}</div>
            <p>${ Number( shirt.get('price') ).toFixed(2) }</p>
            <p><a href={shirt.get('reallink')}>Buy On Woot!</a></p>
            {alert}
            <form className="form-inline" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <input type="number"
                  className="form-control form-item"
                  name="quantity"
                  min="1"
                  placeholder="Qty"
                  value={this.state.quantity}
                  onChange={this.handleQuantity} />
                  <DropdownButton dropup={true} title={this.state.size} id="dropdown-size-medium" onSelect={this.handleSize}>
                    <MenuItem eventKey="1">X-Small</MenuItem>
                    <MenuItem eventKey="2">Small</MenuItem>
                    <MenuItem eventKey="3">Medium</MenuItem>
                    <MenuItem eventKey="4">Large</MenuItem>
                    <MenuItem eventKey="5">X-Large</MenuItem>
                    <MenuItem eventKey="6">XX-Large</MenuItem>
                  </DropdownButton>
                <button type="submit" className="btn btn-primary  form-item">Add to Cart</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

var Shirts = React.createClass({
  render: function(){
    var shirts = this.props.collection.map(function(model){
      return (<ShirtDetail model={model} key={model.get('id')} />);
    }.bind(this));
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="jumbotron">
            <h1>Classy Hound T-Shirt Deals!</h1>
            <h3>You have 10 minutes to purchase once you cart an item.</h3>
          </div>
        </div>
        <div className="row">
          {shirts}
        </div>
      </div>
    );
  }
});

var ShirtsPage = React.createClass({
  getInitialState: function(){
    return {
      user: this.props.user,
      accounts: this.props.accounts
    };
  },
  componentWillMount: function(){
  },
  login: function(username, email){
    if(username && email){
      Cookies.set('username', username);
      Cookies.set('email', email);
      console.log(this.state.accounts);
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
  edit: function(username, email){
    var user = this.state.user;
    user.set({username: username, email: email });
    user.save();
    Cookies.set('username', username);
    Cookies.set('email', email);
    this.setState({'user': user });
  },
  logOut: function(){
    Cookies.remove('username');
    Cookies.remove('email');
    this.setState({'user': undefined});
    this.forceUpdate();
  },
  render: function(){
    return (
      <div>
        <div id="header">
          <Header user={this.state.user} page={window.location.href} login={this.login} edit={this.edit} logOut={this.logOut}/>
        </div>
        <div>
          <Shirts collection={this.props.collection}
            cart={this.props.cart}
            user={this.state.user}
          />
        </div>
      </div>

    );
  }
});
module.exports = ShirtsPage;
