import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LinearProductThinking = () => {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext>();
  const ballPosRef = useRef({ x: 0, y: 0 });
  const isMovingRef = useRef(false);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef(0);
  const lastPositionRef = useRef({ col: 0, row: 0 });
  const keyIntervalRef = useRef<{ [key: string]: number }>({});
  const activeKeysRef = useRef<Set<string>>(new Set());
  const GRID_ROWS = 8;
  const MAX_COLS = 23; // Maximum number of columns
  const POINT_SPACING = 60; // Distance between points
  const LINE_LENGTH = 20; // Fixed line length
  const PADDING = 30;
  const [isCanvasVisible, setIsCanvasVisible] = useState(false);
  const [initialPosition, setInitialPosition] = useState({
    x: window.innerWidth < 768 ? "15px" : "499px",
    y: window.innerWidth < 768 ? "15px" : "91px",
  });

  const getGridCols = () => {
    const canvas = canvasRef.current;
    if (!canvas) return MAX_COLS;

    const availableWidth = canvas.width - 2 * PADDING;
    // Add 1 to include the last column
    return Math.floor(availableWidth / POINT_SPACING) + 1;
  };

  const drawLines = () => {
    const canvas = canvasRef.current;
    const ball = ref.current;
    if (!canvas || !ball) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 2.5;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get current ball position from DOM
    const rect = ball.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    // Convert DOM position to canvas coordinates
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;

    ballPosRef.current = {
      x: (rect.left - canvasRect.left + rect.width / 2) * scaleX,
      y: (rect.top - canvasRect.top + rect.height / 2) * scaleY,
    };

    // Continue animation until transition completes
    if (Date.now() - startTimeRef.current < 500) {
      animationFrameRef.current = requestAnimationFrame(drawLines);
    } else {
      isMovingRef.current = false;
    }

    const availableHeight = canvas.height - 2 * PADDING;
    const horizontalSpacing = POINT_SPACING; // Now using fixed spacing
    const verticalSpacing = availableHeight / (GRID_ROWS - 1);

    for (let y = PADDING; y <= canvas.height - PADDING; y += verticalSpacing) {
      for (
        let x = PADDING;
        x <= canvas.width - PADDING;
        x += horizontalSpacing
      ) {
        const lineStartX = x;
        const lineStartY = y;

        const dx = ballPosRef.current.x - lineStartX;
        const dy = ballPosRef.current.y - lineStartY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        ctx.strokeStyle = "rgb(82 82 91)";

        // Use fixed LINE_LENGTH instead of dynamic calculation
        const lineLength = Math.min(
          LINE_LENGTH,
          Math.max(0, distance - LINE_LENGTH)
        );

        ctx.beginPath();
        ctx.moveTo(lineStartX, lineStartY);
        ctx.lineTo(
          lineStartX + Math.cos(angle) * lineLength,
          lineStartY + Math.sin(angle) * lineLength
        );
        ctx.stroke();
      }
    }
  };

  const playSound = (col: number, row: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    // Only play if position changed
    if (
      lastPositionRef.current.col === col &&
      lastPositionRef.current.row === row
    ) {
      return;
    }

    // Calculate distance between points
    const colDiff = col - lastPositionRef.current.col;
    const rowDiff = row - lastPositionRef.current.row;
    const distance = Math.sqrt(colDiff * colDiff + rowDiff * rowDiff);

    // Map distance to duration (min 0.3s, max 1s)
    const duration = Math.min(1, Math.max(0.3, distance * 0.1));

    lastPositionRef.current = { col, row };

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    // Map column and row to frequency
    const baseFreq = 220; // A3
    const pentatonic = [0, 2, 4, 7, 9]; // Pentatonic intervals

    // Use both col and row for frequency calculation
    const colIndex = col % pentatonic.length;
    const octave = Math.floor(col / pentatonic.length);
    const rowModifier = row * 2; // Each row adds 2 semitones

    const frequency =
      baseFreq *
      Math.pow(2, (pentatonic[colIndex] + octave * 12 + rowModifier) / 12);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine"; // Try 'square', 'sawtooth', or 'triangle'
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    // Adjust fade out based on distance
    gainNode.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContextRef.current.currentTime + duration
    );

    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  const calculateSnapPosition = (
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    rect: DOMRect
  ) => {
    const GRID_COLS = getGridCols();
    const availableHeight = canvas.height - 2 * PADDING;
    const horizontalSpacing = POINT_SPACING;
    const verticalSpacing = availableHeight / (GRID_ROWS - 1);

    // Scale position to actual canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const actualX = x * scaleX;

    // Calculate column index
    const relativeX = actualX - PADDING;
    const col = Math.min(
      GRID_COLS - 1,
      Math.max(0, Math.round(relativeX / horizontalSpacing))
    );

    const row = Math.min(
      GRID_ROWS - 1,
      Math.max(0, Math.round((y * scaleY - PADDING) / verticalSpacing))
    );

    const snapX = PADDING + col * horizontalSpacing;
    const snapY = PADDING + row * verticalSpacing;

    return {
      displayX: snapX / scaleX,
      displayY: snapY / scaleY,
      col,
      row,
    };
  };

  const updateBallPosition = (x: number, y: number) => {
    const ball = ref.current;
    if (!ball) return;
    startTimeRef.current = Date.now();
    ball.style.setProperty("--mouse-x", `${x}px`);
    ball.style.setProperty("--mouse-y", `${y}px`);
  };

  const moveBall = () => {
    const canvas = canvasRef.current;
    const ball = ref.current;
    if (!canvas || !ball) return;

    const GRID_COLS = getGridCols(); // Get dynamic column count
    const rect = canvas.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();

    const currentX = ballRect.left - rect.left + ballRect.width / 2;
    const currentY = ballRect.top - rect.top + ballRect.height / 2;
    const moveAmount = rect.width / GRID_COLS;

    let dx = 0;
    let dy = 0;

    // Check opposing keys
    const hasLeft = activeKeysRef.current.has("ArrowLeft");
    const hasRight = activeKeysRef.current.has("ArrowRight");
    const hasUp = activeKeysRef.current.has("ArrowUp");
    const hasDown = activeKeysRef.current.has("ArrowDown");

    // Only move if not pressing opposing keys
    if (hasLeft && !hasRight) dx -= moveAmount;
    if (hasRight && !hasLeft) dx += moveAmount;
    if (hasUp && !hasDown) dy -= moveAmount;
    if (hasDown && !hasUp) dy += moveAmount;

    // If moving diagonally, normalize the movement
    if (dx !== 0 && dy !== 0) {
      dx /= Math.sqrt(2);
      dy /= Math.sqrt(2);
    }

    const { displayX, displayY, col, row } = calculateSnapPosition(
      canvas,
      currentX + dx,
      currentY + dy,
      rect
    );

    updateBallPosition(displayX, displayY);
    playSound(col, row);

    if (!isMovingRef.current) {
      isMovingRef.current = true;
      animationFrameRef.current = requestAnimationFrame(drawLines);
    }
  };

  const handleMove = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const ball = ref.current;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!canvas || !ball) return;

    const { displayX, displayY, col, row } = calculateSnapPosition(
      canvas,
      event.clientX - rect.left,
      event.clientY - rect.top,
      rect
    );
    updateBallPosition(displayX, displayY);
    playSound(col, row);

    if (!isMovingRef.current) {
      isMovingRef.current = true;
      animationFrameRef.current = requestAnimationFrame(drawLines);
    }
  };

  const normalizePosition = () => {
    const canvas = canvasRef.current;
    const ball = ref.current;
    if (!canvas || !ball) return;

    const rect = canvas.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();
    const currentX = ballRect.left - rect.left + ballRect.width / 2;
    const currentY = ballRect.top - rect.top + ballRect.height / 2;

    // Get current position as a ratio of max columns
    const currentCol = lastPositionRef.current.col;
    const currentRow = lastPositionRef.current.row;
    const currentGridCols = getGridCols();

    // Normalize the column position
    const normalizedCol = Math.min(
      currentGridCols - 1,
      Math.round((currentCol / MAX_COLS) * currentGridCols)
    );

    // Calculate new position
    const { displayX, displayY } = calculateSnapPosition(
      canvas,
      currentX,
      currentY,
      rect
    );

    updateBallPosition(displayX, displayY);
    lastPositionRef.current = { col: normalizedCol, row: currentRow };
    drawLines();
  };

  useEffect(() => {
    drawLines();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        return;
      if (e.repeat) return;

      activeKeysRef.current.add(e.key);
      moveBall();

      if (!keyIntervalRef.current[e.key]) {
        keyIntervalRef.current[e.key] = setInterval(moveBall, 150);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        return;

      activeKeysRef.current.delete(e.key);
      if (keyIntervalRef.current[e.key]) {
        clearInterval(keyIntervalRef.current[e.key]);
        delete keyIntervalRef.current[e.key];
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      Object.values(keyIntervalRef.current).forEach((interval) =>
        clearInterval(interval)
      );
    };
  }, []);

  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const containerWidth = canvas.parentElement?.clientWidth || 696;
      canvas.width = containerWidth * 2;
      canvas.height = 480; // Set fixed height
      normalizePosition();
    };

    if (isCanvasVisible) {
      // Initial size setup
      updateCanvasSize();
      // Small delay to handle any layout shifts
      requestAnimationFrame(updateCanvasSize);
    }

    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [isCanvasVisible]); // Added isCanvasVisible dependency

  useEffect(() => {
    const updatePosition = () => {
      setInitialPosition({
        x: window.innerWidth < 768 ? "15px" : "500px",
        y: window.innerWidth < 768 ? "15px" : "90px",
      });
    };

    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  useEffect(() => {
    // Set isCanvasVisible immediately for mobile
    if (window.innerWidth < 768) {
      setIsCanvasVisible(true);
    }
  }, []); // Run once on mount

  return (
    <AnimatePresence mode="popLayout">
      {!isCanvasVisible && window.innerWidth >= 768 && (
        <motion.h1
          key="title"
          className="absolute text-[#f7f8f8] text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  text-[72px] leading-[80px] md:leading-[68px] tracking-[-1.43px] cursor-pointer md:whitespace-nowrap "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{
            duration: 2,
            ease: "easeIn",
          }}
          onAnimationComplete={() => {
            setIsCanvasVisible(true);
          }}
        >
          Set the product direction
        </motion.h1>
      )}

      <motion.div
        onClick={handleMove}
        className="relative overflow-hidden cursor-pointer w-full max-w-[696px]"
      >
        {isCanvasVisible && (
          <motion.canvas
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 1 }}
            ref={canvasRef}
            height="480"
            className="w-full h-[240px]"
          ></motion.canvas>
        )}
        {isCanvasVisible && (
          <motion.div
            ref={ref}
            aria-hidden="true"
            initial={{ opacity: window.innerWidth < 768 ? 0 : 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute will-change-transform h-[10px] w-[10px] top-0 bg-[#f7f8f8] rounded-full"
            style={
              {
                transition: "transform 0.5s cubic-bezier(.7,.12,.04,1.01)",
                transform:
                  "translate(-50%,-50%) translateX(var(--mouse-x, 375px)) translateY(var(--mouse-y, 75px))",
                "--mouse-x": initialPosition.x,
                "--mouse-y": initialPosition.y,
              } as React.CSSProperties
            }
          ></motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
