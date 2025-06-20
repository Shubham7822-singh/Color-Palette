import './App.css'
import { useCallback, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toPng } from 'html-to-image';


const PALETTE_SIZE = 5 

const ColorPlate = ({color, index, onIconClick, lockStatus }) => {
  const handleCopy = (e) => {
  navigator.clipboard.writeText(e.target.innerText);
  toast('Copied to clipboard')
  }

 const handlelockunlock = (e) => {
   onIconClick(index)
    
 }

  return(
<div 
 style={{backgroundColor: color}}
  className='flex gap-2S flex-col items-center justify-center text-xl font-medium'
  >
<p onClick={handleCopy} className='p-2 hover:cursor-pointer'>{color}</p>
<div className='cursor-pointer' onClick={handlelockunlock}>
  { lockStatus ?
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
</svg>

:
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 0 1-1.5 0V6.75a3.75 3.75 0 1 0-7.5 0v3a3 3 0 0 1 3 3v6.75a3 3 0 0 1-3 3H3.75a3 3 0 0 1-3-3v-6.75a3 3 0 0 1 3-3h9v-3c0-2.9 2.35-5.25 5.25-5.25Z" />
</svg>


}
</div>
 
 </div>

  )
}

const generateRandomColor = () => {
  let colorCode = '#'
  for(let i = 0 ; i < 3 ; i++){
    let colorInt = Math.random() * 256
    console.log('colorInt',colorInt )
    colorCode = colorCode + parseInt (colorInt).toString(16).padStart(2, '0')
  }
  return colorCode;
}

function App() {
    const ref = useRef(null)
   const [lockStatusArray, setLockStatusArray] = useState(Array.from({length: PALETTE_SIZE}, () => { return false }))
  const [colors, setColors] = useState(Array.from({length: PALETTE_SIZE}, generateRandomColor))


   const handleDownload = useCallback(() => {
    if (ref.current === null) {
      return
    }

    toPng(ref.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'color-palatte.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])
 const generateNewColorPalette = () => {
let newColors = []
 for (let i = 0 ; i < PALETTE_SIZE; i++){
  if(lockStatusArray[i]){
     newColors[i] = colors[i]
  } 
  else{
    newColors[i] = generateRandomColor()
  }
 }
 setColors(newColors)
 }

 const toggleLock = (index) => {
  const newLockStatusArray = [...lockStatusArray]
  newLockStatusArray[index] = !lockStatusArray[index]
  setLockStatusArray(newLockStatusArray)
 }

 document.body.onkeyup = function(e) {
  if (e.key == " " || e.code == "Space")
     {
      generateNewColorPalette()
  }

}

  return (
    <div className='flex flex-col w-screen h-screen'>
      <ToastContainer
      position="bottom-right"
autoClose={3000}
hideProgressBar={true}
newestOnTop={false}
theme="light"

      />
      <div className=' h-24 flex items-center justify-between px-6 md:px-8 lg:px-12  '>
         <h1 className='text-4xl font-bold text-amber-500'>colors</h1>
         <button onClick={handleDownload} className='bg-red-500 px-3 py-2 rounded hover:bg-amber-600'>Download</button>

      </div>
      <div ref={ref} className='grow grid grid-cols-1 md:grid-cols-5'>
        {
          colors.map((colorValue, indexValue) =>
          {
            return <ColorPlate key={indexValue}  color={colorValue} index={indexValue} onIconClick = {toggleLock} lockStatus={lockStatusArray[indexValue] } />
          })
        }
        
      </div>
    </div>
  )
}

export default App
