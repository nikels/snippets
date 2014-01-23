var nodemailer = require("nodemailer");
var UserCollection = require('./src/collections/users');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "ncastrop@sparefoot.com",
        pass: "sparesquarehare"
    }
});

var snippetServer = "http://192.168.21.83:3000";
var sent = 0;

UserCollection.forEach(function(user){

  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: "SpareSnippet <snippets@sparefoot.com>", // sender address
      to: user.email, // list of receivers
      subject: "Snippets: Show us your code!", // Subject line
      html: 'Upload your Snippet <a href="' + snippetServer + '/snippets/login/'+user.handle+'">here</a>', // plaintext body
      text: "Upload your Snippet " + snippetServer + "/snippets/login/"+user.handle // html body
  };

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent: " + response.message);
      }

      sent++;

      if(sent === UserCollection.length){
        // if you don't want to use this transport object anymore, uncomment following line
        smtpTransport.close(); // shut down the connection pool, no more messages
      }
  });
});
