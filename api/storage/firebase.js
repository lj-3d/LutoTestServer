const admin = require("firebase-admin");
const {Storage} = require('@google-cloud/storage');
require("dotenv").config();
const uuid = require("uuid-v4");
// Creates a client
const projectId = 'lubotestserver'
const keyFilename = './service/lubotestserver-firebase-adminsdk-ocyb0-ebf7446ca3.json'
const storage = new Storage({projectId, keyFilename});


const serviceAccount = require("../../service/lubotestserver-firebase-adminsdk-ocyb0-ebf7446ca3.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://lubotestserver.appspot.com"
});

const bucket = admin.storage().bucket();

/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */
const uploadImageToStorage = (req) => {
    return new Promise((resolve, reject) => {
        let file = req.file;
        if (!file) {
            reject('No image file');
        }
        const filename = req.userData.phoneNumber;
        let newFileName = `avatars/${filename}.jpg`;

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                firebaseStorageDownloadTokens: uuid(),
            }
        });

        blobStream.on('error', (error) => {
            reject('Something is wrong! Unable to upload at the moment.');
        });

        blobStream.on('finish', () => {
            const config = {
                action: 'read',
                expires: '01-01-2026',
            };
            const uploadedFile = bucket.file(newFileName);
            uploadedFile.getSignedUrl(config, (error, url) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(url);
                }
            });
        });
        blobStream.end(file.buffer);
    });

};

module.exports = {
    storageBucket: bucket,
    uploadImageToStorage: uploadImageToStorage
}