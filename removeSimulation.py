import os # Import os to allow us to delete some files.

# Ask the user for some input.
urlName = input("What's the urlName/filename of the simulation you want to delete? - e.g. single_pendulum (you can find the simulation files under public/javascripts): ")
routerName = input("What's the routerName of the simulation? - e.g. singlePendulumRouter (you can find the routerNames in app.js): ")

# Open app.js and read the lines.
lines = open('./app.js').readlines()

# Open app.js in write mode to allow us to empty the file and then write.
newAppjs = open('./app.js', 'w')

# Go through each line in lines, perform a if statement.
for line in lines:
    if urlName in line:
        print(f"Deleting {line} in app.js...")
    else:
        newAppjs.write(line)

os.remove(f".routes/{urlName}")
os.remove(f"./public/javascript/{urlName}.js")
print(f"Done! removed ./routes/{urlName}.js and ./public/javascripts/{urlName}.js. Please delete your simulation data in routes/parameters/simulationdata!")