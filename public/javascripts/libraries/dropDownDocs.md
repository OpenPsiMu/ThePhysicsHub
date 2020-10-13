
This file contains many functions that can be used to
add a wonderful dropdown to a p5 canvas!!!

follows instructions for use:

INSTRUCTION MANUAL FOR DROPDOWN
---------------

### 1. Creating the dropdown:
**Syntax**:
`makeDropdown()`;

**Description:**
Creates dropdown and places it in the same container as the p5.canvas that gets passed in as an argument.				

**Arguments:**
p5.canvas

**Returns:**
html `<div>` element with special internal functionality for addition of items to the dropdown.

**Observations:**
- This function relies on the placement of the p5 canvas relative to the body of the document. MAKE SURE TO ONLY USE IT AFTER THE CANVAS IS IN ITS FINAL CONTAINER.
- The returned object has the methods `.open()`, `.close()`, and `.setLabel("Text")`. Which open, close or set a label to the dropdown respectively.
- After creating the dropdown it will look horrendous. Use the function `setDropdownStyle()` to make it look pretty.

**Example:**
```javascript
//Note that this uses p5 library!
function setup(){
	const canvas = createCanvas(200, 200);
	const dd = makeDropdown(canvas);
	dd.setLabel("Your label");
	dd.open();//Opens the dropdown
	dd.close();//Closes the dropdown
	setDropdownStyle();//Implements css
};
```

### 2. Adding items to the dropdown
**Description:**
To add items to the dropdown, you must make use of the function `makeItem()`;

**Arguments:**
html div returned by `makeDropdown()`;

**Returns:**
html `<ul>` element with the added functionality for the dropdown and special methods `.setLabel()`, `.open()` and `.close()`. You can find more information about these methods in section 1.

**Example:**
```javascript
//Note that this uses p5 library!
function setup(){
	...
	const dd = makeDropdown(canvas);//Making dropdown
	const item1 = makeItem(dd);
	item1.setLabel("Your label");//Sets label
	item1.open();//Shows contents
	item1.close();//Hides contents
	...
};
```

### 3. Adding rows to dropdown Item
**Description:**
To add a row to an html `<ul>` item, which is returned by `makeItem()`,
you must make use of the function `makeRow()`.

**Arguments:**
html `<ul>` item returned by `makeRow()`.

**Returns:**
html `<li>` row element with the method `.setLabel()` attached. This method is used to change the text inside this row.

**Example:**
```javascript
//Note that this uses the library p5
function setup(){
	...
	let dd = makeDropdown(canvas);
	let item1 = makeItem(dd);
	let item1Row1 = makeRow(item1);
	item1Row1.setLabel("Myrow"); //Sets label
	...
};
```
**Observations:**
- This is the element where the magic happens. Inside an `<ul>` row element you can place widgets. The functions to create these widgets are `makeSlider()`, `makeCheckBox()` and `buttonContainer()`. These functions are explained in better detail over the next sections.
- Furthermore, you use the `<li>` row element as the argument of the function  `makeItem()` . This way you can make _nested_ dropdowns. It is really fancy.


### 4. Adding sliders
**Description:**
To add a dropdown inside a row element. Simply use the function `makeDropdown()` and pass in the row where you want it to reside as an argument.

**Arguments:**
 - html `<li>` row element
 - Maximum value of slider of slider
 - Minimum value of the slider
 - Increment step
 - Initial value
 - Label/title

**Syntax:**
`makeSlider(parent, max = 100, min = 0, step = .1, value = 2, title)`
*Note*: This comes directly from where this function is defined.

**Returns:**
Typeless object that acts as a container to the html elements that form the slider and the labels around it. This object has the following methods:
 - `.setTitleLabel("txt")` -> Changes the text on the left hand side of the slider
- `.getTitleLabel("txt")` -> Returns the current text on the left hand side of the slider
 - `.setValueLabel("000")` -> Changes the text on the right hand side of the slider
 - `.getValueLabel()` -> Returns the current text on the right hand side of the slider
 - `.getSlider()`->returns the html slider object
 - `.remove()`->removes slider from the dropdown
 - `.getValue()`->returns current value of the slider
 - `.setParameters(max, min, step, value)` ->Sets the parameters on to the html slider
 - `.updateValueLabel() ->Updates the label to the right of the slider`

