import React, { Component } from 'react';
import UserList from './UserList';

export default class MainView extends Component {
  componentDidMount = () => {
    this.setupSocket()
    
    const data = this.testData()
    this.setState({users:
      data.map(user => 
        ({
          name: user.name,
          repo: user.data.repo.name,
          repoID: user.data.repo.id,
          commitID: user.data.payload.push_id,
          commitMessage: user.data.payload.commits[0].message,
          commitURL: user.data.payload.commits[0].url.replace("api.", "").replace("/repos", "").replace("commits", "commit"),
          date: new Date(user.data.created_at)
        })
      )
      .sort((user1, user2) => user2.date.getTime() - user1.date.getTime()),
      commentsBeingWritten: {}
    })
  }

  setupSocket = () => {
    const url = "http://localhost:3000"
    // const url = "http://10.185.6.95:3000/"
    // const url = "https://ddf9867e.ngrok.io"
    const socket = require('socket.io-client')(url);
    socket.on('initialLoadData', this.setInitialState);
    socket.on('commentAdded', this.receiveComment);
    // socket.on('gameUpdate', this.setStateFromSocket);
    this.socket = socket
  }

  setInitialState = (data) => {
    this.setState({activeConversations: data.conversations})
  }

  receiveComment = (data) => {
    const conversations = [...this.state.activeConversations]

    let conversation = conversations.find(conversation => parseInt(conversation.repoID) === data.repoID)
    if (conversation !== undefined) {
      conversation = {...conversation}
    } else {
      conversation = {messages: [], repoID: String(data.repoID)}
    }
    console.log(data)
    conversation.messages.push({message: data.commentContent, sender: data.username})
    
    this.setState({activeConversations: conversations})
  }

  render() {
    if (this.state && this.state.activeConversations && this.state.users) {
      return (
        <div className="main-view">
          <input type="text" placeholder="Username" onChange={this.usernameChanged}></input> 
          <UserList users={this.state.users}
                    activeConversations={this.state.activeConversations}

                    commentsBeingWritten={this.state.commentsBeingWritten}
                    commentTextChanged={this.commentTextChanged}
                    addComment={this.addComment}/>
        </div>
      );
    } else {
      return "idk tbh"
    }
  }

  usernameChanged = (event) => {
    this.setState({username: event.target.value})
  }

  commentTextChanged = (event, repoID) => {
    const comments = {...this.state.commentsBeingWritten}
    comments[repoID] = event.target.value
    this.setState({commentsBeingWritten: comments})
  }

  addComment = async (event, repoID) => {
    event.preventDefault()

    this.socket.emit("addComment", {
                                    repoID: repoID,
                                    commentContent: this.state.commentsBeingWritten[repoID],
                                    topic: this.state.users.find(user => user.repoID === repoID).repo,
                                    username: this.state.username
                                  })
    
    const commentsBeingWritten = {...this.state.commentsBeingWritten}
    delete commentsBeingWritten[repoID]
    this.setState({commentsBeingWritten: commentsBeingWritten})
  }

