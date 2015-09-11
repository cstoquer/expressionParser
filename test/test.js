
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function pad(str, len, car) {
	car = car || ' ';
	var p = new Array(len + 1).join(car);
	return (str.toString() + p).substring(0, len);
}

function consoleDisplay(node) {
	var stack = [];
	stack.unshift(node);
	var str = '';

	while (node = stack.pop()) {
		str += node._log;
		// str += node._line;
		if (node._end) str += '\n';
		var args = node.args;
		if (args) {
			for (var i = 0; i < args.length; i++) {
				var arg = args[i];
				stack.unshift(arg);
			}
		}
	}
	console.log('%c' + str, 'background-color: #F99;')
}


function logNode(node) {
	var str;
	var len  = 0;
	var line = '';
	var args = node.args;
	if (args) {
		line = '├';
		for (var i = 0; i < args.length; i++) {
			var arg = args[i];
			var res = logNode(arg);
			len  += res.len;
			if (i > 0) line += pad('', res.len - 1, '─') + (i === args.length - 1 ? '┐' : '┬');
		}
		if (node._end) arg._end = true;
		line += ' '
	}
	if (node.id) {
		str = node.id.toString();
	} else if (node.value) {
		str = node.value.toString();
	} else {
		str = '░';
	}
	len = Math.max(str.length + 1, len);
	str = pad(str, len);
	node._log  = str;
	node._line = line;

	return { len: len };
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var DOCUMENT_BODY = document.getElementsByTagName('body')[0];
var canvas = document.createElement('canvas');
DOCUMENT_BODY.appendChild(canvas);
canvas.width  = 800;
canvas.height = 800;
var ctx = canvas.getContext('2d');
ctx.strokeStyle = '#FCC';
ctx.lineWidth = 2;

function div(text, x, y, xp, yp, parent) {
	parent = parent || DOCUMENT_BODY;
	var dom = document.createElement('div');
	parent.appendChild(dom);
	dom.innerText = text;
	dom.style.left = ~~x - 5 + 'px';
	dom.style.top  = ~~y - 5 + 'px';
	dom.className = 'node';
	ctx.moveTo(~~xp, ~~yp);
	ctx.lineTo(~~x, ~~y);
	ctx.stroke();
	return dom;
}

function htmlDisplay(node, w, x, y, xp, yp) {
	str = ' ';
	if (node.id) {
		str = node.id.toString();
	} else if (node.value) {
		str = node.value.toString();
	}
	var xx = x + w / 2
	div(str, xx, y, xp, yp);

	var args = node.args;
	if (args) {
		for (var i = 0, len = args.length, width = w / len; i < len; i++) {
			var arg = args[i];
			htmlDisplay(arg, width, x + i * width, y + 40, xx, y);
		}
	}
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

function logExpression(str) {
	var expr = parseExpression(str);
	// TODO
	console.log(expr);
	// expr._end = true;
	// logNode(expr);
	// consoleDisplay(expr);
	htmlDisplay(expr, 800, 0, 10, 400, 10);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// TEST


// var p = new Parser().fromString('bla00');
// console.log(p.isNextString('bla000'))


// logExpression('(add5 + b) * 2 - MAX(x, y, 4 * rot)');
logExpression('add5 * (b + 2) - MAX(x, y, (4 + g) * rot)');
// logExpression('MAX(x, y, 4, rot)');
// logExpression('a * 3 + b * 2');
