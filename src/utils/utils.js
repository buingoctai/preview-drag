import {
  SPACE,
  WIDTH_ITEM_GRID,
  HEIGHT_ITEM_GRID,
  WIDTH_ITEM_LIST,
  HEIGHT_ITEM_LIST,
} from "./constants";

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

export const onRearrangeDataList = ({ dataArr, srcIdx, targetIdx }) => {
  const srcItem = dataArr[srcIdx];
  dataArr.splice(srcIdx, 1);
  dataArr.splice(targetIdx, 0, srcItem);
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

// Trả về 2 mảng, mỗi mảng chứa index của item có thể bị move cross
export const detectTwoCrossMovingArr = ({ dataArr, numItemRow }) => {
  let startPoints = [];
  let endPoints = [];

  for (let i = numItemRow; i < dataArr.length; i += numItemRow) {
    startPoints.push(i);
    endPoints.push(i - 1);
  }
  startPoints.unshift(0);
  endPoints.push(dataArr.length - 1);

  return { startPoints, endPoints };
};

export const detectCrossMovingIdxs = ({ start, end, dataArr, numItemRow }) => {
  const { startPoints, endPoints } = detectTwoCrossMovingArr({
    dataArr,
    numItemRow,
  });
  const crossMovingIdxs =
    start < end
      ? startPoints.filter((item) => item >= start && item <= end)
      : endPoints.filter((item) => item >= end && item <= start);

  return crossMovingIdxs;
};

export const detectNumDiffRow = ({ start, end, dataArr, numItemRow }) => {
  const { startPoints, endPoints } = detectTwoCrossMovingArr({
    dataArr,
    numItemRow,
  });
  let belongStartIdx;
  let belongEndIdx;

  for (let i = 0; i < startPoints.length; i++) {
    if (startPoints[i] <= start && start <= endPoints[i]) {
      belongStartIdx = i;
    }
    if (startPoints[i] <= end && end <= endPoints[i]) {
      belongEndIdx = i;
    }
  }

  return Math.abs(belongEndIdx - belongStartIdx);
};

//---------- Handle drag and drop in whitespaces---------------------
const areaCalculation = (x1, y1, x2, y2, x3, y3) => {
  return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
};

const isInsideRectangle = (x1, y1, x2, y2, x3, y3, x4, y4, x, y) => {
  /* Calculate areaCalculation of rectangle ABCD */
  const a =
    areaCalculation(x1, y1, x2, y2, x3, y3) +
    areaCalculation(x1, y1, x4, y4, x3, y3);

  /* Calculate area of triangle PAB */
  const a1 = areaCalculation(x, y, x1, y1, x2, y2);

  /* Calculate areaCalculation of triangle PBC */
  const a2 = areaCalculation(x, y, x2, y2, x3, y3);

  /* Calculate areaCalculation of triangle PCD */
  const a3 = areaCalculation(x, y, x3, y3, x4, y4);

  /* Calculate areaCalculation of triangle PAD */
  const a4 = areaCalculation(x, y, x1, y1, x4, y4);

  /* Check if sum of A1, A2, A3 and A4  
is same as A */
  return a === a1 + a2 + a3 + a4;
};

const onCreateSpaceCoordinates = (query, displayType) => {
  let coorDinatesArr = [];
  const elms = document.querySelectorAll(query);

  for (let i = 0; i < elms.length; i++) {
    const { offsetLeft: x, offsetTop: y } = elms[i];
    let coorDinates;

    switch (displayType) {
      case "grid":
        coorDinates = {
          left: [
            { x: x - 2 * SPACE, y },
            { x, y },
            { x: x, y: y + HEIGHT_ITEM_GRID },
            { x: x - 2 * SPACE, y: y + HEIGHT_ITEM_GRID },
          ],
          right: [
            { x: x + WIDTH_ITEM_GRID, y },
            { x: x + WIDTH_ITEM_GRID + 2 * SPACE, y },
            { x: x + WIDTH_ITEM_GRID + 2 * SPACE, y: y + HEIGHT_ITEM_GRID },
            { x: x + WIDTH_ITEM_GRID, y: y + HEIGHT_ITEM_GRID },
          ],
        };
        break;
      case "list":
        coorDinates = {
          left: [
            { x, y: y - 2 * SPACE },
            { x: x + WIDTH_ITEM_LIST, y: y - 2 * SPACE },

            { x: x + WIDTH_ITEM_LIST, y },
            { x, y },
          ],
          right: [
            { x, y: y + 40 },
            { x: x + WIDTH_ITEM_LIST, y: y + HEIGHT_ITEM_LIST },

            { x: x + WIDTH_ITEM_LIST, y: y + HEIGHT_ITEM_LIST + 2 * 10 },
            { x, y: y + HEIGHT_ITEM_LIST + 2 * 10 },
          ],
        };
        break;
      default:
        break;
    }

    coorDinatesArr.push(coorDinates);
  }

  return coorDinatesArr;
};

export const getEnterIdx = ({
  x,
  y,
  dataArr,
  numItemRow,
  query,
  displayType,
}) => {
  const coorDinatesArr = onCreateSpaceCoordinates(query, displayType);

  for (let i = 0; i < coorDinatesArr.length; i++) {
    const { left, right } = coorDinatesArr[i];
    const isLeft = isInsideRectangle(
      left[0].x,
      left[0].y,
      left[1].x,
      left[1].y,
      left[2].x,
      left[2].y,
      left[3].x,
      left[3].y,
      x,
      y
    );
    const isRight = isInsideRectangle(
      right[0].x,
      right[0].y,
      right[1].x,
      right[1].y,
      right[2].x,
      right[2].y,
      right[3].x,
      right[3].y,
      x,
      y
    );

    const { startPoints } = detectTwoCrossMovingArr({
      dataArr,
      numItemRow,
    });

    const isStartIdx = startPoints.includes(i);
    if (isLeft) return isStartIdx ? i - 1 : i;
    if (isRight) return i;
  }

  // Enter on whitespace
  const numRow =
    Math.floor(dataArr.length / numItemRow) + (dataArr.length % numItemRow);
  const isEnterLastItem = isEnterWhiteSpace({
    x,
    y,
    numItemRow,
    numRow,
    query,
  });

  if (isEnterLastItem) {
    return dataArr.length - 1;
  }
};

export const isEnterWhiteSpace = ({ x, y, numItemRow, numRow, query }) => {
  const elms = document.querySelectorAll(query);
  const firstElm = elms[0];
  const startElm = elms[elms.length - numItemRow - 1];
  if (!startElm) return false;

  const edgeOne = {
    x: startElm.offsetLeft + WIDTH_ITEM_GRID,
    y: startElm.offsetTop + HEIGHT_ITEM_GRID,
  };
  const edgeThree = {
    x: firstElm.offsetLeft + numItemRow * (WIDTH_ITEM_GRID + SPACE * 2),
    y: firstElm.offsetTop + numRow * (HEIGHT_ITEM_GRID + SPACE * 2),
  };
  const rectangle = [
    { ...edgeOne },
    { x: edgeThree.x, y: edgeOne.y },
    { ...edgeThree },
    { x: edgeOne.x, y: edgeThree.y },
  ];

  return isInsideRectangle(
    rectangle[0].x,
    rectangle[0].y,
    rectangle[1].x,
    rectangle[1].y,
    rectangle[2].x,
    rectangle[2].y,
    rectangle[3].x,
    rectangle[3].y,
    x,
    y
  );
};
