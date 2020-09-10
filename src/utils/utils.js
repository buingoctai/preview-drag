export const getCurrentTranslate = (element) => {
  const values = element.style.transform.split(/\w+\(|\);?/);
  const transform = values[1].split(/,\s?/g).map((numStr) => parseInt(numStr));

  return {
    x: transform[0],
    y: transform[1],
    z: transform[2],
  };
};

export const updateCss = (query, style) => {
  const elms = document.querySelectorAll(query);
  for (let i = 0; i < elms.length; i++) {
    Object.keys(style).map((key) => {
      elms[i].style[key] = style[key];
    });
  }
};

export const onRearrangeDataList = ({ dataArr, srcIndex, targetIndex }) => {
  const srcItem = dataArr[srcIndex];
  dataArr.splice(srcIndex, 1);
  dataArr.splice(targetIndex, 0, srcItem);
  return [...dataArr];
};

export const onMarkingStartPoint = (query, idx, isProcessing) => {
  const elms = document.querySelectorAll(query);
  if (isProcessing) {
    elms[idx].style.opacity = "0.4";
    return;
  }
  elms[idx].style.opacity = "1";
};
