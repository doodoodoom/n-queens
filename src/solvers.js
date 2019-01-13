/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findNRooksSolution = function(n) {
  if (n === 0) {
    return [];
  }
  if (n === 1) {
    return [[1]];
  }

  var solution = []; 
  for (var x = 0; x < n; x ++) {
    solution.push([]);
    for (var y = 0; y < n; y ++) {
      solution[x].push(0);
    }
  }

  var board = new Board(solution);

  var applyRooks = function(row, column) {
    board.togglePiece(row, column);
    if (board.hasRowConflictAt(row) || board.hasColConflictAt(column)) {
      board.togglePiece(row, column);
    }
    column ++;
    if (column > n - 1) {
      column = 0;
      row ++;
      if (row > n - 1) {
        return;
      }
    }
    applyRooks(row, column);
  };

  applyRooks(0, 0);
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(board.rows()));
  return board.rows();
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  if (n === 0 || n === 1) {
    return 1;
  }

  var Tree = function(matrix) {
    this.board = new Board(matrix);
    this.children = [];
    this.matrix = matrix;
  };

  Tree.prototype.addChild = function(matrix) {
    var child = new Tree(matrix);
    this.children.push(child);
    return child;
  };
  
  var solutionCount = 0;
  var matrix = [];
  for (var x = 0; x < n; x ++) {
    matrix.push([]);
  }
  for (var x = 0; x < n; x ++) {
    for (var y = 0; y < n; y++) {
      matrix[x].push(0);
    }
  }
  var treeOfSolutions = new Tree(matrix);

  var makeMatrixCopy = function(matrix) {
    var copy = _.reduce(matrix, function (acc, row) {
      acc.push(row.slice());
      return acc;
    }, []);
    return copy;
  };

  var addChildren = function(tree, row) {
    
    for (var col = 0; col < n; col ++) {
      var newBoard = makeMatrixCopy(tree.matrix);
      newBoard[row][col] = 1;
      var child = tree.addChild(newBoard);
      if (row < n - 1) {
        addChildren(child, row + 1);
      }
    }
  };

  var countSolutions = function(tree) {
    if (tree.children.length === 0) {
      if (!tree.board.hasAnyRowConflicts() && !tree.board.hasAnyColConflicts()) {
        solutionCount ++;
      }
    }
    for (var x = 0; x < tree.children.length; x ++) {
      countSolutions(tree.children[x]);
    }
  };
  
  addChildren(treeOfSolutions, 0);
  countSolutions(treeOfSolutions);
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
