Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    Meteor.call('postInsert', post, function(error, result) {
      if(error) {
        throwError(error.reason);
        return false;
      }

      if(result.postExists) {
        throwError("Post does already exist - redirecting");
      }
      Router.go('postPage', {_id: result._id});
    });
  }
});
