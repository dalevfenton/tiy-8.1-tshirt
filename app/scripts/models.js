var Backbone = require('backbone');

var Order = Backbone.Model.extend({

});

var OrderCollection = Backbone.Collection.extend({
  model: Order
});

var Account = Backbone.Model.extend({
  idAttribute: '_id'
});

var AccountCollection = Backbone.Collection.extend({
  model: Account,
  url: 'http://tiny-lasagna-server.herokuapp.com/collections/tshirtaccounts'
});

module.exports = {
  Order: Order,
  OrderCollection: OrderCollection,
  Account: Account,
  AccountCollection: AccountCollection
}
