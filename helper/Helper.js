import nodemailer from 'nodemailer';
import { google } from "googleapis"

export const sendEmailTemp = async (email,token) => {
    const CLIENT_ID ="799985283565-fqec30t3er85o1t65ihm0nnbv2u0g3bq.apps.googleusercontent.com";
    const CLEINT_SECRET = "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";
    const REDIRECT_URI = "https://developers.google.com/oauthplayground";
    const REFRESH_TOKEN = "1//04svhpyvP1GuoCgYIARAAGAQSNwF-L9IrcSSiGK650eTYYDVEs6J_F7GmaWdBG07Gsyzw1RpzO7P9virVIKymi1JyEnEawdOQRTk";
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLEINT_SECRET = process.env.CLEINT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;
// const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
  
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const accessToken = await oAuth2Client.getAccessToken();

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'mangeshdev2042@gmail.com',
    clientId: CLIENT_ID,
    clientSecret: CLEINT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: accessToken,
  },
});

const mailOptions = {
  from: 'SENDER NAME <mangeshdev2042@gmail.com>',
  to: email,
  subject: 'Hello from dev',
  text: 'Email verification',
  html: `<h1>Verify your email </h1><a href=http://localhost:3000/verifyemail/${token}>click here<a/>`,
};

    const result = await transport.sendMail(mailOptions); 
    return result;
}

export const sendEmailOtp = async (email,otp) => {
  const CLIENT_ID ="799985283565-fqec30t3er85o1t65ihm0nnbv2u0g3bq.apps.googleusercontent.com";
  const CLEINT_SECRET = "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";
  const REDIRECT_URI = "https://developers.google.com/oauthplayground";
  const REFRESH_TOKEN = "1//04svhpyvP1GuoCgYIARAAGAQSNwF-L9IrcSSiGK650eTYYDVEs6J_F7GmaWdBG07Gsyzw1RpzO7P9virVIKymi1JyEnEawdOQRTk";
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLEINT_SECRET = process.env.CLEINT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;
// const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
CLIENT_ID,
CLEINT_SECRET,
REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const accessToken = await oAuth2Client.getAccessToken();

const transport = nodemailer.createTransport({
service: 'gmail',
auth: {
  type: 'OAuth2',
  user: 'mangeshdev2042@gmail.com',
  clientId: CLIENT_ID,
  clientSecret: CLEINT_SECRET,
  refreshToken: REFRESH_TOKEN,
  accessToken: accessToken,
},
});

const mailOptions = {
from: 'SENDER NAME <mangeshdev2042@gmail.com>',
to: email,
subject: 'Hello from dev',
text: 'Email verification',
html: `<h1>Verify your email here your otp ${otp}</h1>`,
};

  const result = await transport.sendMail(mailOptions); 
  return result;
}

