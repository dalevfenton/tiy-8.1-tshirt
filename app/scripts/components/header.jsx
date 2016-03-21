var React = require('react');

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
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = Header;
