var Message = React.createClass({
    getInitialState: function () {
        return ({
            isEditorVisible: false
        });
    },
    
    handleEdit: function () {
        this.setState({isEditorVisible: ! this.state.isEditorVisible});
    },
    
    handleSave: function () {
        this.setState({isEditorVisible: ! this.state.isEditorVisible});
        var topic = this.props.container.props.topic;
        var id = this.props.id;
        var text = this.refs.messageEditor.value;
        $.ajax({
            url: "EditMessage.php",
            method: "post",
            data: {id: id, text: text},
            dataType: "text",
            cache: false,
            success: topic.getMessages,
            error: function(xhr, status, err) {
                console.error("ERROR: editMessage: ", status, err.toString());
            }
        });
    },
    
    handleDelete: function () {
        var topic = this.props.container.props.topic;
        $.ajax({
            url: "DeleteMessage.php",
            method: "post",
            data: {id: this.props.id},
            dataType: "text",
            cache: false,
            success: topic.getMessages,
            error: function(xhr, status, err) {
                console.error("ERROR: deleteMessage: ", status, err.toString());
            }
        });
    },
    
	areButtonsVisible: function() {
		var page = this.props.container.props.topic.props.page;
		return this.props.userName === page.state.userName;
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
                    <div className="textContainer">
                        {this.state.isEditorVisible ? <textarea ref="messageEditor" className="messageEditor" defaultValue={this.props.text}></textarea> : null}
                        {! this.state.isEditorVisible ? <p className="text">{this.props.text}</p> : null}
                    </div>
					
					<div className="messageButtons">
						{ this.props.posted }
						{ this.areButtonsVisible() ?
							<div>
								{! this.state.isEditorVisible ? <button onClick={this.handleEdit}>Edit</button> : null}
								{this.state.isEditorVisible ? <button onClick={this.handleSave}>Save</button> : null}
								<button onClick={this.handleDelete}>Delete</button>
							</div>
							: null
						}
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
		var container = this;
		var messages = this.props.data.map( function(value, index) {
            key++;
            return (
                <Message key={key} container={container} id={value.id} avatar={value.avatar} userName={value.userName} text={value.text} posted={value.posted}/>
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
        $.ajax({
            url: "SendMessage.php",
            method: "post",
            data: {msg: this.refs.text.value},
            dataType: "text",
            cache: false,
            success: this.props.topic.getMessages,
            error: function(xhr, status, err) {
                console.error("ERROR: sendMessage: ", status, err.toString());
            }
        });
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
});

var Topic = React.createClass({
    getInitialState: function() {
        return {
            title: "Test title",
            data: []
        };
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
    
    componentDidMount: function() {
        this.getTopic();
        this.getMessages();
        //setInterval(this.getMessages, 5000);
    },
    
    render: function() {
        return (
            <div className="topic">
                <h1>{this.state.title}</h1>
				{this.props.page.state.userName !== "" ? <MessageWriter topic={this} /> : null}
                <MessageContainer topic={this} data={this.state.data} />
            </div>
        );
    }
});

var TopicList = React.createClass({
    getInitialState: function() {
        return {
			data: []
        };
	},
	
	componentDidMount: function() {
		this.getTopics();	
	},
	
	getTopics: function() {
		$.ajax({
            url: "GetTopics.php",
            dataType: "json",
            cache: false,
            success: function(data) {
                this.setState({
                    data: data
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("ERROR: getTopics: ", status, err.toString());
            }
        });
	},
	
	render: function() {
		"use strict";
		var key = 0;
		var topics = this.state.data.map( function(value, index) {
            key++;
            return (
                <TopicInfo key={key} id={value.id} title={value.title} userName={value.userName} posted={value.posted}/>
            );
        });
        return (
            <div className="topicList">
				<table>
					<thead>
						<tr>
							<th>Title</th>
							<th>Poster</th>
							<th>Posted</th>
						</tr>
					</thead>
					<tbody>{topics}</tbody>
				</table>
            </div>
        );
    }
});

var TopicInfo = React.createClass({
	render: function(){
		return (
			<tr className="topicInfo">
				<td>{this.props.title}</td>
				<td>{this.props.userName}</td>
				<td>{this.props.posted}</td>
			</tr>
		);
	}
});

var LoginPopup = React.createClass({
    handleCancel: function() {
        this.props.cancel();
    },
    
    handleLogin: function() {
        this.props.send(this.refs.username.value, this.refs.password.value);
    },
    
    render: function() {
        "use strict";
        return (
            <div className="loginPopup">
                <table>
                    <tr>
                        <td>Login</td>
                        <td><input ref="username" type="text"></input></td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td><input ref="password" type="password"></input></td>
                    </tr>
                </table>
                <button onClick={this.handleLogin}>Log in</button>
                <button onClick={this.handleCancel}>Cancel</button>    
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

var LoginBar = React.createClass({
	getInitialState: function() {
        return ({
			isLoginVisible: false,
			isRegisterVisible: false
		});
    },
    
    login_onClick: function() {        
        this.setState({
            isLoginVisible: ! this.state.isLoginVisible,
            isRegisterVisible: false
        });
    },
    
    register_onClick: function() {
        this.setState({
            isLoginVisible: false,
            isRegisterVisible: ! this.state.isRegisterVisible
        });
    },
	
	sendLogin: function(name, password) {
        this.setState({
            isLoginVisible: false,
            isRegisterVisible: false
        });
        $.ajax({
            url: "SendLogin.php",
            method: "post",
            data: {name: name, password: password},
            dataType: "text",
            cache: false,
            success: function(json) {
				var data = JSON.parse(json);
				this.props.page.setState({userName: data.name});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("ERROR: sendLogin: ", status, err.toString());
            }
        });
    },
    
    sendRegistration: function(name, password) { 
        this.setState({
            isLoginVisible: false,
            isRegisterVisible: false
        });
        $.ajax({
            url: "SendRegistration.php",
            method: "post",
            data: {name: name, password: password},
            dataType: "text",
            cache: false,
            success: function(json) {
				var data = JSON.parse(json);
				this.props.page.setState({userName: data.name});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("ERROR: sendRegistration: ", status, err.toString());
            }
        });
    },
	
	render: function() {
		return (
			<div className="loginBar">
				<button onClick={this.login_onClick}>Log in</button>
				<button onClick={this.register_onClick}>Register</button>
				{this.state.isRegisterVisible ? <RegisterPopup send={this.sendRegistration} cancel={this.register_onClick} /> : null}
				{this.state.isLoginVisible ? <LoginPopup send={this.sendLogin} cancel={this.login_onClick} /> : null}
			</div>
		);
    }
});

var LogoutBar = React.createClass({
	logout_onClick: function() {
		$.ajax({
            url: "SendLogout.php",
            method: "post",
            data: {},
            dataType: "text",
            cache: false,
            success: function(data) {
				this.props.page.setState({userName: ""});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("ERROR: sendLogout: ", status, err.toString());
            }
        });
	},
	
	render: function() {
		return (
			<div className="loginBar">
				<button onClick={this.logout_onClick}>Log out</button>
				{this.props.page.state.userName}
			</div>
		);
	}
});

var Page = React.createClass({
    getInitialState: function() {
		return ({
			userName: ""
		});
	},
	
	render: function() {
        "use strict";
        return (
            <div className="page">
                <div className="pageHeader">
                    <h1>Welcome to test forum</h1>
                </div>
				{this.state.userName === "" ? <LoginBar page={this} /> : <LogoutBar page={this} />}
				<TopicList />
                <Topic page={this} />
            </div>
        );
    }
});

ReactDOM.render(
    <Page />,
    document.getElementById("messages")
);