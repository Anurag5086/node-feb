const express = require('express');
const app = express();

// My First API Route (Hello World)
// "/hello" endpoint
// app.get('/hello', (req, res) => {
//     res.send('Hello World!');
// });

// Learning about params
// localhost:3000/hello/Ankush
app.get('/hello/:name', (req, res) => {
    const name = req.params.name;
    console.log(`Hello ${name}!`)
    res.send(`Hello ${name}!`);
});

// Learning about query parameters
// localhost:3000/hello?firstname=Elon&lastname=Musk

app.get('/hello', (req, res) => {
    try{
        const firstName = req.query.firstname;
        const lastName = req.query.lastname;
        const name=req.query.name;

        if(name){
            res.send(`Hello ${name}!`);
        } else {
            res.send(`Hello ${firstName} ${lastName}!`);
        }
    }catch{
        res.send('Error occurred');
    }

});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});