var rescode = require('../../../responsecode.json');

const FILENAME = __filename.replace(/^.*[\\\/]/, '');
const { listBuckets, makeBucket, putObjectUploadFile, copyObjectCpoyFile } = require('../helper/minio');
const functionBasicCenter = require('../middleware/functionBasicCenter');
const { dateTimeFormater, keysToCamel, convertBytesToMegabytes } = require('../middleware/formatConverter');
const Log = require('../models/log');
const fileModel = require('../models/file');

var { MINIO_BUCKET, minioConfig } = require('../../../config/default');

const uploadFile = async function uploadFile(req, res) {
    var start = new Date();
    try {
        var file = req.file.originalname.split('.');
        console.log('🚀 ~ uploadFile ~ req:', req.file);

        switch (req.headers['file-type']) {
            case '1':
                var folder_name = `comp/${dateTimeFormater(new Date(), 'yyyy-MM')}/`;
                var prefix = `${dateTimeFormater(new Date(), 'DD')}-${Date.now()}`; //day-timestamp
                var file_name = `${prefix}-${functionBasicCenter.makeid(15).toLowerCase()}.${file[file.length - 1]}`;
                var file_path = `${folder_name}${file_name}`;
                break;
            case '2':
                var folder_name = `info/${dateTimeFormater(new Date(), 'yyyy-MM')}/`;
                var prefix = `${dateTimeFormater(new Date(), 'DD')}-${Date.now()}`; //day-timestamp
                var file_name = `${prefix}-${functionBasicCenter.makeid(15).toLowerCase()}.${file[file.length - 1]}`;
                var file_path = `${folder_name}${file_name}`;
                break;
            case '3':
                var folder_name = `ticket/${dateTimeFormater(new Date(), 'yyyy-MM')}/`;
                var prefix = `${dateTimeFormater(new Date(), 'DD')}-${Date.now()}`; //day-timestamp
                var file_name = `${prefix}-${functionBasicCenter.makeid(15).toLowerCase()}.${file[file.length - 1]}`;
                var file_path = `${folder_name}${file_name}`;
                break;
            case '4':
                var folder_name = `note/${dateTimeFormater(new Date(), 'yyyy-MM')}/`;
                var prefix = `${dateTimeFormater(new Date(), 'DD')}-${Date.now()}`; //day-timestamp
                var file_name = `${prefix}-${functionBasicCenter.makeid(15).toLowerCase()}.${file[file.length - 1]}`;
                var file_path = `${folder_name}${file_name}`;
                break;
            case '5':
                var folder_name = `cont/${dateTimeFormater(new Date(), 'yyyy-MM')}/`;
                var prefix = `${dateTimeFormater(new Date(), 'DD')}-${Date.now()}`; //day-timestamp
                var file_name = `${prefix}-${functionBasicCenter.makeid(15).toLowerCase()}.${file[file.length - 1]}`;
                var file_path = `${folder_name}${file_name}`;
                break;

            default:
                var folder_name = ``;
                var prefix = `oth/${dateTimeFormater(new Date(), 'DD')}-${Date.now()}`; //day-timestamp
                var file_name = `${prefix}-${functionBasicCenter.makeid(15).toLowerCase()}.${file[file.length - 1]}`;
                var file_path = `${folder_name}${file_name}`;
                break;
        }

        var params = {
            backet_name: MINIO_BUCKET,
            original_name: req.file.originalname,
            file_name: file_name,
            folder_name: folder_name,
            // buffer: req.file.buffer,
        };
        var fileUrl = `${minioConfig.view_url}/${params.backet_name}`;
        var filePath = `${file_path}`;

        // var fileSizeBytes = req.file.size; 
        // console.log("🚀 ~ uploadFile ~ fileSizeBytes:", fileSizeBytes)
        // var fileSizeMegabytes = convertBytesToMegabytes(fileSizeBytes);

        var paramsFile = {
            original_name: req.file.originalname,
            file_size: req.file.size,
            file_type: req.headers['file-type'],
            file_extension : file[file.length - 1],
            fileUrl: fileUrl,
            filePath: filePath,
        };
        console.log('🚀 ~ uploadFile ~ paramsFile:', paramsFile);

        // console.log(
        //     '🚀 ~ uploadFile ~ paramsencodeURIComponent(paramsFile[0])File:',
        //     encodeURIComponent(paramsFile[0])
        // );

        // var filedata =  await fileModel.file(paramsFile);
        // console.log("🚀 ~ uploadFile ~ filedata:", filedata)

        var etag = await putObjectUploadFile(params.backet_name, file_path, req.file.buffer);
        params.etag = etag;
        //  var params_log = {
        //   systrm_type: req.body.type,
        //   original_name: req.file.originalname,
        //   file_systemname: params.file_name,
        //   file_path: file_path,
        //   file_type: file.pop(),
        //   raw: JSON.stringify(params),
        //   bucket_name: params.backet_name,
        //  };
        //  var insert_log_file = await Log.logUploadFile(params_log);
        //  if (insert_log_file.length == 1) {
        var payload = {
            etag: etag,
            file_details: paramsFile,
            path_url: `${minioConfig.view_url}/${params.backet_name}/${file_path}`,
            file_url : `${minioConfig.view_url}/${params.backet_name}`,
            filePath : `${file_path}`,
            original_name: req.file.originalname,
            file_type : req.headers['file-type'],
            // fileUrl : `${minioConfig.view_url}/${params.backet_name}`,
            // file_id: '1', //insert_log_file[0].uploadfile_id,
            // file_path: `${params.backet_name}/${file_path}`,
            // start_time: start,
        };
        console.log("🚀 ~ uploadFile ~ payload:", payload)
        //  } else {
        //   var payload = {
        //    etag: etag,
        //    file_id: '',
        //    file_url: '',
        //    start_time: start,
        //   };
        //  }
        return res.status(rescode.c1000.httpStatusCode).json({
            code: rescode.c1000.businessCode,
            message: rescode.c1000.description,
            error: rescode.c1000.error,
            data: payload
        });
    } catch (error) {
        return res.status(rescode.c1104.httpStatusCode).json({
            code: rescode.c1104.businessCode,
            message: rescode.c1104.description,
            error: rescode.c1104.error,
            catch: error.message
        });
    }
};

module.exports = {
    uploadFile,
};
