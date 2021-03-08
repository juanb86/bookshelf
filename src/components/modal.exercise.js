import * as React from 'react'
import {Dialog} from './lib'

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
  const onClick = () => callAll(onClick, () => setIsOpen(false))

  if (children.length > 1) {
    throw new Error('ModalDismissButton accepts only one child (button)')
  }
  return React.cloneElement(children, {onClick})
}

function ModalOpenButton({children}) {
  const {setIsOpen} = useModal()
  const onClick = () => callAll(onClick, () => setIsOpen(true))

  if (children.length > 1) {
    throw new Error('ModalOpenButton accepts only one child (button)')
  }
  return React.cloneElement(children, {onClick: ()=> console.log(children)})
}

function ModalContents(props) {
  const {isOpen, setIsOpen} = useModal()
  const onDismiss = () => setIsOpen(false)

  return <Dialog isOpen={isOpen} onDismiss={onDismiss} {...props} />
}

export {Modal, ModalContents, ModalDismissButton, ModalOpenButton}
