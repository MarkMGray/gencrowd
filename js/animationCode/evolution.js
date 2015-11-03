
var COMPARATOR = function(a, b) {
	return a.score > b.score ? -1 : 1;
}

window.Citizen = function(display, maxPeriodicity, wgtPoolSize) {
	this.display = display;
	this.periodicity = new Periodicity(maxPeriodicity);
	this.periodicity.attachToDisplay(display);
	this.wgtPoolSize = wgtPoolSize;
	this.weightPool = randomWeightPool(wgtPoolSize);
	this.evaluation = new Evaluation();
}

function randomWeightPool(size) {
	var numInputs = 5; // Self, L, R, U, D
	if (DIAG_NEIGBS) numInputs += 4; // diagonals
	// TODO other classes, memory (non-markov) frames
	var result = [];
	for (var i = 0; i < size; i++) {
		var wgts = [];
		for (var j = 0; j < numInputs; j++) wgts.push(randWgt());
		result.push(wgts);
	}
	return result;
}

Citizen.prototype.mutate = function(rate) {
	for (var i = 0; i < this.display.cells.length; i++) {
		var c = this.display.cells[i];
		if (Math.random() < rate) this.display.cells[i] = new Cell(c.x, c.y, this.display);
	}
}

Citizen.prototype.mate = function(partner, evo) {
	var citizen = evo.newCitizen();
	for (var i = 0; i < this.weightPool.length; i++) {
		citizen.weightPool[i] = Math.random() < 0.5 ? this.weightPool[i] : partner.weightPool[i];
	}
	for (var i = 0; i < citizen.display.cells.length; i++) {
		citizen.display.cells[i] = Math.random() < 0.5 ? this.display.cells[i] : partner.display.cells[i]
	}
	return citizen;
}

Citizen.prototype.getSaveData = function() {
	var saveData = {};

	saveData.evaluation = {};

	saveData.evaluation.clicks = this.evaluation.clicks;
	saveData.evaluation.endMs = this.evaluation.endMs;
	saveData.evaluation.startMs = this.evaluation.startMs;
	saveData.evaluation.surveyScore = this.evaluation.surveyScore;

	saveData.numrows = this.display.numrows;
	saveData.numcols = this.display.numcols;
	saveData.classPool = this.display.cells[0].classPool;

	saveData.fourPointClasser = {};

	saveData.fourPointClasser.classes = this.fourPointClasser.classes;
	saveData.fourPointClasser.e = this.fourPointClasser.e;
	saveData.fourPointClasser.n = this.fourPointClasser.n;
	saveData.fourPointClasser.s = this.fourPointClasser.s;
	saveData.fourPointClasser.w = this.fourPointClasser.w;


	saveData.cellData = [];
	for (var i = 0; i < this.display.cells.length; i++) {
		var c = this.display.cells[i];
		saveData.cellData.push({
			classPoolIndex : c.classPoolIndex,
			origActivation : c.origActivation,
			bias : c.cellRule.bias,
			wrap : c.cellRule.wrap,
			x : c.x,
			y : c.y
		});
	}
	return saveData;
}

window.Evolution = function(popSize, maxPeriodicity, cols, rows) {
	this.population = [];
	this.maxPeriodicity = maxPeriodicity;
	this.cols = cols;
	this.rows = rows;
	for (var i = 0; i < popSize; i++) {
		this.population.push(this.newCitizen());
	}

	this.reinitbottom = 0//.2;
	this.sextop = 0//.2;
	this.mutrule = function(pctile) { // lower is better
		return Math.max(0, pctile - this.sextop / 2) / 500;
	}
}

Evolution.prototype.newCitizen = function() {
	var display = new GameDisplay();
	display.initialize(this.cols, this.rows);
	var result = new Citizen(display, this.maxPeriodicity, WGT_POOL_SIZE);
	for (var i = 0; i < result.display.cells.length; i++) {
		result.display.cells[i].connectToClassPool(result.weightPool);
	}
	return result;
}

Evolution.prototype.oneGen = function() {
	var n = this.population.length;
	for (var i = 0; i < n; i++) {
		var citizen = this.population[i];
		for (var t = 0; t < this.maxPeriodicity; t++) {
			citizen.display.update();
		}
		var x = citizen.score
		citizen.score = citizen.periodicity.evaluate();
		console.log(i + "	" + x + "	" + citizen.score)
		citizen.score = mutateScore(citizen.score);
	}
	this.population.sort(COMPARATOR);
	console.log(this.population[0].periodicity)
	var sexNum = Math.round(n * this.sextop)
	var freshNum = Math.round(n * this.reinitbottom)
	var killNum = sexNum + freshNum;
	this.population.splice(n - killNum, killNum);
	for (var i = 0; i < this.population.length; i++) this.population[i].mutate(this.mutrule(i / n))
	for (var i = 0; i < sexNum; i++) {
		var father = this.population[Math.floor(Math.random() * sexNum)]
		var mother = this.population[Math.floor(Math.random() * sexNum)]
		var child = father.mate(mother, this);
		this.population.push(child);
	}
	for (var i = 0; i < freshNum; i++) {
		this.population.push(this.newCitizen());
	}
}

function mutateScore(s) {
	return s + (Math.random() * 2 - 1) / 20
}






window.Evaluation = function() {
	this.clicks = [];
}