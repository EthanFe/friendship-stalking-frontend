import React, { Component } from 'react';
import Conversation from './Conversation';

export default class UserView extends Component {
  render() {
    const {name, date, repo, repoID, commitMessage, commitURL} = this.props.user
    return (
      <div className="user-view">
        <div className="user-commit-info">
          <p>{name} ({date.toLocaleString()})</p>
          <p>Last pushed to '<a href={commitURL}>{repo}</a>'</p>
          <p>"{commitMessage}"</p>
        </div>

        <Conversation repoID={repoID}
                      messages={this.props.messages}
                      commentTextChanged={this.props.commentTextChanged}
                      commentText={this.props.commentBeingWritten}
                      addComment={this.props.addComment}/>
        {/* <button onClick={() => this.props.onClick(this.props.user)}>Create conversation</button>} */}
      </div>
    );
  }
}