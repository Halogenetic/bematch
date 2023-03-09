import React, { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import jwt from "jsonwebtoken";

const KEY = 'azertyuiopqsdfghjklmwxcvbn';

interface UserProfile {
  data: any;
  firstname: string;
  lastname: string;
  promotion: string;
  tags?: string[];
  isActive: boolean;
}

function ProfileComponent() {
  const [data, setData] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt.verify(token, KEY);
      if (typeof decodedToken !== 'string') {
        const username = decodedToken.username;
        setUsername(username);
      }
    }
  }, []);

  const profileQuery = trpc.signup.getProfileByEmail.useQuery(username);

  useEffect(() => {
    async function fetchData() {
      if (username) {
        const res = await profileQuery.refetch() as unknown as UserProfile | null;
        setData(res);
      }
    }
    
    fetchData();
  }, [username]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
  <div id="feedback-form">
    <h2>User Profile</h2>
      <div id='userinfos' className='text-center text-white' style={{ backgroundColor: data.data.isActive ? 'green' : 'red' }}>{data.data.isActive ? 'Public' : 'Private'}</div>
      <div id='userinfos' className='text-black'>First Name: {data.data.firstname}</div>
      <div id='userinfos' className='text-black'>Last Name: {data.data.lastname}</div>
      <div id='userinfos' className='text-black'>Promotion: {data.data.promotion}</div>
      <div className='flex flex-wrap mt-[30px]'>{data.data.tags?.map((tag: string | null | undefined) => <div id='mytags'>{tag}</div>)}</div>
    </div>
  );
}

export default ProfileComponent;
