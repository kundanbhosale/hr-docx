import html2canvas from "html2canvas";

export const captureScreenshot = (el: HTMLElement) => {
  const canvasPromise = html2canvas(el, {
    useCORS: true,
    windowWidth: 794,
    windowHeight: 1123,
    scale: 0.5,
  });
  return canvasPromise.then(async (canvas) => {
    const dataURL = canvas.toDataURL("image/webp");
    return dataURL;
  });
};
