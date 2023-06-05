'use client'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import fallbackImg from "../../public/defaultVideoImg.svg";

type Props = {
    channelDetail: {
        id: {
            channelId: string
        },
        snippet: {
            title: string,
            thumbnails: {
                high: {
                    url: string,
                }
            }
        },
    }
}

function ChannelCard({channelDetail}: Props) {
    const [imageError, setImageError] = React.useState(false);
    return (
        <div>
            <Link href={channelDetail?.id?.channelId ? `/channel/${channelDetail?.id?.channelId}` : '/'}>
                <div className='flex flex-col justify-center items-center align-middle text-center text-white'>
                    {imageError && (
                        <div className='md:mt-6'></div>
                    )}
                    <Image 
                        src={imageError ? fallbackImg : channelDetail?.snippet?.thumbnails?.high?.url}
                        alt='img'
                        width="0"
                        height="0"
                        sizes="100vw"
                        className="w-[200px] h-auto rounded-full"
                        placeholder="blur"
                        blurDataURL={'/defaultVideoImg.svg'}
                        onError={() => setImageError(true)}
                    />
                    <h6 className='font-semibold text-base text-white/90'>
                        <span className='text-white font-serif font-bold text-lg'>{channelDetail?.snippet?.title}</span> channel
                    </h6>  
                </div>
            </Link>
        </div>
    )
}

export default ChannelCard;