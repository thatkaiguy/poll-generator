;
(function ( $ ) {
    'use strict';

    if (!$.PollGenerator) {
        $.PollGenerator = {};
    }

    Function.prototype.inherits = function (Parent) {
      function Surrogate() {}
      Surrogate.prototype = Parent.prototype;
      this.prototype = new Surrogate();
      this.prototype.constructor = this;
    }

    var _questionBase = function(options) {
      options = options || {};
      this.text = options.text;
      this.$el = $('<li>');
    }

    _questionBase.prototype.render = function () {
      alert('Please implement me!');
      return this;
    }

    var _textBxQuestion = function(options){
      options = options || {};
      _questionBase.call(this, options);
    }
    _textBxQuestion.inherits(_questionBase);

    _textBxQuestion.prototype.render = function () {
      this.$el.text(this.text);
      $('<textarea>').appendTo(this.$el);
      return this;
    }

    var _radioBtnQuestion = function(options){
      options = options || {};
    }
    _radioBtnQuestion.inherits(_questionBase);

    var _checkBxQuestion = function(options){
      options = options || {};
    }
    _checkBxQuestion.inherits(_questionBase);

    var _dropDownQuestion = function(options){
      options = options || {};
    }
    _dropDownQuestion.inherits(_questionBase);

    $.PollGenerator.questionTypes = {
      text : function(options) {
        return new _textBxQuestion(options);
      }
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

          // initialize
          base.$createPollFrm = $('<form>').appendTo(base.$el);
          base.$createPollFrm.attr('id', 'create-poll');
          base.$createPollFrm
            .append('<label for="poll_title">Title: </label>')
            .append('<input type="text" id="poll_title" />')
            .append('<input type="button" id="new-poll" value="New Poll" />');

          base.$createPollFrm.find('input#new-poll').click(base._createPollClk);
        };

        base._createPollClk = function (e) {
          // add form to create new form
          var title = base.$createPollFrm.find('#poll_title').val();
          base.$createPollFrm.remove();

          base._addPollQuestionsView(title);
        };

        base._addPollQuestionsView = function (title) {
          base.$addPollQuestions = $('<div>').appendTo(base.$el);
          base.$addPollQuestions.attr('id', 'add-poll-questions');
          base.$addPollQuestions.append('<h3>' + title + '</h3>');

          $('<ul>').attr('id', 'questions').appendTo(base.$addPollQuestions);

          base._addQuestionFrm(base.$addPollQuestions);

        };

        base._addQuestionFrm = function($el) {
          var $questionFrm = $('<form>').appendTo($el);
          var $questionTypes = $('<select>').attr('id', 'question-types');

          var types = Object.keys($.PollGenerator.questionTypes)
          if (types) {
            types.forEach(function(val){
              $questionTypes.append(
                $('<option>').attr('value', val).val(val).html(val)
              )
            });
          }

          $questionFrm
            .append('<label for="question-txt">Question Text: </label>')
            .append('<input type="text" id="question-txt" />')
            .append('<label for="question_types">Question Type: </label>')
            .append($questionTypes)
            .append('<input type="button" id="new-question-btn" value="Create Question" />');

          $questionFrm.find('#new-question-btn').click(base._addQuestionClk);
        };

        base._addQuestionClk = function (e) {
          var $questionFrm = $(e.target).parent();
          var questionType = $questionFrm.find("#question-types").val();
          var newQuestion = new $.PollGenerator.questionTypes[questionType]({
            text : $questionFrm.find('#question-txt').val()
          });

          var $questionsList = base.$el.find("#questions");
          $questionsList.append(newQuestion.render().$el);
        }
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
