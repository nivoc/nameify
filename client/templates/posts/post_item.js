Template.postItem.helpers({
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  ownPost: function() {
    if (this.userId === Meteor.userId()){
      return true;
    } else {
      return false;
    }
  }
  // commentsCount: function() {
  //   return Comments.find({postId: this._id}).count();
  // }
});
Template.postItem.events({
  'click .voteup': function(e) {
    e.preventDefault();
    var currentPostId = this._id;
    Meteor.call('voteUp', currentPostId, function(error, result) {
      if(error) {
        throwError(error.reason);
        return false;
      }

    });
  }
});

