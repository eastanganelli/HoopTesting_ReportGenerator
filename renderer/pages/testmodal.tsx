import React, { useState } from 'react'
import { Modal, Button } from 'antd'


const TestModal = (modalState, widthModal: number) => {
    const [open, setOpen] = React.useState(true);

	return (
        <Modal
            title="Test: XXX - Especimen: XXX - Muestra: XXX"
            centered
            open={true}
            onOk={() => setOpen(false)}
            //onCancel={() => setOpen(false)}
            width={widthModal}
            >
            <p>Some contents...</p>
        </Modal>
	)
}

export default TestModal;