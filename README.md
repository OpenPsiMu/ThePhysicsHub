# The Physics Hub

The Physics Hub is a website built by physics enthusiasts from a range of backgrounds,
serving as a place to view high school/undergraduate university-level physics simulations.
The simulations are currently written using the javascript library [p5.js](https://p5js.org/).
Everybody is welcome to contribute, no matter whether you're a beginner or an expert.


### Project Setup

The website is based on ExpressJS. The Node Package Manager [(npm)](https://www.npmjs.com/) will thus install most of the dependencies for you.

1. Install [NodeJS](https://nodejs.dev/)

2. In a terminal, run `npm install` to automatically install the necessary node modules


### Instructions to add simulations to the website

To simplify the process of adding simulations, we wrote a python script that automates the grunt work.
0. Run `npm install` in terminal

1. If any p5.dom elements are being used, add \<element\>.parent("simwrapper") in your js file (including the main canvas).

2. Add your simulation file (p5 code) to /public/javascripts/

3. Add your simulationdata in JSON to /routes/parameters/simulationdata.js

4. Run `python addSimulation.py` in a terminal, type in a urlName and a routerName

**Naming convention**: the urlName should match the name of your simulation file (e.g. single_pendulum)! The routerName must be written in camelCase (e.g. singlePendulumRouter)!

### Forking simulations over a single page

Instead of setting up the whole site, there is an easier way, building over a single HTML page and .js, if one wishes only to build a new simulation forking existing ones.

1. For simplicity, you may download the source HTML directly from, for example, view-source:https://physicshub.herokuapp.com/simulations/projectileMotion2D

2. Download most of the javascript and CSS from this GitHub ThePhysicsHub/public/...
**Caution: Linking to GitHub directly would not work as it is not a CDN (i.e. protected)

3. If the simulation does not show up locally, you may change the CSS and the js source link from relative to direct. i.e. 
<script src="file:///X:/[some long path]/public/javascripts/libraries/p5.gui.js"></script>

### Adding a simulation's theory section

To give those interested in the simulations on this webpage further insight into the physics and mathematics involved in the observed phenomena, we're aiming to add a theory section to each simulation.

To add a theory section for a simulation, open a new .ejs file in /routes/parameters, and write the HTML displaying your explanations in there. For displaying maths formulas, make use of the package [mathjax](https://www.mathjax.org/).

When your theory section is finished, reference it in /routes/parameters by adding a new attribute to the corresponding simulation JSON object using the getFile() method ("explanation": getFile("<yourTheorySectionsName.ejs>") ).



### Design template for simulations
 
>This portion provides a general template for the UI to be followed with some flexibility based on the simulation's specifics.

The UI is meant to be clean, with minimal interactive elements visible on startup. The suggested tools to be used for creating input/sliders/buttons are either the [*p5.gui*](https://github.com/bitcraftlab/p5.gui) library or Pedro's custom-built [*dropdownFunctions.js*](https://github.com/ThePhysHub/ThePhysicsHub/blob/master/public/javascripts/libraries/dropdownFunctions.js)  file. 

The UI should look something as given below, with the parameter options available to the right, and the simulation window to the left, following a minimal grey-scale theme.

![](images/ui1.png?raw=true)

![](images/ui2.png?raw=true)



**The general layering of canvas is as follows:**
* **bgCanvas**: The overall container canvas, holding all other layers, and the dropdown menu on the right.
* **simCanvas**: The simulation window on the left, occupying all of *bgCanvas* except what is occupied by the dropdown menu.
* **plotCanvas**: The plotting window inside *simCanvas*, it can occupy any position and size depending on the simulation. This layer must have a visibility toggle in the menu. Specific to the simulation, *simCanvas* and *plotCanvas* can be resized as the user toggles the visibility. Plotting can be done using [*grafica.js*]( https://github.com/jagracar/grafica.js?files=1) or a custom lightweight plotter if any.
* **Other layers**: Further layers can be added over the above mentioned, as per necessity. For instance, the static grid in the image was on a separate buffer, *gridCanvas*.

The code given below is a sample to recreate the UI shown above. (it uses Pedro's dropdown file, the documentation for which can be found in the same file.)
```
let W = 1200  //width of bgCanvas
let H = 500  //height of bgCanvas
let Wsim = W * 0.69 
let Hsim = H
let Wplot = 0.25 * W
let Hplot = 0.875 * H 
let bgCanvas, simCanvas, plotCanvas;

function setup() {
  bgCanvas = createCanvas(W, H)
  
  simCanvas = createGraphics(Wsim, Hsim)
  
  plotCanvas = createGraphics(Wplot, Hplot)
  plotCanvas.background(20)
  plotCanvas.stroke(255)
  plotCanvas.strokeWeight(3)
  plotCanvas.noFill()
  plotCanvas.rect(0, 0, Wplot, Hplot)
  ...
}

 function draw(){
  //border of simCanvas
  simCanvas.clear()
  simCanvas.stroke(255)
  simCanvas.strokeWeight(2)
  simCanvas.noFill()
  simCanvas.rect(10, 10, Wsim - 20, Hsim - 20)
  
  //sim canvas
  image(simCanvas, 0, 0);
  
  //plot canvas toggle
  if (plotCheckbox.checked) {
    ...
    image(plotCanvas, Wsim - Wplot - 30, 30)
  }
  ...
} 
```

