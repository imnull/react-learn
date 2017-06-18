class EditableList extends ContainerBase{
	
	constructor(props){
		super(props);
		this.state.text = '';
		this.state.items = [];
		this.state.addButtonText = this.props.addButtonText || 'Add';
		this.state.clearButtonText = this.props.clearButtonText || 'Clear';
		//this.state.list = React.createElement(ContainerBase, this.state);
		
	}

	addButtonClickHandle(e){
		let item = {
			text: this.state.text || null,
			id: Date.now()
		};
		this.addOneData(item);
		this.setState((prev) => ({
			text: ''
		}))
	}

	inputOnChangeHandle(e){
		this.setState({ text: e.target.value });
	}


	render(){
		return (<div>
		<h3>{this.props.title}</h3>
		<input onChange={this.inputOnChangeHandle.bind(this)} type="text" value={this.state.text} />
		<button onClick={this.addButtonClickHandle.bind(this)}>{this.state.addButtonText}</button>
		<button onClick={this.clearData.bind(this)}>{this.state.clearButtonText}</button>
		<ul>
		{
			//this.__proto__.__proto__.render.call(this)
			this.state.items.map((item, i) => {
				item.key = item.id;
				item.onClosing = this.onItemClosing.bind(this);
				let el = React.createElement(this.state.ChildrenType, item);
				return el;
			})
		}
		</ul>
		</div>);
	}
}