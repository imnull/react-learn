class XButton extends React.Component{
	
	onClickHandle(e){
		if(typeof(this.props.onClick) === 'function'){
			this.props.onClick(this, e);
		}
	}

	render(){
		return <input type="button"
			onClick={this.onClickHandle.bind(this)}
			className={this.props.className || 'x-button'}
			value={this.props.text || 'button'} />
	}
}

class XListItem extends React.Component{
	
	closeHandle(sender, eventProxy){
		if(typeof(this.props.onClosing) === 'function'){
			this.props.onClosing(this, eventProxy);
		}
	}

	render(){
		return (<li className={this.props.className || 'x-list-item'}>
			<span>{this.props.text || '[Item]'}</span>
			<XButton text="X" className="button-close" onClick={this.closeHandle.bind(this)} />
		</li>);
	}
}

//Complex Component

class XContainerBase extends React.Component{
	
	constructor(props){
		super(props);
		this.state = this.getInitialState();
	}

	getInitialState() {
		return {
			ChildrenType: this.props.ChildrenType || null,
			ChildId: 0
		};
	}

	onItemClosing(item, e){
		this.removeOneData(item.props.id || item.props.key || 0);
	}

	addOneData(d){
		var its = this.state.items.slice(0);
		its.unshift(d);
		this.setState((prev) => ({
			items: its,
		}))
	}

	removeOneData(id){
		if(this.state.items.length > 0){
			let idx = this.state.items.findIndex((it) => (it.id === id));
			if(idx > -1){
				var its = this.state.items.slice(0);
				its.splice(idx, 1);
				this.setState({ items: its });
			}
		}
	}

	clearData(){
		this.setState({ items: [] });
	}

	render(){
		return (<ul>{
			this.state.items.map((item, i) => {
				item.key = item.id;
				item.onClosing = this.onItemClosing.bind(this);
				let el = React.createElement(this.state.ChildrenType, item);
				return el;
			})
		}</ul>);
	}
}

class XEditableList extends XContainerBase{
	
	constructor(props){
		super(props);
		this.state.text = '';
		this.state.items = [];
		this.state.addButtonText = this.props.addButtonText || 'Add';
		this.state.clearButtonText = this.props.clearButtonText || 'Clear';
		
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


/////////////

class XDashboard extends XContainerBase{
	
	constructor(props){
		super(props);
		this.state.items = [];
		this.state.chartTypes = [];
		this.state.addButtonText = this.props.addButtonText || 'Add';
		this.state.clearButtonText = this.props.clearButtonText || 'Clear';
		this.state.chartType = this.props.defaultChartType || '';
		
	}

	addButtonClickHandle(e){
		var ch = this.state.chartTypes.find((it) => (it.type === this.state.chartType));
		let item = {
			id: Date.now(),
			chartType: ch.type,
			chartName: ch.name
		};
		this.addOneData(item);
	}

	componentDidMount(){
		let url = this.props.urlChartTypes;
		url += '?t=' + Date.now();
		$.getJSON(url, function(json, success) {
			if(success != 'success') return;
			this.setState({ chartTypes: json.chartTypes })
		}.bind(this));
	}

	setChartType(type){
		this.setState({ chartType: parseInt(type) });
	}

	selectChangeHandle(e){
		if(!e.target.value) return;
		this.setChartType(e.target.value);
	}

	render(){
		return (<div>
		<h3 className="x-dashboard-title">{this.props.title}</h3>
		<select value={this.state.chartType} onChange={this.selectChangeHandle.bind(this)}>
		<option value="">--选择图表类型--</option>
		{
			this.state.chartTypes.map((item) => (
				<option key={item.type} value={item.type}>{item.name}</option>
			))
		}
		</select>
		<button onClick={this.addButtonClickHandle.bind(this)}>{this.state.addButtonText}</button>
		<button onClick={this.clearData.bind(this)}>{this.state.clearButtonText}</button>
		<ul className="x-dashboard-container">
		{
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

