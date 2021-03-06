Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    var errors = validatePost(post);
    if (errors.title || errors.url) {
      Session.set('postSubmitErrors', errors);
      return;
    }

    Meteor.call('postInsert', post, function(error, result) {
      if(error) {
        throwError(error.reason);
        return false;
      }

      if(result.postExists) {
        throwError('Post does already exist - redirecting');
      }
      Router.go('postPage', {_id: result._id});
    });
  }
});
Template.postSubmit.onCreated(function() {
  Session.set('postSubmitErrors', {});
});
Template.postSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function(field){
    return Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});
