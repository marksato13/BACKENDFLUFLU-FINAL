const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

const storage = new Storage({
    projectId: "fluflu-db001",
    keyFilename: './serviceAccountKey.json' // Asegúrate de que este archivo exista
});

const bucket = storage.bucket("fluflu-db001.appspot.com"); // Nombre del bucket

module.exports = (file, pathImage, deletePathImage) => {
    return new Promise((resolve, reject) => {
        console.log('delete path', deletePathImage);

        // Eliminar la imagen anterior si existe
        if (deletePathImage) {
            const parsedDeletePathImage = new URL(deletePathImage);
            const urlDelete = parsedDeletePathImage.pathname.slice(23); // Ajustar la URL para eliminar
            const fileDelete = bucket.file(`${urlDelete}`);

            fileDelete.delete().then(() => {
                console.log('Imagen eliminada con éxito');
            }).catch(err => {
                console.log('Error al eliminar la imagen:', err);
            });
        }

        // Subir nueva imagen
        if (pathImage) {
            const fileUpload = bucket.file(`${pathImage}`);

            // Crear el stream de escritura
            const blobStream = fileUpload.createWriteStream({
                metadata: {
                    contentType: file.mimetype, // Utiliza el tipo MIME correcto del archivo
                    metadata: {
                        firebaseStorageDownloadTokens: uuid, // Añadir el token para acceder al archivo
                    }
                },
                resumable: false // Evitar la subida resumable para simplificar
            });

            blobStream.on('error', (error) => {
                console.log('Error al subir archivo a Firebase', error);
                reject('Error al subir archivo');
            });

            blobStream.on('finish', () => {
                const publicUrl = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media&token=${uuid}`);
                console.log('URL de Cloud Storage:', publicUrl);
                resolve(publicUrl); // Resolver con la URL del archivo subido
            });

            // Finaliza el stream con el contenido del archivo
            blobStream.end(file.buffer);
        }
    });
};
