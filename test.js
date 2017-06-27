class Test {
	constructor(name){
		this.name = name;
	}

	show(){
		console.log(this.name);
	}
}

let t = new Test('MK');
t.show();