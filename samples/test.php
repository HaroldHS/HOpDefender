<!DOCTYPE html>
	<head>
		<title>
			Test HOpDefender.js
		</title>
		<!-- Make sure to insert the HOpDefender.js inside "head" tag -->
		<script src="HOpDefender.js"></script>
		<!-- Here is the example of all features in HOpDefender.js -->
		<script>
			function runAllFeatures(){
				// Create a new object
				var code_ = new HOpDefender();
				// Run all features
				var a = code_.sanitize(document.getElementById("input1").value, "BLOCK_JAVASCRIPT");  // Make sure for block type is a string
				var b = code_.filter(document.getElementById("input2").value);
				/*
				 * Print all the results to the div tags
				 *
				 * NOTE : For sandbozedSanitizing, dont forget to use appendChild ( sandboxedSanitizing returns an iframe which is an object )
				 *
				 */
				 document.getElementById("input1").value = a;
				 document.getElementById("input2").value = b;
				 document.getElementById("myForm").submit();
			}
		</script>
	</head>
	<body>
		<table align="center" style="text-align: center;">
			<form method="GET" action="" id="myForm">
				<tr>
					<td colspan="2">
						<br><h1><b>Testing page for HOpDefender.js</b></h1><br>
					</td>
				</tr>
				<tr>
					<td>
						Sanitize : 
					</td>
					<td>
						<input type="text" id="input1" name="data1" size="140"><br>
					</td>
				</tr>
				<tr>
					<td>
						Filter : 
					</td>
					<td>
						<input type="text" id="input2" name="data2" size="140"><br>
					</td>
				</tr>
				<tr>
					<td colspan="2">
						<!-- For submitting the form, you an event or other tricks -->
						<!-- The point is you need to sanitize the data first in client side, then submit the data to the server -->
						<br><input type="submit" value="TEST" onclick="runAllFeatures()">
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
	</body>
</html>