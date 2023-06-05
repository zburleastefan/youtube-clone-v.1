'use client'
import React from 'react';
import ReactPlayer from 'react-player/lazy';
import { BackwardIcon, ForwardIcon, PauseIcon,  PlayIcon } from '@heroicons/react/24/solid';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestoreDB } from '@/firebase/firebaseConfig';
import { collection, orderBy, query } from 'firebase/firestore';
import { authContext } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import fallbackImg from "../../public/defaultVideoImg.svg";

type Props = {
    videoId: string
}
 
const VideoPage = ({videoId}: Props) => {
    const [hideScreen, setHideScreen] = React.useState(false);
    const [prevImageError, setPrevImageError] = React.useState(false);
    const [nextImageError, setNextImageError] = React.useState(false);
    const [currentUrlIndex, setCurrentUrlIndex] = React.useState(0);
    const [isPlaying, setIsPlaying] = React.useState(true);
    const [prewVidImg, setPrewVidImg] = React.useState(false);
    const [nextVidImg, setNextVidImg] = React.useState(false);
    const playerRef = React.useRef<ReactPlayer>(null);
    const [videoUrls , setVideoUrls] = React.useState<Array<Url>>([]);

    const [youtubeUrlList] = useCollection(
        authContext && query(collection(firestoreDB, 'users', authContext?.currentUser?.email!, 'UID', authContext?.currentUser?.uid!, 'youtubeUrlList'),
        orderBy('createdAt', 'desc') 
    ));

    const onReady = React.useCallback(() => {
        const timeToStart = 0;
        playerRef?.current?.seekTo(timeToStart, 'seconds');
        setIsPlaying(true);
    }, [playerRef?.current]);

    if (videoUrls?[0].length == 0 || videoUrls[0] == undefined : '') {
        youtubeUrlList?.docs.map((youtubeUrlList) => {
            if(youtubeUrlList.data()._videoID == videoId) {
                // console.log(JSON.stringify(youtubeUrlList.data().urlList))
                setVideoUrls(youtubeUrlList.data().urlList);
            }
        })
    }

    const [windowSize, setWindowSize] = React.useState({
        width: 0,
        height: 0,
    });

    React.useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        // Add event listener
        window.addEventListener("resize", handleResize);
        handleResize();
        // Remove event listener
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={`flex flex-col items-center`}>
            <div className={`flex-col my-10  justify-start items-center text-center  ${hideScreen ? 'hidden' : 'flex'}`}>
                <ReactPlayer
                    onEnded={() => {
                        //play next video
                        setCurrentUrlIndex(
                            prevUrlIndex => (prevUrlIndex + 1) % videoUrls?.length
                        )
                    }}
                    onPlay={() => {
                        setIsPlaying(true);
                    }}
                    onPause={() =>{
                        setIsPlaying(false);
                    }}
                    ref={playerRef}
                    url={videoUrls[currentUrlIndex]?.link}
                    playing={isPlaying}
                    height={windowSize.height/2 + 0.1*windowSize.height}
                    width={(windowSize.width - (windowSize.width > windowSize.height? windowSize.width/10 : (windowSize.width/10 + 30)))}    
                    controls
                    // light={videoUrls[currentUrlIndex]?.thumbnail ? videoUrls[currentUrlIndex].thumbnail : '/ytLogo.svg'}
                    onReady={onReady}
                />
        
                <div className='flex flex-col justify-between items-center'>
                    <h6 className='text-white font-bold text-base md:text-xl px-10 md:px-20'>{videoUrls[currentUrlIndex]?.videoTitle}</h6>
                    <div className={`flex flex-row justify-center items-center m-2 w-[80%]`}>
                        <Link className='text-white/90 md:hover:text-white md:hover:scale-105 ease-in-out transition font-serif md:font-bold text-base md:text-xl overflow-y-auto overflow-x-hidden' href={`/channel/${videoUrls[currentUrlIndex]?.channelId}`}>
                            @{videoUrls[currentUrlIndex]?.channelTitle}
                        </Link>
                    </div>
                </div>

                <div className='flex flex-row z-10 my-2 justify-between w-[50%] '>
                    { prewVidImg && (
                        <div className='items-center flex flex-col left-[10%] z-40 absolute w-20'>
                            <Image 
                                src={prevImageError ? fallbackImg : (videoUrls[currentUrlIndex - 1]?.thumbnail ? videoUrls[currentUrlIndex - 1].thumbnail : videoUrls[videoUrls.length - 1]?.thumbnail)}
                                alt=''
                                width="0"
                                height="0"
                                sizes="100vw"
                                className="w-[50px] h-auto"
                                placeholder="blur"
                                blurDataURL={'/defaultVideoImg.svg'}
                                onError={() => setPrevImageError(true)}
                            />
                            <h6 className='text-white  text-xs'>{ videoUrls[currentUrlIndex - 1]?.videoTitle ? videoUrls[currentUrlIndex - 1]?.videoTitle : videoUrls[videoUrls.length - 1]?.videoTitle }</h6>
                        </div>
                    )}
                    <button
                        onMouseEnter={() => setPrewVidImg(true)}
                        onMouseLeave={() => setPrewVidImg(false)}
                        onClick={() => {
                            setCurrentUrlIndex(
                                prevUrlIndex => {
                                    if (prevUrlIndex == 0 ) {
                                        return videoUrls?.length - 1;
                                    } else {
                                        return (prevUrlIndex - 1) % videoUrls?.length;
                                    }
                                }
                            );
                            setIsPlaying(true);
                            setNextImageError(false);
                            setPrevImageError(false);
                        }}
                    >
                        <BackwardIcon className='md:hover:scale-125 transition duration-700 ease-in-out w-10 h-10 text-white' type="font"/>
                    </button>
                    { isPlaying ? (
                        <button
                            onClick={() => {
                                setIsPlaying(false);
                            }}
                        >
                            <PauseIcon className='md:hover:scale-125 transition duration-700 ease-in-out w-10 h-10 text-white'  type="font"/>
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setIsPlaying(true);
                            }}
                        >
                            <PlayIcon className='md:hover:scale-125 transition duration-700 ease-in-out w-10 h-10 text-white' type="font"/>
                        </button>
                    )}
                    <button
                        onMouseEnter={() => setNextVidImg(true)}
                        onMouseLeave={() => setNextVidImg(false)}
                        onClick={() => {
                            setCurrentUrlIndex(
                                prevUrlIndex => {
                                    if (prevUrlIndex == (videoUrls?.length - 1)) {
                                        return 0;
                                    } else {
                                        return (prevUrlIndex + 1) % videoUrls?.length;
                                    }
                                }
                            );
                            setIsPlaying(true);
                            setNextImageError(false);
                            setPrevImageError(false);
                        }}
                    >
                        <ForwardIcon className='md:hover:scale-125 transition duration-700 ease-in-out w-10 h-10 text-white' type="font"/>
                    </button>
                    { nextVidImg && (
                        <div className='items-center flex flex-col right-[10%] z-40 absolute w-20'>
                            <Image 
                                src={nextImageError ? fallbackImg : (videoUrls[currentUrlIndex + 1]?.thumbnail ? videoUrls[currentUrlIndex + 1].thumbnail : videoUrls[0]?.thumbnail)}
                                alt=''
                                width="0"
                                height="0"
                                sizes="100vw"
                                className="w-[50px] h-auto"
                                placeholder="blur"
                                blurDataURL={'/defaultVideoImg.svg'}
                                onError={() => setNextImageError(true)}
                            />
                            <h6 className='text-white  text-xs'>{videoUrls[currentUrlIndex + 1]?.videoTitle ? videoUrls[currentUrlIndex + 1]?.videoTitle : videoUrls[0]?.videoTitle }</h6>
                        </div>
                    )}
                </div>
            </div>
            
            <div className={`flex-col m-1 justify-evenly items-center text-center ${hideScreen ? 'hidden' : 'flex'}`}>
                { videoUrls?.map((url) => 
                    <ul key={url?.id} >
                        <Link 
                            href={{
                                pathname: '/videocard',
                                query: { 
                                    videoId: url?.videoId,
                                    thumbnail: url?.thumbnail,
                                    videoTitle: url?.videoTitle,
                                    channelId: url?.channelId,
                                    channelTitle: url?.channelTitle,
                                }
                            }}
                            className='items-center flex m-2 text-white'
                        >
                            <Image
                                src={url?.thumbnail}
                                alt=''
                                width="0"
                                height="0"
                                sizes="100vw"
                                className="w-[50px] h-auto hover:scale-150 transition duration-700 ease-in-out"
                                placeholder="blur"
                                blurDataURL={'/defaultVideoImg.svg'}
                            />
                            <p className='font-serif mx-2 hover:shadow-md hover:shadow-red-500 rounded-b-md px-1'>{url?.videoTitle}</p>
                        </Link>
                    </ul>
                )}
            </div>
            <button 
                className={`font-bold border rounded-2xl p-1 ${ hideScreen ? 'bottom-0 align-bottom mt-[3000px] border-white/30 text-white/30' : 'm-1 text-white'}`}
                onClick={() => setHideScreen(current  => !current)}
            >
                { hideScreen ? 'Show' : 'Hide'} Screen
            </button>
        </div>
    )
};

export default VideoPage;