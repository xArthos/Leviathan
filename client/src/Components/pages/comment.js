/////////////////////////////////////////////////
// ! TO FINISH

// class WallContainer extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {

//         };
//     }

//     render() {
//         return (
//             <div id="wallContainer">
//                 <h1>Social Network System with React JS Demo</h1>
//                 <WallFeed />
//             </div>
//         );
//     };
// };

// class WallFeed extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {

//         };
//     };

//     getInitialState() {
//         return { data: [] };
//     }

//     updatesFromServer() {
//         const dataPost = '';
//         const reactThis = this;
//         ajaxPostReact('http://localhost:8010/profile/:id/comments', dataPost, reactThis, function (data) {
//             reactThis.setState({ data: data.updates });
//         });
//     }

//     componentDidMount() {
//         this.updatesFromServer();
//     }

//     updateAjaxSubmit(update) {
//         var reactThis = this;
//         ajaxPostReact('updateFeed.php', update, reactThis, function (data) {
//             var updates = reactThis.state.data;
//             var newUpdates = [data.updates[0]].concat(updates);
//             reactThis.setState({ data: newUpdates });
//         });
//     }

//     updateSubmit(e) {
//         e.preventDefault();
//         var user_update = this.state.user_update.trim();
//         if (!user_update) {
//             return;
//         }
//         else {
//             this.props.onUpdateSubmit({ user_update: user_update });
//             this.setState({ user_update: '' });
//         }
//     }

//     deleteUpdate(e) {
//         var updateIndex = e.target.getAttribute('value');
//         var update_id = e.target.getAttribute('data');
//         var data = 'updateID=' + update_id;
//         var reactThis = this;
//         ajaxPostReact('deleteUpdate.php', data, reactThis, function (data) {
//             reactThis.state.data.splice(updateIndex, 1);
//             reactThis.setState({ data: reactThis.state.data });
//         });
//     }

//     render() {
//         return (
//             <div>
//                 <WallForm onUpdateSubmit={this.updateAjaxSubmit} />
//                 <WallUpdates data={this.state.data} deleteUpdate={this.deleteUpdate} />
//             </div>
//         );
//     };
// };

// class WallForm extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {

//         };
//     };

//     getInitialState() {
//         return { user_update: '' };
//     }

//     componentDidMount() {
//         ReactDOM.findDOMNode(this.refs.updateInput).focus();
//     }

//     updateChange(e) {
//         this.setState({ user_update: e.target.value });
//     }

//     updateSubmit(e) {
//         e.preventDefault();
//         var user_update = this.state.user_update.trim();
//         if (!user_update) {
//             return;
//         }
//         else {
//             console.log("Send user_update value to WallUpdates component");
//             this.setState({ user_update: '' });
//         }
//     }

//     render() {
//         return (
//             <form onSubmit={this.updateSubmit} >
//                 <textarea ref="updateInput" value={this.state.user_update}
//                     onChange={this.updateChange}></textarea>
//                 <input type='submit' value='Post' id='wallPost' />
//             </form>
//         );
//     };
// };

// class WallUpdates extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {

//         };
//     }

//     textToLinkHTML(content) {
//         var finalContent = textToLink(content);
//         return { __html: finalContent }
//     }

//     render() {
//         const updatesEach = this.props.data.map(function (update, index) {
//             return (
//                 <div className="feedBody" key={update.created}>
//                     <img src={update.profile_pic} className="feedImg" />
//                     <div className="feedText">
//                         <b>{update.name}</b>
//                         <a href="#" className="feedDelete" value={index} data={update.update_id}
//                             onClick={this.props.deleteUpdate} >X</a>
//                         <span dangerouslySetInnerHTML={this.textToLinkHTML(<span dangerouslySetInnerHTML={this.textToLinkHTML(update.user_update)} />)} />
//                         <CommentBlock dataComentsBlock={update.comments} updateID={update.update_id} />
//                     </div>
//                 </div>
//             )
//         }, this);
//         return (
//             <div id="wallFeed">
//                 {updatesEach}
//             </div>
//         );
//     };
// };

// class CommentBlock extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {

//         };
//     };

//     getInitialState() {
//         return {
//             dataComments: this.props.dataCommentsBlock,
//             showComment: false //Default value for comment
//         };
//     }

//     commentLink() {
//         this.setState({ showComment: !this.state.showComment });
//         this.renderCommentForm();
//     }

//     renderCommentForm() {
//         if (this.state.showComment) {
//             return (<CommentForm onCommentSubmit={this.commentAjaxSubmit} />)
//         }
//     }

