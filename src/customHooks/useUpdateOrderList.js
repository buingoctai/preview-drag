import { useState, useEffect, useRef } from "react";
import {
  updateCss,
  onRearrangeDataList,
  onMarkingStartPoint,
  getEnterIdx,
  isEnterWhiteSpace,
} from "../utils/utils";

const useUpdateOrderList = ({
  parentClass,
  childClass,
  dataList,
  numItemRow = 1,
  displayType,
  handleIndexUpdate,
  performAnimation,
}) => {
  const [data, setData] = useState(dataList);
  const srcId = useRef("");
  const overItemId = useRef("");
  const isReverting = useRef(true);
  const orderList = useRef(Array.from(Array(dataList.length).keys()));
  const isDropOnContainer = useRef(false);
  const overSpaceIdx = useRef(""); // Handle drag and drop in whitespaces

  const setSrcId = (val) => {
    srcId.current = val;
  };
  const setOverItemId = (val) => {
    overItemId.current = val;
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
  // Handle drag and drop in whitespaces
  const setOverSpaceIdx = (val) => {
    overSpaceIdx.current = val;
  };

  const queryAllItemStr = `.${parentClass} .${childClass}`;
  useEffect(() => {
    const onDragStartItem = (event) => {
      handleDragStartItem(event);
    };

    const onDragOverItem = (event) => {
      handleDragOverItem(event);
    };

    const onDropItem = (event) => {
      handleDropItem(event);
    };

    const onDragEndItem = (event) => {
      handleDragEnd(event);
    };

    const onDragOverContainer = (event) => {
      handleDragOverContainer(event);
    };

    const onDropContainer = (event) => {
      handleDropContainer(event);
    };

    // Add event listeners
    const container = document.querySelector(`.${parentClass}`);
    container.addEventListener("dragover", onDragOverContainer, false);
    container.addEventListener("drop", onDropContainer, false);

    const items = document.querySelectorAll(queryAllItemStr);
    items.forEach((e) => {
      e.addEventListener("dragstart", onDragStartItem, false);
      e.addEventListener("dragover", onDragOverItem, false);
      e.addEventListener("drop", onDropItem, false);
      e.addEventListener("dragend", onDragEndItem, false);
    });

    return () => {
      // Remove event listeners
      const container = document.querySelector(`.${parentClass}`);
      container.removeEventListener("dragover", onDragOverContainer, false);
      container.removeEventListener("drop", onDropContainer, false);

      const items = document.querySelectorAll(queryAllItemStr);
      items.forEach((e) => {
        e.removeEventListener("dragstart", onDragStartItem, false);
        e.removeEventListener("dragover", onDragOverItem, false);
        e.removeEventListener("drop", onDropItem, false);
        e.removeEventListener("dragend", onDragEndItem, false);
      });
    };
  }, [data]);

  const onHandleAnimation = ({ start, end }) => {
    const elms = document.querySelectorAll(queryAllItemStr);
    const startIdx = orderList.current.indexOf(start);
    const endIdx = orderList.current.indexOf(end);
    performAnimation({ startIdx, endIdx, elms });
  };

  const handleDragStartItem = (event) => {
    event.stopImmediatePropagation();
    const {
      target: { id },
    } = event;

    setSrcId(id);
    setOverItemId(id);
    setOverSpaceIdx(""); // Handle drag and drop in whitespace
    setIsReverting(true);
    setOrderList(Array.from(Array(dataList.length).keys()));
    setIsDropOnContainer(false);
    // on Adding Transition
    updateCss(queryAllItemStr, {
      transition: "all 0.4s ease-out",
    });
    onMarkingStartPoint(queryAllItemStr, id, true);
    event.dataTransfer.dropEffect = "move";
  };

  const handleDragOverItem = (event) => {
    const {
      currentTarget: { id },
    } = event;

    if (id === overItemId.current) return;
    setOverItemId(id);
    onHandleAnimation({
      start: parseInt(srcId.current),
      end: parseInt(id),
    });
    const arrangedOrderList = onRearrangeDataList({
      dataArr: [...orderList.current],
      srcIdx: orderList.current.indexOf(parseInt(srcId.current)),
      targetIdx: orderList.current.indexOf(parseInt(id)),
    });
    setOrderList(arrangedOrderList);
  };

  const handleDropItem = (event) => {
    event.stopImmediatePropagation();

    const {
      target: { id },
    } = event;
    onMarkingStartPoint(queryAllItemStr, srcId.current, false);

    const oldIdx = srcId.current;
    const newIdx = orderList.current.indexOf(parseInt(id));

    handleIndexUpdate(oldIdx, newIdx);
    setIsReverting(false);
  };

  const handleDragEnd = (event) => {
    event.stopImmediatePropagation();
    setTimeout(
      () => {
        onMarkingStartPoint(queryAllItemStr, srcId.current, false);
        if (isReverting.current) {
          // on Removing Translate
          updateCss(queryAllItemStr, {
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
          updateCss(queryAllItemStr, {
            transition: "all 0s ease-out",
          });
          // onRemovingTranslate
          updateCss(queryAllItemStr, {
            transform: "translate3d(0px,0px,0px)",
          });
          setData(updatedData);
        }
      },
      isDropOnContainer ? 400 : 0
    );
  };

  const handleDropContainer = (event) => {
    event.stopImmediatePropagation();
    const numRow =
      Math.floor(data.length / numItemRow) + (data.length % numItemRow);
    const oldIdx = srcId.current;
    let newIdx;
    const isEnterLastItem = isEnterWhiteSpace({
      x: event.pageX,
      y: event.pageY,
      numItemRow,
      numRow,
      query: queryAllItemStr,
    });

    setIsReverting(false);
    onMarkingStartPoint(queryAllItemStr, srcId.current, false);

    newIdx = orderList.current.indexOf(parseInt(oldIdx));
    switch (displayType) {
      case "grid":
        if (isEnterLastItem) {
          const lastElm = document.querySelector(
            `${queryAllItemStr}:last-child`
          );
          const event = new Event("dragover");

          lastElm.dispatchEvent(event);
          setIsDropOnContainer(true);
          newIdx = data.length - 1;
        }
        break;
      default:
        break;
    }
    handleIndexUpdate(oldIdx, newIdx);
  };

  // Handle drag and drop in whitespaces
  const handleDragOverContainer = (event) => {
    let effectIdx;
    const srcIdx = orderList.current.indexOf(parseInt(srcId.current));
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (event.target.className === childClass) {
      return;
    }

    const detectIdx = getEnterIdx({
      x: event.pageX,
      y: event.pageY,
      dataArr: dataList,
      numItemRow,
      query: queryAllItemStr,
      displayType: displayType,
    });
    if (typeof detectIdx === "undefined" || detectIdx === overSpaceIdx.current)
      return;

    if (detectIdx > srcIdx) {
      effectIdx = detectIdx;
    }
    if (detectIdx === srcIdx) {
      effectIdx = srcIdx;
    }
    if (detectIdx < srcIdx) {
      effectIdx = detectIdx + 1;
    }

    setOverSpaceIdx(effectIdx);
    setOverItemId(srcId.current);
    const dragoverEvent = new Event("dragover");
    const effectElm = document.querySelectorAll(queryAllItemStr)[
      orderList.current[effectIdx]
    ];
    effectElm.dispatchEvent(dragoverEvent);
  };

  return { data, orderList };
};

export default useUpdateOrderList;
