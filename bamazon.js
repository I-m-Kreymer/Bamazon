var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  customerPrompt();
});
var chosenItem;
var customerPrompt = function() {
	connection.query("SELECT * FROM products",function(err,res){
		  inquirer.prompt({
	      name: "choice",
	      type: "rawlist",
	      choices: function(value) {
	        var choiceArray = [];
	        for (var i = 0; i < res.length; i++) {
	          choiceArray.push(res[i].product_name);
	        }
	        return choiceArray;
	        },
	      message:"Which item would you like to buy?"
	}).then(function(answer){
		console.log(answer);
		for (var i = 0; i < res.length; i++) {
       	
        if (res[i].product_name === answer.choice) {
          chosenItem = res[i];
          console.log(chosenItem.product_name + " Price:$" + chosenItem.price +" Quantity Avail:" + chosenItem.stock_quantity);
          
          count(answer, chosenItem.stock_quantity);	
     	 }
     	 
  		}
  	   })
	})
}

var count = function(product,quantity) {
 	 	inquirer.prompt({
 	 		name:"quantity",
 	 		type:"input",
 	 		message: "How many items would you like to buy?"
 	 	}).then(function(answer){
 	 		var buyQuantity = parseFloat(answer.quantity);
 	 		if(buyQuantity > chosenItem.stock_quantity) {
 	 			console.log("That order is bigger than we can fullfill.");
 	 			customerPrompt();
 	 		}
 	 		else{
 	 			
 	 			var newQuantity = quantity-answer.quantity;
 	 			connection.query("UPDATE products SET ? WHERE ?",
 	 				[
 	 				 {stock_quantity:newQuantity},
 	 				 {product_name:product.choice}
 	 				],function(err,res){
 	 					console.log("You purchased "+ answer.quantity + " " + product.choice);
 	 					customerPrompt();
 	 				});
 	 			
 	 		}
 	 	})
}