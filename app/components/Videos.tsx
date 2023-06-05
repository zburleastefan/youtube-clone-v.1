import ChannelCard from './ChannelCard';
import VideoCard from './VideoCard';

type Props = {
    videos: any[],
    gridProps: string | null,
    isHome: boolean,
    searchInput: string
}

function Videos({videos, gridProps, isHome, searchInput}: Props) {
  return (
    <div className={`grid ${gridProps != null ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}  gap-2 md:gap-10 text-white`}>
        {videos?.map((item, index) => (
            <ul key={index}>
                {item?.id?.channelId && <ChannelCard channelDetail={item}/>}
                {item?.id?.videoId && <VideoCard video={item} searchInput={searchInput}/>}
            </ul>
        ))}
    </div>
  )
};

export default Videos;