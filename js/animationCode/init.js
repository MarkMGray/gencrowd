
FOURPOINTCLASSER = new FourPointClasser(WGT_POOL_SIZE);
console.log(FOURPOINTCLASSER)

// var DISPLAY = new GameDisplay(el("playDiv"));
window.addEventListener("resize", function() {DISPLAY.redraw();});
// DISPLAY.initialize(COLS, ROWS)
// DISPLAY.redraw()

var DISPLAY = new GameDisplay(el("playDiv"));
DISPLAY.initialize(COLS, ROWS);

var evolver = new Evolution(popsize=15, maxperiodicity=10, COLS, ROWS);
var gens = 6;

for (var g = 0; g < gens; g++) {
	evolver.oneGen();
	console.log(evolver.population[0].score)
}
DISPLAY.setCitizen(evolver.population[0], FOURPOINTCLASSER)
console.log(DISPLAY)
DISPLAY.redraw()

el("finishButt").onclick = function() {
	el("surveyDiv").style.display = "block"
}

el("submitButt").onclick = function() {
	DISPLAY.citizen.evaluation.surveyScore = getCheckedValue("survey");
	DISPLAY.citizen.evaluation.endMs = (new Date()).getTime();
	if (DISPLAY.citizen.evaluation.surveyScore) el("surveyDiv").style.display = "none"

	console.log(DISPLAY.citizen.getSaveData()) // send this to server
}