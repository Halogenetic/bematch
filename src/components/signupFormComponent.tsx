import router from 'next/router';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { trpc } from '../utils/trpc';
import bcrypt from 'bcryptjs';

interface FieldProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type: string;
  children: React.ReactNode;
}

function Field({ name, value, onChange, children, type }: FieldProps) {
  return (
    <div>
      <input className='myinputs' placeholder={`${children}`} type={type} value={value} onChange={onChange} id={name} name={name} />
    </div>
  );
}

function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordMasked, setPasswordMasked] = useState(true);
  const [userMessage, setUserMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'passwordConfirm':
        setPasswordConfirm(value);
        break;
      default:
        break;
    }
  };

  const signupFormMutation = trpc.signup.signupForm.useMutation()

  const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };

  const handleSubmitForm = async (email: string, password: string) => {
    try {
      const hashedPassword = await hashPassword(password);
      await signupFormMutation.mutateAsync({ email, password: hashedPassword});
      setUserMessage('Form submitted successfully');
      router.push("/signin");
    } catch (error) {
      setUserMessage('Failed');
    }
  };

  // const { data: existingUsers } = trpc.signup.getUsers.useQuery();
  // const checkNameExists = (email: string): boolean => {
  //   if (!existingUsers) {
  //     return false;
  //   }
  //   return existingUsers.includes(email);
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setUserMessage("Passwords don't match");
    } else if (email.length < 1 || email.length > 30) {
      setUserMessage('Invalid email adress');
    } else if (password.length < 6) {
      setUserMessage('Password should be at least 6 characters long');
    } else {
      // const nameExists = checkNameExists(email);
      // if (nameExists) {
      //   setUserMessage('Email adress already exists');
      // } else {
        setUserMessage('Account successfully created');
        const data = JSON.stringify({ email, password});
        handleSubmitForm(email, password);
      // }
    }
  };

  const togglePasswordMask = () => {
    setPasswordMasked((prevPasswordMasked) => !prevPasswordMasked);
  };

    return (
      <form className='myforms' onSubmit={handleSubmit}>
        <Field name="email" value={email} onChange={handleChange} type="text">
          Email
        </Field>
        <Field
          name="password"
          value={password}
          onChange={handleChange}
          type={passwordMasked ? 'password' : 'text'}
        >
          Password
        </Field>
        <Field
          name="passwordConfirm"
          value={passwordConfirm}
          onChange={handleChange}
          type={passwordMasked ? 'password' : 'text'}
        >
          Confirm Password
        </Field>
        <div className='pt-[5%]'>
          <label className='flex'>
            <input className='mycheckboxes' type="checkbox" checked={passwordMasked} onChange={togglePasswordMask} />
            <div className="mylabels"> Hide password </div>
          </label>
        </div >
        <div>
        </div>
        <div>
        <div className='mymessages'>{userMessage}</div>
        <button className='mybuttons'>Send</button>
        </div>
      </form>
    );
  }

export default Home;