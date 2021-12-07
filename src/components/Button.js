import React from "react";

import "components/Button.scss";

export default function Button(props) {
   const { children, confirm, danger, disabled, onClick } = props
   let buttonClass = "button"
   buttonClass += 
      confirm ? " button--confirm" :
      danger ? " button--danger" :
      ""

   return (
      <button 
      className={buttonClass}
      onClick={onClick && onClick}
      disabled={disabled && disabled}
      >{children}</button>
   );
}
