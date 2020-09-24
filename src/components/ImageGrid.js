import React from "react";

import {
  getCurrentTranslate,
  detectCrossMovingIdxs,
  detectNumDiffRow,
  updateStyleSpecificElement,
} from "../utils/utils";
import useUpdateOrderList from "../customHooks/useUpdateOrderList";
import "./style.css";

const ImageGrid = ({
  dataList,
  itemSize,
  icon,
  rowWidth,
  handleIndexUpdate,
  space,
}) => {
  const movingUnit = {
    width: itemSize.width + space,
    height: itemSize.height + space,
  };
  const numItemRow = Math.floor(rowWidth / (itemSize.width + space));

  const updateTransform = ({ elm, deltaX, deltaY }) => {
    const { x, y, z } = getCurrentTranslate(elm);
    updateStyleSpecificElement(elm, {
      transform: `translate3d(${x + deltaX}px,${y + deltaY}px,${z}px)`,
    });
  };
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
    updateStyleSpecificElement(elms[elmIndex], {
      transition: "all 0s ease-out",
    });
    updateTransform({ elm: elms[elmIndex], deltaX, deltaY });
    // Moving else points
    deltaX = startIdx < endIdx ? -movingUnit.width : movingUnit.width;
    deltaY = 0;
    if (startIdx < endIdx) {
      for (let i = startIdx + 1; i <= endIdx; i++) {
        const elmIndex = orderList.current[i];

        // Turn off catch events on moving cross
        if (crossMovingIdxs.includes(i)) {
          elms[elmIndex].style.pointerEvents = "none";
        }
        if (crossMovingIdxs.includes(i)) {
          deltaX = (numItemRow - 1) * movingUnit.width;
          deltaY = -movingUnit.height;
        } else {
          deltaX = startIdx < endIdx ? -movingUnit.width : movingUnit.width;
          deltaY = 0;
        }
        updateTransform({ elm: elms[elmIndex], deltaX, deltaY });
      }
    } else {
      for (let i = startIdx - 1; i >= endIdx; i--) {
        const elmIndex = orderList.current[i];
        // Turn off catch events on moving cross
        if (crossMovingIdxs.includes(i)) {
          elms[elmIndex].style.pointerEvents = "none";
        }
        if (crossMovingIdxs.includes(i)) {
          deltaX = (numItemRow - 1) * -movingUnit.width;
          deltaY = movingUnit.height;
        } else {
          deltaX = startIdx < endIdx ? -movingUnit.width : movingUnit.width;
          deltaY = 0;
        }
        updateTransform({ elm: elms[elmIndex], deltaX, deltaY });
      }
    }
  };

  const { data, orderList } = useUpdateOrderList({
    parentClass: "list__image__container",
    childClass: "img",
    dataList,
    icon,
    itemSize,
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
        <div
          id={index}
          className="img"
          style={{
            pointerEvents: "initial",
            transform: "translate3d(0px,0px,0px)",
            margin: Math.floor(space / 2),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          draggable="true"
        >
          <img
            style={{
              width: itemSize.width,
              height: itemSize.height,
              // remove whitespace in break inline
              display: "block",
              float: "left",
              border: 0,
              pointerEvents: "none",
            }}
            title={index}
            src={img.url}
            alt="images"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
