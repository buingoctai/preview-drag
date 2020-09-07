import React from "react";

import { getCurrentTranslate } from "../utils/utils";
import useUpdateOrderList from "../customHooks/useUpdateOrderList";

import "./style.css";

const ImageGrid = ({
  dataList,
  itemSize,
  numItemRow,
  movingUnit,
  handleIndexUpdate,
  className,
  margin,
  subClassName,
}) => {
  const handleAddingAnimation = ({ startIndex, endIndex, elms }) => {
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
        const elmIndex = orderList.current[i];

        // Turn off catch events on moving cross
        if (crossMovingIdxs.includes(i) && i !== startIndex && i !== endIndex) {
          elms[elmIndex].style.pointerEvents = "none";
        }
        if (crossMovingIdxs.includes(i)) {
          deltaX = (numItemRow - 1) * movingUnit.width;
          deltaY = -movingUnit.height;
        } else {
          deltaX = startIndex < endIndex ? -movingUnit.width : movingUnit.width;
          deltaY = 0;
        }

        const { x, y, z } = getCurrentTranslate(elms[elmIndex]);
        elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
          y + deltaY
        }px,${z}px)`;
        setTimeout(() => {
          onEnablePointerEvents();
        }, 400);
      }
    } else {
      for (let i = startIndex - 1; i >= endIndex; i--) {
        const elmIndex = orderList.current[i];

        // Turn off catch events on moving cross
        if (crossMovingIdxs.includes(i) && i !== startIndex && i !== endIndex) {
          elms[elmIndex].style.pointerEvents = "none";
        }

        if (crossMovingIdxs.includes(i)) {
          deltaX = (numItemRow - 1) * -movingUnit.width;
          deltaY = movingUnit.height;
        } else {
          deltaX = startIndex < endIndex ? -movingUnit.width : movingUnit.width;
          deltaY = 0;
        }

        const { x, y, z } = getCurrentTranslate(elms[elmIndex]);
        elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
          y + deltaY
        }px,${z}px)`;
        setTimeout(() => {
          onEnablePointerEvents();
        }, 400);
      }
    }
  };

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

  const onEnablePointerEvents = () => {
    const elms = document.querySelectorAll(`.${className} .${subClassName}`);
    for (let i = 0; i < elms.length; i++) {
      elms[i].style.pointerEvents = "initial";
    }
  };

  const { data, orderList } = useUpdateOrderList({
    className,
    subClassName,
    dataList,
    numItemRow,
    movingUnit,
    handleIndexUpdate,
    handleAddingAnimation,
  });

  return (
    <div
      className="list__image__container"
      onDragOver={(event) => {
        if (event.preventDefault) {
          event.preventDefault();
        }
      }}
      onDragEnter={(event) => {
        if (event.preventDefault) {
          event.preventDefault();
        }
      }}
    >
      {data.map((img, index) => (
        <img
          id={index}
          className="img__wrap"
          style={{
            width: itemSize.width,
            height: itemSize.height,
            margin: margin,
            transform: "translate3d(0px,0px,0px)",
            // remove whitespace in break inline
            display: "block",
            float: "left",
            border: 0,
            pointerEvents: "initial",
          }}
          title={index}
          src={img.url}
          alt="images"
          draggable="true"
        />
      ))}
    </div>
  );
};

export default ImageGrid;
