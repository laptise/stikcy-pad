import { faSadCry, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { memo, MouseEvent, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.scss';

declare global {
  interface String {
    styleToNumber(): number;
  }
}

String.prototype.styleToNumber = function () {
  return Number(this.replace('px', ''));
};
class Memo {
  id: number;

  content: string;

  top: number;

  left: number;

  width: number;

  height: number;

  constructor(
    id: number,
    content: string,
    top: number,
    left: number,
    width: number,
    height: number
  ) {
    this.id = id;
    this.content = content;
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
  }
}

const memos: Memo[] = [];

interface MemoPadProps {
  memo: Memo;
  deleteThisNote(memo: Memo): void;
  saveStore(): void;
}

function MemoPad({ memo, deleteThisNote, saveStore }: MemoPadProps) {
  const [value, setValue] = useState(memo.content);
  const [top, setTop] = useState(memo.top);
  const [left, setLeft] = useState(memo.left);
  const [focused, setFocused] = useState(false);
  const elm = useRef((null as unknown) as HTMLDivElement);
  let offsetX = 0;
  let offsetY = 0;
  const inputEvent = (e: React.FormEvent) => {
    const target = e.currentTarget as HTMLTextAreaElement;
    setValue(target.value);
    memo.content = target.value;
    saveStore();
  };

  const updatePositions = () => {
    memo.height = elm.current.style.height.styleToNumber();
    memo.left = elm.current.style.left.styleToNumber();
    memo.top = elm.current.style.top.styleToNumber();
    memo.width = elm.current.style.width.styleToNumber();
    saveStore();
  };

  const mouseDownEvent = (e: React.MouseEvent) => {
    offsetX = e.pageX - left;
    offsetY = e.pageY - top;
    document.onmousemove = mouseMoveEvent as any;
    document.onmouseup = mouseUpEvent as any;
  };

  const mouseMoveEvent = (e: MouseEvent) => {
    setTop(e.pageY - offsetY);
    setLeft(e.pageX - offsetX);
  };

  const mouseUpEvent = (e: MouseEvent) => {
    updatePositions();
    document.onmousemove = undefined as any;
    document.onmouseup = undefined as any;
  };

  const bottomResize = (e: MouseEvent) => {
    document.onmousemove = mouseMove as any;
    document.onmouseup = mouseUp as any;
    const height = elm.current.style.height.styleToNumber();
    const startY = e.pageY;
    function mouseMove(e: MouseEvent) {
      const changed = e.pageY - startY;
      elm.current.style.height = `${height + changed}px`;
    }
    function mouseUp() {
      updatePositions();
      document.onmousemove = undefined as any;
      document.onmouseup = undefined as any;
    }
  };

  const rightResize = (e: MouseEvent) => {
    document.onmousemove = mouseMove as any;
    document.onmouseup = mouseUp as any;
    const width = elm.current.style.width.styleToNumber();
    const startX = e.pageX;
    function mouseMove(e: MouseEvent) {
      const changed = e.pageX - startX;
      elm.current.style.width = `${width + changed}px`;
    }
    function mouseUp() {
      updatePositions();
      document.onmousemove = undefined as any;
      document.onmouseup = undefined as any;
    }
  };

  const seResize = (e: MouseEvent) => {
    document.onmousemove = move as any;
    document.onmouseup = up as any;
    const height = elm.current.style.height.styleToNumber();
    const startY = e.pageY;
    const width = elm.current.style.width.styleToNumber();
    const startX = e.pageX;

    function move(e: MouseEvent) {
      const changedY = e.pageY - startY;
      elm.current.style.height = `${height + changedY}px`;
      const changedX = e.pageX - startX;
      elm.current.style.width = `${width + changedX}px`;
    }
    function up() {
      updatePositions();
      document.onmousemove = undefined as any;
      document.onmouseup = undefined as any;
    }
  };

  const swResize = (e: MouseEvent) => {
    document.onmousemove = move as any;
    document.onmouseup = up as any;
    const height = elm.current.style.height.styleToNumber();
    const startY = e.pageY;
    const left = elm.current.style.left.styleToNumber();
    const width = elm.current.style.width.styleToNumber();
    const startX = e.pageX;

    function move(e: MouseEvent) {
      const changedY = e.pageY - startY;
      elm.current.style.height = `${height + changedY}px`;
      const changedX = e.pageX - startX;
      elm.current.style.width = `${width - changedX}px`;
      elm.current.style.left = `${left + changedX}px`;
    }
    function up() {
      updatePositions();
      document.onmousemove = undefined as any;
      document.onmouseup = undefined as any;
    }
  };

  const leftResize = (e: MouseEvent) => {
    document.onmousemove = move as any;
    document.onmouseup = up as any;
    const left = elm.current.style.left.styleToNumber();
    const width = elm.current.style.width.styleToNumber();
    const startX = e.pageX;

    function move(e: MouseEvent) {
      const changedX = e.pageX - startX;
      elm.current.style.width = `${width - changedX}px`;
      elm.current.style.left = `${left + changedX}px`;
    }
    function up() {
      updatePositions();

      document.onmousemove = undefined as any;
      document.onmouseup = undefined as any;
    }
  };
  return (
    <div
      ref={elm}
      style={{ top, left, height: memo.height, width: memo.width }}
      className={`single-memo-pad ${focused ? 'focused' : ''}`}
    >
      <div className="resizer top" />
      <div onMouseDown={leftResize} className="resizer left" />
      <div onMouseDown={bottomResize} className="resizer bottom" />
      <div onMouseDown={rightResize} className="resizer right" />
      <div onMouseDown={seResize} className="resizer se" />
      <div onMouseDown={swResize} className="resizer sw" />
      <div onMouseDown={mouseDownEvent} className="header">
        <button onClick={() => deleteThisNote(memo)}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <textarea
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onInput={inputEvent}
        spellCheck={false}
        value={value}
      />
    </div>
  );
}

interface DragBoxProps {
  left: number;
  width: number;
  height: number;
  top: number;
}

function DragBox({ left, top, width, height }: DragBoxProps) {
  return <div id="drag-box" style={{ left, top, width, height }}></div>;
}

interface MiniMapProps {
  memoList: Memo[];
}

function MiniMap({ memoList }: MiniMapProps) {
  return (
    <div id="mini-map">
      <div style={{ position: 'relative' }}>
        {memoList.map((memo) => (
          <MiniMapBlock rate={0.05} key={memo.id} memo={memo} />
        ))}
      </div>
    </div>
  );
}

interface MiniMapBlockProps {
  memo: Memo;
  rate: number;
}
function MiniMapBlock({ memo, rate }: MiniMapBlockProps) {
  const { content, top, left, height, width } = memo;
  const [focused, setFocused] = useState(false);
  const elm = useRef((null as unknown) as HTMLDivElement);
  return (
    <div
      ref={elm}
      style={{
        top: top * rate,
        left: left * rate,
        height: height * rate,
        width: width * rate,
      }}
      className={`mini-memo ${focused ? 'focused' : ''}`}
    ></div>
  );
}

const Index = () => {
  const [memoList, setMemoList] = useState([] as Memo[]);
  const [drawing, setDrawing] = useState(false);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const canvas = useRef((null as unknown) as HTMLDivElement);
  let startX = 0;
  let startY = 0;
  let offsetX = 0;
  let offsetY = 0;
  const mouseDownEvent = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === 'canvas') {
      document.onmousemove = mouseMoveEvent as any;
      document.onmouseup = mouseUpEvent as any;
      const left = Number(canvas.current.style.left.replace('px', ''));
      const top = Number(canvas.current.style.top.replace('px', ''));
      offsetX = left;
      offsetY = top;
      if (isMoving) {
        startY = e.pageY - offsetY;
        startX = e.pageX - offsetX;
      } else {
        setDrawing(true);
        setLeft(e.pageY - offsetX);
        setTop(e.pageY - offsetY);
        startX = e.pageX - offsetX;
        startY = e.pageY - offsetY;
        setWidth(0);
        setHeight(0);
      }
    }
  };

  const mouseMoveEvent = (e: MouseEvent) => {
    if (isMoving) {
      const top = e.pageY - startY;
      const left = e.pageX - startX;
      canvas.current.style.top = `${top}px`;
      canvas.current.style.left = `${left}px`;
    } else {
      const widthValue = e.pageX - startX - offsetX;
      const heightValue = e.pageY - startY - offsetY;
      if (widthValue < 0) {
        setWidth(-widthValue);
        setLeft(startX + widthValue);
      } else {
        setLeft(startX);
        setWidth(widthValue);
      }
      if (heightValue < 0) {
        setHeight(-heightValue);
        setTop(startY + heightValue);
      } else {
        setHeight(heightValue);
        setTop(startY);
      }
    }
  };

  const mouseUpEvent = (e: MouseEvent) => {
    if (isMoving) {
      document.onmousemove = undefined as any;
    } else {
      const dragBox = document.querySelector<HTMLDivElement>('#drag-box');
      const top = Number(dragBox?.style.top.replace('px', ''));
      const left = Number(dragBox?.style.left.replace('px', ''));
      const width = Number(dragBox?.style.width.replace('px', ''));
      const height = Number(dragBox?.style.height.replace('px', ''));
      if (width > 20 && height > 40) {
        const newMemo = new Memo(
          new Date().valueOf(),
          '',
          top,
          left,
          width,
          height
        );
        setMemoList([...memoList, newMemo]);
        saveStore();
      }
      setDrawing(false);
    }
  };
  let scale = 1;

  const wheelEvent = (e: React.WheelEvent) => {
    // // e.preventDefault();
    // console.log(e)
    // scale += e.deltaY * -0.01;
    // // Restrict scale
    // scale = Math.min(Math.max(0.125, scale), 4);
    // // Apply scale transform
    // canvas.current.style.transform = `scale(${scale})`;
  };
  document.onkeydown = (e) => {
    const key = e.key;
    switch (key) {
      case '®':
        setMemoList([]);
        break;
      case 'Alt':
        enterMoveMode();
        break;
      case 'Control':
        enterMoveMode();
        break;
    }
  };
  document.onkeyup = (e) => {
    const key = e.key;
    switch (key) {
      case 'Alt':
        leaveMoveMode();
        break;
      case 'Control':
        leaveMoveMode();
        break;
    }
  };

  const enterMoveMode = () => {
    setIsMoving(true);
    document.body.classList.add('moving');
  };

  const leaveMoveMode = () => {
    setIsMoving(false);
    document.body.classList.remove('moving');
    const [left, top] = [canvas.current.style.left, canvas.current.style.top]
      .map((px) => px.replace('px', ''))
      .map((px) => Number(px));
    const coordinates = { left, top };
    localStorage.setItem('coordinates', JSON.stringify(coordinates));
  };

  const deleteThisNote = (memo: Memo) => {
    const newMemos = memoList.filter((item) => item !== memo);
    localStorage.setItem('memos', JSON.stringify(newMemos));
    load();
    console.log(memoList);
  };

  const load = () => {
    const dataString = localStorage.getItem('memos');
    const data = dataString && JSON.parse(dataString);
    data && setMemoList(data);
    const coordinatesString = localStorage.getItem('coordinates');
    const coordinates = coordinatesString && JSON.parse(coordinatesString);
    if (coordinates) {
      const { left, top } = coordinates;
      if (left) canvas.current.style.left = `${left}px`;
      if (top) canvas.current.style.top = `${top}px`;
    }
  };

  const saveStore = () => {
    localStorage.setItem('memos', JSON.stringify(memoList));
  };

  useEffect(() => load(), []);
  return (
    <>
      {isMoving && <MiniMap memoList={memoList} />}
      <div
        style={{ left: -2000, top: -2000 }}
        id="canvas"
        ref={canvas}
        onWheel={wheelEvent}
        onMouseDown={mouseDownEvent}
      >
        {drawing && (
          <DragBox left={left} top={top} height={height} width={width} />
        )}
        {memoList.map((memo) => (
          <MemoPad
            key={memo.id}
            saveStore={saveStore}
            deleteThisNote={deleteThisNote}
            memo={memo}
          />
        ))}
      </div>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Index} />
      </Switch>
    </Router>
  );
}
