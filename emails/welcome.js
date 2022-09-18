require("dotenv").config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const myemail = process.env.mail
const sendWelcomeEmail = (email, name) => {
  sgMail.send({
      to: email,
      from: myemail,
      subject: 'Thanks for joining in!',
      text: `Welcome to the paulomedium.com, ${name}.cant wait to see your blogs `
  })
}

const sendCancelationEmail = (email, name) => {
  sgMail.send({
      to: email,
      from:  myemail,
      subject: 'Sorry to see you go note all the emails you created has been deleted ',
      text: `Goodbye, ${name}. I hope to see you back sometime soon.`
  })
}

const sendEmailwhenpostarticle = (email, name) => {
  sgMail.send({
      to: email,
      from: myemail,
      subject: 'your email has been sent ',
      text: `hey ${name},  I hope to see your article reach different heights;`
  })
}





module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
  sendEmailwhenpostarticle
}