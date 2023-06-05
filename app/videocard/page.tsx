
'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { authContext } from '@/context/AuthContext';
import { collection, orderBy, query } from 'firebase/firestore';
import { firestoreDB } from '@/firebase/firebaseConfig';
import { fetchFromRapidApi } from '../utils/fetchFromRapidApi';
import toast from 'react-hot-toast';
import LoadingDots from '../components/LoadingDots';

type Props = {}

function VideoCardPage({}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const videoId = searchParams?.get('videoId');
    const thumbnail = searchParams?.get('thumbnail');
    const videoTitle = searchParams?.get('videoTitle');
    const channelId = searchParams?.get('channelId');
    const channelTitle = searchParams?.get('channelTitle');

    const [urlList] = useCollection(authContext && query(
        collection(firestoreDB, "users", authContext?.currentUser?.email!, "UID", authContext?.currentUser?.uid!, 'youtubeUrlList'),
        orderBy("createdAt","desc"),
      ));  
    
    const searchSimilarVideosAndAddToDb = async () => {
        try {
            let existVidId = false;
            urlList?.docs.map((url) => {
                if (url.data()._videoID === videoId) {
                    existVidId = true;
                }
            })

            if (existVidId == false) {
                await fetchFromRapidApi(`search?part=snippet&relatedToVideoId=${videoId}&type=video`, 20)
                .then(async (data) => { 
                    let urlList: { id: number, videoTitle: string, videoId: string, channelTitle: string, channelId: string, thumbnail: string, link: string }[] = [
                        { "id": 0, 'videoTitle': videoTitle! , 'videoId': videoId!, 'channelTitle' : channelTitle!, 
                        'channelId' : channelId!, thumbnail:thumbnail!, 
                        'link': `https://www.youtube.com/watch?v=${videoId}&rel=0&embed/${videoId}?showinfo=0&enablejsapi=1&origin=https://www.youtube.com` }
                    ];
                    for (let i = 0; i < data?.items.length; ++i) {
                        urlList.push({ "id": i + 1, 'videoTitle': data.items[i].snippet.title , 'videoId': data.items[i].id.videoId, 
                        'channelTitle' : data.items[i].snippet.channelTitle, 'channelId' : data.items[i].snippet.channelId, 
                        'thumbnail':data.items[i].snippet.thumbnails.high.url, 
                        'link': `https://www.youtube.com/watch?v=${data.items[i].id.videoId}&rel=0&embed/${data.items[i].id.videoId}?showinfo=0&enablejsapi=1&origin=https://www.youtube.com`});
                    }
                    Promise.all(urlList).then(async () => {
                        await fetch("/api/sendUrls", {
                            method: "POST",
                            headers: {
                            "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                urlList: urlList,
                                auth: authContext,
                                videoID: videoId,
                                searchInput: '',
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
            router.push(`/video/${videoId}`);
        }
    }

    React.useEffect(() => {
        searchSimilarVideosAndAddToDb();
    }, [])
    
   
  return (
    <div 
        className="flex h-screen w-screen bg-black bg-no-repeat bg-center bg-contain bg-[url('/ytLogo.svg')] 
        items-center text-center align-middle object-scale-down place-items-center justify-center overflow-y-hidden overflow-x-clip p-3"
    >
        <h1 className="text-3xl font-display font-serif md:text-5xl font-bold tracking-normal text-black ">
            Loading{" "}
            <span className="relative text-3xl"><LoadingDots /></span>
        </h1>
    </div>
  )
}

export default VideoCardPage;