/*This file contains many functions that can be used to
add a wonderful dropdown to a p5 canvas!!!

follows instructions for use:

Instructions for use are in the file dropdownDocs.md in the same directory
*/
function makeCheckbox(parent) {
    /*Takes a row object as an argument and returns this object:
    {"label": label, "checkbox": checkBox} where both label and checkbox are html objects*/
    if (arguments.length == 0) {
        parent = document.body;
    };

    //Now since we must have a parent
    let cbContainer = document.createElement("label");
    cbContainer.className += "cbContainer";
    parent.appendChild(cbContainer);

    //now we make labels and checkbox
    let label = document.createElement("span");
    label.innerHTML = "Property";
    cbContainer.appendChild(label);

    let checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    cbContainer.appendChild(checkBox);

    let obj = {
        "label": label,
        "checkbox": checkBox
    };

    obj.setLabel = (newlabel) => {
        label.innerHTML = newlabel;
    };
    obj.getLabel = () => label;
    obj.getCheckbox = () => checkBox;
    obj.remove = () => {
      cbContainer.parentElement.removeChild(cbContainer);
    };
    return obj;
};

function makeRow(parent) {
    //Makes a row in the returned element from makeItem
    let row = document.createElement("li");
    parent.appendChild(row);

    row.setLabel = (label) => {
        row.innerHTML = label;
    };

    return row;
};


function makeItem(parent) {
    /*Takes the dropdown object as an argument and returns
    an item object that can hold row objects in the dropdown.

    To change the label of this object you can use:
    item.parentElement.children[1].innerHTML = "your title" */

    //First make a variabel responsable for naming rows
    if (typeof ddItemCount == "undefined") {
        window.ddItemCount = 0; //It is a global variable
    };

    //This function let's you define rows in a parent.
    //This parent could be the returned element of makeDropdown OR
    //a row from another ITEM.
    let item = document.createElement("div");
    item.className = "item";
    parent.appendChild(item);

    //Differenciates between droped and normal states
    let itemCheck = document.createElement("input");
    itemCheck.type = "checkbox";
    itemCheck.id = "checkbox" + ddItemCount; //Needed for labels
    item.appendChild(itemCheck);

    //Making the label
    let itemCheckLabel = document.createElement("label");
    itemCheckLabel.innerHTML += String(ddItemCount);
    itemCheckLabel.setAttribute("for", "checkbox" + ddItemCount);
    ddItemCount++;
    //Increase itemCount by one!!!
    item.appendChild(itemCheckLabel);


    //Making a container for the rows
    /*THIS IS THE PARENT FOR THE ROWS!!!!!!*/
    let rowContainer = document.createElement("ul");
    item.appendChild(rowContainer);

    rowContainer.setLabel = (label) => {
        itemCheckLabel.innerHTML = label;
    };

    rowContainer.getLabel = () => itemCheckLabel;
    rowContainer.remove = () => {
        rowContainer.parentElement.remove()
    };

    rowContainer.open = ()=>{itemCheck.checked = true;};
    rowContainer.close = ()=>{itemCheck.checked = false;};

    return rowContainer;
};

