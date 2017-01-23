# angular-sails-rest

##Manage your sails blueprint and create API interfaces for your models in a few seconds.
less code - more time. More time - more beer =D

Installation
-------------
to install using bower:

   bower install angular-sails-rest --save 


## Initialization


Initialize and configure 'ngSailsRest' module to your app

```javascript
	// initialize ngSailsREst module
	var yourApp = angular.module("yourAppName",[
		'ngSailsRest',
		...
	])
	// setup your api url
	.config(function($ngSailsRestProvider){
		
		$ngSailsRestProvider.setApiUrl("http://your-api-url.com")
	})
```
## Methods

var Service = $sailsRest.model('model_name')
		Everything starts here
Service.find(Object)
		Accepts query object. If you are using blueprint API make sure you wrap your query into `{where:{/*here*/}}`
Service.findOne(id)
		Find document by id
Service.update(Object)
		Update record. Make sure you did nit omit 'id' from that object
Service.create(Object)
		Object to create new record
Service.destroy(id || [id,id])
		Destroys object or objects
Service.custom("your_custom_action")["METHOD_NAME"](params, headers)
		Where "METHOD_NAME" is get, put, post, delete
		i.e.: `Service.custom('your_custom_action').post({object})`
		will generate POST request to http://your_url.com/model_name/your_custom_action


## Usage Example

Now its time for the most enjoyable thing. Usage example!

```javascript
	// create service for user model
	yourApp.service("UserService", function($sailsRest),{
		var UserService = new $sailsRest.model("user")
		/*
		by default service has sails blueprint methods available:
			.findOne(id), .find(Object), .create(Object), .destroy(id || [ids]), .update(Object)
		and in addition .custom("action").get/put/delete/post/(body, headers)
		*/

		return UserService;
	})
```
Thats it! Really! You dont have to repeat yourself by typing tons of code
## More Examples

```javascript
yourApp.service("UserService", function($sailsRest),{
	var UserService = new $sailsRest.model("user")
	UserService.getCustomers = function(){
		// this custom action will generate GET request to http://your-api-url.com/user/getCustomers
		return UserService.custom("getCustomers").get()
	}

	return UserService
})

yourApp.controller("UserController", function(UserService, $rootScope, $q){
	var vm = this
	// imagine that we have logged in user in $rootScope.USER namespace
	vm.values = {
		users: [],
		current_user: null
	}

	function activate(){
		
		$q.all({
			// get current user record
			user: UserService.findOne($rootScope.USER.id),
			// this custom action will generate GET request to http://your-api-url.com/user/getCustomers
			current_user: UserService.getCustomers()
		})
		.then(function(results){
			console.log(results.user)
			/*
				{
					id: 1,
					name: "King Of Everything",
					role: "admin"
				}
			*/
			console.log(results.users)
			vm.values = results
		})
		.catch(function(err){
			// error object is response.data object or string
			console.error(err)
		})
	}

	activate()
})
```
#TODO
* update factory to handle sails socket connection
* update docs
* write tests