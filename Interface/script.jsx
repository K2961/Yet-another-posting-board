var Message = React.createClass({
    render: function () {
        "use strict";
        return (
            <div>
                <div className="message">
                    <img className="avatar" src={this.props.avatar}></img>
                    <p className="text">{this.props.text}</p>
                    <div className="messageButtons">
                        <textbox>TimeNDate</textbox>
                        <button>Edit</button>
                        <button>Delete</button>
                    </div>
                </div>
                
            </div>
        );
    }
});

var MessageContainer = React.createClass({                                         
    render: function () {
        "use strict";
        var messages = this.props.data.map( function(value, index) {
            return (
                <Message avatar={value.avatar} text={value.text} />
            );
        });

        return (
            <div>
                {messages}
            </div>
        );
    }
});


var Topic = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    
    getMessages: function() {
        $.ajax({
            url: "GetMessages.php",
            dataType: "json",
            cache: false,
            success: function(data) {
                this.setState({
                    data: data
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("ERROR: getMessages: ", status, err.toString());
            }
        });
    },
    
    componentDidMount: function() {
        this.getMessages();
        //setInterval(this.getMessages, 5000);
    },
    
    render: function() {
        return (
            <div className="topic">
                <MessageContainer data={this.state.data} />
            </div>
        );
    }
});

ReactDOM.render(
    <Topic />,
    document.getElementById("messages")
);