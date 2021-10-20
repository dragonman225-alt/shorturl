import React from 'react'

import styles from './Button.module.scss'

interface Props {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
}

function Button({ onClick, children }: Props) {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  )
}

export default React.memo(Button)
