
function cellsHash(cells) {
	var hash = [];
	for (var i = 0; i < cells.length; i++) hash.push(cells[i].activation);
	return hash;
}

window.Periodicity = function(minLength) {
	this.memo = [];
	this.minLength = minLength;
}

Periodicity.prototype.observeCells = function(cells) {
	this.memo = [cellsHash(cells)].concat(this.memo);
}

Periodicity.prototype.evaluate = function() {
	if (this.memo.length < this.minLength) return null;
	this.periodicity = this.getPeriodicity();
	return this.periodicity;
}

Periodicity.prototype.attachToDisplay = function(display) {
	this.observeCells(display.cells);
	var periodicity = this;
	display.update = function() {
		display.originalUpdate();
		periodicity.observeCells(display.cells);
	}
}

Periodicity.prototype.getPeriodicity = function() {
	var sequence = this.memo;
	for (var i = 0; i < 10; i++) {
		var f = perStep1(sequence);
		var result = perStep2(sequence, f);
		if (result) {
			this.sequence = sequence[0];
			return getPeriodScore(this.sequence);
		}
		sequence = perStep3(sequence, f)
	}
	return null;
}

function perStep1(sequence) {
	return sequence[0];
}
function perStep2(sequence, f) {
	for (var i = 0; i < sequence.length; i++) {
		if (compareArrays(sequence[0], f)) {
			var out = sequence.splice(0, 1);
			sequence.push(out[0]);
		} else {
			return;
		}
	}
	return sequence.length;
}
function perStep3(sequence, f) {
	var result = [];
	lastCut = 0;
	for (var i = 1; i < sequence.length; i++) {
		if (compareArrays(sequence[i-1], f) && !compareArrays(sequence[i], f)) {
			result.push(sequence.slice(lastCut, i));
			lastCut = i;
		}
	}
	result.push(sequence.slice(lastCut, i));
	return result;
}

// after getPeriodicity, sum periods 
function getPeriodScore(sequence) {
	return getDeepest(sequence, 0, 0);
}
// after getPeriodicity, find smallest 
function getPeriodScoreOLD(sequence) {
	var min = 666666;
	for (var i = 0; i < sequence.length; i++) {
		min = Math.min(min, getPerUnit(sequence[i], 666666))
	}
	return min == 666666 ? 0 : min;
}
function getPerUnit(array, other) {
	return array.length == COLS * ROWS ? other : array.length;
}
function getDeepest(array, lastLength, lastLastLength) {
	if (array.length == COLS * ROWS * NUM_OBJ_CLASSES) {
		if (lastLastLength > 1) return lastLength;
		else return 0;
	}
	return getDeepest(array[array.length-1], array.length, lastLength);
}