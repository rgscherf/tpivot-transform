import React from 'react';
import { cartesianProduct, allCoordinates } from './generation.js';
import { Table } from 'react-bootstrap';
import "./Table.css";

const TableRow = ( { data, rowCoord, colCoords, aggCoords, onClickAction } ) => {
    return (
        <tr>
            {
                rowCoord.map(elem => 
                    <td onClick={ () => onClickAction('row', rowCoord.indexOf(elem), elem) } 
                        className="rowHead">
                        {elem}
                    </td>
                )
            }
            {
                colCoords.map(colCoord => {
                    return aggCoords.map(aggCoord => {
                        return <td key={rowCoord + colCoord + aggCoord}>{data.results[rowCoord][colCoord][aggCoord].value}</td>
                    })
                })
            }
        </tr> )

}

const TableData = ( { data, onClickAction } ) => {
    const headerRowContent = cartesianProduct( data.meta.columns );
    const { rowCoords, colCoords, aggCoords } = allCoordinates( data );
    const numberOfTimesThisAppears = ( arr, elem ) => {
        console.log( arr, elem );
        return arr.reduce( ( runningCount, nextElem ) => {
            return runningCount += nextElem === elem ? 1 : 0
        }, 0 );
    }

    return (
        <Table bordered striped>
            <thead>
                {
                    data.meta.columns.map((colArray, colArrayPosition) => {
                        return <tr>
                            { 
                                // empty x*y table header to make room for row labels
                                colArrayPosition === 0 
                                ? <th colSpan={data.meta.rows.length}
                                    rowSpan={data.meta.columns.length}></th> 
                                : null 
                            }
                            { 
                                /* headerRowContent.map(coordElement => 
                                    <th onClick={ () => onClickAction('column', coordElement, coordElement[colArrayPosition]) }>
                                        {coordElement[colArrayPosition]}
                                    </th>
                                )  */

                                headerRowContent
                                .map(coord => coord[colArrayPosition])
                                .reduce((acc, next) => {
                                    if (acc.length === 0) {
                                        return [next];
                                    }
                                    if (acc[acc.length - 1] === next) {
                                        return acc;
                                    } else {
                                        return acc.concat([next]);
                                    }
                                }, [])
                                .map((elem, _, arr) =>
                                    <th colSpan={headerRowContent.length / arr.length}
                                        onClick={() => onClickAction('column', colArrayPosition, elem)} >
                                        {elem}
                                    </th>
                                ) 
                            } 
                        </tr>
                    })
                }
            </thead>
            <tbody>
                {
                    rowCoords.map(rowCoord => {
                        return <TableRow rowCoord={rowCoord}
                                  colCoords={colCoords}
                                  aggCoords={aggCoords}
                                  data={data}
                                  key={rowCoord}
                                  onClickAction={onClickAction} />
                    })
                }
            </tbody>
        </Table>
    )
}

export { TableData };