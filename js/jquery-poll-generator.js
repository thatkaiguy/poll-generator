;
(function ( $ ) {
    'use strict';

    if (!$.PollGenerator) {
        $.PollGenerator = {};
    }

    $.PollGenerator.pollGenerator = function ( el, myFunctionParam, options ) {
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data( "PollGenerator.pollGenerator" , base );

        base.init = function () {
            base.myFunctionParam = myFunctionParam;

            base.options = $.extend({},
            $.PollGenerator.pollGenerator.defaultOptions, options);

            // Put your initialization code here
        };

        // Sample Function, Uncomment to use
        // base.functionName = function( paramaters ){
        //
        // };
        // Run initializer
        base.init();
    };

    $.PollGenerator.pollGenerator.defaultOptions = {
        myDefaultValue: ""
    };

    $.fn.pollGenerator = function ( myFunctionParam, options ) {
        return this.each(function () {
            new $.PollGenerator.pollGenerator(this, myFunctionParam, options);
        });
    };

})( jQuery );
