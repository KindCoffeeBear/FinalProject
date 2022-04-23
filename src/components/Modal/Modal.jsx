import ReactDOM from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import styles from './Modal.module.css'
import { innerModalVariants, wrModalAnimate } from './modalAnimation'

// создаем модалку используя порталы
function Modal({
  children, state, ...rest
}) {
  return ReactDOM.createPortal(
    <AnimatePresence>
      {state && <ModalInner {...rest}>{children}</ModalInner>}
    </AnimatePresence>,
    document.getElementById('modal-root'),
  )
}

export default Modal

function ModalInner({ children, closeModal }) {
  // создаем функцию для передачи в addEventListener
  const escHandler = (e) => {
    if (e.code === 'Escape') {
      closeModal()
    }
  }

  // выход из модалки по клику на Esc
  useEffect(() => {
    window.document.addEventListener('keydown', escHandler)

    return () => {
      window.document.removeEventListener('keydown', escHandler)
    }
  }, [])

  // закрытие модалки по клику (в данном случае на крестик и на внешний блок)
  const closeClickHandler = () => {
    closeModal()
  }

  // прервать процесс закрытия модалки по клику на форме, остановив всплытие
  const innerClickHandler = (e) => {
    e.stopPropagation()
  }

  return (
    <motion.div variants={wrModalAnimate} initial="start" animate="end" exit="final" onClick={closeClickHandler} className={styles.wrapper}>
      <motion.div variants={innerModalVariants} onClick={innerClickHandler} className={styles.inner}>
        <svg
          onClick={closeClickHandler}
          role="button"
          className={`bi bi-x-lg ${styles.icon}`}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
          />
          <path
            fillRule="evenodd"
            d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
          />
        </svg>
        {children}
      </motion.div>
    </motion.div>
  )
}
