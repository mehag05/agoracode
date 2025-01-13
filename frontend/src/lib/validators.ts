import { z } from 'zod';
import { checkEmail } from '../auth/check_email';

export const EmailValidator = z.string().email({ message: 'Invalid email address' }).refine(async (email) => {
  const isValid = await checkEmail(email);
  return isValid;
}, { message: 'Email is not valid' });


export const AuthCredentialsValidator = z.object({
  email: EmailValidator,
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export type TAuthCredentials = z.infer<typeof AuthCredentialsValidator>;