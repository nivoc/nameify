Meteor.publish('posts', function() {
  return Posts.find({}, {sort: {voteCount: -1}});
});
Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});
