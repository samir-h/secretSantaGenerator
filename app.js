console.log('Starting app...');
var promptly = require('promptly');
var nodemailer = require('nodemailer');

var email  = '';
var password = '';

var mailOptions = {
  from: 'no-reply@no-reply.com',
  subject: 'New Years Secret Santa',
};

var data = require('./users.json');
var generatedNumbers = [];
var i = 0;

getName();

async function sendEmail(data, generated) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: password
        }
    });

    for (const item of data) {
        console.log('Sending email to: ' + item.name);
        let promise = new Promise((resolve, reject) => {
            mailOptions.to = item.email;
            mailOptions.text = 'Your are the Secret Santa for: ' + data[generated[i]].name;
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    reject(error)
                } else {
                    return resolve(info);
                }
            });
        });

        let result = await promise;
        console.log('Email Sent! Ho Ho Ho...');
        console.log('');
        i++;
    }
}

async function getName() {
    email = await promptly.prompt('Email from which you want to send the invitations: ');


    getPassword()
}

async function getPassword() {
    password = await promptly.password('Password: ');

    console.log('Generating random Santa...');
    console.log('');


    for(var i = 0; i < data.length; i++) {
        while (true) {
            var random = Math.floor(Math.random() * Math.floor(data.length));
            if (!generatedNumbers.includes(random) && random !== i) {
                generatedNumbers.push(random);
                break;
            }
        }
    }
    console.log('Santas Available: ' + data.length);
    console.log('');
    console.log('Generated: ' + generatedNumbers.length);
    console.log('');

    var i = 0;

    if (data.length !== generatedNumbers.length) {
        console.log('Something went wrong with the random generation... Please re-start');
    } else {
        sendEmail(data, generatedNumbers);
    }
}
