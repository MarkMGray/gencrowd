
function determineWeight(cell, source) {

}

function determineClass(cell, ann) {
	ann.feedForward([cell.x / COLS, cell.y / ROWS]);
	var maxOut = -666666;
	var bestI = 0;

	for (var i = 0; i < ann.outputs.length; i++) {
		var output = ann.outputs[i].activation;
		if (output > maxOut) {
			maxOut = output;
			bestI = i;
		}
	}
	return bestI;
}

window.FourPointClasser = function(createNew, n,s,e,w, classes) {

	if(createNew){
		this.n = Math.random();
		this.s = Math.random();
		this.e = Math.random();
		this.w = Math.random();
		if (this.s < this.n) {
			var z = this.s;
			this.s = this.n;
			this.n = z;
		}
		if (this.e < this.w) {
			var z = this.e;
			this.e = this.w;
			this.w = z;
		}
		this.classes = []
		for (var i = 0; i < 9; i++) this.classes.push(randInt(n));

	} else {
		this.n = n;
		this.s = s;
		this.e = e;
		this.w = w;
		this.classes = classes;
	}


}

FourPointClasser.prototype.getClass = function(cell) {
	var x = cell.x / COLS
	var y = cell.y / ROWS
	if (x < this.e) {
		if (y < this.n) return this.classes[0];
		else if (y > this.s) return this.classes[1];
		else return this.classes[2];
	} else if (x > this.w) {
		if (y < this.n) return this.classes[3];
		else if (y > this.s) return this.classes[4];
		else return this.classes[5];
	} else {
		if (y < this.n) return this.classes[6];
		else if (y > this.s) return this.classes[7];
		else return this.classes[8];
	}
}

function randInt(n) {
	return Math.floor(Math.random() * n);
}