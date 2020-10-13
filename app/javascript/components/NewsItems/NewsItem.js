import React from "react";
import {Col, Row} from 'react-bootstrap';
import {getAPIHostUrl} from "../../utils/rest-helper";
import format from '../../utils/date-format';
import {useQuery} from "react-query";
import {getNewsItem} from "./queries";


function NewsItem(props) {
    const id = props.match.params.id
    const { isLoading, isError, data, error } = useQuery(['newsitems',id], getNewsItem);

    let item = data;
    if (!data) {
        return null;
    }
    return  <React.Fragment>
        <Row>
            <Col md={{span: 8, offset: 2}}>
                <h1>{item.title}</h1>
                <p>{format(item.created_at, 'PPP p')} | {item.user.name}</p>
            </Col>
        </Row>
        <Row>
            <Col md={{span: 8, offset: 2}}>
                <img src={getAPIHostUrl(item.articlephoto_url_carrousel)} alt={item.title}/>
                <p>{item.news}</p>
            </Col>
        </Row>
    </React.Fragment>
}

export default NewsItem;