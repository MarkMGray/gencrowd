
//$.post("/api/fetch", function(data) {
//	var jsonObj = $.parseJSON(data);
//
//	if(jsonObj["response_code"] != 0) {
//		toastr.error("Error: " + jsonObj["error_msg"]);
//	} else {
//		var citizen = jsonObj["citizen"];
//		var fourPointClasserDict = citizen["fourPointClasser"];
//		var classPool = citizen["classPool"];
//		citizenID = citizen["citizenID"];
//		generationID = citizen["generationID"];
//		var numRows = citizen["numrows"];
//		var numCols = citizen["numcols"];
//		var cellData = citizen["cellData"];
//
//		// rebuild four point classer
//		var fpClasser = new FourPointClasser(false, fourPointClasserDict["n"],fourPointClasserDict["s"], fourPointClasserDict["e"], fourPointClasserDict["w"], fourPointClasserDict["classes"]);
//		FOURPOINTCLASSER = fpClasser;
//		console.log(fpClasser);
//
//		// var DISPLAY = new GameDisplay(el("playDiv"));
//		window.addEventListener("resize", function() {DISPLAY.redraw();});
//		// DISPLAY.initialize(COLS, ROWS)
//		// DISPLAY.redraw()
//
//		// create the game display
//		DISPLAY = new GameDisplay(el("playDiv"));
//		// initialize
//		DISPLAY.initialize(COLS, ROWS);
//		// Overwrite the cells to show historic data
//
//
//		//var evolver = new Evolution(popsize=15, maxperiodicity=10, COLS, ROWS);
//		//var gens = 6;
//        //
//		//for (var g = 0; g < gens; g++) {
//		//	evolver.oneGen();
//		//	console.log(evolver.population[0].score)
//		//}
//
//		// create a default citizen to fill in
//		var citizen = new Citizen(DISPLAY, 10, 5);
//
//		// add the weight pool
//		citizen.weightPool = classPool;
//
//		DISPLAY.setCellConfig(cellData, numRows, numCols, classPool, DISPLAY);
//
//		console.log(citizen);
//
//		DISPLAY.setCitizen(citizen, FOURPOINTCLASSER)
//		console.log(DISPLAY)
//		DISPLAY.redraw()
//
//		console.log("Loaded citizen!");
//		console.log("Citizen: " + citizenID);
//
//
//
//	}
//
//}).fail(function() {
//	toastr.error("Failed to load citizen!");
//});

FOURPOINTCLASSER = new FourPointClasser(true, WGT_POOL_SIZE);
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

	var postObj = DISPLAY.citizen.getSaveData();
	postObj.citizenID = "0";//citizenID.toString();
	postObj.generationID = "1"; // generationID.toString();
	postObj = {"data" :  JSON.stringify(postObj)}
	console.log(postObj)

	$("#overlay").show();
	$.post("/api/save", postObj, function (data) {
		console.log(data);
		var jsonObj = $.parseJSON(data);

		if(jsonObj["response_code"] != 0) {
			toastr.error("Error: " + jsonObj["error_msg"]);
		} else {
			toastr.success("Successfully saved response!");
		}
		$("#overlay").delay(500).hide(0);
	})
		.fail(function () {
			toastr.error("Failed to save response!");
			$("#overlay").delay(500).hide(0);
	});

}