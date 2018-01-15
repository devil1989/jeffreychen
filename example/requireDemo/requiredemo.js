

//入口文件必须要用require，有了require这个入口以后，其他的“模块文件”引用其他模块文件，就可以用define了，但是入口文件必须用require，
//公司lizard的入口文件用了define，因为lizard自己先给入口文件包了一层require，入口文件必须用require，重要的事情得多说几遍
require(['mydefine'], function(mydefine) {
	console.log(mydefine);
});

//requirejs中的接口函数功能
// 1、requirejs， 引入定义的模块，并执行callback的代码
// 2、require，只引入，不执行

// 3、define，定义一个模块
define([], function () {
	return {
		age:24
	};
});