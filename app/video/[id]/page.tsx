import VideoPage from '@/app/components/VideoPage';

type Props = {
  params: {
      id: string
  }
}

function Video({params: {id}}: Props) {
  return (
    <div className="flex flex-col">
      <VideoPage videoId={id}/>
    </div>
  )
};

export default Video;