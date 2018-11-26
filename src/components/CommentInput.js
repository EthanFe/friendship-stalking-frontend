import React, { Component } from 'react';

export default class CommentInput extends Component {
  render() {
    console.log(this.props.commentText, this.props.repoID)
    return (
      <div>
        <form onSubmit={(event) => this.props.addComment(event, this.props.repoID)}>
          <input type="text"
                placeholder="Add a comment"
                value={this.props.commentText || ""}
                onChange={(event) => this.props.commentTextChanged(event, this.props.repoID)}
                />
        </form>
      </div>
    );
  }
}