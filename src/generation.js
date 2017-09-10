function cartesianProduct( arr ) {
    return arr.reduce( function( a, b ) {
        return a.map( function( x ) {
            return b.map( function( y ) {
                return x.concat( y );
            } )
        } ).reduce( function( a, b ) { return a.concat( b ) }, [] )
    }, [
        []
    ] );
}

function generateData( metaData ) {
    let res = {};
    let rowCombos = cartesianProduct( metaData.meta.rows );
    let colCombos = cartesianProduct( metaData.meta.columns );
    rowCombos.forEach( rowCombo => {
        colCombos.forEach( colCombo => {
            metaData.meta.aggregators.forEach( reducer => {
                if ( res[ rowCombo ] === undefined ) {
                    res[ rowCombo ] = {};
                }
                if ( res[ rowCombo ][ colCombo ] === undefined ) {
                    res[ rowCombo ][ colCombo ] = {};
                }
                if ( res[ rowCombo ][ colCombo ][ reducer ] === undefined ) {
                    res[ rowCombo ][ colCombo ][ reducer ] = {};
                }
                res[ rowCombo ][ colCombo ][ reducer ] = {
                    value: Math.round( Math.random() * 100 )
                };
            } );
        } );
    } );
    return res;
}

function allCoordinates( data ) {
    return {
        rowCoords: cartesianProduct( data.meta.rows )
        , colCoords: cartesianProduct( data.meta.columns )
        , aggCoords: data.meta.aggregators
    }
}

export {
    generateData
    , cartesianProduct
    , allCoordinates
};