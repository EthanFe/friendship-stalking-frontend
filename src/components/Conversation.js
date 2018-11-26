import React, { Component } from 'react';
import CommentInput from './CommentInput';

export default class Conversation extends Component {
  render() {
    return (
      <div>
        {this.props.messages.map((message, index) => <span key={index}>{message.sender}: {message.message}<br/></span>)}
        <CommentInput addComment={this.props.addComment}
                      commentText={this.props.commentText}
                      commentTextChanged={this.props.commentTextChanged}
                      repoID={this.props.repoID}/>
      </div>
    );
  }
}