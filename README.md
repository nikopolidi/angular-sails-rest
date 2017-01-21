# angular-sails-rest

##Manage your sails blueprint and create API interfaces for your models in a few seconds.
less code - more time. More time - more beer =D

Installation
-------------
To execute all unit tests, use:

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

## Usage Example

Now it's time for the most enjoyable thing. Usage example!

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
			// call custom action getCustomers at
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