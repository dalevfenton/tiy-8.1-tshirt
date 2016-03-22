var React = require('react');
var LoginButton = require('./login.jsx');
var ProfileButton = require('./profile.jsx');
var OrdersButton = require('./orders.jsx');
var Cookies = require('js-cookie');



var Header = React.createClass({
  render: function(){
    var shirtClass = '';
    var cartClass = '';
    var sort = this.props.page.slice(-9);
    if( sort == 'cart.html' ){
      cartClass = 'active';
    }else{
      shirtClass = 'active';
    }
    var userTab;
    if( this.props.user !== undefined ){
      userTab = (
        <li className="dropdown">
          <a href="#" className="dropdown-toggle"
            data-toggle="dropdown" role="button"
            aria-haspopup="true" aria-expanded="false">
            {this.props.user.get('username')}<span className="caret"></span>
          </a>
          <ul className="dropdown-menu">
            <ProfileButton user={this.props.user} edit={this.props.edit} />
            <li role="separator" className="divider"></li>
            <li><a href="#" onClick={this.props.logOut}>Log Out</a></li>
          </ul>
        </li>
      );
    }else{
      userTab = (<li><LoginButton login={this.props.login} /></li>);
    }
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <p className="navbar-text">Classy Hound</p>
            <a className="navbar-brand" href="#">
              <img src="http://unsplash.it/80/25" />
            </a>
          </div>
          <div className="collapse navbar-collapse" id="bs-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li className={shirtClass}><a href="/dist">T-Shirts</a></li>
              <li className={cartClass}><a href="cart.html">Cart</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              {userTab}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = Header;
