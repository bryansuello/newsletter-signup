const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const https = require('https');

app.use(express.static('public'));
//let's your serve up static files with express i.e. external css, images. they must be inside the specified public dir
//when writing file paths, imagine you are inside the public dir
//spent like 30 minutes scouring stackoverflow for lots of solutions that didn't work just to find out the solution was in the video all along only if waited


// local port
// app.listen(3000, () => {
//   console.log('server is running on port 3000.')
// })

// let heroku define its own port, and while also listen to local port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('server is running on port 3000.')
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
})

app.post('/', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  // https.get(url, (response) => {
  //   response.on('data', (data) => {
  //     console.log(firstName);
  //   })
  // })

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }
  const jsonData = JSON.stringify(data);
  const url = 'https://us21.api.mailchimp.com/3.0/lists/1dc5472a9f'; //the end of us should be d same as the api key 'us21' that's the mchimp server number
  const options = {
    method: 'POST',
    auth: 'bryan:7e7d9f30012ae14ef233eba96143cd1c-us21'
  }


  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    }
    else {
      res.sendFile(__dirname + '/failure.html');
    }

    response.on('data', (data) => {
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();


  // console.log(firstName, lastName, email);
  // res.send(`${firstName} ${lastName}, ${email}`);
})


app.post('/failure', (req, res) => {
  res.redirect('/');
})


// mailchimp key
// 7e7d9f30012ae14ef233eba96143cd1c-us21

// audience id:
// 1dc5472a9f 
