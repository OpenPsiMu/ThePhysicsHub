def createRouter(urlName):
    router = open("./routes/{}.js".format(urlName), "w+")
    router.write("const express = require(\'express\');\n") 
    router.write("const router = express.Router();\n")
    router.write("const simArray = require(\'./parameters/simulationdata\');\n")
    router.write("const index = simArray.findIndex(function (i) { return i.urlName == \"" + urlName + "\" });\n")
    router.write("\n")
    router.write("router.get(\'/\', function(req,res,next){\n")
    router.write("res.render(\'simulationsite\', { sim: simArray[index] });\n")
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


urlInput = input("Enter your urlName (with quotation marks!): ")
routerInput = input("Enter your routerName (with quotation marks!): ")
check = input("\nstart adding simulations? type\'run\' (with quotation marks) to continue, press other key to stop:\nurlName:{}\nrouterName:{}\n".format(urlInput, routerInput))

if check == "run":
    editAppjs(routerInput, urlInput)
    createRouter(urlInput)
else:
    exit()
