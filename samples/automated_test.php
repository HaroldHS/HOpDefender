<!DOCTYPE html>
	<head>
		<title>
			Test for automated HOpDefender.js
		</title>
		<!-- Make sure to insert the HOpDefender.js inside "head" tag -->
		<script src="HOpDefender.js"></script>
	</head>
	<body>
		<table align="center" style="text-align: center;">
			<form method="GET" action="" id="HOpDefenderForm">
				<tr>
					<td colspan="2">
						<br><h1><b>Testing page for automated HOpDefender.js</b></h1><br>
					</td>
				</tr>
				<tr>
					<td>
						Sanitize : 
					</td>
					<td>
						<input type="text" class="inputSanitize" name="data1" size="140"><br>
					</td>
				</tr>
				<tr>
					<td>
						Filter : 
					</td>
					<td>
						<input type="text" class="inputFilter" name="data2" size="140"><br>
					</td>
				</tr>
				<tr>
					<td colspan="2">
						<br><input type="submit" value="TEST" id="submitForm">
					</td>
				</tr>
			</form>
		</table><br><br>
		<?php
			if (isset($_GET['data1']) or isset($_GET['data2'])){
				print "<div>".$_GET['data1']."</div><br>\n";
				print "<div>".$_GET['data2']."</div><br>\n";
			}
		?>
		<!-- You can add the script below to make sure that the client runs / has the HOpDefender.js file to prevent SELF XSS -->
		<script>
			if (!HOpDefender_is_present){
				// You can change this alert with anything you want
				alert("[-] HOpDefender.js not found");
			}
		</script>
		<!-- Make sure automate.js always at the bottom of the body -->
		<script src="automate.js"></script>
	</body>
</html>