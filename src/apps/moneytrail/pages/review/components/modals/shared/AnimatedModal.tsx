import { Modal } from 'antd';
import { motion } from 'framer-motion';
import { FC, useEffect, useState } from 'react';
import { AnimatedModalProps } from '../../../engine/contracts/props';

export const AnimatedModal: FC<AnimatedModalProps> = ({
  open,
  afterClose,
  children,
  modalRender,
  motionClassName,
  styles,
  width = 'min(1280px, calc(100vw - 32px))',
  centered = true,
  footer = null,
  title = null,
  closable = false,
  ...modalProps
}) => {
  const [isMounted, setIsMounted] = useState(Boolean(open));

  useEffect(() => {
    if (open) setIsMounted(true);
  }, [open]);

  if (!isMounted) return null;

  return (
    <Modal
      {...modalProps}
      open={isMounted}
      centered={centered}
      width={width}
      footer={footer}
      title={title}
      closable={closable}
      transitionName=""
      styles={{
        ...styles,
        mask: {
          backdropFilter: 'blur(8px) saturate(0.8)',
          ...styles?.mask,
        },
        content: {
          padding: 0,
          background: 'transparent',
          boxShadow: 'none',
          ...styles?.content,
        },
        body: {
          padding: 0,
          ...styles?.body,
        },
      }}
      modalRender={(node) => (
        <motion.div
          className={motionClassName}
          initial="hidden"
          animate={open ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { type: 'spring', damping: 15, stiffness: 350 },
            },
          }}
          transition={{ duration: 0.15 }}
          onAnimationComplete={() => {
            if (!open) {
              setIsMounted(false);
              afterClose?.();
            }
          }}
        >
          {modalRender ? modalRender(node) : node}
        </motion.div>
      )}
    >
      {children}
    </Modal>
  );
};
