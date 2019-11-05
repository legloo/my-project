var ntko;//控件对象

//初始化去打开文档
function  init(cmd){
	ntko = document.getElementById("TANGER_OCX");
	if (cmd == 1)
	{
		//ntko.OpenFromURL("ntkocreatnew.docx");		
	}
	else
	{
		if(cmd==5){
			ntkoBrowser.ntkoSetReturnValueToParentPage("ntkoSendDataToChildtext","ntko");
			//ntko.OpenFromURL("aboutus.docx");
		}else{
			//ntko.OpenFromURL("aboutus.docx");			
		}		
	}			
}

window.zhuyuhao = 'zhuyuhao___';
window.open_doc = function(name){
	ntko = document.getElementById("TANGER_OCX");
	ntko.OpenFromURL(name);		
}