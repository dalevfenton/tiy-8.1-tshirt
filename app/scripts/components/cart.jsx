var React = require('react');

var CartItem = React.createClass({
  remove: function(){
    this.props.removeItem(this.props.model);
  },
  render: function(){
    var model = this.props.model;
    var timeLeft = ((60*10*1000) - (Date.now() - model.get('timeAdded') ) )/ (1000);
    if(timeLeft <  0 ){
      timeLeft = "Expired"
    }else{
      var min = ('0' + Math.floor(timeLeft / 60)).slice(-2);
      var secs = ('0' + Math.floor(timeLeft % 60)).slice(-2);
      timeLeft = min + ":" + secs;
    }
    return (
      <tr>
        <th scope="row">{model.get('shirt').name}</th>
        <td>{model.get('size')}</td>
        <td>{model.get('quantity')}</td>
        <td>{timeLeft}</td>
        <td>
          <button type="button" className="btn btn-primary" onClick={this.remove}>
            Remove
          </button>
        </td>
      </tr>
    );
  }
});

var Cart = React.createClass({
  getInitialState: function(){
    return {
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
  update: function(){
    this.forceUpdate();
  },
  checkout: function(e){
    e.preventDefault();
    localStorage.removeItem('cart');
    this.state.cart.reset();
    this.forceUpdate();
    alert('Now You Would Go Pay And Really We Would Wait To Reset The Cart Then!');
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
    if(this.state.cart.models.length > 0){
      var shirts = this.state.cart.map(function(shirt){
        return ( <CartItem model={shirt} removeItem={this.removeItem} key={shirt.cid}/> )
      }.bind(this));
      return (
        <div className="container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Shirt</th><th>Size</th><th>QTY</th><th>Deal Expires</th><th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {shirts}
            </tbody>
          </table>
          <button type="submit" onClick={this.checkout}>Checkout Now</button>
        </div>
      );
    }else{
      return (
        <div className="container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Shirt</th><th>Size</th><th>QTY</th><th>Deal Expires</th><th>Remove</th>
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
