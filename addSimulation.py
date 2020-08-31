def createRouter(urlName):
    print("Creating router")
    router = open("./routes/{}.js".format(urlName), "w+")
    router.write("const express = require(\'express\');\n") 
    router.write("const router = express.Router();\n")
    router.write("const simArray = require(\'./parameters/simulationdata\');\n")
    router.write("const index = simArray.findIndex(function (i) { return i.urlName == \"" + urlName + "\" });\n")
    router.write("const fs = require(\'fs\');\n")
    router.write("const path = require(\'path\');\n")
    router.write("const navbar = fs.readFileSync(path.resolve(__dirname, \"parameters/navigationbar.ejs\"), \"utf-8\");\n")
    router.write("\n")
    router.write("router.get(\'/\', function(req,res,next){\n")
    router.write("res.render(\'simulationsite\', { sim: simArray[index], navbar: navbar });\n")
    router.write("});\n")
    router.write("\n")
    router.write("module.exports = router;") 
    



def editAppjs(routerName, urlName):
    lines = []
    appjs = open("./app.js")
    for l in appjs:
        lines.append(l)

    newAppjs = open("./app.js", "w")
    for l in lines:
        if "./routes" in l and lines[lines.index(l)+1] == '\n':
            newAppjs.write("const {} = require(\'./routes/{}\');\n".format(routerName, urlName))
    
        if "app.use(\'/simulations" in l and lines[lines.index(l)+1] == '\n':
            newAppjs.write("app.use(\'/simulations/{}\', {});\n".format(urlName, routerName))
    
        newAppjs.write(l)


urlInput = input("Enter your urlName")
routerInput = input("Enter your routerName")
check = input("\nstart adding simulations? type: run \n press other key to stop:\nurlName:{}\nrouterName:{}\n".format(urlInput, routerInput))

if check == "run":
    editAppjs(routerInput, urlInput)
    createRouter(urlInput)
else:
    exit()
