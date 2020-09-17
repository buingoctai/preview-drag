import { useState, useEffect, useRef } from "react";
import {
  updateCss,
  onRearrangeDataList,
  onMarkingStartPoint,
  getEnterIdx,
  createDragImage,
} from "../utils/utils";

const useUpdateOrderList = ({
  parentClass,
  childClass,
  dataList,
  icon,
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

  // Handle drag and drop in whitespaces
  const setOverSpaceIdx = (val) => {
    overSpaceIdx.current = val;
  };

  // new feature
  const selectedItemIds = useRef([]);
  const setSelectedItemIds = (val) => {
    selectedItemIds.current = val;
  };
  const isPressingKey = useRef(false);
  const setIsPressingKey = (val) => {
    isPressingKey.current = val;
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
      handleDragEndItem(event);
    };

    const onDragOverContainer = (event) => {
      handleDragOverContainer(event);
    };

    const onDropContainer = (event) => {
      handleDropContainer(event);
    };

    // new feature
    const onKeyDown = (event) => {
      const { keyCode } = event;
      if (keyCode === 17) setIsPressingKey(true);
    };
    const onKeyUp = (event) => {
      const { keyCode } = event;
      if (keyCode === 17) setIsPressingKey(false);
    };

    const onMouseDownItem = (event) => {
      if (event.target.className !== childClass) {
        onMarkingStartPoint(
          queryAllItemStr,
          [...selectedItemIds.current],
          false
        );
        setSelectedItemIds([]);
        return;
      }

      // if (!isPressingKey.current) {
      //   onMarkingStartPoint(
      //     queryAllItemStr,
      //     [...selectedItemIds.current],
      //     false
      //   );
      //   setSelectedItemIds([event.target.id]);
      //   onMarkingStartPoint(
      //     queryAllItemStr,
      //     [...selectedItemIds.current],
      //     false
      //   );
      // }

      const isMarked = selectedItemIds.current.includes(event.target.id);
      if (isPressingKey.current) {
        onMarkingStartPoint(queryAllItemStr, [event.target.id], !isMarked);
      }

      if (isPressingKey.current && isMarked) {
        const newSelectedItemIds = selectedItemIds.current.filter(
          (item) => item !== event.target.id
        );
        setSelectedItemIds([...newSelectedItemIds]);
      }
      if (isPressingKey.current && !isMarked) {
        setSelectedItemIds([...selectedItemIds.current, event.target.id]);
      }
    };

    // Add event listeners
    document.addEventListener("mousedown", onMouseDownItem, false); // new feature
    document.addEventListener("keydown", onKeyDown, false); // new feature
    document.addEventListener("keyup", onKeyUp, false); // new feature

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
      document.removeEventListener("mousedown", onMouseDownItem, false); // new feature
      document.removeEventListener("keydown", onKeyDown, false); // new feature
      document.removeEventListener("keyup", onKeyUp, false); // new feature

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
    // on Adding Transition
    updateCss(queryAllItemStr, {
      transition: "all 0.4s ease-out",
    });
    onMarkingStartPoint(queryAllItemStr, [id], true);
    event.dataTransfer.dropEffect = "move";

    // Select muiti items
    if (selectedItemIds.current.length > 1) {
      const imgWrap = createDragImage({
        idArr: selectedItemIds.current,
        orderList: orderList.current,
        dataArr: data,
        width: icon.width,
        height: icon.height,
      });
      document.body.appendChild(imgWrap);
      event.dataTransfer.setDragImage(imgWrap, 10, 10);
    }
  };

  const handleDragOverItem = (event) => {
    const {
      currentTarget: { id },
    } = event;
    if (id === overItemId.current) return;
    // if (selectedItemIds.current.includes(id)) return;
    setOverItemId(id);
    setOverSpaceIdx("");

    if (selectedItemIds.current.length === 0)
      setSelectedItemIds([srcId.current]);

    let newId = id;
    for (let i = 0; i < selectedItemIds.current.length; i++) {
      onHandleAnimation({
        start: parseInt(selectedItemIds.current[i]),
        end: parseInt(newId),
      });

      const arrangedOrderList = onRearrangeDataList({
        dataArr: [...orderList.current],
        srcIdx: orderList.current.indexOf(parseInt(selectedItemIds.current[i])),
        targetIdx: orderList.current.indexOf(parseInt(newId)),
      });
      setOrderList(arrangedOrderList);

      newId = selectedItemIds.current[i];
      const nextIdx = orderList.current.indexOf(
        parseInt(selectedItemIds.current[i + 1])
      );
      const newIdx = orderList.current.indexOf(parseInt(newId));

      if (nextIdx > newIdx) newId = orderList.current[newIdx + 1];
    }
  };

  const handleDropItem = (event) => {
    event.stopImmediatePropagation();
    const {
      target: { id },
    } = event;
    const oldIdx = srcId.current;
    const newIdx = orderList.current.indexOf(parseInt(id));

    handleIndexUpdate(oldIdx, newIdx);
    setIsReverting(false);
    onMarkingStartPoint(queryAllItemStr, [srcId.current], false);
  };

  const handleDragEndItem = (event) => {
    event.stopImmediatePropagation();
    // onMarkingStartPoint(queryAllItemStr, [srcId.current], false);
    onMarkingStartPoint(queryAllItemStr, [...selectedItemIds.current], false);
    setSelectedItemIds([]);

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
      // on Removing Transition
      updateCss(queryAllItemStr, {
        transition: "all 0s ease-out",
      });
      // on Removing Translate
      updateCss(queryAllItemStr, {
        transform: "translate3d(0px,0px,0px)",
      });
      setData(updatedData);
    }
  };

  const handleDropContainer = (event) => {
    event.stopImmediatePropagation();
    const oldIdx = srcId.current;
    let newIdx = orderList.current.indexOf(parseInt(oldIdx));

    setIsReverting(false);
    onMarkingStartPoint(queryAllItemStr, [srcId.current], false);
    handleIndexUpdate(oldIdx, newIdx);
  };

  // Handle drag and drop in whitespaces
  const handleDragOverContainer = (event) => {
    if (event.preventDefault) {
      event.preventDefault();
    }

    let effectIdx;
    const srcIdx = orderList.current.indexOf(parseInt(srcId.current));

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
