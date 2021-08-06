import React from "react"

export default ({command, output}) => {
  return <>
    <div className='input-line'>
      <span className='prompt'>$</span>
      <span className='input'>{command}</span>
    </div>
    <div className='output'>{output}</div>
  </>
}
