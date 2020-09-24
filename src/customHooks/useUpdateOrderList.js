import { useState, useEffect, useRef } from "react";
import {
  updateStyleAllElement,
  updateStyleSpecificElement,
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
  itemSize,
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
  const overSpaceIdx = useRef("");

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

  // User select many items
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

    const onDragEndItem = (event) => {
      handleDragEndItem(event);
    };

    const onDragOverContainer = (event) => {
      if (event.preventDefault) {
        event.preventDefault();
      }
      if (event.target.classList.contains(childClass)) {
        handleDragOverItem(event);
        return;
      }
      handleDragOverContainer(event);
    };

    const onDropContainer = () => {
      setIsReverting(false);
    };

    const onKeyDown = (event) => {
      const { keyCode } = event;
      if (keyCode === 17) setIsPressingKey(true);
    };

    const onKeyUp = (event) => {
      const { keyCode } = event;
      if (keyCode === 17) setIsPressingKey(false);
    };

    const onMouseDownItem = (event) => {
      handleClickItem(event);
    };

    const onTransitionend = (event) => {
      updateStyleSpecificElement(event.target, { pointerEvents: "initial" });
    };
    // Add event listeners
    document.addEventListener("mousedown", onMouseDownItem, false);
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);

    const container = document.querySelector(`.${parentClass}`);
    container.addEventListener("dragover", onDragOverContainer, false);
    container.addEventListener("drop", onDropContainer, false);
    container.addEventListener("transitionend", onTransitionend, false);

    const items = document.querySelectorAll(queryAllItemStr);
    items.forEach((e) => {
      e.addEventListener("dragstart", onDragStartItem, false);
      e.addEventListener("dragend", onDragEndItem, false);
    });

    return () => {
      // Remove event listeners
      document.removeEventListener("mousedown", onMouseDownItem, false);
      document.removeEventListener("keydown", onKeyDown, false);
      document.removeEventListener("keyup", onKeyUp, false);

      const container = document.querySelector(`.${parentClass}`);
      container.removeEventListener("dragover", onDragOverContainer, false);
      container.removeEventListener("drop", onDropContainer, false);
      container.removeEventListener("transitionend", onTransitionend, false);

      const items = document.querySelectorAll(queryAllItemStr);
      items.forEach((e) => {
        e.removeEventListener("dragstart", onDragStartItem, false);
        e.removeEventListener("dragend", onDragEndItem, false);
      });
    };
  }, [data]);

  const handleClickItem = ({ target: element }) => {
    // Check marked before
    const isMarked = selectedItemIds.current.includes(element.id);
    // Remove selected items status when click outside item
    const isOutsideItem = !element.classList.contains(childClass);
    // Select many items but don't drag on selected item
    const cancleDragSelectedItem =
      !isPressingKey.current && !selectedItemIds.current.includes(element.id);

    if (isOutsideItem || cancleDragSelectedItem) {
      onMarkingStartPoint({
        query: queryAllItemStr,
        effectedArr: [...selectedItemIds.current],
        isProcessing: false,
        selectedBeforeArr: selectedItemIds.current,
      });
      setSelectedItemIds([]);
      return;
    }

    if (isPressingKey.current && isMarked) {
      const newSelectedItemIds = selectedItemIds.current.filter(
        (item) => item !== element.id
      );
      setSelectedItemIds([...newSelectedItemIds]);
    }
    if (isPressingKey.current && !isMarked) {
      setSelectedItemIds([...selectedItemIds.current, element.id]);
    }
    if (isPressingKey.current) {
      onMarkingStartPoint({
        query: queryAllItemStr,
        effectedArr: [element.id],
        isProcessing: !isMarked,
        selectedBeforeArr: selectedItemIds.current,
        itemSize,
      });
    }
  };

  const handleDragStartItem = (event) => {
    event.stopImmediatePropagation();
    const {
      target: { id },
    } = event;

    setSrcId(id);
    setOverItemId(id); // Handle drag and drop on item
    setOverSpaceIdx(""); // Handle drag and drop on whitespace
    setIsReverting(true);
    setOrderList(Array.from(Array(dataList.length).keys()));
    updateStyleAllElement(queryAllItemStr, {
      // on Adding Transition
      transition: "all 0.4s ease-out",
    });

    // Add into selectedIds for select one item case
    if (selectedItemIds.current.length === 0) {
      setSelectedItemIds([srcId.current]);
      onMarkingStartPoint({
        query: queryAllItemStr,
        effectedArr: [id],
        isProcessing: true,
        selectedBeforeArr: selectedItemIds.current,
        onlyOneItem: true,
      });
    }
    event.dataTransfer.dropEffect = "move";

    // Custom drag image
    const imgWrap = createDragImage({
      idArr: selectedItemIds.current,
      orderList: orderList.current,
      dataArr: data,
      icon,
    });
    document.body.appendChild(imgWrap);
    event.dataTransfer.setDragImage(imgWrap, 10, 10);
  };

  const handleDragOverItem = ({ target: { id } }) => {
    if (id === overItemId.current) return;
    setOverItemId(id);
    setOverSpaceIdx("");
    let enterId = id;

    for (let i = 0; i < selectedItemIds.current.length; i++) {
      const srcId = selectedItemIds.current[i];
      const startIdx = orderList.current.indexOf(parseInt(srcId));
      const endIdx = orderList.current.indexOf(parseInt(enterId));

      onHandleAnimation({
        startIdx,
        endIdx,
      });
      const arrangedOrderList = onRearrangeDataList({
        dataArr: [...orderList.current],
        startIdx,
        endIdx,
      });
      setOrderList(arrangedOrderList);

      // Update enterId
      enterId = srcId;
      const nextSrcIdx = orderList.current.indexOf(
        parseInt(selectedItemIds.current[i + 1])
      );
      const enterIdx = orderList.current.indexOf(parseInt(enterId));
      if (nextSrcIdx > enterIdx) enterId = orderList.current[enterIdx + 1];
    }
  };

  const handleDragEndItem = (event) => {
    event.stopImmediatePropagation();
    onMarkingStartPoint({
      query: queryAllItemStr,
      effectedArr: [...selectedItemIds.current],
      isProcessing: false,
      selectedBeforeArr: selectedItemIds.current,
    });
    setSelectedItemIds([]);

    if (isReverting.current) {
      // on Removing Translate
      updateStyleAllElement(queryAllItemStr, {
        transform: "translate3d(0px,0px,0px)",
      });
    } else {
      let updatedData = [];

      for (let i = 0; i < orderList.current.length; i++) {
        const elementId = orderList.current[i];
        const item = data[elementId];
        updatedData.push(item);
      }
      updateStyleAllElement(queryAllItemStr, {
        transition: "all 0s ease-out",
        transform: "translate3d(0px,0px,0px)",
        pointerEvents: "initial",
      });
      setData(updatedData);
    }

    handleIndexUpdate(orderList.current);
    // Remove drag image
    document.getElementById("customDragImage").remove();
  };

  const handleDragOverContainer = (event) => {
    let effectIdx;
    const srcIdx = orderList.current.indexOf(parseInt(srcId.current));
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
    handleDragOverItem({
      target: { id: orderList.current[effectIdx].toString() },
    });
  };

  const onHandleAnimation = ({ startIdx, endIdx }) => {
    const elms = document.querySelectorAll(queryAllItemStr);
    performAnimation({ startIdx, endIdx, elms });
  };

  return { data, orderList };
};

export default useUpdateOrderList;
