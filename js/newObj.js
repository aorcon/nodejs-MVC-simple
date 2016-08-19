function Person(a, b, name){
	var a = a;
	// this.a = b;
	this.yell=function(){ console.log("Internal foo is "+a+"\nExternal foo is "+this.a) } 
}

Person.prototype.bb = function(c){
	this.a = c;
}
Person.prototype.a = 6;
Person.a = 9;

Child.prototype = new Person();

var foo = new Person(1, 2, 3);
foo.yell();
foo.bb(3);
foo.yell();
var fo1 = new Person('a', 'b', 'c');
console.log('...............')
Person.prototype.a = 12;
foo.yell();
fo1.yell();
Person.prototype.a = 13;
fo1.yell();
fo1.a = 7;
fo1.yell();
foo.yell();
console.log(Person.a);