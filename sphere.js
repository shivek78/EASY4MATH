var w = c.width = window.innerWidth,
		h = c.height = window.innerHeight,
		ctx = c.getContext( '2d' ),
		
		opts = {
			
			radius: 100,
			depth: 200,
			fl: 250,
			vpX: w / 2,
			vpY: h / 2,
			accuracy: 13,
		},
		
		tau = Math.PI * 2,
		rotation = 0,
		rotationSin = 0,
		rotationCos = 1,
		
		points = [],
		triangles = [];

for( var i = 0; i < opts.accuracy; ++i ){
	var y = opts.radius * Math.cos( Math.PI * ( i / opts.accuracy ) ),
			len = opts.radius * Math.sin( Math.PI * ( i / opts.accuracy ) );
	
	for( var j = 0; j < opts.accuracy; ++j ){
		var ang = j / opts.accuracy * tau,
				x = len * Math.cos( ang ),
				z = len * Math.sin( ang );
		
		points.push( new Point( x, y, z ) );
	}
}
for( var i = 0; i < opts.accuracy - 1; ++i ){
	for( var j = 0; j < opts.accuracy; ++j ){
		
		triangles.push( new Triangle( 
			points[ opts.accuracy * i + j ],
			points[ opts.accuracy * i + j + 1 ],
			points[ opts.accuracy * ( i + 1 ) + j + 1 ]
		));
		triangles.push( new Triangle( 
			points[ opts.accuracy * ( i + 1 ) + j ],
			points[ opts.accuracy * i + j ],
			points[ opts.accuracy * ( i + 1 ) + j + 1 ]
		));
	}
}

function Point( x, y, z ){
	
	this.x = x;
	this.y = y;
	this.z = z;
	
	this.screen = {};
	this.transformed = {};
}
Point.prototype.setTransformed = function(){
	
	this.transformed.y = this.y;
	this.transformed.x = this.x * rotationCos - this.z * rotationSin;
	this.transformed.z = this.z * rotationCos + this.x * rotationSin;
	
	this.transformed.z += opts.depth;
}
Point.prototype.setScreen = function(){
	
	this.screen.scale = opts.fl / this.transformed.z;
	this.screen.x = opts.vpX + this.transformed.x * this.screen.scale;
	this.screen.y = opts.vpY + this.transformed.y * this.screen.scale;
}
Point.prototype.draw = function(){
	
	ctx.fillStyle = 'black';
	ctx.beginPath();
	ctx.arc( this.screen.x, this.screen.y, this.screen.scale * 4, 0, tau );
	ctx.fill();
}
function Triangle( a, b, c ){
	
	this.points = [];
	this.points.push( a, b, c );
	
	this.color = 'hsla(hue,80%,50%,alp)'.replace( 'hue', Math.random() * 360 );
}
Triangle.prototype.draw = function(){
	
	ctx.fillStyle = this.color.replace( 'alp', 1 - 1 / this.points[ 0 ].screen.scale );
	ctx.beginPath();
	ctx.moveTo( this.points[ 0 ].screen.x, this.points[ 0 ].screen.y );
	ctx.lineTo( this.points[ 1 ].screen.x, this.points[ 1 ].screen.y );
	ctx.lineTo( this.points[ 2 ].screen.x, this.points[ 2 ].screen.y );
	ctx.fill();
}

function anim(){
	
	window.requestAnimationFrame( anim );
	
	rotation += .01;
	rotationCos = Math.cos( rotation );
	rotationSin = Math.sin( rotation );
	
	ctx.fillStyle = 'black';
	ctx.fillRect( 0, 0, w, h );
	
	for( var i = 0; i < points.length; ++i ){
		points[ i ].setTransformed();
		points[ i ].setScreen();
	}
	for( var i = 0; i < triangles.length; ++i )
		triangles[ i ].draw();
	
}
anim();
