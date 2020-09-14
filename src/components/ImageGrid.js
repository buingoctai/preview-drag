import React from "react";

import {
  getCurrentTranslate,
  updateCss,
  detectCrossMovingIdxs,
  detectNumDiffRow,
} from "../utils/utils";

import useUpdateOrderList from "../customHooks/useUpdateOrderList";

import "./style.css";

const ImageGrid = ({
  dataList,
  itemSize,
  rowWidth,
  handleIndexUpdate,
  space,
}) => {
  const movingUnit = {
    width: itemSize.width + 2 * space,
    height: itemSize.height + 2 * space,
  };
  const numItemRow = Math.floor(rowWidth / (itemSize.width + 2 * space));

  const performAnimation = ({ startIdx, endIdx, elms }) => {
    let deltaX = 0;
    let deltaY = 0;

    const crossMovingIdxs = detectCrossMovingIdxs({
      start: startIdx,
      end: endIdx,
      dataArr: orderList.current,
      numItemRow,
    });
    const numRowDiff = detectNumDiffRow({
      start: startIdx,
      end: endIdx,
      dataArr: orderList.current,
      numItemRow,
    });
    const isSameRow = numRowDiff === 0 ? true : false;

    // Moving start point
    if (isSameRow) {
      deltaX = (endIdx - startIdx) * movingUnit.width;
    } else {
      if (startIdx < endIdx) {
        deltaX =
          (endIdx - (startIdx + numRowDiff * numItemRow)) * movingUnit.width;
        deltaY = numRowDiff * movingUnit.height;
      } else {
        deltaX =
          (endIdx - (startIdx - numRowDiff * numItemRow)) * movingUnit.width;
        deltaY = numRowDiff * -movingUnit.height;
      }
    }

    const elmIndex = orderList.current[startIdx];
    const { x, y, z } = getCurrentTranslate(elms[elmIndex]);
    elms[elmIndex].style.transition = `all 0s ease-out`;
    elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
      y + deltaY
    }px,${z}px)`;

    // Moving else points
    deltaX = startIdx < endIdx ? -movingUnit.width : movingUnit.width;
    deltaY = 0;

    if (startIdx < endIdx) {
      for (let i = startIdx + 1; i <= endIdx; i++) {
        const elmIndex = orderList.current[i];

        // Turn off catch events on moving cross
        if (crossMovingIdxs.includes(i) && i !== startIdx && i !== endIdx) {
          elms[elmIndex].style.pointerEvents = "none";
        }
        if (crossMovingIdxs.includes(i)) {
          deltaX = (numItemRow - 1) * movingUnit.width;
          deltaY = -movingUnit.height;
        } else {
          deltaX = startIdx < endIdx ? -movingUnit.width : movingUnit.width;
          deltaY = 0;
        }

        const { x, y, z } = getCurrentTranslate(elms[elmIndex]);
        elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
          y + deltaY
        }px,${z}px)`;
      }
    } else {
      for (let i = startIdx - 1; i >= endIdx; i--) {
        const elmIndex = orderList.current[i];

        // Turn off catch events on moving cross
        if (crossMovingIdxs.includes(i) && i !== startIdx && i !== endIdx) {
          elms[elmIndex].style.pointerEvents = "none";
        }

        if (crossMovingIdxs.includes(i)) {
          deltaX = (numItemRow - 1) * -movingUnit.width;
          deltaY = movingUnit.height;
        } else {
          deltaX = startIdx < endIdx ? -movingUnit.width : movingUnit.width;
          deltaY = 0;
        }

        const { x, y, z } = getCurrentTranslate(elms[elmIndex]);
        elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
          y + deltaY
        }px,${z}px)`;
      }
    }
    setTimeout(() => {
      updateCss(`.${"list__image__container"} .${"img"}`, {
        pointerEvents: "initial",
      });
    }, 400);
  };

  const { data, orderList } = useUpdateOrderList({
    parentClass: "list__image__container",
    childClass: "img",
    dataList,
    numItemRow,
    movingUnit,
    displayType: "grid",
    handleIndexUpdate,
    performAnimation,
  });

  return (
    <div
      className="list__image__container"
      style={{ width: rowWidth }}
      onDragEnter={(event) => {
        if (event.preventDefault) {
          event.preventDefault();
        }
      }}
    >
      {data.map((img, index) => (
        <img
          id={index}
          className="img"
          style={{
            width: itemSize.width,
            height: itemSize.height,
            margin: space,
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
        />
      ))}
    </div>
  );
};

export default ImageGrid;
