'use client'
import { authContext } from '@/context/AuthContext';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query } from 'firebase/firestore';
import { firestoreDB } from '@/firebase/firebaseConfig';
import SearchedThermRow from './SearchedThermRow';
import React from 'react';

function SideBar() {
    const [youtubeUrlList, loading, error] = useCollection(
        authContext && query(collection(firestoreDB, 'users', authContext?.currentUser?.email!, 'UID', authContext?.currentUser?.uid!, 'youtubeUrlList'),
        orderBy('createdAt', 'desc') 
    ));

    return (
        <div className='p-1 flex flex-row md:flex-col md:overflow-hidden '>
                <div className='hidden md:block text-center md:mb-8 border-r rounded-full border-l'>
                    <h1 className='text-white/80 text-lg font-bold hover:text-red-500/80'>Search list</h1>
                </div>
            <div className='flex flex-row md:flex-col md:h-[150vh] overflow-y-auto overflow-x-hidden'>

                <div className='flex flex-row md:flex-col md:space-y-2'>
                    {loading && (
                        <div className='text-white text-center animate-bounce text-base'>
                        <p>Loading...</p>
                        </div>
                    )}  
                </div>

                <div className='overflow-auto '>
                    { youtubeUrlList?.empty ? (
                        <div className='flex flex-row md:flex-col flex-1 overflow-x-auto overflow-y-hidden md:overflow-y-auto md:overflow-x-hidden'>
                            <div className="text-white text-center mt-10 ">
                                <div className="flex mx-auto justify-center mt-6 animate-bounce">
                                    <p className="my-auto">Search list empty...</p>
                                </div>
                            </div>
                        </div>
                        
                    ) : (
                        <div className='flex flex-row md:flex-col flex-1 overflow-x-auto overflow-y-hidden md:overflow-y-auto md:overflow-x-hidden'>
                            { youtubeUrlList?.docs.map(youtubeUrlList => 
                                <SearchedThermRow key={youtubeUrlList.id} id={youtubeUrlList.id} name={youtubeUrlList.data().urlList[0]?.videoTitle} videoid={youtubeUrlList.data()._videoID}/>   
                            )} 
                        </div>
                    )}
                </div>
            </div>
            <div className={`md:flex items-center justify-around mx-auto overflow-hidden mb-2 min-w-fit hidden ${youtubeUrlList?.empty && 'hidden'}`}>
                <div className='flex  flex-col items-center align-middle justify-evenly md:flex-row md:space-x-3 lg:space-x-10 p-3 space-y-3'>
                    <p className='text-white/50 text-sm text-center '>@2023 Z-Tech</p>
                </div>
            </div>
        </div>
    )
}

export default SideBar;