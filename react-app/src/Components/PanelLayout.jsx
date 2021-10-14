import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import { AiOutlineExpandAlt } from "react-icons/ai";
import Badge from 'react-bootstrap/Badge'

const PanelLayout = () => {

  const [panelOrder, setPanelOrder] = useState({one: 0,two: 1,three: 2,four: 3,five: 4,six: 5});
  const [panelSpan, setPanelSpan] = useState({one: 4,two: 4,three: 4,four: 4,five: 4,six: 4});

  const expandPanelClickHandler = (panel) => {
      let newPanelSpan = {one: 4,two: 4,three: 4,four: 4,five: 4,six: 4};
      if(panelSpan[panel] === 4){
          newPanelSpan[panel] = 12;
      }else{
        newPanelSpan[panel] = 4;
      }
      setPanelSpan(newPanelSpan);
      if(panel === 'two' && panelSpan[panel] === 4){
        setPanelOrder({one: 1,two: 0,three: 2,four: 3,five: 4,six: 5});
      }
      if(panel === 'two' && panelSpan[panel] === 12){
        setPanelOrder({one: 0,two: 1,three: 2,four: 3,five: 4,six: 5});
      }
      if(panel === 'three' && panelSpan[panel] === 4){
        setPanelOrder({one: 1,two: 2,three: 0,four: 3,five: 4,six: 5});
      }
      if(panel === 'three' && panelSpan[panel] === 12){
        setPanelOrder({one: 0,two: 1,three: 2,four: 3,five: 4,six: 5});
      }
      if(panel === 'five' && panelSpan[panel] === 4){
        setPanelOrder({one: 0,two: 1,three: 2,four: 4,five: 3,six: 5});
      }
      if(panel === 'five' && panelSpan[panel] === 12){
        setPanelOrder({one: 0,two: 1,three: 2,four: 3,five: 4,six: 5});
      }
      if(panel === 'six' && panelSpan[panel] === 4){
        setPanelOrder({one: 0,two: 1,three: 2,four: 4,five: 5,six: 3});        
      }
      if(panel === 'six' && panelSpan[panel] === 12){
        setPanelOrder({one: 0,two: 1,three: 2,four: 3,five: 4,six: 5});
      }
      
  } 

  return (
    <Container fluid>
      <Row>
      <Col 
        xs ={{ span: panelSpan['one'], order: panelOrder['one'] }} 
        sm ={{ span: panelSpan['one'], order: panelOrder['one'] }} 
        md ={{ span: panelSpan['one'], order: panelOrder['one'] }} 
        lg ={{ span: panelSpan['one'], order: panelOrder['one'] }} 
        xl ={{ span: panelSpan['one'], order: panelOrder['one'] }} 
        xxl={{ span: panelSpan['one'], order: panelOrder['one'] }} 
        style={{ minHeight: "50vh", backgroundColor: "#f7f7f7", border: "1px solid" }} >
          <Row>
            <Col xs={11} lg={11} xl={11} style={{ padding: 0 }}>
            <h1>Sphere</h1>
            </Col>
            <Col xs={1} lg={1} xl={1} style={{ padding: 0 }}>
              <Button variant="light" style={{ padding: 0 }} onClick={() => expandPanelClickHandler('one')} >
                <AiOutlineExpandAlt style={{ fontSize: "2rem" }}></AiOutlineExpandAlt>
              </Button>
            </Col>
          </Row>
        </Col>
        <Col 
        xs ={{ span: panelSpan['two'], order: panelOrder['two'] }} 
        sm ={{ span: panelSpan['two'], order: panelOrder['two'] }} 
        md ={{ span: panelSpan['two'], order: panelOrder['two'] }} 
        lg ={{ span: panelSpan['two'], order: panelOrder['two'] }} 
        xl ={{ span: panelSpan['two'], order: panelOrder['two'] }} 
        xxl={{ span: panelSpan['two'], order: panelOrder['two'] }} 
        style={{ minHeight: "50vh", backgroundColor: "#f7f7f7", border: "1px solid" }} >
          <Row>
            <Col xs={11} lg={11} xl={11} style={{ padding: 0 }}>
            <h1>Bee Swarm</h1>
            </Col>
            <Col xs={1} lg={1} xl={1} style={{ padding: 0 }}>
              <Button variant="light" style={{ padding: 0 }} onClick={() => expandPanelClickHandler('two')}>
                <AiOutlineExpandAlt style={{ fontSize: "2rem" }}></AiOutlineExpandAlt>
              </Button>
            </Col>
          </Row>
        </Col>
        <Col 
        xs ={{ span: panelSpan['three'], order: panelOrder['three'] }} 
        sm ={{ span: panelSpan['three'], order: panelOrder['three'] }} 
        md ={{ span: panelSpan['three'], order: panelOrder['three'] }} 
        lg ={{ span: panelSpan['three'], order: panelOrder['three'] }} 
        xl ={{ span: panelSpan['three'], order: panelOrder['three'] }} 
        xxl={{ span: panelSpan['three'], order: panelOrder['three'] }} 
        style={{ minHeight: "50vh", backgroundColor: "#f7f7f7", border: "1px solid" }} >
          <Row>
            <Col xs={11} lg={11} xl={11} style={{ padding: 0 }}>
            <h1>Sankey</h1>
            </Col>
            <Col xs={1} lg={1} xl={1} style={{ padding: 0 }}>
              <Button variant="light" style={{ padding: 0 }} onClick={() => expandPanelClickHandler('three')}>
                <AiOutlineExpandAlt style={{ fontSize: "2rem" }}></AiOutlineExpandAlt>
              </Button>
            </Col>
          </Row>
        </Col>
        <Col 
        xs ={{ span: panelSpan['four'], order: panelOrder['four'] }} 
        sm ={{ span: panelSpan['four'], order: panelOrder['four'] }} 
        md ={{ span: panelSpan['four'], order: panelOrder['four'] }} 
        lg ={{ span: panelSpan['four'], order: panelOrder['four'] }} 
        xl ={{ span: panelSpan['four'], order: panelOrder['four'] }} 
        xxl={{ span: panelSpan['four'], order: panelOrder['four'] }} 
        style={{ minHeight: "50vh", backgroundColor: "#f7f7f7", border: "1px solid" }} >
          <Row>
            <Col xs={11} lg={11} xl={11} style={{ padding: 0 }}>
            <h1>Network Graph</h1>
            </Col>
            <Col xs={1} lg={1} xl={1} style={{ padding: 0 }}>
              <Button variant="light" style={{ padding: 0 }} onClick={() => expandPanelClickHandler('four')} >
                <AiOutlineExpandAlt style={{ fontSize: "2rem" }}></AiOutlineExpandAlt>
              </Button>
            </Col>
          </Row>
        </Col>
        <Col 
        xs ={{ span: panelSpan['five'], order: panelOrder['five'] }} 
        sm ={{ span: panelSpan['five'], order: panelOrder['five'] }} 
        md ={{ span: panelSpan['five'], order: panelOrder['five'] }} 
        lg ={{ span: panelSpan['five'], order: panelOrder['five'] }} 
        xl ={{ span: panelSpan['five'], order: panelOrder['five'] }} 
        xxl={{ span: panelSpan['five'], order: panelOrder['five'] }} 
        style={{ minHeight: "50vh", backgroundColor: "#f7f7f7", border: "1px solid" }} >
          <Row>
            <Col xs={11} lg={11} xl={11} style={{ padding: 0 }}>
            <h1>Bias</h1>
            </Col>
            <Col xs={1} lg={1} xl={1} style={{ padding: 0 }}>
              <Button variant="light" style={{ padding: 0 }} onClick={() => expandPanelClickHandler('five')} >
                <AiOutlineExpandAlt style={{ fontSize: "2rem" }}></AiOutlineExpandAlt>
              </Button>
            </Col>
          </Row>
        </Col>
        <Col 
        xs ={{ span: panelSpan['six'], order: panelOrder['six'] }} 
        sm ={{ span: panelSpan['six'], order: panelOrder['six'] }} 
        md ={{ span: panelSpan['six'], order: panelOrder['six'] }} 
        lg ={{ span: panelSpan['six'], order: panelOrder['six'] }} 
        xl ={{ span: panelSpan['six'], order: panelOrder['six'] }} 
        xxl={{ span: panelSpan['six'], order: panelOrder['six'] }} 
        style={{ minHeight: "50vh", backgroundColor: "#f7f7f7", border: "1px solid" }} >
          <Row>
            <Col xs={11} lg={11} xl={11} style={{ padding: 0 }}>
            <h1>Prompt</h1>
            </Col>
            <Col xs={1} lg={1} xl={1} style={{ padding: 0 }}>
              <Button variant="light" style={{ padding: 0 }} onClick={() => expandPanelClickHandler('six')} >
                <AiOutlineExpandAlt style={{ fontSize: "2rem" }}></AiOutlineExpandAlt>
              </Button>
            </Col>
          </Row>
        </Col>        
      </Row>      
    </Container>

  );
}

export default PanelLayout;