**Example:**			
```javascript
//Note that this makes use of the p5 library
function setup(){
	...
	const sliderContainer = makeSlider(rowElement);
    sliderContainer.setTitleLabel("The text on the left of slider");
    sliderContainer.setValueLabel("The text on the right of slider");
    sliderContainer.slider;// returns the slider HTML element;
    sliderContainer.getSlider();// also returns the html element;
    sliderContainer.getValueLabel();// returns valueLabel html element"text on the right";
    sliderContainer.getTitleLabel() returns the text element in the left of the slider;
```

### 5 Adding checkboxes to the dropdown:
**Description:**
	The function `makeCheckbox()` returns an object that holds a checkbox with labels. Its use follows the same logic as the dropdown

 **Example:**
 ```javascript
//Note that this uses p5
function setup(){
	...
	const cb = makeCheckbox(row); //cb={"label": label, "checkbox": checkBox};
	cb.setLabel("My label");
	cb.getLabel();//Returns html element
	cb.getCheckbox();//Returns html element
	cb.remove();
};
```
### 6. Adding buttons:
**Description:**
  To add a button it is necessary to create a container designed for buttons. To make such a container use `new buttonContainer(row)`. Where row is a row (`<li>`) of an item (`<ul>`) element!

**Example:**
```javascript
//Notice that this uses the p5 library
function setup(){
	const buttonContainer1 = new buttonContainer(row);
	const button1 = buttonContainer1.makeButton(label, func);
	//Here label is the name inside the button and func is the function performed by the button when it is pressed.
	//button1 is an html element so you can do whatever you want with it. Examples below:
	button1.innerHTML= "my title";
	button1.onclick = function (){"do something"};
	button1.style = 'write your own css here';
};
```
## EXAMPLE OF WORKFLOW:
```javascript
function setup(){
	//Creating canvas and dropdown
	let canvas = createCanvas(500, 400);
	let dd = makeDropdown(canvas);

	//Changing the name of dropdown button
	dd.setLabel("LOOK LABEL");

	//Setting style
	setDropdownStyle(canvas);

	//Further adding to the dropdown
	let item1 = makeItem(dd);
	let row1 = makeRow(item1);
	let sliderContainer = makeSlider(row1);
	let slider = sliderContainer['slider'];
	//OR
	slider = sliderContainer.getSlider();

	//Using slider as we wish:
	slider.max = 200;
	slider.min = 100;
	slider.step = 0.1;
	slider.value = 150;

	//This step can also be performed using sliderContainer.setParameters(max, min, step, value);
	sliderContainer.setParameters(200, 100, .1, 150);

	//We give a function to the slider
	slider.oninput = () => {
		/*Some fun stuff*/
		slider.updateValueLabel();
	};
	//Updates the text to the new slider value
	sliderContainer.setValueLabel('NAN');

	//Updates the text on the left hand side of the slider.
	sliderContainer.setTitleLabel("TITLE");

	//Making a row
	let checkBoxRow = makeRow(item1);

	//Making a checkbox
	let checkBoxContainer = makeCheckbox(checkBoxRow);

	//Giving it a fancy name
	checkBoxContainer.setLabel("Mybox");
	//Removing it
	//checkBoxContainer.remove();


	//Now we make a row
	let buttonRow = makeRow(item1);

	//Now we make a buttonContainer
	const buttonContainer1 = new buttonContainer(buttonRow);

	//Now we make a button
  const func = ()=>{/*Do stuff*/};
	const button1 = buttonContainer1.makeButton("label", func);
  const button2 = buttonContainer1.makeButton("label", func);

	//This is an html button, you can proceed as you would in pure html
	button1.innerHTML= "my title";
	button1.onclick = function (){"do something"};
	button1.style = 'write your own css here';
};
```


## Additional information:
if you want to add another dropdown inside a row of an item you can simply use `makeItem()`, and the supply your row as an argument.
Lastly, if you get stuck with something, either reach out in the discord chat OR try to figure  it out. One technique that will help a lot is using `console.log()` on objects you do not understand. This will reveal what they are and what information they keep.

# Happy CODING
