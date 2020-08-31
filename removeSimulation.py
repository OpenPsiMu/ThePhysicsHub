import os

urlName = input('What\'s the urlName/filename of the simulation you want to delete? - e.g. single_pendulum (you can find the simulation files under public/javascripts)')
routerName = input('What\'s the routerName of the simulation? - e.g. singlePendulumRouter (you can find the routerNames in app.js)')

appjs = open('./app.js')
lines = appjs.readlines()

newAppjs = open('./app.js', 'w')
for line in lines:
    if urlName in line:
        print('deleting ', line, ' in app.js...')
    else:
        newAppjs.write(line)

os.remove('./routes/{}.js'.format(urlName))
os.remove('./public/javascripts/{}.js'.format(urlName))
print('Done! removed ./routes/{}.js and ./public/javascripts/{}.js. Please delete your simulation data in routes/parameters/simulationdata!'.format(urlName,urlName))





        
