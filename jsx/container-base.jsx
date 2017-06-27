class ContainerBase extends React.Component{
	
	getInitialState() {
		return {
			ChildrenType: null
		};
	},

	constructor(props){
		super(props);
		if(!this.state){
			this.state = {};
		}
		this.state.ChildrenType = this.props.ChildrenType;
		this.state.ChildId = 0;
	}

	onItemClosing(item, e){
		this.removeOneData(item.props.id || item.props.key || 0);
	}

	addOneData(d){
		this.setState((prev) => ({
			items: prev.items.concat(d),
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