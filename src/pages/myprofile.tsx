import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import Link from "next/link";

const KEY = 'azertyuiopqsdfghjklmwxcvbn';

const Myprofile: NextPage = () => {

  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt.verify(token, KEY);
      if (typeof decodedToken !== 'string') {
        const username = decodedToken.username.charAt(0).toUpperCase() + decodedToken.username.slice(1);
        setUsername(username);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className="flex flex-col items-center justify-center text-neutral-500">
          <div id="myprofile" className="flex items-center justify-center w-full">Hi {username}, here is your profile !</div>
        <Link href={"/editprofile"} id="edit" className="bg-white w-[10%] text-center p-1">EDIT YOUR PROFILE</Link>
        </main>
    </>
  );
};

export default Myprofile;
