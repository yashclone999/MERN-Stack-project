import React from 'react';
import {  Breadcrumb, BreadcrumbItem } from 'reactstrap';
import {  Fade, Stagger } from 'react-animation-components';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import { FadeTransform } from 'react-animation-components';

function RenderFeedback({ feedback }) {
    return (
        <div className="col-12 col-md-5 m-1">
                    {feedback.map((feedback) => {
                        return (
                            <FadeTransform in
                                transformProps={{
                                    exitTransform: 'scale(0.5) translateY(-50%)'
                                }}>
                                <Card>
                                    <CardBody>
                                        <CardTitle>--{feedback.firstname} {feedback.lastname}--</CardTitle>
                                        <CardText>"{feedback.message}"</CardText>
                                    </CardBody>
                                </Card>
                            </FadeTransform>
                        );
                    })}
                
        </div>
    );
}

const Feedback = (props) => {

    if (props.feedback.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.feedback.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.feedback.errMess}</h4>
                </div>
            </div>
        )
    }
    else if (props.feedback.feedbacks != null && props.feedback.feedbacks.length > 0) {

        

        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/home'>Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Feedback</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>Feedback</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderFeedback feedback = {props.feedback.feedbacks} />
                </div>
            </div>
        );
    }
    else {
        return (
            <div className="container">
                <div className="row">
                    <h4>No Feedback!</h4>
                </div>
            </div>
        )
    }
}

export default Feedback;