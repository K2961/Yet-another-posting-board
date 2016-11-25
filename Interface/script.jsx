var Message = React.createClass({
    getInitialState: function () {
		"use strict";
        return ({
            isEditorVisible: false
        });
    },
    
    handleEdit: function () {
		"use strict";
        this.setState({isEditorVisible: ! this.state.isEditorVisible});
    },
    
    handleSave: function () {
		"use strict";
        this.setState({isEditorVisible: ! this.state.isEditorVisible});
        var topic = this.props.container.props.topic;
        var id = this.props.id;
        var text = this.refs.messageEditor.value;
        $.ajax({
            url: "Action/EditMessage.php",
            method: "post",
            data: {id: id, text: text},
            dataType: "text",
            cache: false,
            success: topic.getMessages,
            error: function(xhr, status, error) {
                console.error("Message.handleSave: ", status, error.toString());
            }
        });
    },
    
    handleDelete: function () {
		"use strict";
        var topic = this.props.container.props.topic;
        $.ajax({
            url: "Action/DeleteMessage.php",
            method: "post",
            data: {id: this.props.id},
            dataType: "text",
            cache: false,
            success: topic.getMessages,
            error: function(xhr, status, error) {
                console.error("Message.handleDelete: ", status, error.toString());
            }
        });
    },
    
	areButtonsVisible: function() {
		"use strict";
		var page = this.props.container.props.topic.props.page;
		return this.props.userName === page.state.userName;
	},
	
    render: function () {
        "use strict";
        return (
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
		"use strict";
        $.ajax({
            url: "Action/SendMessage.php",
            method: "post",
            data: {message: this.refs.text.value},
            dataType: "text",
            cache: false,
            success: this.props.topic.getMessages,
            error: function(xhr, status, error) {
                console.error("MessageWriter.handleSend: ", status, error.toString());
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

var TopicWriter = React.createClass({
    handleSend: function(event) {
		"use strict";
        $.ajax({
            url: "Action/SendTopic.php",
            method: "post",
            data: {title: this.refs.title.value},
            dataType: "text",
            cache: false,
            success: function() {
				
			},
            error: function(xhr, status, error) {
                console.error("TopicWriter.handleSend: ", status, error.toString());
            }
        });
    },
	
	render: function() {
		"use strict";
        return(
            <div className="topicWriter">
                <input type="text" ref="title" placeholder="Title here" />
                <div className="topicWriterButtons">
                    <button onClick={this.handleSend}>Send</button>
                    <button>Clear</button>
                </div> 
            </div>
        );
	}
});

var Topic = React.createClass({
    getInitialState: function() {
		"use strict";
        return {
            title: "Test title",
            data: []
        };
    },
    
    getTopic: function() {
		"use strict";
        $.ajax({
            url: "Action/GetTopic.php",
            dataType: "json",
            cache: false,
            success: function(data) {
                this.setState({
                    title: data.title,
                    data: this.state.data
                });
            }.bind(this),
            error: function(xhr, status, error) {
                console.error("Topic.getTopic: ", status, error.toString());
            }
        });
    },
    
    getMessages: function() {
		"use strict";
		$.ajax({
            url: "Action/GetMessages.php",
            dataType: "json",
            cache: false,
            success: function(data) {
                this.setState({
                    title: this.state.title,
                    data: data
                });
            }.bind(this),
            error: function(xhr, status, error) {
                console.error("Topic.getMessages: ", status, error.toString());
            }
        });
    },
    
	delete: function() {
		"use strict";
        $.ajax({
            url: "Action/DeleteTopic.php",
            method: "post",
            data: {id: this.props.id},
            dataType: "text",
            cache: false,
            success: function() {
				
			},
            error: function(xhr, status, error) {
                console.error("Topic.delete: ", status, error.toString());
            }
        });
	},
	
    componentDidMount: function() {
		"use strict";
        this.getTopic();
        this.getMessages();
        //setInterval(this.getMessages, 5000);
    },
    
    render: function() {
		"use strict";
        return (
            <div className="topic">
                <h1>{this.state.title}</h1>
				<button onClick={this.delete}>Delete</button>
				{this.props.page.state.userName !== "" ? <MessageWriter topic={this} /> : null}
                <MessageContainer topic={this} data={this.state.data} />
            </div>
        );
    }
});

var TopicList = React.createClass({
    getInitialState: function() {
		"use strict";
        return {
			data: []
        };
	},
	
	componentDidMount: function() {
		"use strict";
		this.getTopics();	
	},
	
	getTopics: function() {
		"use strict";
		$.ajax({
            url: "Action/GetTopics.php",
            dataType: "json",
            cache: false,
            success: function(data) {
                this.setState({
                    data: data
                });
            }.bind(this),
            error: function(xhr, status, error) {
                console.error("TopicList.getTopics: ", status, error.toString());
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
		"use strict";
		return (
			<tr className="topicInfo">
				<td><a href="#">{this.props.title}</a></td>
				<td>{this.props.userName}</td>
				<td>{this.props.posted}</td>
			</tr>
		);
	}
});

var LoginPopup = React.createClass({
    handleCancel: function() {
		"use strict";
        this.props.cancel();
    },
    
    handleLogin: function() {
		"use strict";
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
		"use strict";
        this.props.cancel();
    },
    
    handleRegister: function() {
		"use strict";
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
		"use strict";
        return ({
			isLoginVisible: false,
			isRegisterVisible: false
		});
    },
    
    login_onClick: function() { 
		"use strict";       
        this.setState({
            isLoginVisible: ! this.state.isLoginVisible,
            isRegisterVisible: false
        });
    },
    
    register_onClick: function() {
		"use strict";
        this.setState({
            isLoginVisible: false,
            isRegisterVisible: ! this.state.isRegisterVisible
        });
    },
	
	sendLogin: function(name, password) {
		"use strict";
        this.setState({
            isLoginVisible: false,
            isRegisterVisible: false
        });
        $.ajax({
            url: "Action/SendLogin.php",
            method: "post",
            data: {name: name, password: password},
            dataType: "text",
            cache: false,
            success: function(json) {
				var data = JSON.parse(json);
				this.props.page.setState({userName: data.name});
            }.bind(this),
            error: function(xhr, status, error) {
                console.error("LoginBar.sendLogin: ", status, error.toString());
            }
        });
    },
    
    sendRegistration: function(name, password) { 
		"use strict";
        this.setState({
            isLoginVisible: false,
            isRegisterVisible: false
        });
        $.ajax({
            url: "Action/SendRegistration.php",
            method: "post",
            data: {name: name, password: password},
            dataType: "text",
            cache: false,
            success: function(json) {
				var data = JSON.parse(json);
				this.props.page.setState({userName: data.name});
            }.bind(this),
            error: function(xhr, status, error) {
                console.error("LoginBar.sendRegistration: ", status, error.toString());
            }
        });
    },
	
	render: function() {
		"use strict";
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
		"use strict";
		$.ajax({
            url: "Action/SendLogout.php",
            method: "post",
            data: {},
            dataType: "text",
            cache: false,
            success: function(data) {
				this.props.page.setState({userName: ""});
            }.bind(this),
            error: function(xhr, status, error) {
                console.error("LogoutBar.sendLogout: ", status, error.toString());
            }
        });
	},
	
	render: function() {
		"use strict";
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
		"use strict";
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
				<TopicWriter />
				<TopicList />
                <Topic page={this} id="1" />
            </div>
        );
    }
});

ReactDOM.render(
    <Page />,
    document.getElementById("page")
);