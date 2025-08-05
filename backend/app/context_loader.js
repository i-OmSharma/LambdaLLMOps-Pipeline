//  Loads S3

import AWS from "aws-sdk";

// import AWSMock from "aws-sdk-mock"

// only for testing.
// AWSMock.mock('s3', 'getObject', function(params, callback) {
//     callback(null, {Body:JSON.stringify({message: "mock data"})})
// })

const s3 = new AWS.S3();

export default async function loadContext(fileName) {
    const BUCKET = process.env.CONTEXT_BUCKET;
    try {
        console.log("📁 Loading context file from s3...");
        const data = await s3.getObject({
            Bucket: BUCKET, 
            Key:fileName
        }).promise()

        return JSON.parse(data.Body.toString());

    } catch (error) {
        console.error("Error loading conext from s3:", error);
        return{context: ''}
    }
}