function urlEncode(details) {
  //https://stackoverflow.com/questions/35325370/how-do-i-post-a-x-www-form-urlencoded-request-using-fetch
  let formBody = [];
  for (let property in details) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  return formBody.join("&");
}

class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {commenting: false }

    this.upvote = this.upvote.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.reply = this.reply.bind(this);
  }

  reply() {
    this.setState({ commenting: !this.state.commenting });
  }

  upvote() {
    fetch('/api/upvote', {

      method: 'POST', 
      body: urlEncode({comment_id: this.props.id, name: CURRRENT_NAME}),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },

    });
  }

  onSubmit() {
    this.setState({ commenting: false });
  }

  render() {

    return (
        <div class="comment one-line">
            <img alt="140x140" data-src="holder.js/140x140" class="rounded-circle profile" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzE0MHgxNDAKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xODA0YTZlMTUzYyB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE4MDRhNmUxNTNjIj48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjQ0LjA0Njg3NSIgeT0iNzQuNSI+MTQweDE0MDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true" />
          <div class>
            <div class="one-line">
              <p class="font-weight-bold">{this.props.name}</p>
              <p>·</p>
              <p class="text-secondary">{ this.props.timestamp.fromNow() }</p>
            </div>
            <div>
              <p>{this.props.comment}</p>
            </div>
            <div class="one-line">
              <button onClick={this.upvote} class="font-weight-bold sneaky-btn">▲ Upvote</button>
              <p> {this.props.upvotes} </p>
              <button onClick={this.reply} class="font-weight-bold sneaky-btn">Reply</button>
            </div>
            { this.state.commenting && <CommentBox onSubmit={this.onSubmit} parentId={this.props.id} /> }
            { 
              this.props.children && this.props.children.map((c) => 
                <Comment key={c.comment_id} id={c.comment_id} timestamp={c.timestamp} name={c.name} comment={c.comment} upvotes={c.upvotes} children={c.children} /> 
              ) 
            } 
          </div>
        </div>
    );
  }
}

class CommentBox extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {text: ""};
  }

  onSubmit(e) {
    e.preventDefault();
    let data = {comment: this.state.text, name: CURRRENT_NAME};
    if (this.props.parentId)
      data.parent_id = this.props.parentId;

    fetch('/api/comment', {

      method: 'POST', 
      body: urlEncode(data),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },

    });

    this.setState({text: "" });

    if (this.props.onSubmit)
      this.props.onSubmit();
  }

  onChange(event) {
    this.setState({ text: event.target.value });
  }

  render() {
    return (
        <form onSubmit={this.onSubmit} class="one-line section-border">
          <input onChange={this.onChange} id="comment-line" type="text" class="form-control" placeholder="What are your thoughts?" value={this.state.text} />
          <button type="submit" class="btn btn-default bg-primary reply">Submit</button>
        </form>
    );
  }
}

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {comments: [] };
  }

  refresh() {
    fetch('/api/comments')
          .then(response => response.json())
          .then(data => {

        let seen = {};
        data.forEach(parent => {
          data.forEach(child => {
            if (child.parent_id != parent.comment_id)
              return;

            if (!parent.children)
              parent.children = [];

            parent.children.push(child);
            seen[child.comment_id] = true;
          });

          parent.timestamp = dayjs.utc(parent.timestamp);
        });

        data = data.filter(c => !seen[c.comment_id]);

        let order = comments => {
          comments.sort((a, b) => {
            return b.timestamp - a.timestamp
          })

          comments.forEach(c => {
            if (c.children)
              order(c.children);
          })
        };
        order(data);

        this.setState({ comments: data.filter(c => !seen[c.comment_id]) })
    });
  }

  componentDidMount() {
      this.refresh();

      this.socket = new WebSocket('ws://' + location.host);

      let self = this;
      this.socket.onmessage = function(event) {
        self.refresh();
      };
  }

  componentWillUnmount() {
    if (this.socket)
      this.socket.close();
  }

  render() {
    return ( 
      <div>
        <CommentBox />
        <div id="comments">
        { 
          this.state.comments.map((c) => 
            <Comment key={c.comment_id} id={c.comment_id} timestamp={c.timestamp} name={c.name} comment={c.comment} upvotes={c.upvotes} children={c.children} /> 
          ) 
        } 
        </div>
      </div>
    );
  }
}

const element = <Comments />
const domContainer = document.querySelector('#comments_container');
const root = ReactDOM.createRoot(domContainer);
root.render(element);