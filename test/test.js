
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function pad(str, len, car) {
	car = car || ' ';
	var p = new Array(len + 1).join(car);
	return (str.toString() + p).substring(0, len);
}

function logNode(node, end) {
	var str;
	var len   = 0;
	var line  = '';
	var args  = node.args;
	var depth = 0;

	var log = {
		end: end,
		children: [],
		depth: 0,
		str: '',
		line: '',
		len: 0
	};

	if (args) {
		line = '├';
		var prev = null;
		for (var i = 0; i < args.length; i++) {
			var arg = args[i];
			var res = logNode(arg, end && i === args.length - 1);
			len += res.len;
			depth = Math.max(depth, res.depth + 1);
			if (prev) line += pad('', prev.len - 1, '─') + (i === args.length - 1 ? '┐' : '┬');
			prev = res;
			log.children.push(res);
		}
	}
	if (node.id) {
		str = node.id.toString() + ' ';
	} else if (node.value) {
		str = node.value.toString() + ' ';
	} else {
		str = '░ ';
	}
	len = Math.max(str.length, len);
	str = pad(str, len);
	line = pad(line, len);

	log.str   = str;
	log.line  = line;
	log.len   = len;
	log.depth = depth;

	return log;
}

function logExpression(str) {
	console.log('%c' + str, 'background-color: #FCC');

	var node  = logNode(parseExpression(str), true);
	var depth = node.depth;
	var stack = [];
	var str   = '';
	var line  = '';

	node.depth = 0;
	stack.unshift(node);

	while (node = stack.pop()) {
		
		var children = node.children;
		if (children.length === 0 && node.depth < depth) {
			// pad leaf to tree max depth
			var padding = pad('', node.len, ' ');
			node.line = padding;
			children.push({
				str: padding,
				line: '',
				end: node.end,
				children: [],
				len: node.len
			});
		}

		str  += node.str;
		line += node.line;
		if (node.end) {
			str += '\n' + line + '\n';
			line = '';
		}

		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			child.depth = node.depth + 1;
			stack.unshift(child);
		}
	}
	console.log(str);
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

function div(text, x, y, xp, yp) {
	var dom = document.createElement('div');
	DOCUMENT_BODY.appendChild(dom);
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
	var str = ' ';
	var xx  = x + w / 2

	if      (node.id)    str = node.id.toString();
	else if (node.value) str = node.value.toString();

	div(str, xx, y, xp, yp);

	var args = node.args;
	if (args) {
		for (var i = 0, len = args.length, width = w / len; i < len; i++) {
			var arg = args[i];
			htmlDisplay(arg, width, x + i * width, y + 40, xx, y);
		}
	}
}

function displayExpression(str) {
	div(str, 0, 0, 0, 0, 0);
	htmlDisplay(parseExpression(str), 800, 0, 10, 400, 10);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// TEST

displayExpression('(add5 + b) * 2 - MAX(x, y, 4 * rot)');

logExpression('(add5 + b) * 2 - MAX(x, y, 4 * rot)');
logExpression('add5 * (b + 2) - MAX(x, y, (4 + g) * rot)');
logExpression('MAX(x, rot, 4, y)');
logExpression('3 + b * 2');
logExpression('a * 3 + b * 2');
