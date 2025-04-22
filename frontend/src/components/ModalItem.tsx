import { ReactNode, useEffect } from "react"

type ModalItemProps = {
    open: boolean
    onClose: () => void
    children: ReactNode
}

function ModalItem({open, onClose, children}:ModalItemProps) {
    useEffect( () => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <>
            <div
            onClick={onClose}
            className={`fixed inset-0 flex transition-colors w-full h-full ${open ? 'visible bg-midnight/50' : "invisible"}`}
            >
                {/* inside modal here we gonna change if screen changes*/}
                <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-midnight outline-2 outline-green-300 transition-all w-full h-full overflow-y-auto ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
                >
                    {children}
                </div>
            </div>
        </>
    )
}

export default ModalItem;