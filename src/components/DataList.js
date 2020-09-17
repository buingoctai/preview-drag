import React from "react";
import { getCurrentTranslate } from "../utils/utils";
import { IMAGE_SIZE } from "../utils/constants";

import useUpdateOrderList from "../customHooks/useUpdateOrderList";

import "./style.css";

const DataList = ({
  dataList,
  itemSize,
  icon,
  rowWidth,
  space,
  handleIndexUpdate,
}) => {
  const movingUnit = {
    width: itemSize.width + 2 * space,
    height: itemSize.height + 2 * space,
  };

  const performAnimation = ({ startIdx, endIdx, elms }) => {
    let deltaX = 0;
    let deltaY = 0;

    //  Move start point
    deltaX = 0;
    deltaY = (endIdx - startIdx) * movingUnit.height;

    const elmIndex = orderList.current[startIdx];
    const { x, y, z } = getCurrentTranslate(elms[elmIndex]);
    elms[elmIndex].style.transition = `all 0s ease-out`;
    elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
      y + deltaY
    }px,${z}px)`;

    // Move else points
    deltaX = 0;
    deltaY = startIdx < endIdx ? -movingUnit.height : movingUnit.height;
    if (startIdx < endIdx) {
      for (let i = startIdx + 1; i <= endIdx; i++) {
        const elmIndex = orderList.current[i];
        const { x, y, z } = getCurrentTranslate(elms[elmIndex]);

        elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
          y + deltaY
        }px,${z}px)`;
      }
      return;
    }
    for (let i = startIdx - 1; i >= endIdx; i--) {
      const elmIndex = orderList.current[i];
      const { x, y, z } = getCurrentTranslate(elms[elmIndex]);

      elms[elmIndex].style.transform = `translate3d(${x + deltaX}px,${
        y + deltaY
      }px,${z}px)`;
    }
  };

  const { data, orderList } = useUpdateOrderList({
    parentClass: "list__data__container",
    childClass: "item__wrap",
    dataList,
    icon,
    itemSize,
    movingUnit,
    displayType: "list",
    handleIndexUpdate,
    performAnimation,
  });

  return (
    <div
      className="list__data__container"
      style={{ width: rowWidth }}
      onDragEnter={(event) => {
        if (event.preventDefault) {
          event.preventDefault();
        }
      }}
    >
      {data.map((item, index) => (
        <div
          id={index}
          className="item__wrap"
          style={{
            background: "lightgray",
            transform: "translate3d(0px,0px,0px)",
            margin: space,
            height: IMAGE_SIZE.height,
            width: itemSize.width,
          }}
          draggable="true"
        >
          <img
            style={{
              width: IMAGE_SIZE.width,
              height: IMAGE_SIZE.height,
              pointerEvents: "none",
            }}
            alt={item.title}
            src={item.thumb}
          />

          <div className="flex column" style={{ pointerEvents: "none" }}>
            <div style={{ pointerEvents: "none" }}>{item.title}</div>
            <div style={{ pointerEvents: "none" }}>{item.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataList;
