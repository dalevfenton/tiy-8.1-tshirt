var Backbone = require('backbone');

var Order = Backbone.Model.extend({

});

var OrderCollection = Backbone.Collection.extend({
  model: Order
});

module.exports = {
  Order: Order,
  OrderCollection: OrderCollection
}
