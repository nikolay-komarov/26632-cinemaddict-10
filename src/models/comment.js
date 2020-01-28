export default class Comment {
  constructor(comment) {
    this.id = comment[`id`] || ``;
    this.emoji = comment[`emotion`];
    this.author = comment[`author`] || ``;
    this.text = comment[`comment`];
    this.day = comment[`date`] || null;
  }

  toRAW() {
    return {
      'comment': this.text,
      'date': new Date(this.day),
      'emotion': this.emoji
    };
  }

  static parseComment(comment) {
    return new Comment(comment);
  }

  static parseComments(comments) {
    return comments.map(Comment.parseComment);
  }

  static cloneComment(comment) {
    return new Comment(comment.toRAW());
  }
}