//     commentAjaxSubmit(dataComment) {
//         var update_id = this.props.updateID;
//         var reactThis = this;
//         var data = 'updateID=' + update_id + '&user_comment=' + dataComment.user_comment;
//         var reactThis = this;
//         ajaxPostReact('updateComment.php', data, reactThis, function (data) {
//             var comments = reactThis.state.dataComments;
//             var newComments = comments.concat([data.comments[0]]);
//             reactThis.setState({ dataComments: newComments });
//         });
//     }

//     deleteComment(e) {
//         e.preventDefault();
//         var commentIndex = e.target.getAttribute('value');
//         var com_id = e.target.getAttribute('data');
//         var update_id = this.props.updateID;
//         var reactThis = this;
//         var data = 'updateID=' + update_id + '&commentID=' + com_id;
//         ajaxPostReact('deleteComment.php', data, reactThis, function (data) {
//             reactThis.state.dataComments.splice(commentIndex, 1);
//             reactThis.setState({ dataComments: reactThis.state.dataComments });
//         });
//     }

//     render() {
//         return (
//             <div>
//                 <div className="feedLinks">
//                     <a href="#" onClick={this.commentLink}>Comment</a></div>
//                 <CommentsGrid dataComments={this.state.dataComments} deleteComment={this.deleteComment} />
//                 {this.renderCommentForm()}
//             </div>
//         );
//     }
// };

// class CommentsGrid extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {

//         }
//     }

//     textToLinkHTML(content) {
//         var finalContent = textToLink(content);
//         return { __html: finalContent }
//     }

//     render() {
//         var comments = this.props.dataComments.map(function (comment, index) {
//             return (
//                 <div className="feedCommentGrid" key={comment.com_id}>
//                     <img src={comment.profile_pic} className="commentImg" />
//                     <div className="commentText">
//                         <b>{comment.name}</b>
//                         <a href="#" data={comment.com_id} className="commetDelete" value={index}
//                             onClick={this.props.deleteComment} >X</a>
//                         <div>
//                             <span dangerouslySetInnerHTML={this.textToLink(comment.comment)} />
//                         </div>
//                     </div>
//                 </div>
//             )
//         }.bind(this));

//         return (
//             <div id="commnetsFeed"  >
//                 {comments}
//             </div>
//         );
//     };
// };

// class CommentForm extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {};
//     }

//     getInitialState() {
//         return { user_comment: '' };
//     }
//     commentChange(e) {
//         this.setState({ user_comment: e.target.value });
//     }
//     commentSubmit(e) {
//         e.preventDefault();
//         var user_comment = this.state.user_comment.trim();
//         if (!user_comment) {
//             return;
//         }
//         else {
//             this.props.onCommentSubmit({ user_comment: user_comment });
//             this.setState({ user_comment: '' });
//         }
//     }

//     componentDidMount() {
//         ReactDOM.findDOMNode(this.refs.commentInput).focus();
//     }

//     render() {
//         return (
//             <div className="feedCommentForm" >
//                 <form onSubmit={this.commentSubmit} >
//                     <textarea className="commentInput" onChange={this.commentChange}
//                         value={this.state.user_comment} ref="commentInput">
//                     </textarea>
//                     <input type="submit" value="Comment" className="commentSubmit" />
//                 </form>
//             </div>
//         )
//     };
// };


// ///////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////


// function ajaxPostReact(url, dataPost, reactThis, success) {
//     const config = {
//         headers: {
//             'content-type': 'application/json'
//         }
//     };

//     axios.post(url, dataPost, config)
//     .then((result) => {

//         console.log(result);

//         console.log(`${result.request.status} ${result.request.statusText}`);

//         switch (result.request.status) {
//             case 204:
//                 this.setState({ message: 'User doesn\'t exist' });
//                 break;

//             case 200:
//                 this.setState(result.data.comment);
//                 if (this.state.message) {
//                     delete this.state['message'];
//                 }
//                 console.log('Il Porco De Dio')
//                 break;

//             default:
//                 break;
//         };
//     })
//     .catch((err) => {
//         // err (message, config, code, request, response)
//         console.log(err.response.data)

//         switch (err.response.status) {

//             case 400:
//                 this.setState({ message: err.response.data });
//                 break;

//             case 409:
//                 this.setState({ message: err.response.data });
//                 break;

//             default:
//                 break;
//         };
//     });

//     // $.ajax({
//     //     type: "POST",
//     //     url: url,
//     //     data: dataPost,
//     //     dataType: "json",
//     //     cache: false,
//     //     timeout: 20000,
//     //     beforeSend: function (data) { }.bind(this),
//     //     success: function (data) { success.call(this, data); }.bind(this),
//     //     error: function (data) { }.bind(this)
//     // });
// }

// function textToLink(text) {
//     var finalText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
//     // eslint-disable-next-line
//     var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
//     var htmlData = finalText.replace(urlPattern, '<a target="_blank" href="$&">$&</a>');
//     return htmlData;
// }

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


// Main Component
