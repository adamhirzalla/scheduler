import React from "react";
import classNames from "classnames"

import "components/Button.scss";

export default function Button(props) {
   const { children, confirm, danger, disabled, onClick } = props
   let buttonClass = classNames('button', {
         "button--confirm": confirm, 
         "button--danger": danger
      })

   return (
      <button 
      className={buttonClass}
      onClick={onClick && onClick}
      disabled={disabled && disabled}
      >{children}</button>
   );
}
