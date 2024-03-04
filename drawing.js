const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorsBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector("#clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

let prevMouseX, prevMouseY, snapshot
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

const setCanasBackground = () =>{
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}



window.addEventListener("load", ()=>{
    //setting canvase width/height.. offsetwidth/heigth returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanasBackground();
});
const drawRect = (e)=>{
    // if the fill color is not checked draw a rect with border else draw rect with background
    if(!fillColor.checked){
        // creating circle according to the mouse pointer.
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    return ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    


}

const drawCircle = (e)=>{
    ctx.beginPath(); // creating new path to draw circle
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to them mouse pointer
    ctx.stroke();
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
    
}
const drawTriangle = (e)=>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
    ctx.closePath();
    ctx.stroke();
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle

}
const startDraw = (e) =>{
    isDrawing = true;
    prevMouseX = e.offsetX; //passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value 
    ctx.beginPath(); //creating a new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as lin width
    ctx.strokeStyle = selectedColor; // passing selected color as stroke style
    ctx.fillStyle = selectedColor; // passing selected Color as fill style
    //copy canvas data & passing as snapshot value.. this avoids dragging the image

    snapshot = ctx.getImageData(0,0, canvas.width, canvas.height);
}

const drawing = (e)=>{

    if(!isDrawing) return; //if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0) // adding copied canvas data on to this canvas
    if(selectedTool === "brush" || selectedTool === "eraser"){
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;

        ctx.lineTo(e.offsetX, e.offsetY) //creating line according to the mouse pointer
        ctx.stroke(); //drawing/filling line with color
    }else if(selectedTool === "rectangle"){
        drawRect(e);
    }else if(selectedTool === "circle"){
        drawCircle(e);
    }else{
        drawTriangle(e)
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", ()=>{
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});

sizeSlider.addEventListener("change", ()=> brushWidth = sizeSlider.value); // passing slider value as brushSize

colorsBtns.forEach(btn => {
    btn.addEventListener("click", ()=>{
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selected value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", ()=>{
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clearing whole canvas
    setCanasBackground();
});
saveImg.addEventListener("click", ()=>{
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`; // passing current date as link downlaod value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to downlaod image
});
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", ()=> isDrawing = false);