// This file needs to take a "config" object and produce a string using console.log as the final step
function configPrinter(ourConfig){
	console.log("require.config(" + JSON.stringify(ourConfig) + ");");
}