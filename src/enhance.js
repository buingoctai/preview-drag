import React, { useState, useEffect, useRef } from "react";

const enhance = (App) => ({
  dataList,
  className,
  subClassName,
  displayStyle,
  itemSize,
  margin,
  movingUnit,
  numItemRow = 1,
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
    };

    const handleDragEnd = (event) => {
      event.stopImmediatePropagation();
      if (isReverting.current) {
        onRevertingDataList();
      } else {
        let updatedData = [...data];
        let updatedIndex = [];

        for (let i = 0; i < orderList.current.length; i++) {
          const elementId = orderList.current[i];

          if (updatedIndex.includes(elementId)) {
            continue;
          } else {
            updatedIndex.push(orderList.current.indexOf(elementId));
          }
          updatedData = onRearrangeDataList({
            dataArr: [...updatedData],
            srcIndex: elementId,
            targetIndex: orderList.current.indexOf(elementId),
          });
        }

        onRemovingTransition();
        onRevertingDataList();
        setData(updatedData);
      }
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
      if (targetIndex === srcIndex.current) {
        element.style.opacity = "0.4";
        return;
      }

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

      const {
        target: { id },
      } = event;
      const oldIndex = event.dataTransfer.getData("startIndex");
      const newIndex = orderList.current.indexOf(parseInt(id));

      handleIndexUpdate(oldIndex, newIndex);
      setIsReverting(false);
    };

    const handleDropContainer = (event) => {
      event.stopImmediatePropagation();
      const fullHeightItemRow =
        Math.floor(data.length / numItemRow) * movingUnit.height;
      const oldIndex = event.dataTransfer.getData("startIndex");

      setIsReverting(false);
      handleDragLeave(event);
      if (event.clientY > fullHeightItemRow) {
        const lastElm = document.querySelector(
          `.${className} .${subClassName}:last-child`
        );
        const event = new Event("dragenter");

        lastElm.dispatchEvent(event);
        handleIndexUpdate(oldIndex, data.length - 1);
        return;
      }
      handleIndexUpdate(
        oldIndex,
        orderList.current.indexOf(parseInt(oldIndex))
      );
    };

    // Add event listeners
    const container = document.querySelector(`.${className}`);
    container.addEventListener("drop", handleDropContainer, false);

    const items = document.querySelectorAll(`.${className} .${subClassName}`);
    items.forEach((e) => {
      e.addEventListener("dragstart", handleDragStart, false);
      e.addEventListener("dragend", handleDragEnd, false);
      e.addEventListener("dragenter", handleDragEnter, false);
      e.addEventListener("dragleave", handleDragLeave, false);
      e.addEventListener("dragover", handleDragOver, false);
      e.addEventListener("drop", handleDrop, false);
    });

    return () => {
      // Remove event listeners
      const items = document.querySelectorAll(`.${className} .${subClassName}`);
      items.forEach((e) => {
        e.removeEventListener("dragstart", handleDragStart, false);
        e.removeEventListener("dragend", handleDragEnd, false);
        e.removeEventListener("dragenter", handleDragEnter, false);
        e.removeEventListener("dragleave", handleDragLeave, false);
        e.removeEventListener("dragover", handleDragOver, false);
        e.removeEventListener("drop", handleDrop, false);
      });

      const container = document.querySelector(`.${className}`);
      container.removeEventListener("drop", handleDropContainer, false);
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
        });
        break;
      case "grid":
        handleAddingGridAnimation({
          startIndex,
          endIndex,
          elms,
        });
        break;
      default:
        break;
    }
  };
  const handleAddingListAnimation = ({ startIndex, endIndex, elms }) => {
    let deltaX = 0;
    let deltaY = 0;

    //  Move start point
    deltaX = 0;
    deltaY = (endIndex - startIndex) * movingUnit.height;
    const elmIndex = orderList.current[startIndex];

    const { x, y, z } = getCurrentTranslate(elms[elmIndex]);
    elms[elmIndex].style.transition = `all 0s ease-out`;
    elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
      y + deltaY
    }px,${z}px)`;

    // Move else points
    deltaX = 0;
    deltaY = startIndex < endIndex ? -movingUnit.height : movingUnit.height;
    if (startIndex < endIndex) {
      for (let i = startIndex + 1; i <= endIndex; i++) {
        const elmIndex = orderList.current[i];
        const { x, y, z } = getCurrentTranslate(elms[elmIndex]);

        elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
          y + deltaY
        }px,${z}px)`;
      }
      return;
    }
    for (let i = startIndex - 1; i >= endIndex; i--) {
      const elmIndex = orderList.current[i];
      const { x, y, z } = getCurrentTranslate(elms[elmIndex]);

      elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
        y + deltaY
      }px,${z}px)`;
    }
  };
  const handleAddingGridAnimation = ({ startIndex, endIndex, elms }) => {
    let deltaX = 0;
    let deltaY = 0;

    const crossMovingIdxs = detectCrossMovingIdxs(startIndex, endIndex);
    const numRowDiff = detectNumDiffRow(startIndex, endIndex);
    const isSameRow = numRowDiff === 0 ? true : false;

    // Moving start point
    if (isSameRow) {
      deltaX = (endIndex - startIndex) * movingUnit.width;
    } else {
      if (startIndex < endIndex) {
        deltaX =
          (endIndex - (startIndex + numRowDiff * numItemRow)) *
          movingUnit.width;
        deltaY = numRowDiff * movingUnit.height;
      } else {
        deltaX =
          (endIndex - (startIndex - numRowDiff * numItemRow)) *
          movingUnit.width;
        deltaY = numRowDiff * -movingUnit.height;
      }
    }

    const elmIndex = orderList.current[startIndex];
    const { x, y, z } = getCurrentTranslate(elms[elmIndex]);
    elms[elmIndex].style.transition = `all 0s ease-out`;
    elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
      y + deltaY
    }px,${z}px)`;

    // Moving else points
    deltaX = startIndex < endIndex ? -movingUnit.width : movingUnit.width;
    deltaY = 0;

    if (startIndex < endIndex) {
      for (let i = startIndex + 1; i <= endIndex; i++) {
        if (crossMovingIdxs.includes(i)) {
          deltaX = (numItemRow - 1) * movingUnit.width;
          deltaY = -movingUnit.height;
        } else {
          deltaX = startIndex < endIndex ? -movingUnit.width : movingUnit.width;
          deltaY = 0;
        }
        const elmIndex = orderList.current[i];
        const { x, y, z } = getCurrentTranslate(elms[elmIndex]);
        elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
          y + deltaY
        }px,${z}px)`;
      }
    } else {
      for (let i = startIndex - 1; i >= endIndex; i--) {
        if (crossMovingIdxs.includes(i)) {
          deltaX = (numItemRow - 1) * -movingUnit.width;
          deltaY = movingUnit.height;
        } else {
          deltaX = startIndex < endIndex ? -movingUnit.width : movingUnit.width;
          deltaY = 0;
        }

        const elmIndex = orderList.current[i];
        const { x, y, z } = getCurrentTranslate(elms[elmIndex]);

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
    let startPoints = [];
    let endPoints = [];
    for (let i = numItemRow; i < orderList.current.length; i += numItemRow) {
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

  const getCurrentTranslate = (element) => {
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
  return <App data={data} itemSize={itemSize} margin={margin} />;
};

export default enhance;
