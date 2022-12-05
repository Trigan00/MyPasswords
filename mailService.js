const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const mailer = (to, link) => {
  transporter.sendMail({
    from: "MyPasswords <mytest_90@mail.ru>",
    to,
    subject: "Account activation on " + process.env.API_URL,
    text: "",
    html: `
              <div>
                  <h1>To activate, follow the link</h1>
                  <a href="${link}">${link}</a>
              </div>
          `,
  });
};

module.exports = mailer;

// const nodemailer = require("nodemailer");

// class MailService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASSWORD,
//       },
//     });
//   }

//   async sendActivationMail(to, link) {
//     await this.transporter.sendMail({
//       from: process.env.SMTP_USER,
//       to,
//       subject: "Account activation on " + process.env.API_URL,
//       text: "",
//       html: `
//             <div>
//                 <h1>To activate, follow the link</h1>
//                 <a href="${link}">${link}</a>
//             </div>
//         `,
//     });
//   }
// }

// module.exports = new MailService();
