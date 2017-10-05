(function(){
	
	angular.module('ngSailsRest', [])
	.provider("$ngSailsRest", ngSailsRestProvider)
	.factory("$sailsRest", ngSailsRestFactory);

	function ngSailsRestProvider(){
		
		var api_url = "",
		sails_socket_enabled = false;

		function setApiUrl(url){
			api_url = url
		}
		function getApiUrl(){
			return api_url;
		}
		
		return {
			$get: function(){
				return {
					/*
					global configuration
						@api_url: "http://someurl.com"
						// true -> use $sails socket connection
						// false -> use $http
						@sails_socket_enabled: Boolean 
					*/
					config: {
						api_url: api_url,
						sails_socket_enabled: false
					}
				};
			},
			setApiUrl: setApiUrl,
			getApiUrl: getApiUrl
		}
	}
	ngSailsRestFactory.$inject=['$ngSailsRest', '$http', '$q', '$httpParamSerializer'];

	function ngSailsRestFactory($ngSailsRest, $http, $q, $httpParamSerializer){
		
		var config = $ngSailsRest.config
		var api_url = config.api_url

		return {
			model: function (model_name, _socket_enabled, _api_url){
				if(!api_url && !_api_url) console.error("$ngSailsRest api_url is not provided. Please use $ngSailsRest.setApiUrl('http://your_api_url') on your module.config")
				this.config = {
					api_url: _api_url ? _api_url : api_url,
					endpoint: api_url[api_url.length-1] === "/" ? api_url+model_name : api_url+="/"+model_name,
					sails_socket_enabled: _.isUndefined(_socket_enabled) ? config.sails_socket_enabled : _socket_enabled
				};
				this.findOne = findOne;
				this.find = find;
				this.create = create;
				this.update = update;
				this.destroy = destroy;
				this.custom = custom;
				this._buildPath = _buildPath;

				function _handleReject(res){
					var deferred = $q.defer();
					if(!res){
						return deferred.reject("API not available: "+api_url);
					}else if(res.data){
						return deferred.reject(res.data);
					}else{
						return deferred.reject(res);
					}
				};

				function _buildPath(endpoint, query){
					
					if(!_.isEmpty(query) && _.isObject(query)){

						return endpoint+"?"+$httpParamSerializer(query);

					}else if(_.isString(query) && !_.isEmpty(query)){

						return endpoint+"?"+$httpParamSerializer({id: query});

					}else{

						return endpoint;
					}
				};
				/*
				@TODO: handle headers
				*/
				function custom(action){
					var that = this;

					return {
						get: getFn,
						post: postFn,
						put: putFn,
						delete: deleteFn
					};

					function getFn(body, headers){
						customAction('get', action, body,headers)
					};
					function postFn(body, headers){
						customAction('post', action, body,headers)
					};
					function putFn(body, headers){
						customAction('put', action, body,headers)
					};
					function deleteFn(body, headers){
						customAction('delete', action, body,headers)
					};

					function customAction(method, action, body,headers){
						if(method) method = method.toLowerCase()
						if(action && action[0] != '/') action = '/'+action

						var deferred = $q.defer();
						var path = that._buildPath(that.config.endpoint + action)

						if(that.config.sails_socket_enabled){

							console.log('$sails mode not implemented yet in that version')
							/*promise = $sails.get(path).then(function(res){
								deferred.resolve(res.data)
							}, deferred.reject)*/
						}else{
							var req = {
								method: method,
								url: path,
								headers: headers ? headers : void(0),
								data: _.isEmpty(body) ? void(0) : body
							}
							
							$http(req).then(function(res){

								deferred.resolve(res.data)

							})
							.catch(_handleReject)
						}

						return deferred.promise;
					}
					// sanitize inputs
					
				}
				

				function findOne(id){

					var deferred = $q.defer();
					var path = that._buildPath(endpoint + '/'+id)

					if(that.config.sails_socket_enabled){

						console.log('sails socket not implemented on that packege yet')
						/*promise = $sails.get(path).then(function(res){
							deferred.resolve(res.data)
						}, deferred.reject)*/
					}else{

						$http.get(path)
						.then(function(res){

							deferred.resolve(res.data)

						})
						.catch(_handleReject)
					}
					return deferred.promise;
				};

				function find(query){
					var that = this
					var deferred = $q.defer();
					var path = that._buildPath(that.config.endpoint, query)
					
					if(that.config.sails_socket_enabled){

						console.log('$sails mode not implemented yet in that version')
						/*promise = $sails.get(path).then(function(res){
							deferred.resolve(res.data)
						}, deferred.reject)*/
					}else{

						$http.get(path).then(function(res){

							deferred.resolve(res.data)

						})
						.catch(_handleReject)
					}
					return deferred.promise;
				};

				function update(data){
					var that = this
					var deferred = $q.defer();
					var sanitize_data = _.omit(data, 'id')
					var path = that._buildPath(that.config.endpoint + '/' +data.id)

					if(that.config.sails_socket_enabled){

						console.log('$sails mode not implemented yet in that version')
						/*promise = $sails.put(path, sanitize_data).then(function(res){
							deferred.resolve(res.data)
						}, deferred.reject)*/
					}else{

						$http.put(path, sanitize_data).then(function(res){

							deferred.resolve(res.data)
						})
						.catch(_handleReject)
					}
					return deferred.promise;
				};

				function create(data){
					var that = this
					var deferred = $q.defer();
					var sanitize_data = _.omit(data, 'id')
					var path = that._buildPath(that.config.endpoint)
					var promise
					if(that.config.sails_socket_enabled){
						console.log('$sails mode not implemented yet in that version')
						/*promise = $sails.post(path, sanitize_data).then(function(res){
							deferred.resolve(res.data)
						}, deferred.reject)*/
					}else{
						promise = $http.post(path, sanitize_data).then(function(res){

							deferred.resolve(res.data)
						})
						.catch(_handleReject)
					}
					return deferred.promise;
				};

				function destroy(query){
					var that = this
					var deferred = $q.defer();
					// var sanitize_data = _.omit(data, 'id')
					var path = that._buildPath(that.config.endpoint, query)

					if(that.config.sails_socket_enabled){
						console.log('$sails mode not implemented yet in that version')
						/*promise = $sails.delete(path).then(function(res){
							deferred.resolve(res.data)
						}, deferred.reject)*/
					}else{
						$http.delete(path).then(function(res){

							deferred.resolve(res.data)
						})
						.catch(_handleReject)
					}
					return deferred.promise; 
				};
			}
		};
		
	};

})();