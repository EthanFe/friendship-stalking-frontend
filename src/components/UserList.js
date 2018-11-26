import React, { Component } from 'react';
import UserView from './UserView';

export default class UserList extends Component {
  render() {
    return (
      <div className="user-list">
        {this.props.users.map(user => {
          let activeConvo = this.props.activeConversations.find(conversation => parseInt(conversation.repoID) === user.repoID)

          return (
            <div key={user.name}>
              <UserView user={user}
                        messages={activeConvo ? activeConvo.messages : []}
                        commentTextChanged={this.props.commentTextChanged}
                        commentBeingWritten={this.props.commentsBeingWritten[user.repoID]}
                        addComment={this.props.addComment}/>
            </div>
          )
        })}
      </div>
    );
  }
}