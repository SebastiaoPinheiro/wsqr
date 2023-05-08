const { createCanvas, loadImage } = require('canvas');
const jsQR = require('jsqr');

async function findQRCodeInImage(path) {
  const image = await loadImage(path);
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);

  let code = jsQR(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
  if (code) {
    return code.data;
  }

  const divisions = [4, 8, 12];
  for (let division of divisions) {
    const partWidth = Math.floor(canvas.width / division);
    const partHeight = Math.floor(canvas.height / division);
    for (let i = 0; i < division; i++) {
      for (let j = 0; j < division; j++) {
        console.log('Trying... ', i, j);
        const x = i * partWidth;
        const y = j * partHeight;
        code = jsQR(context.getImageData(x, y, partWidth, partHeight).data, partWidth, partHeight);
        if (code) {
          return code.data;
        }
      }
    }
  }

  return null;
}

findQRCodeInImage('COLOQUE O CAMINHO DO ARQUIVO AQUI C:/...')
  .then(data => {
    if (data) {
      console.log('QR code detected:', data);
    } else {
      console.log('No QR code detected in the image.');
    }
  })
  .catch(error => {
    console.error('Error loading image:', error);
  });
