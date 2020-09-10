import { useState, useEffect, useRef } from "react";
import {
  updateCss,
  onRearrangeDataList,
  onMarkingStartPoint,
} from "../utils/utils";

const useUpdateOrderList = ({
  className,
  subClassName,
  dataList,
  numItemRow = 1,
  movingUnit,
  handleIndexUpdate,
  performAnimation,
}) => {
  const [data, setData] = useState(dataList);
  const srcIndex = useRef("");
  const overIdx = useRef("");
  const isReverting = useRef(true);
  const orderList = useRef(Array.from(Array(dataList.length).keys()));
  const isDropOnContainer = useRef(false);

  const setSrcIndex = (val) => {
    srcIndex.current = val;
  };

  const setIsReverting = (val) => {
    isReverting.current = val;
  };

  const setOrderList = (val) => {
    orderList.current = val;
  };

  const setIsDropOnContainer = (val) => {
    isDropOnContainer.current = val;
  };

  const setOverIdx = (val) => {
    overIdx.current = val;
  };

  useEffect(() => {
    const handleDragStart = (event) => {
      event.stopImmediatePropagation();
      const {
        target: { id: srcIndex },
      } = event;

      setSrcIndex(srcIndex);
      setOverIdx(srcIndex);
      setIsReverting(true);
      setOrderList(Array.from(Array(dataList.length).keys()));
      setIsDropOnContainer(false);
      // onAddingTransition
      updateCss(`.${className} .${subClassName}`, {
        transition: "all 0.4s ease-out",
      });
      onMarkingStartPoint(`.${className} .${subClassName}`, srcIndex, true);
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.setData(
        "startIndex",
        orderList.current.indexOf(parseInt(srcIndex))
      );
    };

    const handleDragOver = (event) => {
      const { currentTarget: element } = event;
      const { id: targetIndex } = element;

      if (targetIndex === overIdx.current) return;

      setOverIdx(targetIndex);

      onHandleAnimation({
        start: parseInt(srcIndex.current),
        end: parseInt(targetIndex),
      });
      const arrangedOrderList = onRearrangeDataList({
        dataArr: [...orderList.current],
        srcIndex: orderList.current.indexOf(parseInt(srcIndex.current)),
        targetIndex: orderList.current.indexOf(parseInt(targetIndex)),
      });
      setOrderList(arrangedOrderList);
    };

    const handleDragEnd = (event) => {
      event.stopImmediatePropagation();
      setTimeout(
        () => {
          onMarkingStartPoint(
            `.${className} .${subClassName}`,
            srcIndex.current,
            false
          );
          if (isReverting.current) {
            // onRemovingTranslate
            updateCss(`.${className} .${subClassName}`, {
              transform: "translate3d(0px,0px,0px)",
            });
          } else {
            let updatedData = [];

            for (let i = 0; i < orderList.current.length; i++) {
              const elementId = orderList.current[i];
              const item = data[elementId];
              updatedData.push(item);
            }

            // onRemovingTransition
            updateCss(`.${className} .${subClassName}`, {
              transition: "all 0s ease-out",
            });
            // onRemovingTranslate
            updateCss(`.${className} .${subClassName}`, {
              transform: "translate3d(0px,0px,0px)",
            });
            setData(updatedData);
          }
        },
        isDropOnContainer ? 400 : 0
      );
    };

    const handleDrop = (event) => {
      event.stopImmediatePropagation();

      const {
        target: { id },
      } = event;
      onMarkingStartPoint(
        `.${className} .${subClassName}`,
        srcIndex.current,
        false
      );

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
      onMarkingStartPoint(
        `.${className} .${subClassName}`,
        srcIndex.current,
        false
      );

      if (event.offsetY > fullHeightItemRow) {
        const lastElm = document.querySelector(
          `.${className} .${subClassName}:last-child`
        );
        const event = new Event("dragover");

        lastElm.dispatchEvent(event);
        setIsDropOnContainer(true);
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
      e.addEventListener("dragover", handleDragOver, false);
      e.addEventListener("drop", handleDrop, false);
    });

    return () => {
      // Remove event listeners
      const container = document.querySelector(`.${className}`);
      container.removeEventListener("drop", handleDropContainer, false);

      const items = document.querySelectorAll(`.${className} .${subClassName}`);
      items.forEach((e) => {
        e.removeEventListener("dragstart", handleDragStart, false);
        e.removeEventListener("dragend", handleDragEnd, false);
        e.removeEventListener("dragover", handleDragOver, false);
        e.removeEventListener("drop", handleDrop, false);
      });
    };
  }, [data]);

  const onHandleAnimation = ({ start, end }) => {
    const elms = document.querySelectorAll(`.${className} .${subClassName}`);
    const startIndex = orderList.current.indexOf(start);
    const endIndex = orderList.current.indexOf(end);

    performAnimation({ startIndex, endIndex, elms });
  };

  return { data, orderList };
};

export default useUpdateOrderList;
