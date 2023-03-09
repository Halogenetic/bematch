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
    <div>
      <h2>User Profile</h2>
      <p>First Name: {data.data.firstname}</p>
      <p>Last Name: {data.data.lastname}</p>
      <p>Promotion: {data.data.promotion}</p>
      <p>Tags: {data.data.tags?.join(', ')}</p>
      <p>Profile Status: {data.data.isActive ? 'Public' : 'Private'}</p>
    </div>
  );
}

export default ProfileComponent;
