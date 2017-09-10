import React, { Component } from 'react';
import './App.css';
import ReactJson from 'react-json-view';
import { generateData } from './generation.js';
import { TableData } from './Table.js';
import { intro } from './intro.js'
import { Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

const pivotMeta = {
    meta: {
        columns: [
            [ "Open", "Closed", "In Progress" ],
            [ "True", "False" ]
        ],
        rows: [
            [ "2014", "2015", "2016", "2017" ],
            [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ]
        ],
        aggregators: [ "count" ]
    }
}


class App extends Component {

    constructor( props ) {
        super( props );

        const initialResults = { ...pivotMeta, results: generateData( pivotMeta ) };

        this.state = {
            showIntro: true,
            pivotTransformations: this.generateInitialTransformations( initialResults ),
            initialResults
        }

        this.onHeaderClick = this.onHeaderClick.bind( this );
        this.onClickShowIntro = this.onClickShowIntro.bind( this );
        this.onResetTransformations = this.onResetTransformations.bind( this );
        this.generateInitialTransformations = this.generateInitialTransformations.bind( this );
        this.calculateTransformedResults = this.calculateTransformedResults.bind( this );
    }

    generateInitialTransformations( metadata ) {
        const empty = [];
        let initTransforms = {
            excludedColumns: [],
            excludedRows: [],
            excludedAggregators: [],
        }
        metadata.meta.columns.forEach( val => {
            initTransforms.excludedColumns.push( empty );
        } );
        metadata.meta.rows.forEach( val => {
            initTransforms.excludedRows.push( empty );
        } );
        metadata.meta.aggregators.forEach( val => {
            initTransforms.excludedAggregators.push( empty );
        } );
        return initTransforms;
    }

    calculateTransformedResults( results, transform ) {
        let retResults = JSON.parse( JSON.stringify( results ) );
        retResults.meta.columns = results.meta.columns.map( ( columnArr, colIdx ) => {
            return columnArr.filter( columnElement => {
                return transform.excludedColumns[ colIdx ].indexOf( columnElement ) === -1;
            } )
        } )
        retResults.meta.rows = results.meta.rows.map( ( rowArr, rowIdx ) => {
            return rowArr.filter( rowElement => {
                return transform.excludedRows[ rowIdx ].indexOf( rowElement ) === -1;
            } )
        } )
        return retResults;
    }

    onResetTransformations() {
        this.setState( {
            pivotTransformations: this.generateInitialTransformations( this.state.initialResults )
        } );
    }

    onHeaderClick( headerDirection, elementIndex, clickedCoordinateElement ) {
        let transform = { ...this.state.pivotTransformations };
        console.log( `HEADER CLICK @ direction ${headerDirection}, container index ${elementIndex}, element ${clickedCoordinateElement}` )

        let field;
        let addTransform = false;
        if ( headerDirection === 'row' ) {
            if ( transform.excludedRows[ elementIndex ].indexOf( clickedCoordinateElement ) === -1 ) {
                addTransform = true;
                field = "excludedRows";
            }
        } else if ( headerDirection === 'column' ) {
            if ( transform.excludedColumns[ elementIndex ].indexOf( clickedCoordinateElement ) === -1 ) {
                addTransform = true;
                field = "excludedColumns"
            }
        }

        if ( addTransform ) {
            const current = transform[ field ][ elementIndex ];
            transform[ field ][ elementIndex ] = current.concat( [ clickedCoordinateElement ] );
        }

        this.setState( {
            pivotTransformations: transform
        } );
    }

    onClickShowIntro() {
        let { showIntro } = this.state;
        this.setState( { showIntro: !showIntro } );
    }

    render() {
        const jsonProps = {
            collapsed: 2,
            indentWidth: 2,
            enableClipboard: false,
            displayObjectSize: false,
            displayDataTypes: false
        }

        const { initialResults, pivotTransformations } = this.state;
        const calcResults = this.calculateTransformedResults( initialResults, pivotTransformations );

        return (
            <div>
                <div className="bodyContainer headline">
                    <h1>
                        Making pivot results transformation-friendly
                    </h1>
                </div>
                <div className="bodyContainer">
                    <Button onClick={() => this.onClickShowIntro()}>
                        Show/Hide intro text
                    </Button>
                    { 
                        this.state.showIntro 
                        ? <ReactMarkdown className="bodyBackground" source={intro}/> 
                        : null
                    }
                </div>
                <div className="outerAppContainer">
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"/>

                    <AppChild headline="Pivot Results">
                        <ReactJson src={this.state.initialResults} {...jsonProps} />
                    </AppChild>

                    <AppChild headline="Transformations">
                        <ReactJson src={this.state.pivotTransformations} {...jsonProps} collapsed={false} />
                        <div>
                            <Button onClick={ () => this.onResetTransformations() }>Reset transformations</Button>
                        </div>
                    </AppChild>

                    <AppChild headline="Results + Transformations = Table DOM">
                        <TableData onClickAction={this.onHeaderClick} data={ calcResults } />
                    </AppChild>
                </div>
            </div>
        );
    }
}

const AppChild = ( { headline, children } ) =>
    <div className="outerAppContainer__section smallText">
      <h3>{headline}</h3>
      {children}
    </div>


export default App;