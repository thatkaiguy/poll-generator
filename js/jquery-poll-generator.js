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

    var _questionBase = function (options) {
      options = options || {};
      this.text = options.text;
      this.$el = $('<li>');
      this.hasChoices = false
    };

    _questionBase.prototype.render = function () {
      alert('Please implement me!');
      return this;
    };

    var _textBoxQuestion = function (options){
      options = options || {};
      _questionBase.call(this, options);
    };
    _textBoxQuestion.inherits(_questionBase);

    _textBoxQuestion.prototype.render = function () {
      this.$el.text(this.text);
      this.$el.append('<br>');
      $('<textarea>').appendTo(this.$el);

      return this;
    };

    _textBoxQuestion.prototype.renderAsAnswered = function () {
      var result = this.$el.find('textarea').val();
      this.$el.text(this.text);
      this.$el.append( $('<p>').text("Response: " + result) );
      return this;
    };

    _textBoxQuestion.prototype.isAnswered = function () {
      var $textArea = this.$el.find('textarea');

      return $textArea.length && $textArea.val().length > 0;
    };

    var _radioBtnQuestion = function (options){
      options = options || {};
      _questionBase.call(this, options);
      this.answer_choices = options.answer_choices
      this.hasChoices = true;
    };
    _radioBtnQuestion.inherits(_questionBase);

    _radioBtnQuestion.prototype.render = function () {
      var question = this;

      question.$el.text(this.text);
      this.$el.append('<br>');
      var $radioFrm = $('<form>').appendTo(question.$el);
      question.answer_choices.forEach(function (choice) {
        $radioFrm
          .append(
            $('<input>')
              .attr('type', 'radio')
              .attr('value', choice)
              .attr('id', choice)
              .attr('name', 'question-group')
          )
          .append(
            $('<label>')
              .attr('for', choice)
              .text(choice)
          )
          .append('<br>')
      });

      return this;
    };

    _radioBtnQuestion.prototype.renderAsAnswered = function () {
      var result = this.$el.find('input:radio:checked').map(function() {
        return this.value;
      }).get();
      this.$el.text(this.text);
      this.$el.append( $('<p>').text("Response: " + result.join(", ")) );
      return this;
    };

    _radioBtnQuestion.prototype.isAnswered = function () {
      return this.$el.find('input:radio:checked').length > 0;
    };

    var _checkBoxQuestion = function(options){
      options = options || {};
      _questionBase.call(this, options);
      this.answer_choices = options.answer_choices
      this.hasChoices = true;
    }
    _checkBoxQuestion.inherits(_questionBase);

    _checkBoxQuestion.prototype.render = function () {
      var question = this;

      question.$el.text(this.text);
      this.$el.append('<br>');
      var $checkboxFrm = $('<form>').appendTo(question.$el);
      question.answer_choices.forEach(function (choice) {
        $checkboxFrm
          .append(
            $('<input>')
              .attr('type', 'checkbox')
              .attr('value', choice)
              .attr('id', choice)
          )
          .append(
            $('<label>')
              .attr('for', choice)
              .text(choice)
          )
          .append('<br>')
      });

      return this;
    }

    _checkBoxQuestion.prototype.renderAsAnswered = function () {
      var result = this.$el.find('input:checkbox:checked').map(function() {
        return this.value;
      }).get();
      this.$el.text(this.text);
      this.$el.append( $('<p>').text("Response: " + result.join(', ')) );

      return this;
    };

    _checkBoxQuestion.prototype.isAnswered = function () {
      return this.$el.find('input:checkbox:checked').length > 0;
    }

    var _dropDownQuestion = function(options){
      options = options || {};
      _questionBase.call(this, options);
      this.answer_choices = options.answer_choices
      this.hasChoices = true;
    }
    _dropDownQuestion.inherits(_questionBase);

    _dropDownQuestion.prototype.render = function () {
      var question = this;

      question.$el.text(this.text);
      this.$el.append('<br>');
      var $dropdownFrm = $('<form>').append('<select>').appendTo(question.$el);
      var $dropdownList = $dropdownFrm.find('select');
      $dropdownList.append(
        $('<option>').attr('value', "empty").html('Choose..')
      );
      question.answer_choices.forEach(function (choice) {
        $dropdownFrm.find('select')
          .append(
            $('<option>')
              .attr('value', choice)
              .attr('id', choice)
              .html(choice)
          )
      });

      return this;
    };

    _dropDownQuestion.prototype.renderAsAnswered = function () {
      var result = this.$el.find(':selected').text();
      this.$el.text(this.text);
      this.$el.append( $('<p>').text("Response: " + result) );

      return this;
    };

    _dropDownQuestion.prototype.isAnswered = function () {
      return this.$el.find('select')[0].selectedIndex !== 0;
    };


    $.PollGenerator.questionTypes = {
      text : function(options) {
        return new _textBoxQuestion(options);
      },
      radio : function(options) {
        return new _radioBtnQuestion(options);
      },
      checkbox : function(options) {
        return new _checkBoxQuestion(options);
      },
      dropdown : function(options) {
        return new _dropDownQuestion(options);
      }
    }

    $.PollGenerator.pollGenerator = function ( el ) {
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data( "PollGenerator.pollGenerator" , base );

        base.init = function () {
          // initialize
          base.$createPollFrm = $('<form>').appendTo(base.$el);
          base.$createPollFrm.attr('id', 'create-poll');
          base.$createPollFrm
            .append('<label for="poll-title">Title: </label>')
            .append('<input type="text" id="poll-title" />')
            .append('<input type="button" id="new-poll" value="New Poll" />');

          base.$createPollFrm.find('input#new-poll').click(base._createPollClk);
        };

        base._allQuestions = function() {
          base.questions = base.questions || [];
          return base.questions;
        }

        base._createPollClk = function (e) {
          var title = base.$createPollFrm.find('#poll-title').val();
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

        base._publishPoll = function (e) {
          var $publishBtn = $(e.target);
          var $questionFrm = base.$el.find('#new-question');

          $publishBtn.attr('value', 'Submit Poll');
          $publishBtn.off('click');
          $publishBtn.click(base._areAllQuestionsAnswered);
          $questionFrm.remove();
          base.isPublished = true;
        };

        base._addQuestionFrm = function($el) {
          var $questionFrm = $('<form>')
            .attr('id', 'new-question')
            .appendTo($el);
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
            .append('<br>')
            .append('<label for="question_types">Question Type: </label>')
            .append($questionTypes)
            .append('<br>')
            .append('<input type="button" id="new-question-btn" value="Add Question" />');

          $questionFrm.find('#new-question-btn').click(base._addQuestionClk);
          $questionFrm.find('#question-types').on(
            'change',
            base._handleQuestionTypeChange
          );
        };

        base._addQuestionClk = function (e) {
          var $questionFrm = $(e.target).parent();
          var $questionType = $questionFrm.find('#question-types');
          var $questionTxt = $questionFrm.find('#question-txt');

          var answerChoices = [];
          $questionFrm.find('#answer-choices li').each(function() {
            answerChoices.push($(this).text());
          });

          var newQuestion = $.PollGenerator.questionTypes[$questionType.val()]({
            text : $questionTxt.val(),
            answer_choices : answerChoices
          });

          var $questionsList = base.$el.find("#questions");
          $questionsList.append(newQuestion.render().$el);
          base._allQuestions().push(newQuestion);

          // TODO reset selectively instead of re-add components
          $questionFrm.remove();
          base._addQuestionFrm(base.$addPollQuestions);

          var $publishBtn = base.$addPollQuestions.find('#publish-poll');
          if ($publishBtn.length) {
            $publishBtn.remove();
          }

          base.$addPollQuestions.append('<br>');

          $publishBtn = $('<input>')
            .attr('type', 'button')
            .attr('id', 'publish-poll')
            .attr('value', 'Publish Poll')
            .appendTo(base.$addPollQuestions);

          $publishBtn.click(base._publishPoll);
        }

        base._areAllQuestionsAnswered = function (e) {
          var allAnswered = base._allQuestions().every(function (question) {
            return question.isAnswered();
          });

          if (allAnswered && base.isPublished) {
            base._allQuestions().forEach(function (question) {
              question.renderAsAnswered();
              // remove submit button
              $(e.target).remove();
            });
          }
        };

        base._handleQuestionTypeChange = function (e) {
          var $questionFrm = $(e.target).parent();
          var questionType = $questionFrm.find("#question-types").val();
          var question = $.PollGenerator.questionTypes[questionType]();

          if (question.hasChoices &&
              base.$el.find('#add-choices-frm').length < 1) {
            base._addChoicesFrm($questionFrm)
          }
        }

        base._addChoicesFrm = function ($el) {
          var $newQuestionBtn = $el.find('#new-question-btn');
          $newQuestionBtn
            .before('<h5>Answer Choices</h5>')
            .before($('<ul>').attr('id', 'answer-choices'))
            .before(
              $('<form>').attr('id', 'add-choices-frm')
                .append('<label for="answer-choice">Answer Choice: </label>')
                .append('<input type="text" id="answer-choice" />')
                .append('<br>')
                .append('<input type="button" id="add-answer-choice" value="Add Answer Choice" />')
            )
            .before('<br>');

          $el.find('#add-answer-choice').click(base._addAnswerChoiceClk);
        };

        base._addAnswerChoiceClk = function (e) {
          var $answerChoiceFrm = $(e.target).parent();
          var $answerChoicesList = base.$el.find('#answer-choices');

          $answerChoicesList.append(
            $('<li>').text($answerChoiceFrm.find('#answer-choice').val())
          );
          $answerChoiceFrm.find('#answer-choice').val('');
        };

        base.init();
    };

    $.fn.pollGenerator = function () {
        return this.each(function () {
            new $.PollGenerator.pollGenerator(this);
        });
    };

})( jQuery );
