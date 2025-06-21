import React, { useRef, useEffect } from 'react';
import styles from '@/style/HangmanCanvas.module.css';
interface HangmanCanvasProps {
  wrongGuesses: number;
}

const HangmanCanvas: React.FC<HangmanCanvasProps> = ({ wrongGuesses }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.strokeStyle = "#333"; 
    context.lineWidth = 4; 
    const draw = (pathFromx: number, pathFromy: number, pathTox: number, pathToy: number) => {
      context.moveTo(pathFromx, pathFromy);
      context.lineTo(pathTox, pathToy);
      context.stroke();
    };

    const drawGallowsBase = () => draw(10, 140, 130, 140); 
    const drawGallowsVertical = () => draw(30, 140, 30, 10); 
    const drawGallowsHorizontal = () => draw(30, 10, 100, 10); 
    const drawNoose = () => draw(100, 10, 100, 25); 


    const drawHead = () => {
      context.beginPath();
      context.arc(100, 45, 20, 0, Math.PI * 2, true); 
      context.stroke();
    };
    const drawBody = () => draw(100, 65, 100, 105);
    const drawLeftArm = () => draw(100, 75, 70, 95);
    const drawRightArm = () => draw(100, 75, 130, 95);
    const drawLeftLeg = () => draw(100, 105, 75, 130);
    const drawRightLeg = () => draw(100, 105, 125, 130);

    const drawParts = [
      drawGallowsBase,      
      drawGallowsVertical,  
      drawGallowsHorizontal, 
      drawNoose,       
      drawHead,              
      drawBody,             
      drawLeftArm,           
      drawRightArm,          
      drawLeftLeg,           
      drawRightLeg           
    ];

    const drawingOrder = [
        drawGallowsBase,
        drawGallowsVertical,
        drawGallowsHorizontal,
        drawNoose,
        drawHead,
        drawBody,
        drawLeftArm,
        drawRightArm,
        drawLeftLeg,
        drawRightLeg
    ];

    for (let i = 0; i < wrongGuesses + 4 && i < drawingOrder.length; i++) { 
        drawingOrder[i]();
    }


  }, [wrongGuesses]); 

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={250} 
      className={styles.hangmanCanvas} // Thêm class để dễ style
    />
  );
};

export default HangmanCanvas;