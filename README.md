# Attack-with-PDF

Attack with PDF is an offensive tool created during the 2206 project. The intent of this tool is to generate an offensive PDF that can be uploaded to a target machine to exfiltrate data. The tool is wholly written in javascript and contains the following:

# Direcotry Tree
|-- README.md  
|-- main.js  
|-- PDFKit_template.js  
|-- jsPDF_template.js  


# Program and Purpose
| Name            | Version | Description                                                                       |
|-----------------|---------|-----------------------------------------------------------------------------------|
| main            | 1       | - Takes users input and calls relevant function(s) to generate an exploitable PDF |
| PDFKit_template | 1       | - Contains functions to create exploits available to the PDFKit library           |
| jsPDF_template  | 1       | - Contains functions to create exploits available to the jsPDF library            |

# Setup and Usage

## Prerequsites
- Ensure that nodejs is installed
- Ensure that the target environment PDF Viewer has JavaScript enabled

## Install necessary npm modules
``` npm install argparse pdfkit jspdf@2.1.1 ```

## Running the main script
1. Open terminal
2. Change to directory containing all 3 files
3. run `node main.js --help`

#### Heulpful commands
- View installed npm modules `npm list`
- View available available exploits for 'jsPDF' library `node main -l jsPDF -L`
- Example creating a pdf causing the user to redirect to http.tacocat.tk when clicking anywhere on the document `node main -l jsPDF -e redirection -o cute-cat-document -u http.tacocat.tk`
