'use client'
import { demoVideoTitle } from '../utils/constants';
import Image from 'next/image';
import { fetchFromRapidApi } from '../utils/fetchFromRapidApi';
import { auth, firestoreDB } from '@/firebase/firebaseConfig';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query } from 'firebase/firestore';
import { authContext } from '@/context/AuthContext';
import React from 'react';
import fallbackImg from "../../public/defaultVideoImg.svg";

type Props = {
    video: {
        id: {
            videoId: string,
        },
        snippet: {
            thumbnails: {
                high: {
                    url: string
                }
            },
            title: string,
            channelId: string,
            channelTitle: string,
        }
    },
    searchInput: string
}

function VideoCard({video, searchInput}: Props) {
    const router = useRouter();
    const [imageError, setImageError] = React.useState(false);
    const [urlList] = useCollection(authContext && query(
        collection(firestoreDB, "users", authContext?.currentUser?.email!, "UID", authContext?.currentUser?.uid!, 'youtubeUrlList'),
        orderBy("createdAt","desc"),
      ));  
    

    const searchSimilarVideosAndAddToDb = async () => {
        try {
            let existVidId = false;
            urlList?.docs.map((url) => {
                if (url.data()._videoID === video?.id?.videoId) {
                    existVidId = true;
                }
            })

            if (existVidId == false) {
                await fetchFromRapidApi(`search?part=snippet&relatedToVideoId=${video?.id?.videoId}&type=video`, 20)
                .then(async (data) => { 
                    let urlList: { id: number, videoTitle: string, videoId: string, channelTitle: string, channelId: string, thumbnail: string, link: string }[] = [
                        { "id": 0, 'videoTitle': video?.snippet?.title , 'videoId': video?.id?.videoId, 'channelTitle' : video?.snippet?.channelTitle, 
                        'channelId' : video?.snippet?.channelId, thumbnail: video?.snippet?.thumbnails?.high?.url, 
                        'link': `https://www.youtube.com/watch?v=${video?.id?.videoId}&rel=0&embed/${video?.id?.videoId}?showinfo=0&enablejsapi=1&origin=https://www.youtube.com` }
                    ];
                    for (let i = 0; i < data?.items.length; ++i) {
                        urlList.push({ "id": i + 1, 'videoTitle': data.items[i].snippet.title , 'videoId': data.items[i].id.videoId, 
                        'channelTitle' : data.items[i].snippet.channelTitle, 'channelId' : data.items[i].snippet.channelId, 
                        'thumbnail':data.items[i].snippet.thumbnails.high.url, 
                        'link': `https://www.youtube.com/watch?v=${data.items[i].id.videoId}&rel=0&embed/${data.items[i].id.videoId}?showinfo=0&enablejsapi=1&origin=https://www.youtube.com`});
                    }
                    const vidId = video?.id?.videoId;
                    Promise.all(urlList).then(async () => {
                        await fetch("/api/sendUrls", {
                            method: "POST",
                            headers: {
                            "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                urlList: urlList,
                                auth: auth,
                                videoID: vidId,
                                searchInput: searchInput,
                            }),     
                        }).then(async (response) => {
                            const imageResponse = await response.json();
                            // setImageURL(imageResponse.answer);
                            toast.success(imageResponse.answer)
                        })
                        .catch((error) => {
                            toast.error(error.toString());
                        })
                    });
                });
            }
        } catch (error: any) {
            toast.error(error.toString());
        } finally {
            router.push(`/video/${video?.id?.videoId}`);
        }
    }
    
    return (                   
        <section className='justify-center items-center flex my-1 md:my-0'>                           
            <button 
                onClick={searchSimilarVideosAndAddToDb}
            >
                <blockquote>
                    <div className="tracking-tight w-[250px]">  
                        {imageError && (
                            <div className='md:mt-6'></div>
                        )}
                        <Image 
                            src={imageError ? fallbackImg : video.snippet.thumbnails.high.url}
                            alt='img'
                            width="0"
                            height="0"
                            sizes="100vw"
                            className="w-[250px] h-auto hover:scale-105 duration-500 ease-in transition"
                            placeholder="blur"
                            blurDataURL={'/defaultVideoImg.svg'}
                            onError={() => setImageError(true)}
                        />
                        <p className='font-bold text-sm text-white/80'>
                            {video?.snippet?.title.slice(0, 60) || demoVideoTitle.slice(0, 60)}
                        </p>
                    </div>
                </blockquote>
            </button>   
        </section>
    )
};

export default VideoCard;