import React from "react";
import { getCurrentTranslate } from "../utils/utils";

import useUpdateOrderList from "../customHooks/useUpdateOrderList";

import "./style.css";

const DataList = ({
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
      className="flex column list__data__container"
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
      {data.map((item, index) => (
        <div
          id={index}
          className="flex  item__wrap"
          style={{
            background: "lightgray",
            transform: "translate3d(0px,0px,0px)",
            margin: margin,
            height: itemSize.height,
          }}
          draggable="true"
        >
          <img
            style={{
              width: itemSize.width,
              height: itemSize.height,
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
