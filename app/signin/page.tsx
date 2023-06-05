'use client'
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import singInWithGoogle from '@/context/auth/singinwithgoogle';
import { toast } from 'react-hot-toast';
import Notification from './../components/Notification';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';

type Props = {}

function SignIn({}: Props) {
    const handleForm = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const {result, error} = await singInWithGoogle();
        if (error) {
            toast.error(error.toString());
            if(auth.currentUser?.emailVerified != true) {
                await sendEmailVerification(auth?.currentUser!)
                .then(() => {
                    toast.success('Please check your email and activate your account!')
                }).catch((err) => {
                    toast.error(err.toString())
                });
            }
        }
    }

return ( 
    <div 
        className="flex flex-col h-screen w-screen bg-black bg-no-repeat bg-center bg-contain bg-[url('/ytLogo.svg')] object-scale-down text-center items-center justify-center
        overflow-y-hidden overflow-x-clip p-3 align-middle"
    >      
        <section className='grid w-screen h-screen justify-center md:mt-10 items-center align-middle overflow-y-auto overflow-x-hidden'>
            <Notification/>
            <div className='relative flex flex-1 md:m-20 flex-col items-center justify-center'>
                <form className='relative flex flex-col justify-center items-center text-center align-middle bg-transparent' 
                    onSubmit={handleForm}
                >                                                                           
                    <div className='justify-between flex flex-col items-center'>
                        <div className='flex-1 md:mb-5'>
                            <h1  className='text-white p-1 my-10 font-bold text-3xl'>Youtube Clone</h1>
                            <button
                                type="submit"
                                className="p-2 hover:shadow-lg w-fit hover:shadow-amber-400 opacity-90 hover:bg-red-500
                                hover:opacity-95 bg-black rounded-full cursor-pointer font-semibold text-white md:mt-1"
                                >
                                <FcGoogle className='inline-block w-8 h-8 md:w-12 md:h-12'/> 
                                <span> Sign in with <span className='font-bold'>Google</span></span>
                            </button>    
                        </div> 
                    </div>              
                </form>                         
            </div>
        </section>
        <div className='text-gray-700'>
            <p>Powered by</p>
            <div className='flex-row flex'>
                <a 
                className='text-gray-600' 
                href="https://firebase.google.com/"  
                target="_blank"  
                >
                    <p className='text-gray-500 p-1 font-bold'>Firebase</p>
                </a>
                <a 
                className='text-gray-600' 
                href="https://www.netlify.com/"  
                target="_blank"  
                >
                    <p className='text-gray-500 p-1 font-bold'>Netlify</p>
                </a>
                <a 
                className='text-gray-600' 
                href="https://www.prisma.io/"  
                target="_blank"  
                >
                    <p className='text-gray-500 p-1 font-bold'>Rapid API</p>
                </a>
            </div>
        </div>                    
    </div>
)}

export default SignIn;