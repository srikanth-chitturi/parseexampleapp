$(function() {

	Parse.$ = jQuery;

	// Replace this line with the one on your Quickstart Guide Page
	Parse.initialize("N7iEd4UsrBfExFr00uAUiFoBrsVEeWNsgJDyPJno");
	Parse.serverURL = window.location.origin + '/parse';

	
	$('.form-signin').on('submit', function(e) {

		// Prevent Default Submit Event
		e.preventDefault();

		// Get data from the form and put them into variables
		var data = $(this).serializeArray(),
			username = data[0].value,
			password = data[1].value;

		// Call Parse Login function with those variables
		Parse.User.logIn(username, password, {
			// If the username and password matches
			success: function(user) {

				$.ajax({
					url: "/save",
					type: "POST",
					dataType: "json",
					data: {
						objectData: user
					},
					cache: false,
					timeout: 5000,
					complete: function() {
						//called when complete
						console.log('process complete');
					},

					success: function(data) {
						console.log(data);
						console.log('process sucess');
						 if (typeof data.redirect === 'string')
                    	 window.location = data.redirect
					},

					error: function() {
						console.log('process error');
					},
				});

			},
			// If there is an error
			error: function(user, error) {
				console.log(error);
				$("div.message").text(error.message);
			}
		});

	});


	$('.form-signup').on('submit', function(e) {

		// Prevent Default Submit Event
		e.preventDefault();

		// Get data from the form and put them into variables
		var data = $(this).serializeArray(),
			username = data[0].value,
			password = data[1].value;


		Parse.User.signUp(username, password, {}, {
			success: function(user) {
				console.log(user);

				$.ajax({
					url: "/save",
					type: "POST",
					dataType: "json",
					data: {
						objectData: user
					},
					cache: false,
					timeout: 5000,
					complete: function() {
						//called when complete
						console.log('process complete');
					},

					success: function(data) {
						console.log(data);
						console.log('process sucess');
						 if (typeof data.redirect === 'string')
                    	 window.location = data.redirect
					},

					error: function() {
						console.log('process error');
					},
				});

			},

			error: function(user, error) {
				console.log(error);
				$("div.message").text(error.message);
				//alert('error occured');
			}
		});

	});

});