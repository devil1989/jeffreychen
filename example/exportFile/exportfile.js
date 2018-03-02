// //指定页面区域内容导入Word
// function CellAreaExcel(arr) {
// 	var excel = new ActiveXObject("Excel.Application");
// 	var excelWorkBooks = excel.Workbooks.Add();
// 	var excelContent = excelWorkBooks.ActiveSheet; //具体的excel内容api
// 	for (i = 0; i < arr.length; i++) {//多少行
// 		for (j = 0; j < arr[i].length; j++) {
// 			excelContent.Cells(i + 1, j + 1).value = arr[i][j];
// 		}
// 	}
// 	excel.Visible = true;
// }

// //table转excel （不支持ie）
// function tableToExcel(tableId, name) {
// 	var uri = 'data:application/vnd.ms-excel;base64,';
// 	var excelConfig={
// 		"fileName":name,
// 		"innerName":
// 	}
// 	// var template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>';//不支持改名
// 	var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head>'
// 				   +'<!--[if gte mso 9]><?xml version="1.0" encoding="UTF-8" standalone="yes"?><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:'+excelConfig.innerName+'>{worksheet}</x:'+excelConfig.innerName+'><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->'
// 				   +'</head><body><table>{table}</table></body></html>';//支持改名
// 	var table = document.getElementById(tableId);
// 	var replaceConfig={
// 		worksheet: name || 'Worksheet',
// 		table: table.innerHTML//和template中的{table}关联
// 	};

// 	var content=template.replace(/{(\w+)}/g,function(m, p) {//https://www.jianshu.com/p/31bebd90fd1d函数使用
// 		//m为整个配的字符串，p为里面的子匹配组，如果有多个子分组，那么依次为多个匹配项，接着的参数是第一个匹配的下标（如果多次执行，下标会变），接下来的参数就是字符串本身
// 		return replaceConfig[p];//m="{table}",p="tabel",这个函数是把匹配到的所有{table}替换成table.innerHTML（即c[p]）
// 	});

// 	window.location.href = uri + window.btoa(unescape(encodeURIComponent(content)));
// }


// //导出csv文件（其实和excel文件差不多）
// //https://www.cnblogs.com/dojo-lzz/p/4837041.html
// function exportCsv(obj) {
// 	var title = obj.title;//title ["","",""]
// 	var titleForKey = obj.titleForKey;//titleForKey ["","",""]
// 	var data = obj.data;
// 	var str = [];

// 	str.push(obj.title.join(",") + "\n");
// 	for (var i = 0; i < data.length; i++) {
// 		var temp = [];
// 		for (var j = 0; j < titleForKey.length; j++) {
// 			temp.push(data[i][titleForKey[j]]);
// 		}
// 		str.push(temp.join(",") + "\n");
// 	}

// 	var blob = new Blob(["\ufeff"+data], { type: 'text/csv,charset=UTF-8' });//ufeff用于支持中文
// 	var csvUrl = URL.createObjectURL(blob);  

// 	//创建a元素，执行click事件，删除a元素
// 	var element = document.createElement("a");
// 	element.href = csvUrl;
// 	element.download = obj.name+".csv";//设置下载文件名称
// 	document.body.appendChild(element);
// 	element.click();//执行a元素的click事件，触发的是a标签的默认click事件
// 	document.body.removeChild(element);
// }


/*
 time:2018/01/19
 author:jiajiechen
 description:export the excel file(.cvs)
 */

//导出excel（.csv文件）
function ExportFile(opts){
	this.name = opts.name||this.getDefaultName();
	this.data=opts.data;
	this.download();
}
ExportFile.prototype={
	getDefaultName:function(){
		var name=20180115;
		var date=new Date();
		var year=date.getFullYear();
		var month=(date.getMonth()+1);
		var day=date.getDate();
		return "学生名单_"+year+(month<10?("0"+month):month)+day;
	},
	
	getIEVersion:function(){
		var isOpera=navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") == -1;
		var isIE = navigator.userAgent.indexOf("compatible") > -1 && navigator.userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览
		var fIEVersion = navigator.userAgent.substring(30, 31);
		
		if(/Edge\/12/.test(navigator.userAgent)){
			fIEVersion=12;
		}
		return {
			isIE:isIE,
			version:fIEVersion
		}
	},

	//分行使用“\n”，分列使用","
	getText:function(){
		var str="";
		var data=this.data;//[[],[],[]] 第一行就是title
		for (var i = 0; i < data.length; i++) {
			for (var j = 0; j < data[i].length; j++) {
				str+=this.transInnerStr(data[i][j])+",";
			}
			str+="\n";
		}
		return str;
	},

	//文本中自带了",\r\n等特殊字符，需要用引号把他们包起来，否则会导致cvs把他们解析出换行或者换列等错误（尤其要注意原来就自带的单个引号，如果给引号外面添加引号，会导致错误）
	//例如sdf"ds用引号包起来，变成了"sdf"ds",这样会导致错误的分隔，所以如果是单独的",需要把它改成两个引号""
	transInnerStr:function(value){
		var textField = '"';
		if (!value && typeof value !== "number") {
			value = "";
		}
		if (value && /[",\r\n]/g.test(value)) {
			value = textField + value.replace(/(")/g, '""') + textField;
		}
		return value;
	},

	download: function() {
		var browser=this.getIEVersion();
		var isIE=browser.isIE;
		var ver = browser.version;
		var filename = this.name;
		var text = this.getText();
		if (isIE&& ver < 10) {
          // has module unable identify ie11 and Edge
          var oWin = window.top.open("about:blank", "_blank");
          oWin.document.write('sep=,\r\n' + text);
          oWin.document.close();
          oWin.document.execCommand('SaveAs', true, filename+".csv");
          oWin.close();
        }
		else if (isIE&&ver > 10&&ver < 12) {
			var BOM = "\ufeff";
			var csvData = new Blob([BOM + encodeURIComponent(text)], {//encodeURIComponent转化可以正确解析内容
				type: 'text/csv'
			});
			navigator.msSaveBlob(csvData, filename);
		} else { //ie13以上或者其他浏览器，可以通过a标签实现
			var element = document.createElement("a");
			element.href = this.getUrl(text);
			element.download = this.name+".csv";//设置下载文件名称
			document.body.appendChild(element);
			if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") == -1) {//"safari浏览器"
				var click_ev = document.createEvent("MouseEvents");
				click_ev.initEvent("click", true /* bubble */ , true /* cancelable */ );
				element.dispatchEvent(click_ev);
			} else {
				element.click();
			}
			document.body.removeChild(element);
			
		}
	},
	getUrl: function(text) {
		var BOM = "\ufeff";
		if (window.Blob && window.URL && window.URL.createObjectURL) {
			var csvData = new Blob([BOM + text], {
				type: 'text/csv,charset=UTF-8'
			});
			return URL.createObjectURL(csvData);
		} else {
			return 'data:attachment/csv;charset=UTF-8,' + BOM + encodeURIComponent(text);
		}
	}

}


new ExportFile({
	// name:"jeffrey",
	data: [["第一列", "第二列"],["123","fff"],["456","ss"],["854","jeffrey"]]
});