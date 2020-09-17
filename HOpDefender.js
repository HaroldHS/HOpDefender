/*

MIT License

Copyright (c) 2020 Harold H. S.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

/*
 * Program : HOpDefender.js, manual client side security program with javascript
 *
 * Author : Harold H. S.
 *
 * Version : 1.0
 * 
 * FAQ / Q&A  :  1. How it works? - For sanitizer, this program will create a DOMParser class, traverse all the html tags and remove dangerous tags & attributes
 *                                - For filter, this program will encode the input with HTML entities by using a textarea element
 *
 *               2. Why using DOMParser? DOMParser interprets the input as a real document ( in an environment that allows javascript but doesn't
 *                  execute javascript on the active window / web page. If you put a script tag inside DOMParser, DOMParser can parse / use / access the
 *                  script tag but doesn't run / execute it ).
 *
 *               3. Why this program called manual client side security program? Because you dont need to install any 3rd party libraries to run this program.
 *                  Just run it manually using a script tag in your html code and this program was written by me manually.
 *
 *               4. Does this program works 100% safely? No, maybe there are bugs in the parser because of some inputs ( eg: mutation XSS, and etc. )
 *                  or even bugs on the source code.
 *
 *               5. The main goal of this program? This program mainly created by me to share some knowledges to other programmers about javascript,
 *                  parser, and how sanitizing / filtering works.
 *
 *               6. How many features in this program? There are 3 features which are sanitization, sandboxed sanitization, and filterization.
 *
 *               7. Advantages of this program? - You can use / learn this program easily
 *                                              - You can use this program to sanitize / filter the result of an ajax request ( in case of asynchronous request )
 *                                              - This program is really small
 *
 *               8. Disadavantages of this program? - There are bunch of better programs out there for sanitizing / filtering
 *                                                  - This program runs really slow for complex tags / input ( in case of sanitizing, not filtering )
 *
 *
 * NOTE : This program works for client side
 *
 */

var HOpDefender_is_present = true;

/*
 * NOTE : Look at test.html / test.php for how to use this class
 *
 */
class HOpDefender{

