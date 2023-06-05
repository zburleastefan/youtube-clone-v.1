interface PostUrls {
    _searchedFor: string,
    _videoID: string,
    createdAt: admin.firestore.serverTimestamp,
    urlList: { 
        id: number, 
        videoTitle: string, 
        videoId: string, 
        channelTitle: string, 
        channelId: string, 
        thumbnail: string, 
        link: string 
    }[],
    user: {
        id: string,
        name: string,
        avatar: string,
    },
}

interface Url {
    id: number,
    videoTitle: string, 
    videoId: string, 
    channelTitle: string, 
    channelId: string, 
    thumbnail: string, 
    link: string 
}
interface initialData {
    urlListFromDb: string[]
}
