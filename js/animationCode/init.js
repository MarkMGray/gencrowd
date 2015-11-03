
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
	$("#submitDiv").slideDown(500);
	$("#finishButt").slideUp();

}

var selectedValue = 1;

$(".btn-group > button.btn").on("click", function () {
	var num = +this.innerHTML;
	selectedValue = num;
});

el("submitButt").onclick = function() {
	DISPLAY.citizen.evaluation.surveyScore = selectedValue;
	DISPLAY.citizen.evaluation.endMs = (new Date()).getTime();
	if (DISPLAY.citizen.evaluation.surveyScore) {
		$("#submitDiv").slideUp(500);
		$("#finishButt").slideDown();
	}


	console.log(DISPLAY.citizen.getSaveData()) // send this to server
	var postObj = DISPLAY.citizen.getSaveData();
	$("#overlay").show();
	$.post("/api/save", $.param(postObj), function (data) {
		console.log(data);

		toastr.success("Successfully saved response!");
		$("#overlay").delay(500).hide(0);
	});

}