	constructor(){
		/*
		 * These are the whitelisted tags and attributes.
		 *
		 * NOTE : You can edit the whitelists for your own purposes.
		 *
		 */
		this.valid_attributes = ["style", "src", "href", "name", "id", "class", "title"];
		this.valid_html_tags = ["div", "span", "b", "u", "s", "p", "img", "a", "li", "ul", "ol"];
	}
	/*
	 * Call this function to filter / encode your input with htmlentities
	 *
	 */
	filter(data){
		// Create a textarea element
		var ccdd = document.createElement('textarea');
		// Encode the data with htmlentities using textarea
		ccdd.innerHTML = data;
		// Return the encoded data
		return ccdd.innerHTML;
	}
	/*
	 * Call this function to sanitize your input ( This function will return the sanitized version of your input )
	 *
	 * NOTE : There 4 types of block => - BLOCK_JAVASCRIPT, to block javascript uri in href attribute
	 *                                  - FORCE_HTTP, force the uri scheme in href attribute to be http ( by appending 'http://' at the start of href )
	 *                                  - FORCE_HTTPS, force the uri scheme in href attribute to be https
	 *                                  - FORCE_FTP, force the uri scheme in href attribute to be ftp
	 */
	sanitize(data, block_type){
		/*
		 * Create a DOMParser class and use html document mode
		 *
		 * NOTE : The reason why I use DOMParser is DOMParser automatically removes invalid / error tags. For example : <scr<b>Hello</b>ipt>alert(1)</script>
		 *        will be removed because the script tag is invalid eventhough the bold tag is valid.
		 *
		 */
		var b = new DOMParser().parseFromString(data, "text/html");
		var flag1 = false;
		var total_child1 = b.body.childElementCount;
		var aaa = 0;
		while(aaa<total_child1){
			if(flag1 == true){
					aaa -= 1;
					total_child1 -= 1;
					flag1 = false;
			}else{
				if(!this.valid_html_tags.includes(b.body.children[aaa].tagName.toLowerCase())){
					b.body.removeChild(b.body.children[aaa]);
					flag1 = true;
					aaa += 1;
				}else{
					var c = b.body.children[aaa].getAttributeNames();
					for(var j=0; j<c.length; j++){
						if(!this.valid_attributes.includes(c[j].toLowerCase())){
							b.body.children[aaa].removeAttribute(c[j].toLowerCase());
						}
						if(c[j].toLowerCase() == "href"){
							if (block_type != undefined){
								// Switch case for block_type
								switch(block_type){
									case "BLOCK_JAVASCRIPT":
										// Retrive the href value
										var ffgg = b.body.children[aaa].href;
										// Replace 'javascript:' with '[blocked]:'
										ffgg = ffgg.replace(/^javascript(\s)*:(\s)*/, "[blocked]:");
										// Change the href value with the edited one
										b.body.children[aaa].href = ffgg;
										break;
									case "FORCE_HTTP":
										var ffgg = b.body.children[aaa].href;
										// Append 'http://'
										ffgg = "http://" + ffgg;
										b.body.children[aaa].href = ffgg;
										break;
									case "FORCE_HTTPS":
										var ffgg = b.body.children[aaa].href;
										// Append 'https://'
										ffgg = "https://" + ffgg;
										b.body.children[aaa].href = ffgg;
										break;
									case "FORCE_FTP":
										var ffgg = b.body.children[aaa].href;
										// Append 'ftp://'
										ffgg = "ftp://" + ffgg;
										b.body.children[aaa].href = ffgg;
								}
							}
						}
					}
					// If there are children inside the tags, traverse all the children and sanitize them
					if(b.body.children[aaa].childElementCount !== 0){
						for(var o=0; o<total_child1; o++){
							this.recursiveChildSanitize(b.body.children[o], block_type);
						}
					}
					aaa += 1;
				}
			}
		}
		return b.body.innerHTML;
	}
	/*
	 * Call this function to sanitize your input and sandboxing it inside an iframe
	 *
	 * NOTE : You are just allowed to style the iframe, not your input
	 *
	 */
	sandboxedSanitizing(data, block_type, styling){
		// Sanitize the data / input
		if (block_type != undefined) {
	 		var aabb = this.sanitize(data, block_type);
	 	}else{
	 		var aabb = this.sanitize(data);
	 	}
	 	// Create an iframe
	 	var bbcc = document.createElement('iframe');
	 	// Enable sandboxing
	 	bbcc.sandbox = "";
	 	// Styling the iframe
	 	bbcc.style = styling;
	 	// Put the sanitized code inside the sandboxed iframe
	 	bbcc.srcdoc = aabb;
	 	// Return the sandboxed iframe that contains the sanitized data
	 	return bbcc;
	 }
	/*
	 * This function will traverse all tags and remove invalid tags and attributes
	 *
	 * NOTE : DO NOT ACCESS OR CHANGE THIS FUNCTION IF YOU DONT KNOW HOW IT WORKS AND HOW TO MODIFY IT
	 *
	 */
	recursiveChildSanitize(parentObject, block_type){
		// Base case ( If there is no child )
		if(parentObject.childElementCount == 0){
			// Remove all invalid attributes
			var aa = parentObject.getAttributeNames();
			for(var jj=0; jj<aa.length; jj++){
				if(!this.valid_attributes.includes(aa[jj].toLowerCase())){
					parentObject.removeAttribute(aa[jj].toLowerCase());
				}
				if(aa[jj].toLowerCase() == "href"){
					if (block_type != undefined) {
						switch(block_type){
							case "BLOCK_JAVASCRIPT":
								var ffgg = parentObject.href;
								ffgg = ffgg.replace(/^javascript(\s)*:(\s)*/, "[blocked]:");
								parentObject.href = ffgg;
								break;
							case "FORCE_HTTP":
								var ffgg = parentObject.href;
								ffgg = "http://" + ffgg;
								parentObject.href = ffgg;
								break;
							case "FORCE_HTTPS":
								var ffgg = parentObject.href;
								ffgg = "https://" + ffgg;
								parentObject.href = ffgg;
								break;
							case "FORCE_FTP":
								var ffgg = parentObject.href;
								ffgg = "ftp://" + ffgg;
								parentObject.href = ffgg;
						}
					}
				}
			}
			return;
		}else{
			var flag = false;
			var total_child = parentObject.childElementCount;
			var aa = 0;
			while(aa<total_child){
				if(flag == true){
					aa -= 1;
					total_child -= 1;
					flag = false;
				}else{
					// Remove all invalid children
					if(!this.valid_html_tags.includes(parentObject.children[aa].tagName.toLowerCase())){
						parentObject.removeChild(parentObject.children[aa]);
						flag = true;
						aa += 1;
					}else{
						// Remove all the children's invalid attributes
						var p = parentObject.children[aa].getAttributeNames();
						for(var q=0; q<p.length; q++){
							if(!this.valid_attributes.includes(p[q].toLowerCase())){
								parentObject.children[aa].removeAttribute(p[q].toLowerCase());
							}
							if(p[q].toLowerCase() == "href"){
								if (block_type != undefined) {
									switch(block_type){
										case "BLOCK_JAVASCRIPT":
											var ffgg = parentObject.children[aa].href;
											ffgg = ffgg.replace(/^javascript(\s)*:(\s)*/, "[blocked]:");
											parentObject.children[aa].href = ffgg;
											break;
										case "FORCE_HTTP":
											var ffgg = parentObject.children[aa].href;
											ffgg = "http://" + ffgg;
											parentObject.children[aa].href = ffgg;
											break;
										case "FORCE_HTTPS":
											var ffgg = parentObject.children[aa].href;
											ffgg = "https://" + ffgg;
											parentObject.children[aa].href = ffgg;
											break;
										case "FORCE_FTP":
											var ffgg = parentObject.children[aa].href;
											ffgg = "ftp://" + ffgg;
											parentObject.children[aa].href = ffgg;
									}
								}
							}
						}
						// Traverse all the children
						if(parentObject.children[aa].childElementCount !== 0){
							this.recursiveChildSanitize(parentObject.children[aa]);
						}
						aa += 1;
					}
				}
			}
		}
	}
}