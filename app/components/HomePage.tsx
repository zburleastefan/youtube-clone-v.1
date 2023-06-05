'use client'
import React from 'react';
import { fetchFromRapidApi } from '../utils/fetchFromRapidApi';
import SideBar from './SideBar';
import Videos from './Videos';

type Props = {}

function HomePage({}: Props) {
  const [selectedCategory, setSelectedCategory] = React.useState('New music');
  const [videos, setVideos] = React.useState<string[]>([]);

  React.useEffect(() => {
      fetchFromRapidApi(`search?part=snippet&q=${selectedCategory}&order=date`, 10)
      .then((data) => { 
        setVideos(data.items);
      });
  }, [selectedCategory])
  
  return (
    <div className='flex flex-col md:flex-row justify-evenly'>
      <div>
        <SideBar/>
      </div>
        
      <div className='mb-1 md:mb-0'>
        <p
          className='text-white/50 text-2xl md:text-6xl md:mb-2 font-bold pl-2 md:pl-7 h-fit md:h-[10%]
          z-10 bg-gradient-to-r from-purple-500 via-red-700 to-black  rounded-xl'
        >
          {selectedCategory}<span className='text-black/70'> videos</span>
        </p>
        <Videos videos={videos} gridProps={null} isHome={true} searchInput={''}/>
      </div>
    </div>
  )
}

export default HomePage;