# The Physics Hub

The Physics Hub is a website built by physics enthusiasts from a range of backgrounds,
serving as a place to view  high school/undergraduate university level physics simulations.
The simulations are currently written using the javascript library [p5.js](https://p5js.org/).
Everybody is welcome to contribute, no matter whether you're a beginner or an expert.

**Contact**: physhub@protonmail.com.  **Website**: [physicshub.herokuapp.com](https://physicshub.herokuapp.com) **Discord**: [Invitation](https://discord.gg/B2M9p4y)


### Project Setup

The website is based on ExpressJS. The Node Package Manager [(npm)](https://www.npmjs.com/) will thus install most of the dependencies for you.

1. Install [NodeJS](https://nodejs.dev/)

2. In terminal, run `npm install` in order to automatically install the necessary node modules


### Instructions to add simulations to the website

In order to simplify the process of adding simulations, we wrote a python script that automates the grunt work.
1. If any p5.dom elements are being used, add \<element\>.parent("simwrapper") in your js file (including the main canvas).

2. Add your simulation file (p5 code) to /public/javascripts/

3. Add your simulationdata in JSON to /routes/parameters/simulationdata.js

4. Run `python addSimulation.py` in terminal, type in a urlName and a routerName

**Naming convention**: the urlName should match the name of your simulation file (e.g. single_pendulum)! The routerName must be written in camelCase (e.g. singlePendulumRouter)!

### Design template for simulations
 
>This portion provides a general template for the UI to be followed with some flexibility based on the specifics of the simulation.

The UI is meant to be clean with minimal interactive elements visible on startup. The suggested tools to be used for creating input/sliders/buttons are either the [*p5.gui*](https://github.com/bitcraftlab/p5.gui) library or Pedro's custom built [*dropdownFunctions.js*](https://github.com/ThePhysHub/ThePhysicsHub/blob/master/public/javascripts/libraries/dropdownFunctions.js)  file. 

The UI should look something as given below, with the parameter options available to the right, and the simulation window to the left, following a minimal grey-scale theme.

![](images/ui1.png?raw=true)

![](images/ui2.png?raw=true)



**The general layering of canvas is as follows:**
* **bgCanvas**: The overall container canvas, holding all other layers, and the dropdown menu on the right.
* **simCanvas**: The simulation window on the left, occupying all of *bgCanvas* except what is occupied by the dropdown menu.
* **plotCanvas**: The plotting window inside *simCanvas*, it can occupy any position and size depending on the simulation. This layer must have a visibility toggle in the menu. Specific to the simulation, *simCanvas* and *plotCanvas* can be resized as the user toggles the visibility. Plotting can be done using [*grafica.js*]( https://github.com/jagracar/grafica.js?files=1) or a custom lightweight plotter, if any.
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

