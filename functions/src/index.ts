import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
import * as sgMail from '@sendgrid/mail';

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
const USER_DB = functions.config().database.userdb;
sgMail.setApiKey(API_KEY);


export const sendUserwelcomeEmail = 
functions
.database.instance(USER_DB).ref('/Users/{userId}')
    .onCreate(async snapshot => {
        const user = snapshot.val();
        const email = user.email;
        const UserName = user.name;
        console.log('User Email Fetch',email);

        const msg = {
            to:{
                email:email,
                name:UserName

            },
            from:{
                email:'hello@oncampus.in',
                name:'onCampus.in'

            },
            reply_to:{
                email: 'contact@oncampus.in',
                name: 'oncampus.in'

            },
            click_tracking:{
                enable:true,
                enable_text:true

            },
            open_tracking:{
                enable:true

            },
            templateId: TEMPLATE_ID,
            dynamic_template_data: {
                name:UserName,
            },
           
        };

        console.log('Email message',msg);

        return await sgMail.send(msg)
        .then(() =>{
            console.log("Email sent Successfully")
        }).catch((error) =>{
            console.log("Email sending error: ",error)
        });

    });