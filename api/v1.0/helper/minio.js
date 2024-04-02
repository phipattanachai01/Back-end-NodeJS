/** @format */

const FILENAME = __filename.replace(/^.*[\\\/]/, '');
const { minioconnection } = require('../../../connection');
var minioClient = minioconnection;
async function listBuckets() {
 try {
  return new Promise(async (resolve, reject) => {
   minioClient.listBuckets(
    await function (err, buckets) {
     if (err) return reject(err);

     resolve(buckets);
    }
   );
  });
 } catch (error) {
  var err = new Error('FunctionError', `Error from ${FILENAME} : ${arguments.callee.name} | ${error.message}`);
  err.name = 'FunctionError';
  throw err;
 }
}

async function makeBucket(bucketName, region) {
 try {
  return new Promise(async (resolve, reject) => {
   minioClient.makeBucket(bucketName, region || '', function (err) {
    if (err) return reject(err);
    resolve(`Bucket created successfully`);
   });
  });
 } catch (error) {
  var err = new Error(`Error from ${FILENAME} : ${arguments.callee.name} | ${error.message}`);
  err.name = 'FunctionError';
  throw err;
 }
}

async function putObjectUploadFile(backet_name, file, buffer) {
 try {
  return new Promise(async (resolve, reject) => {
   minioClient.putObject(backet_name, file, buffer, function (err, etag) {
    if (err) return reject(err);
    etag.file_name = file;
    etag.backet_name = backet_name;
    resolve(etag);
   });
  });
 } catch (error) {
  var err = new Error(`Error from ${FILENAME} : ${arguments.callee.name} | ${error.message}`);
  err.name = 'FunctionError';
  throw err;
 }
}

async function copyObjectCpoyFile(backet_name, file) {
 // var conds = new Minio.CopyConditions()
 minioClient.copyObject(
  backet_name,
  file,
  '/asset/test',
  /*conds,*/ function (e, data) {
   if (e) {
    return console.log(e);
   }
   console.log('Successfully copied the object:');
   console.log('etag = ' + data.etag + ', lastModified = ' + data.lastModified);
  }
 );
}

module.exports = {
 listBuckets,
 makeBucket,
 putObjectUploadFile,
 copyObjectCpoyFile,
};