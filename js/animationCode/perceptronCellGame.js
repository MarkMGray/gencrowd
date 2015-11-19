// TODO some rule determining the cell's interaction with the player

var COLORS = [
	'rgba(0,0,0,1)',
	'rgba(255,0,0,1)',
	'rgba(0,255,0,1)',
	'rgba(0,0,255,1)',
	'rgba(255,255,0,1)',
	'rgba(255,0,255,1)',
	'rgba(0,255,255,1)',
	'rgba(0,128,128,1)',
	'rgba(128,0,128,1)',
	'rgba(128,128,0,1)'
];
COLORS.sort(function(a, b) {
	return Math.random() > 0.5 ? 1 : -1;
})

var RED = 'rgba(255,0,0,1)';

window.CellRule = function() {
	this.weights = [];
	this.bias = -Math.random();
	this.wrap = WRAP;//Math.random() > 0.5;
}

window.Cell = function(x, y, z, display) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.display = display;
	this.origActivation = Math.round(Math.random());
	this.activation = this.origActivation;
	this.cellRule = new CellRule();
	this.classPoolIndex = 0;
}

Cell.prototype.debug = function() {
	return this.x + this.y + this.z == 0;
}

Cell.prototype.recalc = function() {
	var neighbs = this.getNeighbors(DIAG_NEIGBS, this.wrap);
	this.sumIn = this.cellRule.bias;
	if (!this.cellRule.weights.length) this.setWeights(neighbs);
	for (var i = 0; i < neighbs.length; i++) {
		this.sumIn += neighbs[i].activation * this.cellRule.weights[i];
	}
	// if (this.debug()) console.log(this.cellRule.weights)
}

Cell.prototype.beClicked = function(ctx, cellW, cellH) {
	this.activation = !this.activation;
	ctx.fillStyle = COLORS[0];
	ctx.fillRect(this.x * cellW + cellW / 2, this.y * cellH + cellH / 2, cellW, cellH);
}

Cell.prototype.setWeights = function(neighbs) {
	if (this.classPool) this.setWeightClass();
	else for (var i = 0; i < neighbs.length; i++) {
		w = randWgt();
		this.cellRule.weights.push(w);
	}
}

Cell.prototype.setWeightClass = function() {
	this.cellRule.weights = this.classPool[this.classPoolIndex];
}

Cell.prototype.connectToClassPool = function(classPool) {
	this.classPool = classPool;
	this.classPoolIndex = this.classPoolIndex || CLASSER.getClass(this);
	// this.classPoolIndex = this.classPoolIndex || determineClass(this, HYPERMODELER);
	this.cellRule.weights = [];
}

Cell.prototype.recharge = function() {
	this.activation = DECAY * Math.round(sigmoid(this.sumIn)) + (1-DECAY) * this.activation;
	// console.log(this.sumIn + " " + this.activation)
}

Cell.prototype.draw = function(ctx, cellW, cellH) {
	var w = cellW, h = cellH;
	if (this.activation > 0.5) {
		ctx.fillStyle = COLORS[this.z];//[this.classPoolIndex];
		w *= 1;
		h *= 1;
		ctx.fillRect(this.x * cellW + w / 2, this.y * cellH + h / 2, w, h);
	}
}

Cell.prototype.getNeighbors = function(incDiag, wrap, debug) {
	var result = [];
	for (var i = 0; i < NUM_OBJ_CLASSES; i++) {
		if (SELFOK || i != this.z) result.push(this.display.getCell(this.x, this.y, i));
	}
	var xs = [];
	if (this.x > 0 || wrap) xs.push(this.x-1);
	if (this.x < this.display.numcols - 1 || wrap) xs.push(this.x+1);
	var ys = [];
	if (this.y > 0 || wrap) ys.push(this.y-1);
	if (this.y < this.display.numrows - 1 || wrap) ys.push(this.y+1);
	if (incDiag) {
		for (var i = 0; i < xs.length; i++) {
			for (var j = 0; j < ys.length; j++) {
				result.push(this.display.getCell(xs[i], ys[j], this.z));
			}
		}
	} else {
		for (var i = 0; i < xs.length; i++) {
			result.push(this.display.getCell(xs[i], this.y, this.z));
		}
		for (var i = 0; i < ys.length; i++) {
			result.push(this.display.getCell(this.x, ys[i], this.z));
		}
	}
	if (debug) {
		console.log(xs)
		console.log(ys)
	}
	return result;
}