  testData = () => {
    const data = `[{"name":"kapham2","data":{"id":"8615156080","type":"PushEvent","actor":{"id":11263732,"login":"kapham2","display_login":"kapham2","gravatar_id":"","url":"https://api.github.com/users/kapham2","avatar_url":"https://avatars.githubusercontent.com/u/11263732?"},"repo":{"id":158261226,"name":"kapham2/intro-to-redux-library-codealong-houston-web-082718","url":"https://api.github.com/repos/kapham2/intro-to-redux-library-codealong-houston-web-082718"},"payload":{"push_id":3063011309,"size":1,"distinct_size":1,"ref":"refs/heads/master","head":"6cc8ea72bb4cd7bc4da53886758e7489c5ef8544","before":"da6bf97186d5faf651d38d56c1e38179440a7da9","commits":[{"sha":"6cc8ea72bb4cd7bc4da53886758e7489c5ef8544","author":{"email":"pham.kim.a@gmail.com","name":"Kim Pham"},"message":"Done.","distinct":true,"url":"https://api.github.com/repos/kapham2/intro-to-redux-library-codealong-houston-web-082718/commits/6cc8ea72bb4cd7bc4da53886758e7489c5ef8544"}]},"public":true,"created_at":"2018-11-19T19:40:31Z"}},{"name":"nickluong","data":{"id":"8591880702","type":"PushEvent","actor":{"id":39754434,"login":"nickluong","display_login":"nickluong","gravatar_id":"","url":"https://api.github.com/users/nickluong","avatar_url":"https://avatars.githubusercontent.com/u/39754434?"},"repo":{"id":156885434,"name":"nickluong/react-game-kit","url":"https://api.github.com/repos/nickluong/react-game-kit"},"payload":{"push_id":3050349159,"size":1,"distinct_size":1,"ref":"refs/heads/master","head":"43bfe1d2ac96578bcc434f2126ec88dd7d8db5da","before":"c36b5992fdcaec6c300eae80c25b3d1a9c66c719","commits":[{"sha":"43bfe1d2ac96578bcc434f2126ec88dd7d8db5da","author":{"email":"nckluong@gmail.com","name":"Nick Luong"},"message":"jurrasic park space bacon collecting simulator","distinct":true,"url":"https://api.github.com/repos/nickluong/react-game-kit/commits/43bfe1d2ac96578bcc434f2126ec88dd7d8db5da"}]},"public":true,"created_at":"2018-11-14T23:42:14Z"}},{"name":"gwatson86","data":{"id":"8615778415","type":"PushEvent","actor":{"id":42220448,"login":"gwatson86","display_login":"gwatson86","gravatar_id":"","url":"https://api.github.com/users/gwatson86","avatar_url":"https://avatars.githubusercontent.com/u/42220448?"},"repo":{"id":158279946,"name":"gwatson86/map-dispatch-to-props-lab-houston-web-082718","url":"https://api.github.com/repos/gwatson86/map-dispatch-to-props-lab-houston-web-082718"},"payload":{"push_id":3063333121,"size":1,"distinct_size":1,"ref":"refs/heads/master","head":"8ce83cfec60df55b813f597e397f2dc94d5ecc01","before":"7af516529bdb8a62da25124343b8939edc611dfe","commits":[{"sha":"8ce83cfec60df55b813f597e397f2dc94d5ecc01","author":{"email":"gwatson86@gmail.com","name":"gwatson86"},"message":"Done.","distinct":true,"url":"https://api.github.com/repos/gwatson86/map-dispatch-to-props-lab-houston-web-082718/commits/8ce83cfec60df55b813f597e397f2dc94d5ecc01"}]},"public":true,"created_at":"2018-11-19T21:39:03Z"}},{"name":"spraguesy","data":{"id":"8615844534","type":"PushEvent","actor":{"id":33095669,"login":"spraguesy","display_login":"spraguesy","gravatar_id":"","url":"https://api.github.com/users/spraguesy","avatar_url":"https://avatars.githubusercontent.com/u/33095669?"},"repo":{"id":158292679,"name":"spraguesy/map-state-to-props-readme-houston-web-082718","url":"https://api.github.com/repos/spraguesy/map-state-to-props-readme-houston-web-082718"},"payload":{"push_id":3063367309,"size":1,"distinct_size":1,"ref":"refs/heads/master","head":"b7b1d211f6f16140e4333ca4f5d51b3980894ecc","before":"46c0854a67e6305706aba22e32784514c914484b","commits":[{"sha":"b7b1d211f6f16140e4333ca4f5d51b3980894ecc","author":{"email":"andrewsprague@outlook.com","name":"spraguesy"},"message":"Done/","distinct":true,"url":"https://api.github.com/repos/spraguesy/map-state-to-props-readme-houston-web-082718/commits/b7b1d211f6f16140e4333ca4f5d51b3980894ecc"}]},"public":true,"created_at":"2018-11-19T21:52:05Z"}},{"name":"HeadyT0pper","data":{"id":"8165813255","type":"PushEvent","actor":{"id":29072647,"login":"HeadyT0pper","display_login":"HeadyT0pper","gravatar_id":"","url":"https://api.github.com/users/HeadyT0pper","avatar_url":"https://avatars.githubusercontent.com/u/29072647?"},"repo":{"id":146033565,"name":"HeadyT0pper/tweet-shortener-prework","url":"https://api.github.com/repos/HeadyT0pper/tweet-shortener-prework"},"payload":{"push_id":2824566913,"size":1,"distinct_size":1,"ref":"refs/heads/master","head":"e0ca6389b7ff35d8b8b165b9adb7963154a8745e","before":"6f65b19d0aef919684c415fb6392bfe96a31e3c5","commits":[{"sha":"e0ca6389b7ff35d8b8b165b9adb7963154a8745e","author":{"email":"headyt0pper89@gmail.com","name":"jstricklin89"},"message":"Done.","distinct":true,"url":"https://api.github.com/repos/HeadyT0pper/tweet-shortener-prework/commits/e0ca6389b7ff35d8b8b165b9adb7963154a8745e"}]},"public":true,"created_at":"2018-08-25T00:35:29Z"}},{"name":"V10LET","data":{"id":"8604140458","type":"PushEvent","actor":{"id":40186534,"login":"V10LET","display_login":"V10LET","gravatar_id":"","url":"https://api.github.com/users/V10LET","avatar_url":"https://avatars.githubusercontent.com/u/40186534?"},"repo":{"id":157896951,"name":"V10LET/map-state-to-props-readme-houston-web-082718","url":"https://api.github.com/repos/V10LET/map-state-to-props-readme-houston-web-082718"},"payload":{"push_id":3056788550,"size":1,"distinct_size":1,"ref":"refs/heads/master","head":"eb1563230967af8415ea6b0a1b54d575b952d140","before":"46c0854a67e6305706aba22e32784514c914484b","commits":[{"sha":"eb1563230967af8415ea6b0a1b54d575b952d140","author":{"email":"violet.wmoon@gmail.com","name":"V10LET"},"message":"learning mapstatetoprops","distinct":true,"url":"https://api.github.com/repos/V10LET/map-state-to-props-readme-houston-web-082718/commits/eb1563230967af8415ea6b0a1b54d575b952d140"}]},"public":true,"created_at":"2018-11-16T19:06:23Z"}},{"name":"mwilliamszoe","data":{"id":"8615719883","type":"PushEvent","actor":{"id":36799254,"login":"mwilliamszoe","display_login":"mwilliamszoe","gravatar_id":"","url":"https://api.github.com/users/mwilliamszoe","avatar_url":"https://avatars.githubusercontent.com/u/36799254?"},"repo":{"id":158030455,"name":"mwilliamszoe/wanderlust","url":"https://api.github.com/repos/mwilliamszoe/wanderlust"},"payload":{"push_id":3063303066,"size":1,"distinct_size":1,"ref":"refs/heads/master","head":"2d09416c50af738135dede723d5194151b7912a7","before":"b8ec2c8c5ab340db69d1017d6918ce343303e6f6","commits":[{"sha":"2d09416c50af738135dede723d5194151b7912a7","author":{"email":"github email address","name":"github username"},"message":"set up routes for countries","distinct":true,"url":"https://api.github.com/repos/mwilliamszoe/wanderlust/commits/2d09416c50af738135dede723d5194151b7912a7"}]},"public":true,"created_at":"2018-11-19T21:27:56Z"}},{"name":"NaebIis","data":{"id":"8597229115","type":"PushEvent","actor":{"id":41523291,"login":"NaebIis","display_login":"NaebIis","gravatar_id":"","url":"https://api.github.com/users/NaebIis","avatar_url":"https://avatars.githubusercontent.com/u/41523291?"},"repo":{"id":157747664,"name":"NaebIis/redux-reducer-houston-web-082718","url":"https://api.github.com/repos/NaebIis/redux-reducer-houston-web-082718"},"payload":{"push_id":3053153246,"size":1,"distinct_size":1,"ref":"refs/heads/master","head":"801963dac98774d45b264b76e2841ed74bf42b45","before":"6c331352242032bd23f13868f6330b2e679f7305","commits":[{"sha":"801963dac98774d45b264b76e2841ed74bf42b45","author":{"email":"johnmlowery@gmail.com","name":"Naeblis"},"message":"Done.","distinct":true,"url":"https://api.github.com/repos/NaebIis/redux-reducer-houston-web-082718/commits/801963dac98774d45b264b76e2841ed74bf42b45"}]},"public":true,"created_at":"2018-11-15T18:02:11Z"}},{"name":"sparkbold-git","data":{"id":"8615199950","type":"PushEvent","actor":{"id":41597610,"login":"sparkbold-git","display_login":"sparkbold-git","gravatar_id":"","url":"https://api.github.com/users/sparkbold-git","avatar_url":"https://avatars.githubusercontent.com/u/41597610?"},"repo":{"id":158257776,"name":"sparkbold-git/map-dispatch-to-props-lab-houston-web-082718","url":"https://api.github.com/repos/sparkbold-git/map-dispatch-to-props-lab-houston-web-082718"},"payload":{"push_id":3063033861,"size":1,"distinct_size":1,"ref":"refs/heads/master","head":"08304446ae2f25a8f119f6ceaadef9615e3ddbc1","before":"7af516529bdb8a62da25124343b8939edc611dfe","commits":[{"sha":"08304446ae2f25a8f119f6ceaadef9615e3ddbc1","author":{"email":"sparkboldstudio@gmail.com","name":"sparkbold-git"},"message":"Done.","distinct":true,"url":"https://api.github.com/repos/sparkbold-git/map-dispatch-to-props-lab-houston-web-082718/commits/08304446ae2f25a8f119f6ceaadef9615e3ddbc1"}]},"public":true,"created_at":"2018-11-19T19:48:33Z"}},{"name":"chelsme","data":{"id":"8614377828","type":"PushEvent","actor":{"id":41696824,"login":"chelsme","display_login":"chelsme","gravatar_id":"","url":"https://api.github.com/users/chelsme","avatar_url":"https://avatars.githubusercontent.com/u/41696824?"},"repo":{"id":151131302,"name":"chelsme/GRILList","url":"https://api.github.com/repos/chelsme/GRILList"},"payload":{"push_id":3062615728,"size":2,"distinct_size":2,"ref":"refs/heads/master","head":"23ae0749865b502e048d2fbbbfb4ceb7262858b0","before":"3dc437d42686353bcbe4624c16720a1886e85df5","commits":[{"sha":"635a6f8b62147b3bbe56b99d7e19e189049c04e9","author":{"email":"chelsea.crowson@me.com","name":"Chelsea Crowson"},"message":"upgrade ruby","distinct":true,"url":"https://api.github.com/repos/chelsme/GRILList/commits/635a6f8b62147b3bbe56b99d7e19e189049c04e9"},{"sha":"23ae0749865b502e048d2fbbbfb4ceb7262858b0","author":{"email":"chelsea.crowson@me.com","name":"Chelsea Crowson"},"message":"Merge branch 'master' of github.com:chelsme/GRILList","distinct":true,"url":"https://api.github.com/repos/chelsme/GRILList/commits/23ae0749865b502e048d2fbbbfb4ceb7262858b0"}]},"public":true,"created_at":"2018-11-19T17:18:58Z"}},{"name":"EthanFe","data":{"id":"8599404441","type":"PushEvent","actor":{"id":1192711,"login":"EthanFe","display_login":"EthanFe","gravatar_id":"","url":"https://api.github.com/users/EthanFe","avatar_url":"https://avatars.githubusercontent.com/u/1192711?"},"repo":{"id":155464193,"name":"EthanFe/labs-leaderboard-frontend","url":"https://api.github.com/repos/EthanFe/labs-leaderboard-frontend"},"payload":{"push_id":3054295395,"size":2,"distinct_size":2,"ref":"refs/heads/api","head":"bd60e1fd580fda274d493dd92f591d712775cc35","before":"ba974a41dc83cc10142144252af77a03b5ed2d57","commits":[{"sha":"abc5e36815f3378c747daf2037010e060fd8b482","author":{"email":"sneakcow@gmail.com","name":"EthanFe"},"message":"I don't even know if this is working but I think there's module filters and cumulative/per-day toggling now","distinct":true,"url":"https://api.github.com/repos/EthanFe/labs-leaderboard-frontend/commits/abc5e36815f3378c747daf2037010e060fd8b482"},{"sha":"bd60e1fd580fda274d493dd92f591d712775cc35","author":{"email":"sneakcow@gmail.com","name":"EthanFe"},"message":"remove dashed lines","distinct":true,"url":"https://api.github.com/repos/EthanFe/labs-leaderboard-frontend/commits/bd60e1fd580fda274d493dd92f591d712775cc35"}]},"public":true,"created_at":"2018-11-16T01:56:10Z"}}]`
    return JSON.parse(data)
  }
}