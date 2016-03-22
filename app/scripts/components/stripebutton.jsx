var React = require('react');
var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;

var StripeButton = React.createClass({
    mixins: [ReactScriptLoaderMixin],
    getScriptURL: function() {
        return 'https://checkout.stripe.com/checkout.js';
    },
    statics: {
        stripeHandler: null,
        scriptDidError: false,
    },
    // Indicates if the user has clicked on the button before the
    // the script has loaded.
    hasPendingClick: false,
    handleCheckout: function(token){
      this.props.handleCheckout(token);
    },
    onScriptLoaded: function() {
        // Initialize the Stripe handler on the first onScriptLoaded call.
        // This handler is shared by all StripeButtons on the page.
        if (!StripeButton.stripeHandler) {
            StripeButton.stripeHandler = StripeCheckout.configure({
                key: 'pk_test_ZAHFrqDPM2vUTaYme5ROkMYs',
                image: 'http://unsplash.it/128/128',
                token: function(token){
                  this.handleCheckout(token);
                }.bind(this)
            });
            if (this.hasPendingClick) {
                this.showStripeDialog();
            }
        }
    },
    showLoadingDialog: function() {
        // show a loading dialog
    },
    hideLoadingDialog: function() {
        // hide the loading dialog
    },
    showStripeDialog: function() {
        this.hideLoadingDialog();
        StripeButton.stripeHandler.open({
                name: 'Classy Hound',
                description: this.props.total.quantity + " shirts ($" + Number(this.props.total.total).toFixed(2) + ")",
                amount: this.props.total.total * 100
            });
    },
    onScriptError: function() {
        this.hideLoadingDialog();
        StripeButton.scriptDidError = true;
    },
    onClick: function() {
        if (StripeButton.scriptDidError) {
            console.log('failed to load script');
        } else if (StripeButton.stripeHandler) {
            this.showStripeDialog();
        } else {
            this.showLoadingDialog();
            this.hasPendingClick = true;
        }
    },
    render: function() {
        return (
            <button type="button" className="btn btn-primary" onClick={this.onClick}>Checkout - ${ Number(this.props.total.total).toFixed(2) }</button>
        );
    }
});

module.exports = StripeButton;