function makeDropdown(canvas) {
    /*Takes a canvas object as an argument and returns
    a dropdown element, which can hold item elements from makeItem()

    In order for this funciton to work, it must be used AFTER the canvas
    is placed in its final container.

    To change the name of the dropdown do:
    dropdown.parentElement.children[1].innerHTML = "Your title"*/
    let div = document.createElement("div");

    //Creating a canvas container for easier placement!!!
    let canvasContainer; //Only ysed if canvas is in body
    if (document.body == canvas.elt.parentElement || canvas.elt.parentElement == document.body.getElementsByTagName("main")[0]) {
        canvasContainer = document.createElement("div");
        canvasContainer.id = "VeryUniqueOriginalCanvasContainer";
        document.body.appendChild(canvasContainer);

        canvas.elt.parentNode.removeChild(canvas.elt);
        canvasContainer.appendChild(canvas.elt);
        //Leaving canvas without a parent for the "if" statement
    } else {
        canvasContainer = canvas.elt.parentElement;
    };

    let positionContainer = document.createElement('div');
    positionContainer.id = "SomeCreativeID"; //CSS reasons
    canvasContainer.appendChild(positionContainer);

    //This contains the ENTIRE dropdown.
    let ddContainer = document.createElement('div');
    ddContainer.className = "ddContainer";
    positionContainer.appendChild(ddContainer);

    //Now we make the dropdown Button
    let mainDdButton = document.createElement("input");
    mainDdButton.type = "checkbox";
    mainDdButton.id = "Root";
    ddContainer.appendChild(mainDdButton);

    let mainDdButtonLabel = document.createElement("label");
    mainDdButtonLabel.setAttribute("for", "Root");
    mainDdButtonLabel.style = "font-size: 1.5em; margin-left: 1em;";
    mainDdButtonLabel.innerHTML = "Options";
    ddContainer.appendChild(mainDdButtonLabel);

    //This is the parent elemnt for any "ITEM" elements you make
    let ddContents = document.createElement("div");
    ddContents.className = "dd";
    ddContainer.appendChild(ddContents);

    ddContents.setLabel = (label) => {
        mainDdButtonLabel.innerHTML = label;
    };

    ddContents.getLabel = () => mainDdButtonLabel;
    ddContents.remove = () => {
        ddContents.parentElement.remove();
    };
    ddContents.open = ()=>{mainDdButton.checked = true;};
    ddContents.close = ()=>{mainDdButton.checked = false;};

    return ddContents; //This is the parent of ITEM!!!
};

function makeSlider(parent, max = 100, min = 0, step = .1, value = 2, title) {
    /*Returns the container that has 3 elements accesible by
    element.children[index]. Where index=0: title,
    index=1: slider, index=2: number;
    This is the returned object:
    {"label": sliderTitle, "slider": slider, "valueLabel": sliderValue}
    */
    if (typeof numberSliders == "undefined") {
        window.numberSliders = 0;
    };
    let sliderContainer = document.createElement("div");
    sliderContainer.classList.add("sliderContainer");
    sliderContainer.id = `slider${numberSliders}`;

    let sliderTitle = document.createElement("span");
    sliderTitle.className = "sliderTitle";
    sliderTitle.innerHTML = "slider" + numberSliders++;
    if (title != undefined) {
        sliderTitle.innerHTML = title;
    };

    let slider = document.createElement("input");
    slider.type = "range";
    slider.class = "slider";

    slider.max = max;
    slider.min = min;
    slider.value = value;
    slider.step = step;

    slider.oninput = () => {
        sliderValue.innerHTML = slider.value;
    };

    let sliderValue = document.createElement("span");
    sliderValue.innerHTML = slider.value;
    sliderValue.className = "rangeValue";

    sliderContainer.appendChild(sliderTitle);
    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(sliderValue);

    parent.appendChild(sliderContainer);


    let obj = {
        "label": sliderTitle,
        "slider": slider,
        "valueLabel": sliderValue
    };

    obj.setTitleLabel = function title(titlelabel) {
        //The label to the left of slider
        this.label.innerHTML = titlelabel;
    };
    obj.setValueLabel = function Valuelabel(newLabel) {
        //Set the new value label to a slider
        this.valueLabel.innerHTML = newLabel;
    };
    obj.getSlider = function getSlider() {
        //Returns the slider contained in the html object
        return this.slider;
    };
    obj.remove = () => {
        sliderContainer.remove();
    };
    //Removes slider

    obj.setParameters = function sliderValues(max = 100, min = 0, step = .1, value = 2) {
        let slider = this.slider;
        slider.max = max;
        slider.min = min;
        slider.step = step, slider.value = value;
        this.valueLabel.innerHTML = String(value);
    };
    obj.getValue = function getValue() {
        return this.slider.value;
    };

    obj.updateValueLabel = ()=>{
      sliderValue.innerHTML = String(slider.value);
    };
    return obj;
};

