// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var matrix = this.rows();
      var row = matrix[rowIndex].slice(0);
      for (var x = 0; x < row.length; x ++) {
        if (row[x] === 1) {
          var hit = row[x];
          row.splice(x, 1);
          for (var y = 0; y < row.length; y ++) {
            if (row[y] === 1) {
              return true;
            }
          }
        }
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var hasConflict = false;
      var matrix = this.rows();
      for (var x = 0; x < matrix.length; x ++) {
        hasConflict = this.hasRowConflictAt(x);
        if (hasConflict) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var matrix = this.rows();
      var column = [];
      for (var x = 0; x < matrix.length; x ++) {
        column.push(matrix[x][colIndex]);
      }

      for (var x = 0; x < column.length; x ++) {
        if (column[x] === 1) {
          var hit = column[x];
          column.splice(x, 1);
          for (var y = 0; y < column.length; y ++) {
            if (column[y] === 1) {
              return true;
            }
          }
        }
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var hasConfict = false;
      var matrix = this.rows();
      for (var x = 0; x < matrix.length; x ++) {
        hasConflict = this.hasColConflictAt(x);
        if (hasConflict) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var matrix = this.rows();
      var diagonal = [];

      for (var y = 0; y < matrix.length; y ++) {
        var x = majorDiagonalColumnIndexAtFirstRow + y;
        if (x < 0 || x > matrix.length - 1) {
          diagonal.push('blank');
        } else {
          diagonal.push(matrix[x][y]);
        }
      }

      for (var x = 0; x < diagonal.length; x ++) {
        if (diagonal[x] === 1) {
          var hit = diagonal[x];
          diagonal.splice(x, 1);
          for (var y = 0; y < diagonal.length; y ++) {
            if (diagonal[y] === 1) {
              return true;
            }
          }
        }
      }
      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var hasConflict = false;
      var matrix = this.rows();
      var row = -(matrix.length - 2);
      for (var x = row; x < matrix.length + row; x ++) {
        hasConflict = this.hasMajorDiagonalConflictAt(x);
        if (hasConflict) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var matrix = this.rows();
      var diagonal = [];

      for (var y = 0; y < matrix.length; y ++) {
        var x = minorDiagonalColumnIndexAtFirstRow - y;
        if (x < 0 || x > matrix.length - 1) {
          diagonal.push('blank');
        } else {
          diagonal.push(matrix[x][y]);
        }
      }

      for (var x = 0; x < diagonal.length; x ++) {
        if (diagonal[x] === 1) {
          var hit = diagonal[x];
          diagonal.splice(x, 1);
          for (var y = 0; y < diagonal.length; y ++) {
            if (diagonal[y] === 1) {
              return true;
            }
          }
        }
      }
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var hasConflict = false;
      var matrix = this.rows();
      var row = matrix.length - 2;
      for (var x = row; x < matrix.length + row; x ++) {
        hasConflict = this.hasMinorDiagonalConflictAt(x);
        if (hasConflict) {
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
