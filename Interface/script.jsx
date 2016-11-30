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
				<div className="messageLeft">
					<img className="avatar" src={this.props.avatar}></img>
				</div>
				<div className="messageRight">
					<div className="messageBar">
						<ul className="messageInfo">
							<li>{this.props.userName}</li>
							<li>{ this.props.posted }</li>
						</ul>
						{ this.areButtonsVisible() ?
							<div className="messageButtons">
								{! this.state.isEditorVisible ? <button onClick={this.handleEdit}>Edit</button> : null}
								{this.state.isEditorVisible ? <button onClick={this.handleSave}>Save</button> : null}
								<button onClick={this.handleDelete}>Delete</button>
							</div>
							: null
						}
					</div>
					<div className="messageText">
						{this.state.isEditorVisible ? <textarea ref="messageEditor" className="messageEditor" defaultValue={this.props.text}></textarea> : null}
						{! this.state.isEditorVisible ? <p className="text">{this.props.text}</p> : null}
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
                <Message key={key} container={container} id={value.id} avatar={value.avatar} 
					userName={value.userName} text={value.text} posted={value.posted}/>
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
		if (this.refs.text.value === "")
			return;
		
		$.ajax({
			url: "Action/SendMessage.php",
			method: "post",
			data: {topicId: this.props.topic.state.id, message: this.refs.text.value},
			dataType: "text",
			cache: false,
			success: function() {
				this.props.topic.getMessages(this.props.topic.props.id);
			}.bind(this),
			error: function(xhr, status, error) {
				console.error("MessageWriter.handleSend: ", status, error.toString());
			}
        });
		
		this.refs.text.value = "";
    },
    
    render: function() {
		"use strict";
        return(
            <div className="messageWriter">
                <textarea ref="text" placeholder="Type your message here." />
                <div className="writerButtons">
                    <button onClick={this.handleSend}>Send</button>
                </div> 
            </div>
        );
    }
});

var Topic = React.createClass({
	getInitialState: function() {
		"use strict";
		return {
			id: -1,
			title: "",
			userName: "",
			isMessageWriterVisible: false,
			data: []
		};
	},
    
	setId: function(id) {
		"use strict";
		var state = this.state;
		state.id = id;
		this.setState(state);
	},
	
	setTitle: function(title) {
		"use strict";
		var state = this.state;
		state.title = title;
		this.setState(state);
	},
	
	setUserName: function(userName) {
		"use strict";
		var state = this.state;
		state.userName = userName;
		this.setState(state);
	},
	
	setMessageWriterVisible: function(isMessageWriterVisible) {
		"use strict";
		var state = this.state;
		state.isMessageWriterVisible = isMessageWriterVisible;
		this.setState(state);
	},
	
	setData: function(data) {
		"use strict";
		var state = this.state;
		state.data = data;
		this.setState(state);
	},
	
    getInfo: function() {
		"use strict";
		$.ajax({
			url: "Action/GetTopic.php",
			data: {id: this.state.id},
			dataType: "json",
			cache: false,
			success: function(data) {
				this.setTitle(data.title);
				this.setUserName(data.userName);
			}.bind(this),
			error: function(xhr, status, error) {
				console.error("Topic.getInfo: ", status, error.toString());
			}
        });
    },
    
    getMessages: function() {
		"use strict";		
		$.ajax({
            url: "Action/GetMessages.php",
            data: {topicId: this.state.id},
            dataType: "json",
            cache: false,
            success: function(data) {
				this.setData(data);
            }.bind(this),
            error: function(xhr, status, error) {
                console.error("Topic.getMessages: ", status, error.toString());
            }
        });
    },
    
	toggleMessageWriterVisibility: function() {
		"use strict";
		this.setMessageWriterVisible(!this.state.isMessageWriterVisible);	
	},
	
	isDeleteButtonVisible: function() {
		"use strict";
		var page = this.props.page;
		return this.state.userName === page.state.userName;
	},
	
	delete: function() {
		"use strict";
        $.ajax({
            url: "Action/DeleteTopic.php",
            method: "post",
            data: {id: this.state.id},
            dataType: "text",
            cache: false,
            success: function() {
				this.setState(this.getInitialState());
				this.props.page.refs.forum.getTopics();
			}.bind(this),
            error: function(xhr, status, error) {
                console.error("Topic.delete: ", status, error.toString());
            }
        });
	},
	
    componentDidMount: function() {
		"use strict";
        this.reload(this.props.id);
        //setInterval(this.getMessages, 5000);
    },
	
	reload: function() {
		"use strict";
		this.getInfo();
        this.getMessages();
	},
    
    render: function() {
		"use strict";
        return (
			<div className="topic">
				<h1>{this.state.title}</h1>
				{this.props.page.state.userName !== "" ? 
					<div>
						{this.isDeleteButtonVisible() ? <button onClick={this.delete}>Delete</button> : null}
						<button onClick={this.toggleMessageWriterVisibility}>New message</button>
						{this.state.isMessageWriterVisible ? <MessageWriter topic={this} /> : null}
					</div>
					: null
				}
				<MessageContainer topic={this} data={this.state.data} />
			</div>
        );
    }
});

