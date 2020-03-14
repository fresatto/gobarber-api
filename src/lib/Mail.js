import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';

class Mail {
  constructor() {
    const { host, port, auth, secure } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth: auth.user ? auth : null,
      secure,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendEmail(message) {
    return this.transporter.sendMail({
      ...message,
      ...mailConfig.default,
    });
  }
}

export default new Mail();