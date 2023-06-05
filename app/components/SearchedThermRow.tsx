import { authContext } from '@/context/AuthContext';
import { firestoreDB } from '@/firebase/firebaseConfig';
import { FilmIcon, TrashIcon } from '@heroicons/react/24/solid';
import { deleteDoc, doc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
    videoid: string,
    id:string,
    name: string,
}

function SearchedThermRow({id, name, videoid}: Props) {
    const router = useRouter();

    const removeChat = async () => {
        await deleteDoc(doc(firestoreDB, 'users', authContext?.currentUser?.email!, 'UID', authContext?.currentUser?.uid!, 'youtubeUrlList', id));
    };

  return (
    <div className={`searchRow`}>
        <FilmIcon className='h-5 w-7 text-[#f84a3d] hover:text-white' onClick={() => router.push(`/video/${videoid}`)}/>
        <Link href={`/video/${videoid}`} className='flex-1 inline-flex truncate justify-start'>
            <p className='md:overflow-auto'>            
                {name || videoid}
            </p>
        </Link>
        <TrashIcon onClick={removeChat} className='h-5 w-5 text-gray-100/70 hover:text-red-700'/>
    </div>
  )
};

export default SearchedThermRow;
