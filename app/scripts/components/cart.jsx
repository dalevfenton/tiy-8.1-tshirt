var React = require('react');


var Cart = React.createClass({
  render: function(){
    return (
      <div className="container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Shirt</th><th>Size</th><th>QTY</th><th>Deal Expires</th><th>Remove</th>
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row">Hans</th><td>SM</td><td>1</td><td>09:34</td><td><button type="button" className="btn btn-primary">Remove</button></td></tr>
            <tr><th scope="row">Franz</th><td>SM</td><td>1</td><td>09:34</td><td><button type="button" className="btn btn-primary">Remove</button></td></tr>
            <tr><th scope="row">Dale</th><td>SM</td><td>1</td><td>09:34</td><td><button type="button" className="btn btn-primary">Remove</button></td></tr>
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = Cart;
