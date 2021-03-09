/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import {Dialog, CircleButton} from './lib'

const ModalContext = React.createContext()

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args))

function Modal({children}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <ModalContext.Provider value={{isOpen, setIsOpen}}>
      {children}
    </ModalContext.Provider>
  )
}

function useModal() {
  const context = React.useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a <Modal />')
  }
  return context
}

function ModalDismissButton({children}) {
  const {setIsOpen} = useModal()

  if (children.length > 1) {
    throw new Error('ModalDismissButton accepts only one child (button)')
  }
  return React.cloneElement(children, {
    onClick: callAll(children.props.onClick, () => setIsOpen(false)),
  })
}

function ModalOpenButton({children}) {
  const {setIsOpen} = useModal()

  if (children.length > 1) {
    throw new Error('ModalOpenButton accepts only one child (button)')
  }
  return React.cloneElement(children, {
    onClick: callAll(children.props.onClick, () => setIsOpen(true)),
  })
}

function ModalContentsBase(props) {
  const {isOpen, setIsOpen} = useModal()
  const onDismiss = () => setIsOpen(false)

  return <Dialog isOpen={isOpen} onDismiss={onDismiss} {...props} />
}

function ModalContents({children, title, ...props}) {
  return (
    <ModalContentsBase {...props}>
      <div css={{display: 'flex', justifyContent: 'flex-end'}}>
        <ModalDismissButton>
          <CircleButton>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </ModalDismissButton>
      </div>
      <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
      {children}
    </ModalContentsBase>
  )
}

export {
  Modal,
  ModalContentsBase,
  ModalContents,
  ModalDismissButton,
  ModalOpenButton,
}
