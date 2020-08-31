import React, { useState, useEffect, useRef } from "react";

const enhance = (App) => ({
  dataList,
  className,
  subClassName,
  displayStyle,
  imageSize,
  rowWidth,
  margin,
  handleIndexUpdate,
}) => {
  const [data, setData] = useState(dataList);
  const srcIndex = useRef("");
  const isReverting = useRef(true);
  const enterIndex = useRef(""); // Fix fire dragenter many time
  const finishCheck = useRef(null); // Fix fire dragenter many time
  const orderList = useRef(Array.from(Array(dataList.length).keys()));

  const setSrcIndex = (val) => {
    srcIndex.current = val;
  };

  const setIsReverting = (val) => {
    isReverting.current = val;
  };

  // fix fire dragenter many time
  const setEnterIndex = (val) => {
    enterIndex.current = val;
  };

  const setFinishCheck = (val) => {
    finishCheck.current = val;
  };

  const setOrderList = (val) => {
    orderList.current = val;
  };

  useEffect(() => {
    const handleDragStart = (event) => {
      event.stopImmediatePropagation();
      const {
        target: { id: srcIndex },
      } = event;

      setEnterIndex(srcIndex); // fix fire dragenter many time
      setFinishCheck(false); // fix fire dragenter many time
      setIsReverting(true);
      setSrcIndex(srcIndex);
      setOrderList(Array.from(Array(dataList.length).keys()));
      onAddingTransition();
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.setData(
        "startIndex",
        orderList.current.indexOf(parseInt(srcIndex))
      );
      event.target.style.cursor = "move";
      event.target.style.opacity = "0.4";
    };

    const handleDragEnd = (event) => {
      event.stopImmediatePropagation();

      const { target: element } = event;
      if (isReverting.current) {
        onRevertingDataList();
      } else {
        let updatedData = [...data];
        let updatedIndex = [];

        for (let i = 0; i < orderList.current.length; i++) {
          if (updatedIndex.includes(orderList.current[i])) {
            continue;
          } else {
            updatedIndex.push(orderList.current.indexOf(orderList.current[i]));
          }
          updatedData = onRearrangeDataList({
            dataArr: [...updatedData],
            srcIndex: orderList.current[i],
            targetIndex: orderList.current.indexOf(orderList.current[i]),
          });
        }

        onRemovingTransition();
        onRevertingDataList();
        setData(updatedData);
      }
      element.style.opacity = "1";
    };

    const handleDragOver = (event) => {
      if (event.preventDefault) {
        event.preventDefault();
      }
      return false;
    };

    const handleDragEnter = (event) => {
      const { currentTarget: element } = event;
      const { id: targetIndex } = element;

      // Fix fire dragenter many time
      if (!finishCheck.current) {
        if (targetIndex === enterIndex.current) {
          setFinishCheck(true);
        } else {
          return;
        }
      }
      if (targetIndex === srcIndex.current) return;

      onChoosingAnimationStyle({
        start: parseInt(srcIndex.current),
        end: parseInt(targetIndex),
        displayStyle: displayStyle,
      });
      const arrangedOrderList = onRearrangeDataList({
        dataArr: [...orderList.current],
        srcIndex: orderList.current.indexOf(parseInt(srcIndex.current)),
        targetIndex: orderList.current.indexOf(parseInt(targetIndex)),
      });
      setOrderList(arrangedOrderList);
    };

    const handleDragLeave = ({ target: element }) => {
      element.style.opacity = "1";
    };

    const handleDrop = (event) => {
      event.stopImmediatePropagation();
      handleDragLeave(event);

      const oldIndex = event.dataTransfer.getData("startIndex");
      const {
        target: { id: newIndex },
      } = event;

      handleIndexUpdate(
        oldIndex,
        orderList.current.indexOf(parseInt(newIndex))
      );
      setIsReverting(false);
    };

    // Add event listeners
    const imgEls = document.querySelectorAll(`.${className} .${subClassName}`);
    imgEls.forEach(function (e) {
      e.addEventListener("dragstart", handleDragStart, false);
      e.addEventListener("dragend", handleDragEnd, false);
      e.addEventListener("dragenter", handleDragEnter, false);
      e.addEventListener("dragleave", handleDragLeave, false);
      e.addEventListener("dragover", handleDragOver, false);
      e.addEventListener("drop", handleDrop, false);
    });

    return () => {
      // Remove event listeners
      const imgEls = document.querySelectorAll(
        `.${className} .${subClassName}`
      );
      imgEls.forEach(function (e) {
        e.removeEventListener("dragstart", handleDragStart, false);
        e.removeEventListener("dragend", handleDragEnd, false);
        e.removeEventListener("dragenter", handleDragEnter, false);
        e.removeEventListener("dragleave", handleDragLeave, false);
        e.removeEventListener("dragover", handleDragOver, false);
        e.removeEventListener("drop", handleDrop, false);
      });
    };
  }, [data]);

  const onRearrangeDataList = ({ dataArr, srcIndex, targetIndex }) => {
    const srcItem = dataArr[srcIndex];
    dataArr.splice(srcIndex, 1);
    dataArr.splice(targetIndex, 0, srcItem);
    return [...dataArr];
  };

  const onChoosingAnimationStyle = ({ start, end, displayStyle }) => {
    const elms = document.querySelectorAll(`.${className} .${subClassName}`);
    const startIndex = orderList.current.indexOf(start);
    const endIndex = orderList.current.indexOf(end);

    switch (displayStyle) {
      case "list":
        handleAddingListAnimation({
          startIndex,
          endIndex,
          elms,
          widthUnit: 56,
        });
        break;
      case "grid":
        handleAddingGridAnimation({
          startIndex,
          endIndex,
          elms,
          widthUnit: 88,
          numItemRow: 9,
        });
        break;
      default:
        break;
    }
  };
  const handleAddingListAnimation = ({
    startIndex,
    endIndex,
    elms,
    widthUnit,
  }) => {
    //  Move start point
    let deltaX = 0;
    let deltaY = 0;

    deltaX = 0;
    deltaY = (endIndex - startIndex) * widthUnit;
    const elmIndex = orderList.current[startIndex];

    const { x, y, z } = getMatrix(elms[elmIndex]);
    elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
      y + deltaY
    }px,${z}px)`;

    // Move else points
    deltaX = 0;
    deltaY = startIndex < endIndex ? -widthUnit : widthUnit;
    if (startIndex < endIndex) {
      for (let i = startIndex + 1; i <= endIndex; i++) {
        const elmIndex = orderList.current[i];
        const { x, y, z } = getMatrix(elms[elmIndex]);

        elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
          y + deltaY
        }px,${z}px)`;
      }
      return;
    }
    for (let i = startIndex - 1; i >= endIndex; i--) {
      const elmIndex = orderList.current[i];
      const { x, y, z } = getMatrix(elms[elmIndex]);

      elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
        y + deltaY
      }px,${z}px)`;
    }
  };
  const handleAddingGridAnimation = ({
    startIndex,
    endIndex,
    elms,
    widthUnit,
    numItemRow,
  }) => {
    const crossMovingIdxs = detectCrossMovingIdxs(startIndex, endIndex);
    const numRowDiff = detectNumDiffRow(startIndex, endIndex);
    const isSameRow = numRowDiff === 0 ? true : false;
    // Moving start point
    let deltaX = 0;
    let deltaY = 0;

    if (isSameRow) {
      deltaX = (endIndex - startIndex) * widthUnit;
    } else {
      if (startIndex < endIndex) {
        deltaX =
          (endIndex - (startIndex + numRowDiff * numItemRow)) * widthUnit;
        deltaY = numRowDiff * widthUnit;
      } else {
        deltaX =
          (endIndex - (startIndex - numRowDiff * numItemRow)) * widthUnit;
        deltaY = numRowDiff * -widthUnit;
      }
    }

    const elmIndex = orderList.current[startIndex];
    const { x, y, z } = getMatrix(elms[elmIndex]);
    elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
      y + deltaY
    }px,${z}px)`;

    // Moving else points
    deltaX = startIndex < endIndex ? -widthUnit : widthUnit;
    deltaY = 0;

    if (startIndex < endIndex) {
      for (let i = startIndex + 1; i <= endIndex; i++) {
        if (crossMovingIdxs.includes(i)) {
          deltaX = (numItemRow - 1) * widthUnit;
          deltaY = -widthUnit;
        } else {
          deltaX = startIndex < endIndex ? -widthUnit : widthUnit;
          deltaY = 0;
        }
        const elmIndex = orderList.current[i];
        const { x, y, z } = getMatrix(elms[elmIndex]);

        elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
          y + deltaY
        }px,${z}px)`;
      }
    } else {
      for (let i = startIndex - 1; i >= endIndex; i--) {
        if (crossMovingIdxs.includes(i)) {
          deltaX = (numItemRow - 1) * -widthUnit;
          deltaY = widthUnit;
        } else {
          deltaX = startIndex < endIndex ? -widthUnit : widthUnit;
          deltaY = 0;
        }

        const elmIndex = orderList.current[i];
        const { x, y, z } = getMatrix(elms[elmIndex]);

        elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
          y + deltaY
        }px,${z}px)`;
      }
    }
  };
  const onRevertingDataList = () => {
    const elms = document.querySelectorAll(`.${className} .${subClassName}`);
    for (let i = 0; i < elms.length; i++) {
      elms[i].style.transform = "translate3d(0px,0px,0px)";
    }
  };

  const onRemovingTransition = () => {
    const elms = document.querySelectorAll(`.${className} .${subClassName}`);
    for (let i = 0; i < elms.length; i++) {
      elms[i].style.transition = "all 0s ease-out";
    }
  };

  const onAddingTransition = () => {
    const elms = document.querySelectorAll(`.${className} .${subClassName}`);
    for (let i = 0; i < elms.length; i++) {
      elms[i].style.transition = "all 0.4s ease-out";
    }
  };

  // Only for image grid
  const detectCrossMovingPoints = () => {
    const ROW_WIDTH = 800;
    const ELEMENT_WDITH = 88;
    const rowNumberEle = Math.floor(ROW_WIDTH / ELEMENT_WDITH);

    let startPoints = [];
    let endPoints = [];
    for (
      let i = rowNumberEle;
      i < orderList.current.length;
      i += rowNumberEle
    ) {
      startPoints.push(i);
      endPoints.push(i - 1);
    }
    startPoints.unshift(0);
    endPoints.push(orderList.current.length - 1);

    return { startPoints, endPoints };
  };

  const detectCrossMovingIdxs = (start, end) => {
    const { startPoints, endPoints } = detectCrossMovingPoints();

    const crossMovingIdxs =
      start < end
        ? startPoints.filter((item) => item >= start && item <= end)
        : endPoints.filter((item) => item >= end && item <= start);

    return crossMovingIdxs;
  };

  const detectNumDiffRow = (start, end) => {
    const { startPoints, endPoints } = detectCrossMovingPoints();
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

  const getMatrix = (element) => {
    const values = element.style.transform.split(/\w+\(|\);?/);
    const transform = values[1]
      .split(/,\s?/g)
      .map((numStr) => parseInt(numStr));

    return {
      x: transform[0],
      y: transform[1],
      z: transform[2],
    };
  };
  return <App data={data} imageSize={imageSize} margin={margin} />;
};

export default enhance;
