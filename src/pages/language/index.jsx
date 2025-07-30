import React, { useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { compareAndUploadLanguage, downloadLanguageFile } from './languageFn';
import { Container, Row, Col, Card, Button, Form, Alert, ListGroup } from 'react-bootstrap';

const LanguagePage = () => {
    const dispatch = useDispatch();
    const idnRef = useRef();
    const engRef = useRef();

    const diffPreview = useSelector(state => state.language.diffPreview);
    
    const { translationData } = useSelector(state => state.language);
    const code_lang = useSelector(state => state.language.selectedLanguage);
    console.log('translate bahasa : ',translationData[code_lang]);
    console.log('translate bahasa : ', translationData[code_lang]?.language?.text1); // contoh pengambilan

    const handleUpload = (language, fileRef) => {
        const file = fileRef.current?.files[0];
        if (!file) {
            alert('Please select a file.');
            return;
        }
        dispatch(compareAndUploadLanguage(language, file));
    };

    const handleExport = (lang) => {
        dispatch(downloadLanguageFile(lang));
    };

    const languageLabels = {
        id: translationData[code_lang]?.language?.bahasa,
        en: translationData[code_lang]?.language?.english,
    };

    const renderDiff = () => {
        if (!diffPreview) return null;

        return (
            <Alert variant="danger" className="mt-4">
                <Alert.Heading>
                    🚫 Key Hilang Terdeteksi untuk {languageLabels[diffPreview.language]}
                </Alert.Heading>

                <ListGroup variant="flush" className="mt-3">
                    <ListGroup.Item className="bg-primary text-white fw-bold">
                        <Row>
                            <Col md={6}>Key</Col>
                            <Col md={6}>Value</Col>
                        </Row>
                    </ListGroup.Item>
                    {diffPreview.differences.map((item, idx) => (
                        <ListGroup.Item key={idx} className="bg-white text-dark">
                            <Row>
                                <Col md={6}><code>{item.key}</code></Col>
                                <Col md={6}>{item.oldValue ?? <em>(Kosong)</em>}</Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Alert>
        );
    };

    return (
        <Container className="my-4">
            <h2 className="mb-4">{translationData[code_lang]?.language?.text2}</h2>

            <Row className="mb-4">
                <Col md={6}>
                    <Card className="p-3">
                        <Card.Title>{languageLabels['id']}</Card.Title>
                        <Form.Group controlId="uploadId" className="mb-2">
                            <Form.Control type="file" accept=".json" ref={idnRef} />
                        </Form.Group>
                        <div className="d-flex gap-2">
                            <Button variant="primary" onClick={() => handleUpload('id', idnRef)}>{translationData[code_lang]?.global?.btn?.upload}</Button>
                            <Button variant="outline-primary" onClick={() => handleExport('id')}>{translationData[code_lang]?.global?.btn?.export}</Button>
                        </div>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="p-3">
                        <Card.Title>{languageLabels['en']}</Card.Title>
                        <Form.Group controlId="uploadEn" className="mb-2">
                            <Form.Control type="file" accept=".json" ref={engRef} />
                        </Form.Group>
                        <div className="d-flex gap-2">
                            <Button variant="primary" onClick={() => handleUpload('en', engRef)}>{translationData[code_lang]?.global?.btn?.upload}</Button>
                            <Button variant="outline-primary" onClick={() => handleExport('en')}>{translationData[code_lang]?.global?.btn?.export}</Button>
                        </div>
                    </Card>
                </Col>
            </Row>

            {renderDiff()}
        </Container>
    );
};

export default LanguagePage;
