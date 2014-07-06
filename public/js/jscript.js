jQuery(function($){
		var socket = io.connect(),
				nickForm = $('#setNick'),
				nickError	= $('#nickError'),
				nickBox = $('#nickname'),
				confirmed = $('#confirmedNick'),
				users = $('#users'),
				messageForm = $('#send-message'),
				messageBox = $('#message'),
				chat = $('#chat ul');
		

	
	nickForm.on('submit',function(e){
			e.preventDefault();
			var u = nickBox.val();
			if( u.length == 0 ){
				alert("Error! You must insert a valid nickname");
				return false;
			}
			
			socket.emit('new user', u, function(data){
				if(data) {
					$('#setNick').hide();
					$('#jumbo .toHide').hide();
					nickError.hide();
					confirmed.css('display','inline').html("you're chatting with <b>" + u + "</b> username");
				} else {
					nickError.html('That username is already taken! Try again');
				}
			});
		});
		
		socket.on('usernames', function(data){
			var html = '',
					icon = '<span class="glyphicon glyphicon-user"> '
			for ( i=0; i< data.length; i++){
					html += icon + data[i] + '</span><br/>'
			}
			users.html(html);
		});
		
		messageForm.submit(function(e){
			e.preventDefault();
			socket.emit('send message', messageBox.val());
			messageBox.val('');
		});

		socket.on('new message', function(data){
			chat.append('<li><b>'+ data.nick +': </b>' + data.msg + "</li>");
		});
	});