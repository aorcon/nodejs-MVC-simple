function Person(a, b, name){
	var a = a;
	// this.a = b;
	this.yell=function(){ console.log("Internal foo is "+a+"\nExternal foo is "+this.a) } 
}
var fo1 = new Person('a', 'b', 'c');
Person.prototype.a = 12;
fo1.yell();
Person.prototype.a = 13;
fo1.yell();