function buttonContainer(parent) {
    /*This function works a little differently from the others
    This function must be instanciated by new.

    buttonCont = new buttonContainer(row);

    this instanciation can hold up to 3 buttons. Which are added using
    buttonCont.makeButton(), which returns an html button element*/

    if (parent == undefined) {
        alert("YOU need to place this inside a row!");
        return null;
    };

    let container = document.createElement("div");
    parent.appendChild(container);
    container.style = parent.style;
    container.style["padding"] = "0";
    container.style['display'] = "flex";
    container.style['min-width'] = "100%";

    this.container = container;

    this.makeButton = (label, func) => {
        let button = document.createElement("button");
        container.appendChild(button);
        button.innerHTML = label;
        button.onclick = func;
        return button;
    };
    this.remove = () => {
        this.container.remove()
    };

};


function setPedroStyle(canvas) {
    //Sets the CSS required for the dropdown


    //Canvas is the element you get from createCanvas();
    let id; //Necesary for canvas positioning
    if (arguments.length == 0) {
        id = "VeryUniqueOriginalCanvasContainer";
    } else {
        id = canvas.elt.parentNode.id;
        //In case canvas is already inside another element.
    };
    //NOW THE CSS
    var style = document.createElement('style');
    style.innerHTML = `
        /*Making it go inside the canvas*/
        #SomeCreativeID{
          position: absolute;
          display: flex;
          min-width: 17em;
          max-height: 100%;
          z-index: 99;
          overflow-y: auto;
          overflow-x: hidden;
          margin-left: auto;
          right: 0%;
        }
        #SomeCreativeID>div{
          padding-left: 0;
        }

        #${id}{
          position:relative;
          background-color: darkgray;
          display: inline-flex;
        }

        /*functionality*/
        .item, li, label{
          cursor: pointer;
          z-index: 3;
        }

        /*Functionality*/
        .ddContainer>input[type="checkbox"], .dd>.item>input[type=checkbox], .item>ul, .dd{
          display: none;
        }

        #Root:checked ~ .dd, .item>input:checked ~ ul{
          display: block;
        }

        #Root:checked ~ label{
          background-color: #222;
        }

        #Root:checked ~ label::before, .item>input:checked ~ label::before{
          transform: rotate(-90deg);
          display: inline-block;
          transition-duration: .2s;
          transform: rotate(-180deg);
        }

        #Root:not(:checked) ~ label::before, .item>input:not(:checked)~label::before{
          transform: rotate(-90deg);
          display: inline-block;
          transition-duration: .2s;
        }

        /*Making it pretty*/
        .ddContainer{
          background-color: none;
          display: inline-flex;
          width: 100%;
          height: 100%;
          padding: 0;
          flex-direction: column;
          font-size: .99em;
          color:white;
          font-family: sans-serif;
        }

        .ddContainer>label{
          min-height: 1.5em;
          font-weight: 600;
          display: flex;
          margin: 0;
          padding: 0;
          align-items: center;
          justify-contents: center;
          border-radius: 0.2em;
        }
        .item{
          margin: 0;
          padding: 0;
        }

        .item>ul>li>.item>input{
          display: none;
        }

        .item>ul>li>.item, .item>ul>li>.item>*{
          width: 100%;
        }


        .item>label{
          font-weight: 600;
          font-size: 1em;
          padding-left: 0.3em;
          background-color: #222;
          display: flex;
          align-items: center;
          border-bottom: 0.05em solid #333;
          border-top: 0.05em solid #333;
          border-radius: 0.2em;
          margin-top: 0.025em;
          margin-bottom: 0.05em;
          padding: 0.5em;
          min-height: 1.5em;
        }


        div.item>ul>li{
          border-radius: 0.2em;
          min-height: 2em;
          padding-left: .4em;
          padding-right: 1em;
          margin-top: 0;
          margin-bottom: 0;
          background: #222;
          display: flex;
          align-items: center;
          font-size: .8em;
        }

        .item>label::before, .ddContainer>label::before{
          content: "‹";
          margin-left: 0.4em;
          margin-right: 0.4em;
        }


        .item>ul{
          list-style: none;
          padding-left: 9%;
          margin: 0;
          min-height: 1em;
          background-color: #222;
          border-radius: .2em;
        }

        .item>ul>li:hover, .item:hover ~ ul, .item>label:hover{
          background-color: #333;
        }

         label:hover{
          transform: scale(1.01);
          background-color: #333;
        }

        /* width */
        #SomeCreativeID::-webkit-scrollbar{
          width: .5em;
        }

        /* Handle */
        #SomeCreativeID::-webkit-scrollbar-thumb {
          background: #666;
        }

        /* Handle on hover */
        #SomeCreativeID::-webkit-scrollbar-thumb:hover {
          background: #444;
        }


        /*NOW WE HAVE THE SLIDERS*/
        .rangeValue, .sliderTitle{
          display: flex;
          text-align: center;
          margin: 0;
          width: 30%;
          padding: 0;
        }
        .rangeValue{
          width: 10%;
          padding-left: 6%;
        }

        .sliderContainer{
          display: flex;
          justify-content: space-around;
          align-items: center;
          color: white;
          margin: 0em;
          padding: .4em;
          border-radius: 0.5em;
          width: 100%;
          opacity: 0.85;
        }

        .sliderContainer:hover{
          opacity:1;
        }

        .sliderContainer>input[type=range]{
          -webkit-appearance: none;
          background: transparent;
          width: 50%;
        }
        .sliderContainer>input[type=range]:focus {
          outline: none;
        }
        .sliderContainer>input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: .3em;
          cursor: pointer;
          background: #3071a9;
          border-radius: .9em;
          border: .05em solid #010101;
        }
        .sliderContainer>input[type=range]::-webkit-slider-thumb {
          border: 1px solid #000000;
          height: 1.3em;
          width: 1.3em;
          border-radius: 1.3em;
          background: #ffffff;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -0.55em;
          transition-duration: .2s;
        }

        .sliderContainer>input[type=range]::-webkit-slider-thumb:hover{
          transform: scale(1.1);
        }
        .sliderContainer>input[type=range]::-moz-range-thumb:hover{
          transform: scale(1.1);
        }

        .sliderContainer>input[type=range]::-ms-thumb:hover{
          transform: scale(1.1);
        }

        .sliderContainer>input[type=range]::-moz-range-track{
          width: 100%;
          height: .3em;
          cursor: pointer;
          background: #3071a9;
          border-radius: .9em;
          border: .05em solid #010101;
        }

        .sliderContainer>input[type=range]::-moz-range-thumb {
          border: 1px solid #000000;
          height: 1.3em;
          width: 1.3em;
          border-radius: 1.3em;
          background: #ffffff;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -0.55em;
          transition-duration: .2s;
        }

        .sliderContainer>input[type=range]::-ms-track {
         width: 100%;
          height: .3em;
          cursor: pointer;
          background: #3071a9;
          border-radius: .9em;
          border: .05em solid #010101;
        }
        .sliderContainer>input[type=range]::-ms-fill-lower {
          background: #2a6495;
          border: 0.2px solid #010101;
          border-radius: 2.6px;
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        }
        .sliderContainer>input[type=range]::-ms-fill-upper {
          background: #3071a9;
          border: 0.2px solid #010101;
          border-radius: 2.6px;
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        }
        .sliderContainer>input[type=range]::-ms-thumb {
         border: 1px solid #000000;
          height: 1.3em;
          width: 1.3em;
          border-radius: 1.3em;
          background: #ffffff;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -0.55em;
          transition-duration: .2s;
        }

        /*NOW TIME FOR CHECKBOXES*/
        .cbContainer{
          display: flex;
          min-height: 2em;
          width: 100%;
          height: 100%;
          color: white;
          align-items: center;
          opacity: 0.8;
          transition-duration: .2s;
        }
        .cbContainer:hover{
          opacity: 1;
        }

        .cbContainer input[type=checkbox]{
          margin-left: auto;
          margin-right: .5em;
        }

        .cbContainer span{
          margin-left: .5em;
          margin-right: auto;
        }

        .item ul li button {
          border-radius: .4em;
          background-color: #333;
          border: .1em solid grey;
          outline: none;
          color: #ccc;
          transition-duration: .2s;
          font: inherit;
          font-weight: 600;
          padding: .2em .4em .2em .4em;
          width: 30%;
          margin: .2em;
        }

        .item ul li button:hover {
          color: white;
          background: #444;
        }
        `;
    document.head.appendChild(style);
};
let setDropdownStyle = setPedroStyle;
