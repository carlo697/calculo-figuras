const defaultStep = 0.1;
const defaultMin = 0.0;
const defaultMax = Math.Infinity;

/*					Circle					*/

function Circle() {
	this.name = "Circulo";
	this.parameters = {
		radius: {
			name: "Radio",
			value: 1.0
		}
	}
}

Circle.prototype.applyImage = function(image) {
	image.outerHTML = '<svg class="form-img" height="100" width="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="black" />';
}

Circle.prototype.updateResults = function() {
	const radiusInput = document.getElementById("radius");
	const radius = Number(radiusInput.value);

	document.getElementById("perimeterResult").textContent = (2 * Math.PI * radius).toFixed(5);
	document.getElementById("areaResult").textContent = (Math.PI * Math.pow(radius, 2)).toFixed(5);
}


/*					Square					*/
function Square() {
	this.name = "Cuadrado";
	this.parameters = {
		width: {
			name: "Ancho",
			value: 1.0
		},
		height: {
			name: "Alto",
			value: 2.0
		}
	}
}

Square.prototype.applyImage = function(image) {
	image.innerHTML = '<svg class="form-img" width="100" height="100"><rect width="100" height="100" style="fill:black;stroke-width:3;stroke:rgb(0,0,0)" /></svg>';
	image.children[0].children[0].id = "rect";
}

Square.prototype.updateResults = function() {
	const width = Number(document.getElementById("width").value);
	const height = Number(document.getElementById("height").value);

	document.getElementById("perimeterResult").textContent = ((width * 2) + (height * 2)).toFixed(5);
	document.getElementById("areaResult").textContent = (width * height).toFixed(5);

	const rect = document.getElementById("rect");

	const rel = width / height;

	let _width = 0;
	let _height = 0;

	if (rel >= 1.0) {
		_width = 100;
		_height = _width / rel;
	} else {
		_height = 100;
		_width = _height * rel;
	}

	rect.setAttribute("width", _width);
	rect.setAttribute("height", _height);

}


/*					Regular Polygon					*/
function Polygon() {
	this.name = "Poligono";
	this.parameters = {
		sides: {
			name: "Numero de lados",
			value: 5,
			step: 1,
			min: 3
		},
		sideLength: {
			name: "Lado",
			value: 1
		}
	}
}

Polygon.prototype.applyImage = function(image) {
	image.innerHTML = '<svg class="form-img" height="100" width="100"><polygon points="50,0 100,50 50,100 0 50" style="fill:black;stroke:black;stroke-width:3" /></svg>';

	image.children[0].children[0].id = "polygon";
}

Polygon.prototype.updateResults = function() {
	const sides = parseInt(document.getElementById("sides").value);

	const sideLength = parseFloat(document.getElementById("sideLength").value);

	document.getElementById("perimeterResult").textContent = (sideLength * sides).toFixed(4);
	
	const apotema = sideLength / (2 * Math.tan(Math.degToRad((360 / sides) / 2)));
	const area = (sides * sideLength * apotema) / 2;
	document.getElementById("areaResult").textContent = area.toFixed(4);

	const polygon = document.getElementById("polygon");

	const length = 40;

	const points = [];


	const centerX = 50;
	const centerY = 50;

	for (var i = 1; i <= sides + 1; i++) {
		const angle = (360 / sides) * (i + 1);

		let x = 0;
		let y = 0;

		const rad = angle * (Math.PI / 180);

		if (angle <= 90) {
			x = length * Math.cos(Math.degToRad(angle));
			y = length * Math.sin(Math.degToRad(angle));
		} else if (angle <= 180) {
			x = -length * Math.cos(Math.degToRad(180 - angle));
			y = length * Math.sin(Math.degToRad(180 - angle));
			
		} else if (angle <= 270) {
			x = -length * Math.cos(Math.degToRad(angle - 180));
			y = -length * Math.sin(Math.degToRad(angle - 180));
		} else {
			x = length * Math.cos(Math.degToRad(360 - angle));
			y = -length * Math.sin(Math.degToRad(360 - angle));
		}

		points.push([centerX + x, centerY - y]);
	}

	let final = "";

	for (var i = 0; i < points.length; i++) {
		final += `${points[i][0]},${points[i][1]} `;
	}

	polygon.setAttribute("points", final);
}

Math.degToRad = function(degrees) {
	return degrees * (Math.PI / 180);
};



function capitalize (s) {
	if (typeof s !== 'string') {
		return '';
	}

	return s.charAt(0).toUpperCase() + s.slice(1)
}


const select = document.getElementById("shapeSelect");
select.onchange = onSelectShape;

const imgParent = document.getElementById("imageParent");
const paramsParent = document.getElementById("paramsParent");

const shapes = [
	new Polygon(),
	new Circle(),
	new Square()
]

let currentShape;

// Remove options from the select
for (var i = 0; i < select.children.length; i++) {
	select.children[i].remove();
}

// Add options to the select
for (var i = 0; i < shapes.length; i++) {
	let figure = shapes[i];

	const option = document.createElement("option");
	option.innerHTML = figure.name;

	select.appendChild(option);
}

// Update the page with the new figure
onSelectShape();

function onSelectShape() {

	for (var i = 0; i < shapes.length; i++) {
		if (shapes[i].name == select.value)
		{
			currentShape = shapes[i];
			console.log("A figure has been selected");
			console.log(shapes[i]);
			break;
		}
	}

	// Add the image of the geometric figure.
	imgParent.innerHTML = "";
	const imgChild = document.createElement("div");
	imgParent.appendChild(imgChild);

	// Set the image
	currentShape.applyImage(imgChild);

	// Remove the parameters
	paramsParent.innerHTML = "";

	// Add the parameters of the shape.
	for (let key in currentShape.parameters) {
		let value = currentShape.parameters[key];

		const div = document.createElement("div");
		div.className = "param-row";
		div.innerHTML = '<label for="radius">Radio (r):</label><input id="radius" type="number" name="radius" value="1.0" step="0.1">';

		const label = div.children[0];
		label.textContent = capitalize(value.name) + ":";

		const input = div.children[1];
		input.value = value.value;
		input.id = key;

		input.oninput = function () {
			currentShape.updateResults();
		}

		if ("min" in value) {
			input.min = value.min;
		} else {
			input.min = defaultMin;
		}

		if ("max" in value) {
			input.max = value.max;
		} else {
			input.max = defaultMax;
		}

		if ("step" in value) {
			input.step = value.step;
		} else {
			input.step = defaultStep;
		}

		if ("onCreate" in value) {
			value.onCreate(label, input);
		}

		paramsParent.appendChild(div);
	}

	currentShape.updateResults();
}