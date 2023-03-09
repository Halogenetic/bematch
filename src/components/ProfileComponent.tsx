import React, { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import jwt from "jsonwebtoken";
import Link from 'next/link';

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
    <div className='h-auto flex flex-col items-center justify-center'>
      <Link href={"/editprofile"} id="edit" className="bg-white w-[150px] text-center p-1 m-[50px]">EDIT YOUR PROFILE</Link>
      <div id="myprofilebox" className='flex flex-col items-center justify-center'>
        <div id='userinfos' className='text-center text-white w-full' style={{ backgroundColor: data.data.isActive ? 'green' : 'red' }}>{data.data.isActive ? 'Public' : 'Private'}</div>
        <div id='userinfos' className='text-center text-black'>{data.data.firstname} {data.data.lastname}</div>
        <div id='userinfos' className='text-center text-black'>{data.data.promotion}</div>
        <div className='flex flex-wrap mt-[30px]'>{data.data.tags?.map((tag: string | null | undefined) => tag ? <div id='mytags'>{tag}</div> : null)}</div>
      </div>
    </div>

  );
}

export default ProfileComponent;
