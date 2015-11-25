
ID = 0;

window.GameDisplay = function(parentElement) {
	this.isMain = parentElement ? true : false;
	this.id = ID++;
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
		display.animate(ANIMATION_SPEED);
	}, 100)
	CANVAS.addEventListener('click', function(event) {
		if (display.parent) {
			console.log(event)
			var ww = display.getColW();
			var hh = display.getRowH();
			var parentHeight = display.parent.clientHeight-26;
			var parentWidth = display.parent.clientWidth-34;
			console.log("width: " + parentWidth + " height: " + parentHeight);

			var cellHeight = parentHeight / display.numrows;
			var cellWidth = parentWidth / display.numcols;

			console.log("cellH: " + cellHeight + " cellW: " + cellWidth);

			console.log("layerX: " + (event.layerX) + " layerY: " + (event.layerY));

			var x = (event.layerX-17) / cellWidth;
			var y = (event.layerY-13) / cellHeight;

			console.log("x: " + x + " y: " + y);

			//var x = Math.max(0, event.layerX - ww / 2) / (ww + 0);
			//var y = Math.max(0, event.layerY - hh / 2) / (hh + 0);
			var cell = display.getCell(Math.floor(x), Math.floor(y), 0);
			cell.beClicked(display.ctx, ww, hh);
			console.log(x + "	" + y)
			console.log(cell)
			console.log(cell.getNeighbors(DIAG_NEIGBS, cell.wrap))

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
	if (!this.isMain || !this.animating) return;
	var display = this;
	display.update();
	setTimeout(function() {
		display.animate(ms);
	}, ms);
}

GameDisplay.prototype.initialize = function(numcols, numrows, numobjs) {
	this.cells = [];
	this.numrows = numrows;
	this.numcols = numcols;
	this.numobjs = numobjs;
	var display = this;
	for (var o = 0; o < numobjs; o++) {
		for (var r = 0; r < numrows; r++) {
			for (var c = 0; c < numcols; c++) {
				this.cells.push(new Cell(c, r, o, display))
			}
		}
	}

	this.redraw();
}

NARF = 0;

GameDisplay.prototype.originalUpdate = function() {
	for (var i = 0; i < this.cells.length; i++) this.cells[i].recalc();
	for (var i = 0; i < this.cells.length; i++) this.cells[i].recharge();
	this.redraw();
}

GameDisplay.prototype.update = function() {
	this.originalUpdate();
}

GameDisplay.prototype.getCell = function(x, y, z) {
	var wx = (x + this.numcols) % this.numcols;
	var wy = (y + this.numrows) % this.numrows;
	var inz = wx + wy*this.numcols;
	return this.cells[inz + z*this.numcols*this.numrows];
}

GameDisplay.prototype.setCellConfig = function(cellData, numRows, numCols, depth, classPool, display) {
	this.cells = [];
	console.log("Num Rows: " + numRows);
	console.log("Num Cols: " + numCols);
	for(var i = 0; i < cellData.length; i++){
		var cellDataObj = cellData[i];
		var area = numCols*numRows;
		var j = i % area;
		var y = Math.floor(j / numCols);
		var x = j - y* numCols;
		var z = Math.floor(i/area);

		var newCell = new Cell(x,y,z, display);

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
	this.id = this.citizen.display.id;

	for (var i = 0; i < citizen.display.cells.length; i++) {
		citizen.display.cells[i].connectToClassPool(citizen.weightPool);
	}
}
