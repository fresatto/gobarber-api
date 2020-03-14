import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';
class Mail {
  constructor() {
    const { host, port, auth, secure } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth: auth.user ? auth : null,
      secure,
    });
  }

  sendEmail(message) {
    return this.transporter.sendMail({
      ...message,
      ...mailConfig.default,
    });
  }
}

export default new Mail();
