# Attack-with-PDF

Attack with PDF is an offensive tool created during the 2206 project. The intent of this tool is to generate an offensive PDF that can be uploaded to a target machine to exfiltrate data. The tool is wholly written in javascript and contains the following:

# Directory Tree
|-- Attack-with-PDF  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-- README.md   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-- main.js   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-- jsPDF_template.js   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-- PDFkit_template.js  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-- exploits  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-- *output exploits*  
|-- node_modules  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-- *Your npm packages*  
|-- package  
|-- package-lock



# Program and Purpose
| Name            | Version | Description                                                                       |
|-----------------|---------|-----------------------------------------------------------------------------------|
| main            | 1       | - Takes users input and calls relevant function(s) to generate an exploitable PDF |
| PDFKit_template | 1       | - Contains functions to create exploits available to the PDFKit library           |
| jsPDF_template  | 1       | - Contains functions to create exploits available to the jsPDF library            |

# Exploits
| Library | Chrome/Acrobat | Name           | Detection         | Description                                                                                       |
|---------|----------------|----------------|-------------------|---------------------------------------------------------------------------------------------------|
| jsPDF   | Chrome         | simple_js      | Noisy             | Simple PDF to test if browser is running JS                                                       |
| jsPDF   | Chrome         | PDFSSRF        | Somewhat Stealthy | Makes the target to make a http post request to given URL upon clicking anywhere in the document  |
| jsPDF   | Chrome         | Redirection    | Noisy             | Redirects target to visit given URL upon clicking anywhere in the document                        |
| jsPDF   | Acrobat        | Simple Autorun | Noisy             | Upon opening the PDF document, an injected JS code will run without further user interaction      |
| jsPDF   | Chrome         | Exfiltration   | Somewhat Stealthy | Makes the target submit a form with all the words in a selected key-pair value to a given server  |
| PDFkit  | Acrobat        | Exfiltration   | Noisy             | Makes the target submit a form with all the words in a selected key-pair value to a given server  |

# Setup and Usage

## Prerequsites
- Ensure that nodejs is installed
- Ensure that the target environment PDF Viewer has JavaScript enabled

## Install necessary npm modules
``` npm install argparse pdfkit jspdf@2.1.1 chalk@2.4.1 tree-kill```

## Running the main script
1. Open terminal
2. Change to directory containing all 3 files
3. run `node main.js --help`

#### Helpful commands
- View installed npm modules `npm list`
- View help command/syntax `node main.js -h`
<br>`usage:  node main.js -l,--lib [jsPDF|PDFkit [-L,--list]] -e,--exploit [-o,--output] [-u,--URI]`
- View available available exploits for 'jsPDF' library `node main -l jsPDF -L`

# Limitations
1. Requires access to target machine
2. Exfiltration of data requires it to be unencrypted
3. PDF JavaScript function getPageNthWord has a bug of not returning the first word of every new line 

# Demo Video
A Video Demo can be viewed here: https://www.youtube.com/watch?v=fQdYMTGDiLU
