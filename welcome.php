<?php
   include('session.php');
?>
<html>
   
   <head>
      <title>Welcome </title>
	  <link rel="stylesheet" href="styles/Welcome.css">
   </head>
   
   <body>
		<div id = "navBar">
			<a href = "welcome.php" style = "text-decoration:none; color:white"><button type = "button"  class="navBarButtons">Home</button></a>
			<a href = "8by8.html" style = "text-decoration:none; color:white"><button type = "button"  class="navBarButtons">Play 8x8</button></a>
			<a href = "10by10.html" style = "text-decoration:none; color:white"><button type = "button"  class="navBarButtons">Play 10x10</button></a>
			<a href = "Leaderboard.html" style = "text-decoration:none; color:white"><button type = "button"  class="navBarButtons">Leaderboard</button></a>
			<a href = "help.html" style = "text-decoration:none; color:white"><button type = "button"  class="navBarButtons">Help</button></a>
			<a href = "contactUs.html" style = "text-decoration:none; color:white"><button type = "button"  class="navBarButtons">Contact Us</button></a>
			<a href = "index.php" style = "text-decoration:none; color:white"><button type = "button"  class="navBarButtons">Sign Out</button></a>
		</div>
      <h1>Welcome <?php echo $login_session; ?>!</h1> 
	  <h3>This website was built by Amanda Balker, as part of a CSCI 130 project at Fresno State.</h3>
	  <h3>Look around as you please! You can play a game on an eight by eight board or on a ten by ten board.</h3>
	  <h3>To take a look at the leaderboard of Checkers players, please visit the "Leaderboard"! Here you will find the top scores!</h3>
	  <h3>New to the game? Take a look at our "Help" tab to get an overview of the game, as well as its rules!</h3>
	  <h3>If you notice anything wrong in the game, feel free to reach out to me using the information in the "Contact Us" page, I appreciate any feedback!</h3>
	  

   </body>
   
</html>