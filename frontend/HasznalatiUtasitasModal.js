// HasznalatiUtasitasModal.js
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const HasznalatiUtasitasModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Használati utasítás
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Használati utasítás</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Itt találhatók a használati utasítások az alkalmazás használatához...</p>
          <ul>
            <li>Első lépés: ...</li>
            <li>Második lépés: ...</li>
            <li>Harmadik lépés: ...</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Bezárás
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default HasznalatiUtasitasModal;
