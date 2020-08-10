# The Physics Hub

The Physics Hub is a website built by physics enthusiasts from a range of backgrounds,
serving as a place to view  high school/undergraduate university level physics simulations.
The simulations are currently written using the javascript library [p5.js](https://p5js.org/).
Everybody is welcome to contribute, no matter whether you're a beginner or an expert.

**Contact**: physhub@protonmail.com.  **Website**: [physicshub.herokuapp.com](physicshub.herokuapp.com)


### Project Setup

The website is based on ExpressJS. The Node Package Manager [(npm)](https://www.npmjs.com/) will thus install most of the dependencies for you.

1. Install [NodeJS](https://nodejs.dev/)

2. In terminal, run `npm install` in order to automatically install the necessary node modules


### Instructions to add simulations to the website

In order to simplify the process of adding simulations, we wrote a python script that automates the grunt work.

1. Add your simulation file (p5 code) to /public/javascripts/

2. Add your simulationdata in JSON to /routes/parameters/simulationdata.js

3. Run `python addSimulation.py` in terminal, type in a urlName and a routerName

**Naming convention**: the urlName should match the name of your simulation file (e.g. single_pendulum)! The routerName must be written in camelCase (e.g. singlePendulumRouter)!

