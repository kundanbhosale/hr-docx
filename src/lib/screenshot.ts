import html2canvas from "html2canvas";

export const captureScreenshot = (el: HTMLElement) => {
  // Save original overflow styles
  const originalOverflow = el.style.overflow;
  const originalOverflowX = el.style.overflowX;
  const originalOverflowY = el.style.overflowY;

  // Set overflow to hidden to ignore overflowing content
  el.style.overflow = "hidden";
  el.style.overflowX = "hidden";
  el.style.overflowY = "hidden";

  // Create canvas with specified dimensions
  const canvasPromise = html2canvas(el, {
    useCORS: true,
    windowWidth: 794,
    windowHeight: 1123,
    scale: 0.5,
    ignoreElements: (element) => {
      // Optionally add logic to ignore specific elements
      return false;
    },
  });

  return canvasPromise
    .then(async (canvas) => {
      // Restore original overflow styles
      el.style.overflow = originalOverflow;
      el.style.overflowX = originalOverflowX;
      el.style.overflowY = originalOverflowY;

      // Convert canvas to WebP image
      const dataURL = canvas.toDataURL("image/webp");
      return dataURL;
    })
    .catch((error) => {
      // Ensure styles are restored even if there's an error
      el.style.overflow = originalOverflow;
      el.style.overflowX = originalOverflowX;
      el.style.overflowY = originalOverflowY;
      throw error;
    });
};
