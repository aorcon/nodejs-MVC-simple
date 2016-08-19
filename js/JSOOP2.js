// Summary
// You cause a class to inherit using ChildClassName.prototype = new ParentClass();.
// You need to remember to reset the constructor property for the class using ChildClassName.prototype.constructor=ChildClassName.
// You can call ancestor class methods which your child class has overridden using the Function.call() method.
// Javascript does not support protected methods.

function Mammal(name){ 
	this.name=name;
	this.offspring=[];
} 
Mammal.prototype.haveABaby=function(){ 
	var newBaby=new Mammal("Baby "+this.name);
	this.offspring.push(newBaby);
	return newBaby;
} 
Mammal.prototype.toString=function(){ 
	return '[Mammal "'+this.name+'"]';
} 


Cat.prototype = new Mammal();        // Here's where the inheritance occurs 
Cat.prototype.constructor=Cat;       // Otherwise instances of Cat would have a constructor of Mammal 
function Cat(name){ 
	this.name=name;
} 
Cat.prototype.toString=function(){ 
	return '[Cat "'+this.name+'"]';
} 

Cat.prototype.haveABaby = function(){
	var baby =  Mammal.prototype.haveABaby.call(this);
	// var baby = super.haveABaby();
	alert("mew!");
	return baby;

}


var someAnimal = new Mammal('Mr. Biggles');
var myPet = new Cat('Felix');
alert('someAnimal is '+someAnimal);   // results in 'someAnimal is [Mammal "Mr. Biggles"]' 
alert('myPet is '+myPet);             // results in 'myPet is [Cat "Felix"]' 

var baby = myPet.haveABaby();                    // calls a method inherited from Mammal 
alert(myPet.offspring.length);        // shows that the cat has one baby now 
alert(myPet.offspring);            // results in '[Mammal "Baby Felix"]' 
alert("myPet's baby is " +baby);
alert(baby instanceof Mammal);
if (baby) alert(baby.toString());
function alert(v){
	console.log(v);
}
