var Message = React.createClass({
    handleDelete: function () {
        this.props.deleteMessage(this.props.id);
    },
    
    render: function () {
        "use strict";
        return (
            <div>
                <div className="message">
                    <div className="userInfo">
                        <img className="avatar" src={this.props.avatar}></img>
                        <p className="userName">{this.props.userName}</p>
                    </div>
                    <p className="text">{this.props.text}</p>
                    <div className="messageButtons">
                        <div>{this.props.posted}</div>
                        <button>Edit</button>
                        <button onClick={this.handleDelete}>Delete</button>
                    </div>
                </div>
                
            </div>
        );
    }
});

var MessageContainer = React.createClass({                                         
    render: function () {
        "use strict";
        var key = 0;
        var deleteMessage = this.props.deleteMessage;
        var messages = this.props.data.map( function(value, index) {
            key++;
            return (
                <Message key={key} id={value.id} avatar={value.avatar} userName={value.userName} text={value.text} posted={value.posted} deleteMessage={deleteMessage} />
            );
        });

        return (
            <div>
                {messages}
            </div>
        );
    }
});

var MessageWriter = React.createClass({
    handleSend: function(event) {
        this.props.sendMessage(this.refs.text.value);
    }, 
    
    render: function() {
        "use strict";
        return(
            <div className="messageWriter">
                <textarea ref="text" placeholder="Text here" />
                <div className="writerButtons">
                    <button onClick={this.handleSend}>Send</button>
                    <button>Clear</button>
                </div> 
            </div>
        );
    }
})

var Topic = React.createClass({
    getInitialState: function() {
        return {
            title: "Test title",
            data: []
        };
    },
    
    sendMessage: function(message) { 
        $.ajax({
            url: "SendMessage.php",
            method: "post",
            data: {msg: message},
            dataType: "text",
            cache: false,
            success: this.getMessages,
            error: function(xhr, status, err) {
                console.error("ERROR: sendMessage: ", status, err.toString());
            }
        });
    },
    
    getTopic: function() {
        $.ajax({
            url: "GetTopic.php",
            dataType: "json",
            cache: false,
            success: function(data) {
                this.setState({
                    title: data.title,
                    data: this.state.data
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("ERROR: getMessages: ", status, err.toString());
            }
        });
    },
    
    getMessages: function() {
        $.ajax({
            url: "GetMessages.php",
            dataType: "json",
            cache: false,
            success: function(data) {
                this.setState({
                    title: this.state.title,
                    data: data
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("ERROR: getMessages: ", status, err.toString());
            }
        });
    },
    
    deleteMessage: function(id) {
        $.ajax({
            url: "DeleteMessage.php",
            method: "post",
            data: {id: id},
            dataType: "text",
            cache: false,
            success: this.getMessages,
            error: function(xhr, status, err) {
                console.error("ERROR: deleteMessage: ", status, err.toString());
            }
        });
    },
    
    componentDidMount: function() {
        this.getTopic();
        this.getMessages();
        //setInterval(this.getMessages, 5000);
    },
    
    render: function() {
        return (
            <div className="topic">
                <h1>{this.state.title}</h1>
                <MessageWriter sendMessage={this.sendMessage}/>
                <MessageContainer data={this.state.data} deleteMessage={this.deleteMessage}/>
            </div>
        );
    }
});

var LoginPopup = React.createClass({
    render: function() {
        "use strict";
        return (
            <div className="loginPopup">
                <table>
                    <tr>
                        <td>Login</td>
                        <td><input type="text"></input></td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td><input type="text"></input></td>
                    </tr>     
                </table>
                <button>Log in</button>
                <button>Cancel</button>    
            </div>
        );
    } 
});

var RegisterPopup = React.createClass({
    handleCancel: function() {
        this.props.cancel();
    },
    
    handleRegister: function() {
        this.props.send(this.refs.username.value, this.refs.password.value);
    },
    
    render: function() {
        "use strict";
        return (
            <div className="registerPopup">
                <table>
                    <tr>
                        <td>Username</td>
                        <td><input ref="username" type="text"></input></td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td><input ref="password" type="text"></input></td>
                    </tr>     
                </table>
                <button onClick={this.handleRegister}>Register account</button>
                <button onClick={this.handleCancel}>Cancel</button>    
            </div>
        );
    } 
});

var Page = React.createClass({
    getInitialState: function() {
        return (
            {
                showLogin: false,
                showRegister: false
            }
            
        );
    },
    
    login_onClick: function() {        
        this.setState({
            showLogin: ! this.state.showLogin,
            showRegister: false
        });
    },
    
    register_onClick: function() {
        this.setState({
            showLogin: false,
            showRegister: ! this.state.showRegister
        });
    },
    
    sendRegistration: function(name, password) { 
        $.ajax({
            url: "SendRegistration.php",
            method: "post",
            data: {name: name, password: password},
            dataType: "text",
            cache: false,
            success: function() {
                console.log("Success");
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("ERROR: sendRegistration: ", status, err.toString());
            }
        });
    },
    
    render: function() {
        "use strict";
        return (
            <div className="page">
                <div className="pageHeader">
                    <h1>Welcome to test forum</h1>
                </div>
                <div className="loginBar">
                    <button onClick={this.login_onClick}>Log in</button>
                    <button onClick={this.register_onClick}>Register</button>
                </div>
                {this.state.showRegister ? <RegisterPopup send={this.sendRegistration} cancel={this.register_onClick} /> : null}
                {this.state.showLogin ? <LoginPopup /> : null}
                <Topic />
            </div>
        );
    }
});

ReactDOM.render(
    <Page />,
    document.getElementById("messages")
);