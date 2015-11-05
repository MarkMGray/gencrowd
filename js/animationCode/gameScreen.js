


window.GameDisplay = function(parentElement) {

	this.parent = parentElement;
	CANVAS = this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	var deviceRatio = window.devicePixelRatio || 1;
	var storeRatio = (this.ctx.webkitBackingStorePixelRatio ||
			this.ctx.mozBackingStorePixelRatio ||
			this.ctx.msBackingStorePixelRatio ||
			this.ctx.oBackingStorePixelRatio ||
			this.ctx.backingStorePixelRatio || 1);
	this.pixelMult = deviceRatio / storeRatio;
	this.animating = false;

	if (parentElement) parentElement = parentElement.appendChild(this.canvas);
	
	var display = this;
	setTimeout(function() {
		display.animating = !display.animating;
		display.animate(300);
	}, 100)
	CANVAS.addEventListener('click', function(event) {
		if (display.parent) {
			console.log(event)
			var ww = display.getColW();
			var hh = display.getRowH();
			var x = Math.max(0, event.layerX - ww / 2) / (ww/2 + 0);
			var y = Math.max(0, event.layerY - hh / 2) / (hh/2 + 0);
			var cell = display.getCell(Math.floor(x), Math.floor(y));
			cell.beClicked(display.ctx, ww, hh);
			console.log(x + "	" + y)
			console.log(event)

			display.citizen.evaluation.clicks.push((new Date()).getTime())
		}
	}, false);
}

GameDisplay.prototype.getColW = function() {
	return this.parent.offsetWidth * this.pixelMult / (this.numcols + 1);
}
GameDisplay.prototype.getRowH = function() {
	return this.parent.offsetHeight * this.pixelMult / (this.numrows + 1);
}

GameDisplay.prototype.animate = function(ms) {
	if (!this.animating) return;
	var display = this;
	display.update();
	setTimeout(function() {
		display.animate(ms);
	}, ms);
}

GameDisplay.prototype.initialize = function(numrows, numcols) {
	this.cells = [];
	this.numrows = numrows;
	this.numcols = numcols;
	var display = this;
	for (var r = 0; r < numrows; r++) {
		for (var c = 0; c < numcols; c++) {
			this.cells.push(new Cell(c, r, display))
		}
	}
	this.redraw();
}

GameDisplay.prototype.setCellConfig = function(cellData, numRows, numCols, classPool, display) {
	this.cells = [];
	console.log("Num Rows: " + numRows);
	console.log("Num Cols: " + numCols);
	for (var r = 0; r < numRows; r++) {
		for (var c = 0; c < numCols; c++) {
			var newCell = new Cell(c, r, display);
			var cellDataObj = cellData[r * numRows + c%numCols];
			newCell.origActivation = cellDataObj["origActivation"];
			newCell.activation = newCell.origActivation;
			newCell.classPool = classPool;
			newCell.cellRule = new CellRule();
			newCell.cellRule.bias = cellDataObj["bias"];
			newCell.cellRule.wrap = cellDataObj["wrap"];
			newCell.classPoolIndex = cellDataObj["classPoolIndex"];
			this.cells.push(newCell);
		}
	}


}


GameDisplay.prototype.originalUpdate = function() {
	for (var i = 0; i < this.cells.length; i++) this.cells[i].recalc();
	for (var i = 0; i < this.cells.length; i++) this.cells[i].recharge();
	this.redraw();
}

GameDisplay.prototype.update = function() {
	this.originalUpdate();
}

GameDisplay.prototype.getCell = function(x, y) {
	var wx = (x + this.numcols) % this.numcols;
	var wy = (y + this.numrows) % this.numrows;
	return this.cells[wx + wy*this.numcols];
}

GameDisplay.prototype.redraw = function() {
	if (!this.parent) return;
	var q = this.canvas, c = this.ctx;
	q.width = this.parent.offsetWidth * this.pixelMult;
	q.height = this.parent.offsetHeight * this.pixelMult;
	if (!this.setSize) {

		q.style.width = this.parent.offsetWidth + 'px';
		q.style.height =  '20em';
		this.setSize = true;
	}

	var ww = this.getColW();
	var hh = this.getRowH();
	for (var i = 0; i < this.cells.length; i++) {
		this.cells[i].draw(c, ww, hh);
	}
}

GameDisplay.prototype.setCitizen = function(citizen, fourPointClasser) {
	this.citizen = citizen;
	this.cells = this.citizen.display.cells;
	this.citizen.evaluation.startMs = (new Date()).getTime();
	this.citizen.fourPointClasser = fourPointClasser;
}
