export const smtpSettings = {
    host: 'smtp.resend.com', 
    authUsername: 'resend',
    password: process.env.RESEND_API_KEY,
    port: 465,
    from: {
        name: "Agora",
        email: "support@shopatagora.com"
    },
    secure: true
};