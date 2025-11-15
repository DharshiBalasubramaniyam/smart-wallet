export interface MailOptions {
    to: string,
    subject: string,
    text: string
}

export interface MailRequest extends Document {
   userId: string;
   mailOptions: MailOptions,
   datetime: string,
   type: string,
}
