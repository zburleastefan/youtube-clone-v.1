'use client'
import Videos from '@/app/components/Videos';
import { fetchFromRapidApi } from '@/app/utils/fetchFromRapidApi';
import { usePathname } from 'next/navigation';
import React from 'react';
import Image from 'next/image';

type Props = {}

function ChannelPage({}: Props) {
  const path = usePathname();
  const [channelDetails, setChannelDetails] = React.useState<{ 
    id: {
      channelId: string,
    },
    snippet: {
        title: string,
        thumbnails: {
            high: {
                url: string,
            }
        }
    }
  }>();
  const [channelVideos, setChannelVideos] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    const channelIdFromPath = path?.slice(9);
    console.log(channelIdFromPath + " = chanel id from path")
    fetchFromRapidApi(`channels?part=snippet&id=${channelIdFromPath}`, 1)
    .then((data) => { 
      setChannelDetails(data?.items[0]); 
      // console.log('channel page : ' + JSON.stringify(data) );
    });
    
    fetchFromRapidApi(`search?channelId=${channelIdFromPath}&part=snippet&order=date`, 20)
    .then((data) => { 
      setChannelVideos(data?.items);
      let urlList: string[] = [];
      for (let i = 0; i < data?.items.length; ++i) {
        urlList.push(`https://www.youtube.com/watch?v=${data.items[i].id.videoId}&rel=0&embed/${data.items[i].id.videoId}?showinfo=0&enablejsapi=1`);
      }
    });
  }, [])

  return (
    <div className='flex flex-col md:flex-row w-full justify-evenly'>
      <div className='mb-1 md:mb-0'>
        <div className='flex flex-col justify-center items-center align-middle text-center text-white'>       
          <div
            className='w-screen justify-center items-center flex-col flex md:mb-2 font-bold pl-2 md:pl-7 h-fit 
            z-10 bg-gradient-to-r from-purple-500 via-red-700 to-black  rounded-xl'
          >
            <Image 
              src={channelDetails?.snippet?.thumbnails?.high?.url!}
              alt='alt'
              width="0"
              height="0"
              sizes="100vw"
              className="w-[250px] h-auto rounded-full"
              placeholder="blur"
              blurDataURL={'/ytLogo.svg'}
            />
            <h6 className='font-semibold text-base text-white/90'>
              <span className='text-white font-serif font-bold text-lg'>{channelDetails?.snippet?.title}</span> channel
            </h6>  
          </div>
        </div>
        <Videos videos={channelVideos} gridProps={null} isHome={false} searchInput={''}/>
      </div>
    </div>
  )
};

export default ChannelPage;