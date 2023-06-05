'use client'
import React from 'react';
import Videos from '../../components/Videos';
import { fetchFromRapidApi } from '../../utils/fetchFromRapidApi';
import { usePathname } from 'next/navigation';

type Props = {}

function SearchPage({}: Props) {
    const path = usePathname();
    let searchInput = path?.slice(8);
    const [videos, setVideos] = React.useState<string[]>([]);

    if (searchInput?.includes('%20')) {
      searchInput = searchInput.replace(/%20/g, ' ');
    }

    React.useEffect(() => {
        fetchFromRapidApi(`search?part=snippet&q=${searchInput}&order=date`, 30)
        .then((data) => { 
            setVideos(data.items); 
        });
    }, [searchInput])

    return (
        <div className='flex flex-col md:flex-row justify-center items-center'>
            <div className='flex flex-col overflow-hidden mb-1'>
                <p
                    className='text-white/50 text-2xl md:text-6xl md:mb-2 font-bold md:ml-1 px-2 md:px-7 sticky h-fit 
                    z-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-5'
                >
                    Search results for <span className='text-red-400'>{searchInput}</span>
                </p>

                <div className=' overflow-auto m-1'>
                    <Videos videos={videos} gridProps={null} isHome={false} searchInput={searchInput? searchInput : '' }/>
                </div>
            </div>
        </div>
    )
};

export default SearchPage;