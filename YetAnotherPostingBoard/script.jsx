var MessageContainer = React.createClass({
    render: function () {
        "use strict";
        return (
            <div>
                <div className="messageContainer">
                    <Message avatar="kuva/avatarph.png" text="Fefefwefefef  afa sf" />
                </div>
            </div>
        );
    }
});

var Message = React.createClass({
    render: function () {
        "use strict";
        return (
            <div>
                <div className="message">
                    <img className="avatar" src={this.props.avatar}></img>
                    <p className="text">{this.props.text}</p>
                    <textbox>TimeNDate</textbox>
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <MessageContainer />,
    document.getElementById("messages")
);