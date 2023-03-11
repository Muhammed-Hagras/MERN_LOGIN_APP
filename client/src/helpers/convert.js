export default function convertToBase6(file) {
  return new Promise((res, rej) => {
    const fileLoader = new FileReader();
    fileLoader.readAsDataURL(file);

    fileLoader.onload = () => {
      res(fileLoader.result);
    };

    fileLoader.onerror = (error) => {
      rej(error);
    };
  });
}
