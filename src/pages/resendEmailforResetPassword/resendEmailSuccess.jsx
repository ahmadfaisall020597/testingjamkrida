import React, { useState, useEffect } from "react";
import { Form, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";

const ResendEmailSuccess = () => {
    // navigasi
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const message = location.state?.message;


    return (
        <Container fluid id="register-mitra-page">
            <div className="content custom-style text-center py-4">
                <h2 className="mb-4">Thank You</h2>
                <p className="mb-4" style={{ backgroundColor: "#c4efc4", fontWeight: "normal" }}>
              <div dangerouslySetInnerHTML={{ __html: message }} />
                </p>
            </div>
        </Container>
    );
};

export default ResendEmailSuccess;
