//  adapted from Krasimir Tsonev's 20 line template engine
//  http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line

var TemplateEngine = function(tpl, data) {
		var re = /<%([^%>]+)?%>/g,
		    code = 'var r=[];\n',
		    cursor = 0,
		    match;

		while(match = re.exec(tpl)) {
			code+= addHTML(tpl.slice(cursor, match.index));
			code+= addJS(match[1]);
			cursor = match.index + match[0].length;
		}
		code += addHTML(tpl.substr(cursor, tpl.length - cursor));
		code += 'return r.join("");'; // <-- return the result
		return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
}

function addHTML(line) {
	//  double backslash all double quotes
	return 'r.push("' + line.replace(/"/g, '\\"') + '");\n';
}

function addJS(line) {
	if(line.match(/(^(\s)?(if|for|else|switch|case|break|{|}))(.*)?/g)){
		return line + '\n';
	} else {
		return 'r.push(' + line + ');\n';
	}
}
