const intro = `## Rationale

Currently, tpivot returns pivot results from the server as an array of arrays. The first array contains labels for the head of the table. Subsequent arrays contain result rows. The first N elements of a row array are labels for the N row fields being pivoted.  

This approach is easy to understand, but the array of arrays data structure is difficult to use once we start adding transformations on top of the result data. For example,

- What if we want to remove a row from the table?
- What if we want to remove all cells with a certain column value?
- What about both transformatons at once?
    
It's tricky to make these calculations with nested arrays.

I propose representing pivot results in nested hash maps where individual values are indexed by their row/column/aggregator coordinates in the pivot table. This makes it easy to transform our pivot data. For example, removing a given row label from the table means rendering a new table excluding values which index that row label.

I recommend treating pivot results received from the server as immutable and tracking changes to the pivot table's shape in a new "transformation" value. Transformations can be combined with pivot data to produce a new copy of the the same data with the user's presentation preferences applied. This new copy of the pivot results can be passed to a refreshed pivot table, charting module, or any new features.

Notably, this includes serializing a "transformation" along with its pivot query; later, we can load the same query with fresh data and apply the same transformations.

## Demo

The demo has three sections:

- On the left, generated data. The "meta" property describes the ordering of row/column labels. Feel free to click around the "results" property to get a sense of how data is stored.

- In the middle, a transformation data structure. I'm only demonstrating the ability to exclude row/column labels from the results data structure. You can imagine additional properties describing things like the user's desired label ordering! Note that transformations operate exclusively over the "meta" properties of a results value.

- On the right, a table displaying our generated data. This is meant to look like a pivot table, where each value belongs to a row/column intersection. Try clicking the row/column headers to exclude those values. Note how the transformation value changes. The table's data is updated by applying the new transformation value to the (immutable) results value.`;

export { intro };