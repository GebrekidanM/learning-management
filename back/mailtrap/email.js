const { PASSWORD_RESET_REQUEST_TEMPLATE } = require('./emailTemplates');

const {sender, mailtrapClient} = require('./mailtrap.config')

export const sendPasswordResetEmail = async(email,resetURL)=>{
    const recipient = [{email}];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to:recipient,
            subject:"Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            category: "Password Reset",
		});
	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
}