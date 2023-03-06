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

interface CheckboxProps {
  name: string;
  value: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
}

function Checkbox({ name, value, onChange, children }: CheckboxProps) {
  return (
    <div className='flex'>
      <input className='mycheckboxes' type="checkbox" checked={value} onChange={onChange} id={name} name={name} />
      <label className='mylabels' htmlFor={name}>{children}</label>
    </div>
  );
}

function Home() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordMasked, setPasswordMasked] = useState(true);
  const [userMessage, setUserMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'passwordConfirm':
        setPasswordConfirm(value);
        break;
      case 'newsletter':
        setNewsletter(checked);
        break;
      case 'termsAccepted':
        setTermsAccepted(checked);
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

  const handleSubmitForm = async (name: string, password: string, newsletter: boolean) => {
    try {
      const hashedPassword = await hashPassword(password);
      await signupFormMutation.mutateAsync({ name, password: hashedPassword, newsletter });
      setUserMessage('Form submitted successfully');
      router.push("/signin");
    } catch (error) {
      setUserMessage('Failed');
    }
  };

  const { data: existingUsers } = trpc.signup.getUsers.useQuery();
  const checkNameExists = (name: string): boolean => {
    if (!existingUsers) {
      return false;
    }
    return existingUsers.includes(name);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setUserMessage("Passwords don't match");
    } else if (!termsAccepted) {
      setUserMessage('You have to accept our terms and conditions');
    } else if (name.length < 1 || name.length > 16) {
      setUserMessage('Name should be between 1 and 16 characters');
    } else if (password.length < 6) {
      setUserMessage('Password should be at least 6 characters long');
    } else {
      const nameExists = checkNameExists(name);
      if (nameExists) {
        setUserMessage('Name already exists');
      } else {
        setUserMessage('Account successfully created');
        const data = JSON.stringify({ name, password, newsletter });
        handleSubmitForm(name, password, newsletter);
      }
    }
  };

  const togglePasswordMask = () => {
    setPasswordMasked((prevPasswordMasked) => !prevPasswordMasked);
  };

    return (
      <form className='myforms' onSubmit={handleSubmit}>
        <Field name="name" value={name} onChange={handleChange} type="text">
          Name
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
          <Checkbox name="newsletter" value={newsletter} onChange={handleChange}>
            Subscribe to our newsletter
          </Checkbox>
          <Checkbox name="termsAccepted" value={termsAccepted} onChange={handleChange}>
            Accept our terms and conditions
          </Checkbox>
        </div>
        <div>
        <div className='mymessages'>{userMessage}</div>
        <button className='mybuttons'>Send</button>
        </div>
      </form>
    );
  }

export default Home;