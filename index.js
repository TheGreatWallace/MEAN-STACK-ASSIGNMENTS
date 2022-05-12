// npm install --save express mysql body-parser ejs
// npm install -g nodemon

const mysql = require('mysql');
const express = require('express');
// const ejs = require('ejs')
// const bodyparser = require('body-parser');
const path = require('path');
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const req = require('express/lib/request');
const router = express.Router();
const app = express();

// Create Database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'project_schema',
    dateString: true
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected');
})

// set views file
app.set('views',path.join(__dirname,'views'));

// set directory file for public folder holding css stylesheet
const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory))

// set views engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


// software table default page 
app.get('/',(req,res)=> {
    // res.send('Software Project Application');
    let sql = "SELECT * FROM `project_schema`.software_projects";
    connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index',{
            title: 'Software Project Application',
            user: rows
           });
    });
});

// Notes table home page
app.get('/notes',(req,res) => {
    let sql = "SELECT * FROM project_schema.notes_table";
    connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('addnotes_table', {
            notes_title: 'Add Notes Table',
            notes: rows
        })
    })
})

app.get('/add',(req, res) => {
    res.render('project_add', {
        title: 'Software Project Application',
        // user: rows
    })
})

// This is the save section after a project is edited
app.post('/save', (req, res) => {
    let data = {
        project_title: req.body.projectTitle,
        project_description: req.body.projectDescription,
        project_start_dt: req.body.projectStartDate,
        project_due_dt: req.body.projectDueDate
    };
    
    let sql = "INSERT INTO software_projects SET?";

    connection.query(sql, data,(err, results) => {
        if(err) throw err;
        res.redirect('/');
    })
})

// This is where the notes get saved after being edited
app.post('/notes_save', (req, res) => {
    let data = {
        note: req.body.note,
        active_date: req.body.active_date,
        project_id: req.body.project_id
    };
    
    
    let sql = "INSERT INTO notes_table SET?";

    connection.query(sql, data,(err, results) => {
        if(err) throw err;
        res.redirect('/notes');
    })
})


// Project Update Section
app.post('/project_update/:id', (req, res) => {
    let data = {
        project_title: req.body.projectTitle,
        project_description: req.body.projectDescription,
        project_start_dt: req.body.projectStartDate,
        project_due_dt: req.body.projectDueDate
    };
    
    let sql =  `UPDATE software_projects SET ? WHERE id = ${req.params.id};`;

    connection.query(sql, data,(err, results) => {
        if(err) throw err;

        res.redirect('/');
    })
})


// Edit Project Section
app.get('/project_edit/:id/', (req,res)=>{
    const id = req.params.id;

    let sql= `SELECT * FROM project_schema.software_projects WHERE id= ${id}`;

    connection.query(sql, (err, result) => {
        if(err) throw err;
        res.render('project_edit', { software_projects: result[0], title: 'Software Project Application'})
    })
})


// Edit Notes Section
app.get('/notes_edit/:id/', (req,res)=>{
    const id = req.params.id;

    let sql= `SELECT * FROM project_schema.notes_table WHERE id= ${id}`;

    connection.query(sql, (err, result) => {
        if(err) throw err;
        res.render('notes_edit', { notes_table: result[0], edit_title: 'Edit Notes Table'})
    })
})


// Notes Update Section
app.post('/notes_update/:id', (req, res) => {
    let data = {
        note: req.body.note,
        active_date: req.body.active_date,
        project_id: req.body.project_id
    };
    
    let sql =  `UPDATE notes_table SET ? WHERE id = ${req.params.id};`;

    connection.query(sql, data,(err, results) => {
        if(err) throw err;

        res.redirect('/notes');
    })
})

//  the delete section
app.get("/delete/:id", (req, res) =>{
    connection.query('DELETE FROM project_schema.software_projects WHERE Id='+ req.params.id, (err, rows, fields) =>{
        if(!err)
        {
            
            res.redirect('/')
        }
        else
        {
            console.log(err);
        }
    })
   })


    //  Notes Section Delete
   app.get("/notes_delete/:id", (req, res) =>{
    connection.query('DELETE FROM project_schema.notes_table WHERE Id='+ req.params.id, (err, rows, fields) =>{
        if(!err)
        {
            
            res.redirect('/notes')
        }
        else
        {
            console.log(err);
        }
    })
   })


// Server listening
app.listen(3000, ()=>  {
    console.log('Server is listening at Port 3000');
})

module.exports =router;
