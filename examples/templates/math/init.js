
var myJOBAD; 
$(function(){
	myJOBAD = new JOBAD($(".ltx_page_main"));

	myJOBAD.modules.load("mathjax.mathjax", function(suc){
		myJOBAD.Setup.enable();

		//Fold all ltx sections. 
		myJOBAD.Folding.enable($("div.ltx_section"), {
			"preview": function(element){
				return element.find(".ltx_title").eq(0).clone();
			}
		});

		
		myJOBAD.Folding.enable($("div.ltx_para"), {"preview": "Paragraph", "height": 20});


		myJOBAD.Folding.enable(myJOBAD.element, {
			"preview": $("#idp32240").clone()
		});
	});

})