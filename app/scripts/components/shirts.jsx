var React = require('react');

var Shirts = React.createClass({
  render: function(){
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="jumbotron">
            <h1>Classy Hound T-Shirt Deals!</h1>
            <h3>You have 10 minutes to purchase once you cart an item.</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-md-4">
            <div className="thumbnail">
              <img src="http://unsplash.it/600/400" alt="dummy image" />
              <div className="caption">
                <h3>We Won T-Shirt</h3>
                <p>This shirt is so amazing that it will make you amazing when you wear it.</p>
                <form className="form-inline">
                  <div className="form-group">
                      <input type="number" className="form-control" name="quantity" min="1" placeholder="Qty" />
                  </div>
                  <div className="form-group">
                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Size <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                      <li><a href="#">X-Small</a></li>
                      <li><a href="#">Small</a></li>
                      <li><a href="#">Medium</a></li>
                      <li><a href="#">Large</a></li>
                      <li><a href="#">X-Large</a></li>
                      <li><a href="#">XX-Large</a></li>
                    </ul>
                  </div>
                  <div className="form-group">
                    <button type="button" className="btn btn-primary">Add to Cart</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Shirts;
