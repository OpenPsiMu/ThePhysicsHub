def createRouter(urlName):
    """Create a router file.

    Args:
        urlName (str): URL name.
    """
    print("Creating router")
    router = open(f"./routes/{urlName}.js", "w+")
    router.write("const express = require('express\);\n") 
    router.write("const router = express.Router();\n")
    router.write("const simArray = require('./parameters/simulationdata');\n")
    router.write('const index = simArray.findIndex(function (i) { return i.urlName == "' + urlName + '" });\n')
    router.write("const fs = require('fs');\n")
    router.write("const path = require('path');\n")
    router.write('const navbar = fs.readFileSync(path.resolve(__dirname, "parameters/navigationbar.ejs"), \"utf-8\");\n')
    router.write("\n")
    router.write("router.get('/', function(req,res,next){\n")
    router.write("res.render('simulationsite', { sim: simArray[index], navbar: navbar });\n")
    router.write("});\n")
    router.write("\n")
    router.write("module.exports = router;") 

def editAppjs(routerName, urlName):
    """Rewrite our app.js file.

    Args:
        routerName (str): Router name.
        urlName (str): URL name.
    """
    # Open our app.js file, go through each line in the file and add it to a list called lines. 
    lines = [ line for line in open("./app.js") ]

    # Open app.js in write mode to allow us to empty the file and then rewrite it.
    newAppjs = open("./app.js", "w")

    # Go through each element or line in our lines list, run two quick if statements and write something if either of them are valid. Once out of the if statements write the line from the lines list into app.js.
    for line in lines:
        if "./routes" in line and lines[lines.index(line) + 1] == '\n':
            newAppjs.write(f"const {routerName} = require('.routes/{urlName}');\n")
        if "app.use(\'/simulations" in line and lines[lines.index(line)+1] == '\n':
            newAppjs.write(f"app.use('simulations/{urlName}', {routerName});\n")
        newAppjs.write(line)

# Ask the user for some input.
urlInput = input("urlName: ")
routerInput = input("routerName: ")
check = input(f"\nStart adding simulations? Type: run \n Press another key to stop:\nurlName:{urlInput}\nrouterName:{routerInput}\n")

# Call editAppjs and creteRouter if the user inputs "run" in our check input, otherwise call exit.
if check == "run":
    editAppjs(routerInput, urlInput)
    createRouter(urlInput)
else:
    exit()