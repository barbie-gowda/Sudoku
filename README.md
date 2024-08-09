Overview:-
This project provides a web-based Sudoku solver with features for validating, solving, and hinting. Built with React, it allows users to enter Sudoku puzzles, validate their correctness, automatically solve them, and get hints for empty cells.

Features:-
Validation: Checks if the current grid configuration is a valid Sudoku puzzle.
Solving: Uses a backtracking algorithm to solve the Sudoku puzzle.
Hints: Provides hints for empty cells if the puzzle is valid.
Clear: Resets the grid and clears any solved puzzle.

Validation Logic:-
The validation logic ensures that the Sudoku grid adheres to the rules of Sudoku:
Rows: Each row must contain unique numbers (1-9).
Columns: Each column must contain unique numbers (1-9).
3x3 Boxes: Each 3x3 subgrid must contain unique numbers (1-9).
The validation function iterates through rows, columns, and 3x3 boxes to ensure no duplicates exist.

Solving Algorithm:-
The solving algorithm uses a backtracking approach:
Find Empty Cell: Searches for the first empty cell in the grid.
Try Possible Numbers: For each empty cell, attempt to place numbers (1-9) and check if placing a number is valid.
Recursively Solve: Recursively attempt to solve the grid with the placed number.
Backtrack: If a number does not lead to a solution, reset the cell and try the next number.

Running the Project:-
Prerequisites:
Node.js and npm installed on your machine.
Installation
Clone the Repository - git clone https://github.com/barbie-gowda/sudoku.git
Navigate to the Project Directory - cd sudoku-solver
Install Dependencies - npm install

Running the Application:-
Start the Development Server - npm star
tOpen Your Browser - Visit http://localhost:3000 to view and interact with the Sudoku solver.
