import { motion } from 'framer-motion'
import React, { ReactNode } from 'react'
import { pageVariants } from 'src/transitions'

interface PageFrameProps {
    children: ReactNode
}
function PageFrame({ children }: PageFrameProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.5 }}

        >
            {children}
        </motion.div>

    )
}

export default PageFrame