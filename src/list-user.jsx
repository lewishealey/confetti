var React = require('react');
var rootUrl = 'https://crackling-torch-3200.firebaseio.com/';

module.exports = React.createClass({
	getInitialState: function() {
		return {
			text: this.props.user.text,
			done: this.props.user.done,
			textChanged: false
		}
	},
	componentWillMount: function() {
		this.fb = new Firebase(rootUrl + 'users/' + this.props.user.key); // update specific todo by appending id
	},
	render: function() {
		return <div className="input-group">
			<span className="input-group-addon">
				<input type="checkbox" onChange={this.handleDoneChange} checked={this.state.done} />
			</span>
				<input type="text" className="form-control" value={this.state.text} onChange={this.handleTextChange} disabled={this.state.done}/>
			<span className="input-group-btn">
			{this.changesButtons()}
				<button className="btn btn-default" onClick={this.handleDeleteClick}>
					Delete
				</button>
			</span>
		</div>
	},
	changesButtons: function() {
		if(!this.state.textChanged) {
			return null
		} else {
			return [
				<button className="btn btn-default" onClick={this.handleSaveClick}>Save</button>,
				<button className="btn btn-default" onClick={this.handleUndoClick}>Undo</button>
			]
		}
	},
	handleUndoClick: function() {
		this.setState({
			text: this.props.user.text,
			textChanged: false
		})
	},
	handleSaveClick: function() {
		this.fb.update({text: this.state.text});
		this.setState({textChanged: false });
	},
	handleDoneChange: function(event) {
		var update = {done: event.target.checked}
		this.setState(update);
		this.fb.update(update);

	},
	handleTextChange: function(event) {
		this.setState({
			text: event.target.value,
			textChanged: true
		})
	},
	handleDeleteClick: function() {
		this.fb.remove();
	}
});
