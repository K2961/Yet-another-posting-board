var MessageContainer = React.createClass({
    render: function () {
        "use strict";
        return (
            <div>
                <div className="messageContainer">
                    <Message text="Fefefwefefef  afa sf" />
                    <Message text="hdfhdfghdfgdfg" />
                    <Message text="sgrsrgrgsegergsrg" />
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
                    <p className="text">{this.props.text}</p>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <MessageContainer />,
    document.getElementById("messages")
);