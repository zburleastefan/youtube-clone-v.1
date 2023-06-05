'use client'
import React from 'react';
import { fetchFromRapidApi } from './utils/fetchFromRapidApi';
import SideBar from './components/SideBar';
import Videos from './components/Videos';

type Props = {}

function Home({}: Props) {
  const [selectedCategory, setSelectedCategory] = React.useState('New music');
  const [videos, setVideos] = React.useState<string[]>([]);

  React.useEffect(() => {
      fetchFromRapidApi(`search?part=snippet&q=${selectedCategory}&order=date`, 15)
      .then((data) => { 
        setVideos(data.items);
      });
  }, [selectedCategory])
  
  return (
    <div className='flex flex-col md:flex-row justify-evenly'>
      <div>
        <SideBar />
      </div>
      <div className='flex flex-col overflow-hidden mb-1'>
        <p
          className='text-white/50 text-2xl md:text-6xl md:mb-2 font-bold px-2 md:px-7 sticky h-fit 
          z-10 bg-gradient-to-r from-purple-500 via-red-700 to-black  rounded-xl  p-5'
        >
          {selectedCategory}<span className='text-black/70'> videos</span>
        </p>
        <Videos videos={videos} gridProps={null} isHome={true} searchInput={''}/>
      </div>
    </div>
  )
}

export default Home;