import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { adminDb } from '@/firebase/adminConfig';

type Data = {
    answer: string
}
  
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
){
    
    const {urlList , auth, videoID, searchInput} = req.body;

    if (!req.body.urlList) return res.status(400).json({answer: 'No url list!'});

    const Urls: PostUrls = {
        _searchedFor: searchInput,
        _videoID: videoID,
        urlList: urlList,
        createdAt: admin.firestore.Timestamp.now(),
        user: {
            id: auth?.currentUser?.uid!,
            name: auth?.currentUser?.displayName! || auth?.currentUser?.email!,
            avatar: auth?.currentUser?.photoURL!,
        },
    };

    // add message to firestore DB
    const dbResponse = await adminDb
    .collection("users")
    .doc(auth?.currentUser?.email!)
    .collection("UID")
    .doc(auth?.currentUser?.uid!)
    .collection("youtubeUrlList")
    .add(Urls);
    
    // console.log('dbResponse: ' + dbResponse.path);

    res.status(200).json({ answer: "Success! url's posted to DB." })
}