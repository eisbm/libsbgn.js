var ns = {};
var xml2js = require('xml2js');
var Issue =  require('./Issue').Issue;
ns.doValidation = function(file) {
 	try {
  		var isoContent= loadXMLDoc("node_modules/libsbgn.js/src/template.xslt");
		file = file.replace('libsbgn/0.3', 'libsbgn/0.2');
		var xml = new DOMParser().parseFromString(file, "text/xml");
		var xsltProcessor = new XSLTProcessor();
	        var result ;
		if (window.ActiveXObject || xhttp.responseType == "msxml-document")
 		 {
  			result = xml.transformNode(xsl);
  		}
		// code for Chrome, Firefox, Opera, etc.
		else if (document.implementation && document.implementation.createDocument)
 		 {
 			 xsltProcessor = new XSLTProcessor();
  		         xsltProcessor.importStylesheet(isoContent);
 			 result = xsltProcessor.transformToFragment(xml, document);
  		}
		var tmp = document.createElement("div");
		tmp.appendChild(result);
		result = tmp.innerHTML; 
		var parseString = xml2js.parseString;
		var parsedResult;
		parseString(result, function (err, data) {
    			parsedResult = data;
		});
		var errors = [];
		if(parsedResult["svrl:schematron-output"]["svrl:failed-assert"] == undefined)
			return errors;
		var errCount= parsedResult["svrl:schematron-output"]["svrl:failed-assert"].length;
		for(var i=0;i<errCount;i++){
		   var error = new Issue();
		   error.setText(parsedResult["svrl:schematron-output"]["svrl:failed-assert"][i]["svrl:text"]);
		   error.setPattern(parsedResult["svrl:schematron-output"]["svrl:failed-assert"][i]["$"]["id"]); 
		   error.setRole(parsedResult["svrl:schematron-output"]["svrl:failed-assert"][i]["svrl:diagnostic-reference"][0]["_"]);	
		   errors.push(error);	 			
		}
					
		//console.log(result["svrl:schematron-output"]["svrl:failed-assert"][0]);
		return errors;
	}
	catch(e) {
		console.log(e);
		return false;
	}	
}
function loadXMLDoc(filename)
{
	if (window.ActiveXObject)
  	{
  		xhttp = new ActiveXObject("Msxml2.XMLHTTP");
  	}
	else 
  	{
 		 xhttp = new XMLHttpRequest();
  	}
	xhttp.open("GET", filename, false);
	try {xhttp.responseType = "msxml-document"} catch(err) {} // Helping IE11
	xhttp.send("");
	return xhttp.responseXML;
}
module.exports = ns;
