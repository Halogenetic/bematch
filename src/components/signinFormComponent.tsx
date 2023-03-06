import router from 'next/router';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { trpc } from '../utils/trpc';

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
      <input className="myinputs" placeholder={`${children}`} type={type} value={value} onChange={onChange} id={name} name={name} />
    </div>
  );
}

function SignIn({ handleSignIn }: { handleSignIn: (token: string) => void }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [userMessage, setUserMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name2':
        setName(value);
        break;
      case 'password2':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const signInMutation = trpc.signup.signin.useMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
    const token = await signInMutation.mutateAsync({ name, password });
    setUserMessage('You have been signed in successfully');
    localStorage.setItem('token', token);
    handleSignIn(token);
    } catch (error) {
    setUserMessage('Authentication failed');
    }
    };

  return (

    <form className='myforms' onSubmit={handleSubmit}>
        <Field name="name2" value={name} onChange={handleChange} type="text">
            Name
        </Field>
        <Field
            name="password2"
            value={password}
            onChange={handleChange}
            type="password"
        >
            Password
        </Field>
        <div>
        <div className='mymessages'>{userMessage}</div>
        <button className='mybuttons'>Sign In</button>
        </div>
    </form>
  );
}

export default SignIn;
