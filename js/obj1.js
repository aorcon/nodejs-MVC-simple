var MYAPP = MYAPP || {};

var MYAPP.Person = function (firstName) {
  this.firstName = firstName;
};

MYAPP.Person.prototype.sayHello = function() {
  console.log("Hello, I'm " + this.firstName);
};

var person1 = new MYAPP.Person("Alice");
var person2 = new MYAPP.Person("Bob");

// call the Person sayHello method.
person1.sayHello(); // logs "Hello, I'm Alice"
person2.sayHello(); // logs "Hello, I'm Bob"