var TopicWriter = React.createClass({
    handleSend: function(event) {
		"use strict";
		if (this.refs.title.value === "")
			return;
		
        $.ajax({
            url: "Action/SendTopic.php",
            method: "post",
            data: {title: this.refs.title.value},
            dataType: "text",
            cache: false,
            success: this.props.forum.getTopics,
            error: function(xhr, status, error) {
                console.error("TopicWriter.handleSend: ", status, error.toString());
            }
        });
		
		this.refs.title.value = "";
    },
	
	render: function() {
		"use strict";
        return(
            <div className="topicWriter">
                Post new topic<br/>
				<input type="text" ref="title" placeholder="Topic title" />
                <div className="topicWriterButtons">
                    <button onClick={this.handleSend}>Send</button>
                </div> 
            </div>
        );
	}
});

var TopicInfo = React.createClass({
	handleClick: function(event) {
		"use strict";
		event.preventDefault();
		var topic = this.props.list.props.forum.props.page.refs.topic;
		topic.setId(this.props.id);
		topic.reload();
	},
	
	render: function() {
		"use strict";
		return (
			<tr className="topicInfo">
				<td><a href="#" onClick={this.handleClick}>{this.props.title}</a></td>
				<td>{this.props.userName}</td>
				<td>{this.props.posted}</td>
				<td>{this.props.lastPost}</td>
			</tr>
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
		var list = this;
		var topics = this.state.data.map( function(value, index) {
            key++;
            return (
                <TopicInfo key={key} id={value.id} list={list} title={value.title} 
					userName={value.userName} posted={value.posted} lastPost={value.lastPost} />
            );
        });
        return (
            <div className="topicList">
				<table>
					<thead>
						<tr>
							<th>Title</th>
							<th>Poster</th>
							<th>Original post</th>
							<th>Last post</th>
						</tr>
					</thead>
					<tbody>{topics}</tbody>
				</table>
            </div>
        );
    }
});

var Forum = React.createClass({
	getTopics: function() {
		"use strict";
		this.refs.topicList.getTopics();
	},
	
	render: function() {
		"use strict";
		return (
			<div className="forum">
				{this.props.page.state.userName !== "" ? <TopicWriter forum={this} /> : null}
				<TopicList ref="topicList" forum={this} />
			</div>
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
						<td><input ref="password" type="password"></input></td>
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
            dataType: "json",
            cache: false,
            success: function(data) {
				this.props.page.setUserName(data.name);
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
            dataType: "json",
            cache: false,
            success: function(data) {
				this.props.page.setUserName(data.name);
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
				<div className="loginButtons">
					<button onClick={this.login_onClick} >Log in</button>
					<button onClick={this.register_onClick}>Register</button>
				</div>
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
				this.props.page.setUserName("");
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
				<div className="loginButtons">
					Logged in as: {this.props.page.state.userName}
					<button onClick={this.logout_onClick}>Log out</button>
				</div>
			</div>
		);
	}
});

var Page = React.createClass({
    getInitialState: function() {
		"use strict";
		return ({
			userName: "",
		});
	},
	
	setUserName: function(userName) {
		"use strict";
		var state = this.state;
		state.userName = userName;
		this.setState(state);
	},
	
	componentDidMount: function() {
		"use strict";
		$.ajax({
			url: "Action/GetSession.php",
			dataType: "json",
			cache: false,
			success: function(session) {
				this.setUserName(session.user.name);
			}.bind(this),
			error: function(xhr, status, error) {
                console.error("Page.componentDidMount: ", status, error.toString());
            }
		});
		$.ajax({
            url: "Action/GetTopics.php",
            dataType: "json",
            cache: false,
            success: function(data) {
				
            }.bind(this),
            error: function(xhr, status, error) {
                console.error("Page.componentDidMount: ", status, error.toString());
            }
        });
	},
	
	render: function() {
        "use strict";
        return (
            <div className="page">
                <div className="pageHeader">
                    <h1>Yet Another Posting Board</h1>
                </div>
				<div className="pageContent">
					{this.state.userName === "" ? <LoginBar page={this} /> : <LogoutBar page={this} />}
					<Forum ref="forum" page={this}/>
					<Topic ref="topic" page={this}/>
				</div>
            </div>
        );
    }
});

ReactDOM.render(
    <Page />,
    document.getElementById("page")
);