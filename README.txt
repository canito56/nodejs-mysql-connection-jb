npm init --yes
npm i express ejs mysql body-parser  

(body-parser is a middleware to be able to send data from the browser to the server and store it in mysql
and also to receive inputs, for example sent by a form, by its name attributes)

The structure of the project, its folders and files, is as follows:
src                             Contains the whole project
src/index.js                    To start all the app, configuration and start of the express server, the following is 
                                required: express, path, body-parser, the port, the view engine, the view path are set
src/news.js                     It will have the connection to the DB and the queries, since the routes are the place 
                                where the application receives the browser requests
src/public                      It will have the project images and styles (CSS)
src/public/stylus/news.CSS      Styles of the elements of the different templates
src/views                       For all project views
src/views/main.ejs              Main template, here I go to getbootstrap.com, get started, and in CSS I copy the path 
                                to paste it in <head> under <title>, and I put the include of the other templates
src/views/list.ejs              The first template that is displayed when the app starts, shows the complete list of news
src/views/add.ejs               Template to register news, it is included in main.ejs
src/views/edit.ejs              Template to edit and change news, it is included in main.ejs
src/views/nav.ejs               Template with only the nav part, it is included in main.ejs
src/database.js                 Has the connection with mysql
src/database                    To store sql scripts

Tips:
-----
The path variable is used for operating system paths
'view engine' is used to tell you what type of template we are going to use, in this case 'ejs', all template 
    engines at the end are transformed into html
The path.join method is responsible for joining directories
In app.use (bodyparser.urlencoded ({extended: false})) it means that it will not pass images (for ex.) to the form, it 
    will only pass data
In res.render ('news / news.ejs') I don't need to put .ejs because when I declared the template engine 'view engine', 
    I already told it it was ejs. But I put it the same to have it as a guide.
The ejs forms have to point to a server path in action = "/ news" (for example), the form sends the /news path with 
    the POST method. This is received by news.js and solves it.