import { ReactNode } from "react"

type ModalItemProps = {
    open: boolean
    onClose: () => void
    children: ReactNode
}

function ModalItem({open, onClose, children}:ModalItemProps) {
    return (
        <>
            <div
            onClick={onClose}
            className={`fixed inset-0 flex transition-colors w-full h-full ${open ? 'visible bg-midnight/50' : "invisible"}`}
            >
                {/* inside modal here we gonna change if screen changes*/}
                <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-midnight outline-2 outline-green-300 transition-all w-full h-full ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
                >
                    {children}
                </div>
            </div>
        </>
    )
}

export default ModalItem;