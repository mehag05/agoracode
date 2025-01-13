import { SoftLaunchEmailHtml, SoftLaunchEmailSubject } from '../emails/LaunchEmail';
import { MarketplaceEmailHtml, MarketplaceEmailSubject } from './marketresearch';

const smtpSettings = {
    host: 'smtp.resend.com', 
    port: 587, // Use 587 for STARTTLS
    secure: false, // Set to false for non-SSL connections
    auth: {
        user: 'resend', // Your Resend username
        pass: 're_ERqacd1s_DxuYrjrozpvtB4wsp7MWmLRD'
    }
}

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(smtpSettings as any);

const sendSoftLaunchEmail = async ({ to }: any) => {
    const htmlContent = SoftLaunchEmailHtml();

    const mailOptions = {
        from: '"Agora" <support@shopatagora.com>', // Replace with your sender address
        to,
        subject: SoftLaunchEmailSubject,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendMarketplaceEmail = async ({ email, name}: any) => {
    const htmlContent = MarketplaceEmailHtml({ email, name });

    const mailOptions = {
        from: '"Agora" <support@shopatagora.com>',
        to: email,
        subject: MarketplaceEmailSubject,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

const emailList = [
    'yochih@wharton.upenn.edu',
    'mehag05@seas.upenn.edu',
    'alexzaz@sas.upenn.edu',
    'krckrc@sas.upenn.edu',
    'davidzhe@sas.upenn.edu',
    'yurachel@wharton.upenn.edu',
    'cattang@sas.upenn.edu',
    'meemamilan@gmail.com',
    'kartikpillai8@gmail.com',
    'camilam@wharton.upenn.edu',
    'evelaga@sas.upenn.edu',
    'byrianaa@wharton.upenn.edu',
    'traoref@sas.upenn.edu',
    'Lnnaji@wharton.upenn.edu',
    'Demgon@upenn.edu',
    'lizaqmm@sas.upenn.edu',
    'jing350@sas.upenn.edu',
    'melmejia@wharton.upenn.edu',
    'Katlu@wharton.upenn.edu',
    'aryabansal1@gmail.com',
    'elianap@seas.upenn.edu',
    'Valentinacuellarb24@gmail.com',
    'Listeven@wharton.upenn.edu',
    'eecho@sas.upenn.edu',
    'amaranw@upenn.edu',
    'sohaing1@wharton.upenn.edu',
    'jeramys@sas.upenn.edu',
    'zsankofa@sas.upenn.edu',
    'aswl@sas.upenn.edu',
    'marcbut@wharton.upenn.edu',
    'ailingc@sas.upenn.edu',
    'alee15@sas.upenn.edu',
    'annarmcc@sas.upenn.edu',
    'mdonel@wharton.upenn.edu',
    'Alexdb8305@gmail.com',
    'rogzhengsas.upenn.edu',
    'huynhka@sas.upenn.edu',
    'rjsylak3@gmail.com',
    'nicwest@wharton.upenn.edu',
    'ouyangs@wharton.upenn.edu',
    'Sancheah@wharton.UPenn.edu',
    'eaemtage@sas.upenn.edu',
    'squddus@sas.upenn.edu',
    'nolanwen@sas.upenn.edu',
    'dono77@wharton.upenn.edu',
    'rachelwang711@gmail.com',
    'jancao@wharton.upenn.edu',
    'lucashud@sas.Upenn.edu',
    'cameh@upenn.edu',
    'dono77@wharton.upenn.edu',
    'catdoan@sas.upenn.edu',
    'Jessicaanyanwu21@gmail.com',
    'chnicole@sas.upenn.edu',
    'kwamboka@sas.upenn.edu',
    'alcy@sas.upenn.edu',
    'lindaxuy@sas.upenn.edu',
    'samwinn@sas.upenn.edu'
];

const emailNamesUsers = [
    { email: 'mehag05@seas.upenn.edu', name: 'Meha' },
    { email: 'abansal1@wharton.upenn.edu', name: 'Arya' },
    { email: 'yochih@wharton.upenn.edu', name: 'Yochi' },
    { email: 'eaemtage@sas.upenn.edu', name: 'Ella' },
    { email: 'nuamena@seas.upenn.edu', name: 'NuAmen' },
    { email: 'ashpar@nursing.upenn.edu', name: 'Ashley' },
    { email: 'rogzheng@sas.upenn.edu', name: 'Roger' },
    { email: 'tinado@sas.upenn.edu', name: 'Tina' },
    { email: 'parutaa@sas.upenn.edu', name: 'Andrea' },
    { email: 'achapel1@sas.upenn.edu', name: 'Avery' },
    { email: 'jgastil@appc.upenn.edu', name: 'John' },
    { email: 'dariad@wharton.upenn.edu', name: 'daria' },
    { email: 'mclear@sas.upenn.edu', name: 'Milan' },       
    { email: 'arimejia@sas.upenn.edu', name: 'Arianna' },       
    { email: 'luiriasc@sas.upenn.edu', name: 'Lucia' },         
    { email: 'tmarhguy@seas.upenn.edu', name: 'Tyrone' },       
    { email: 'demgon@sas.upenn.edu', name: 'Demetrio' },        
    { email: 'lkseale@sas.upenn.edu', name: 'Liana' },  
    { email: 'joiya@sas.upenn.edu', name: 'Jo ' },      
    { email: 'myung11@seas.upenn.edu', name: 'Max' },   
    { email: 'taani@sas.upenn.edu', name: 'Tanisha' }, 
    { email: 'ljuliana@sas.upenn.edu', name: 'Jules' },
    { email: 'chloeyan@seas.upenn.edu', name: 'Chloe' },
    { email: 'mtadros@wharton.upenn.edu', name: 'Mariam' },
    { email: 'hlasic@sas.upenn.edu', name: 'Helena' }
]

const emails_and_names = [
    {"email": "alexzaz@sas.upenn.edu", "name": "alexza zaragoza"},
    {"email": "krckrc@sas.upenn.edu", "name": "Krishna Chandrasekhara"},
    {"email": "davidzhe@sas.upenn.edu", "name": "david"},
    {"email": "yurachel@wharton.upenn.edu", "name": "Rachel Yu"},
    {"email": "cattang@sas.upenn.edu", "name": "Catherine Tang"},
    {"email": "kartikpillai8@gmail.com", "name": "kartik pillai"},
    {"email": "camilam@wharton.upenn.edu", "name": "Camila Moreno Juarez"},
    {"email": "evelaga@sas.upenn.edu", "name": "Esha Velaga"},
    {"email": "byrianaa@wharton.upenn.edu", "name": "byriana kelly"},
    {"email": "traoref@sas.upenn.edu", "name": "Fadila Traore"},
    {"email": "Lnnaji@wharton.upenn.edu", "name": "Lisa nnaji"},
    {"email": "lizaqmm@sas.upenn.edu", "name": "Liza Matthews"},
    {"email": "jing350@sas.upenn.edu", "name": "jing"},
    {"email": "melmejia@wharton.upenn.edu", "name": "Melanie Mejia"},
    {"email": "Katlu@wharton.upenn.edu", "name": "Kathy Lu"},
    {"email": "aryabansal1@gmail.com", "name": "Arya Bansal"},
    {"email": "elianap@seas.upenn.edu", "name": "Eliana Pasternak"},
    {"email": "Valentinacuellarb24@gmail.com", "name": "Valentina Cuellar"},
    {"email": "Listeven@wharton.upenn.edu", "name": "Steven"},
    {"email": "eecho@sas.upenn.edu", "name": "eecho yuan"},
    {"email": "vickyywang7@gmail.com", "name": "Vicky Wang"},
    {"email": "amaranw@upenn.edu", "name": "amara"},
    {"email": "sohaing1@wharton.upenn.edu", "name": "grace djoko"},
    {"email": "jeramys@sas.upenn.edu", "name": "Jeramy Solano"},
    {"email": "zsankofa@sas.upenn.edu", "name": "Zawadi Sankofa"},
    {"email": "aswl@sas.upenn.edu", "name": "Ashwin Laksumanage"},
    {"email": "Marcbut@wharton.UPenn.edu", "name": "Marcus butler"},
    {"email": "cdong72@seas.upenn.edu", "name": "Cynthia Dong"},
    {"email": "ailingc@sas.upenn.edu", "name": "AiLing Chen"},
    {"email": "alee15@sas.upenn.edu", "name": "aaron lee"},
    {"email": "annarmcc@sas.upenn.edu", "name": "Anna McCarthy"},
    {"email": "mdonel@wharton.upenn.edu", "name": "Madison Donelson"},
    {"email": "Alexdb8305@gmail.com", "name": "Alexander"},
    {"email": "huynhka@sas.upenn.edu", "name": "kh"},
    {"email": "rjsylak3@gmail.com", "name": "RJ"},
    {"email": "nicwest@wharton.upenn.edu", "name": "Nicolas West"},
    {"email": "Nuamena@seas.upenn.edu", "name": "NuAmen Audena"},
    {"email": "ouyangs@wharton.upenn.edu", "name": "Samantha Ouyang"},
    {"email": "Sancheah@wharton.UPenn.edu", "name": "Sandra Cheah"},
    {"email": "squddus@sas.upenn.edu", "name": "Sangeeta Quddus"},
    {"email": "nolanwen@sas.upenn.edu", "name": "Nolan Wen"},
    {"email": "ashleypark716@gmail.com", "name": "ashley"},
    {"email": "dono77@wharton.upenn.edu", "name": "Donovan Miller"},
    {"email": "rachelwang711@gmail.com", "name": "rachel wang"},
    {"email": "jancao@wharton.upenn.edu", "name": "Janice Cao"},
    {"email": "lucashud@sas.Upenn.edu", "name": "Lucas hUdson"},
    {"email": "cameh@upenn.edu", "name": "Chantal Ameh"},
    {"email": "saeylli@sas.upenn.edu", "name": "Sally Huang"},
    {"email": "catdoan@sas.upenn.edu", "name": "Cat Doan"},
    {"email": "Jessicaanyanwu21@gmail.com", "name": "Jessica Anyanwu"},
    {"email": "chnicole@sas.upenn.edu", "name": "Nicole Chung"},
    {"email": "kwamboka@sas.upenn.edu", "name": "Darlene Moturi"},
    {"email": "alcy@sas.upenn.edu", "name": "Allyson Ye"},
    {"email": "lindaxuy@sas.upenn.edu", "name": "linda"},
    {"email": "samwinn@sas.upenn.edu", "name": "sam"}
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const sendEmails = async () => {
    for (const { email, name } of emails_and_names) {
        await sendMarketplaceEmail({ email: email, name: name });
        await delay(500);
    }
};

sendEmails();