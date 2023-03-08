import router from 'next/router';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { trpc } from '../utils/trpc';
import CustomSelect from './selectComponent';
import jwt from "jsonwebtoken";

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

  const options = [
    { label: 'HTML', value: 'HTML' },
    { label: 'CSS', value: 'CSS' },
    { label: 'Javascript', value: 'Javascript' },
    { label: 'Git', value: 'Git' },
  ];

  const KEY = 'azertyuiopqsdfghjklmwxcvbn';

function Edit() {
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [promotion, setPromotion] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [user, setUser] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'lastname':
        setLastname(value);
        break;
      case 'firstname':
        setFirstname(value);
        break;
      case 'promotion':
        setPromotion(value);
        break;
      default:
        break;
    }
  };

  const editFormMutation = trpc.signup.editpForm.useMutation()

  const handleSubmitForm = async (lastname: string, firstname: string, promotion: string, isPublic: boolean, user: string) => {
    try {
      await editFormMutation.mutateAsync({ lastname, firstname, promotion, isPublic, user });
      setUserMessage('Form submitted successfully');
      router.push("/myprofile");
    } catch (error) {
      setUserMessage('Failed');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (lastname.length < 1 || firstname.length < 1 || promotion.length < 1) {
      setUserMessage('Invalid fields');
    } else {
        setUserMessage('Profile edited successfully');
        handleSubmitForm( lastname, firstname, promotion, isPublic, user);
    }
  };

  const handlePublicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setIsPublic(checked);
    setIsPrivate(!checked);
  };

  const handlePrivateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setIsPrivate(checked);
    setIsPublic(!checked);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt.verify(token, KEY);
      if (typeof decodedToken !== 'string') {
        const username = decodedToken.username.charAt(0).toUpperCase() + decodedToken.username.slice(1);
        setUser(username);
      }
    }
  }, []);

  const [selectedOption, setSelectedOption] = useState<{ label: string; value: string } | null>(null);

  const handleOptionChange = (option: { label: string; value: string } | null) => {
    setSelectedOption(option);
  };
  const handleAddTag = () => {
    if (selectedOption && !tags.includes(selectedOption.value)) {
      setTags([...tags, selectedOption.value]);
    }
  };
  
  return (
    <form className='myforms' onSubmit={handleSubmit}>
      <div className="flex items-center justify-center gap-[15px] my-[10%]">
        <Checkbox name="isPublic" value={isPublic} onChange={handlePublicChange}>
          Public
        </Checkbox>
        <Checkbox name="isPrivate" value={isPrivate} onChange={handlePrivateChange}>
          Private
        </Checkbox>
      </div>
      <div className="flex flex-col items-center justify-center mt-[10%]">
        <Field name="lastname" value={lastname} onChange={handleChange} type="text">
          Name
        </Field>
        <Field name="firstname" value={firstname} onChange={handleChange} type="text">
          Firstname
        </Field>
        <Field name="promotion" value={promotion} onChange={handleChange} type="text">
          Promotion
        </Field>
      </div>
      <h2 className="header mt-5">Add tags :</h2>
      <div className="flex items-center justify-center mt-[10%]">
        <div className='flex items-center justify-center w-full'>
          <div className='w-3/4'>
            <CustomSelect name='custom-select' value={selectedOption} onChange={handleOptionChange} options={options} />
          </div>
          <div className='w-1/4'>
            <button id='addtags' type="button" className='addbutton w-[90%] ml-[10%]' onClick={handleAddTag}>ADD</button>
          </div>
        </div>
      </div>
      <div id='tags' className='flex flex-wrap items-center justify-center gap-[5px] w-full mt-5'>
          {tags.map((tag, index) => (
            <div id='tag' className="tag" key={index}>
              {tag}
            </div>
          ))}
        </div>
      <div>
        <div className='mymessages'>{userMessage}</div>
        <button className='mybuttons'>Update</button>
      </div>
    </form>
  );
  }
  

export default Edit;