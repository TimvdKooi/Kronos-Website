import React from 'react'
import {Table, Button} from 'react-bootstrap';
import { Link} from "react-router-dom";

import OBJECTTYPES from './object_types.json';



const ObjectTypes = () => {
    return (
        <React.Fragment>
          <h1>Object types</h1>
          <Table striped>
      <thead>
        <tr>
          <th>Name</th>
          <th colSpan={2}>Acties</th>
        </tr>
      </thead>
      <tbody>
        {OBJECTTYPES.map((object) => {
    
            return (
              <tr key={object.name}>
                <td>{object.name}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    as={Link}
                    to={`/admin/objects/${object.name}/`}
                  >
                    Bewerk
                  </Button>
                </td>
                
              </tr>
            );
          })}
      </tbody>
    </Table>
        </React.Fragment>
      );
}

export default ObjectTypes;