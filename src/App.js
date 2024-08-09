import React, { useState, useRef } from 'react';
import './App.css';

const initialGrid = Array(9).fill(null).map(() => Array(9).fill(''));

const isValid = (grid) => {
    const isValidRow = (row) => {
        const seen = new Set();
        for (let num of row) {
            if (num !== '' && seen.has(num)) return false;
            seen.add(num);
        }
        return true;
    };

    const isValidCol = (colIdx) => {
        const seen = new Set();
        for (let i = 0; i < 9; i++) {
            const num = grid[i][colIdx];
            if (num !== '' && seen.has(num)) return false;
            seen.add(num);
        }
        return true;
    };

    const isValidBox = (rowIdx, colIdx) => {
        const seen = new Set();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const num = grid[rowIdx + i][colIdx + j];
                if (num !== '' && seen.has(num)) return false;
                seen.add(num);
            }
        }
        return true;
    };

    for (let i = 0; i < 9; i++) {
        if (!isValidRow(grid[i]) || !isValidCol(i)) return false;
    }
    for (let r = 0; r < 9; r += 3) {
        for (let c = 0; c < 9; c += 3) {
            if (!isValidBox(r, c)) return false;
        }
    }
    return true;
};

const solveSudoku = (grid) => {
    const findEmpty = () => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] === '') return [r, c];
            }
        }
        return [-1, -1];
    };

    const isValid = (row, col, num) => {
        for (let i = 0; i < 9; i++) {
            if (grid[row][i] === num || grid[i][col] === num) return false;
        }
        const boxRowStart = row - (row % 3);
        const boxColStart = col - (col % 3);
        for (let r = boxRowStart; r < boxRowStart + 3; r++) {
            for (let c = boxColStart; c < boxColStart + 3; c++) {
                if (grid[r][c] === num) return false;
            }
        }
        return true;
    };

    const backtrack = () => {
        const [row, col] = findEmpty();
        if (row === -1) return true;

        for (let num = 1; num <= 9; num++) {
            const strNum = num.toString();
            if (isValid(row, col, strNum)) {
                grid[row][col] = strNum;
                if (backtrack()) return true;
                grid[row][col] = '';
            }
        }
        return false;
    };

    return backtrack() ? grid : null;
};

const getHint = (grid) => {
    const findEmpty = () => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] === '') return [r, c];
            }
        }
        return [-1, -1];
    };

    const isValid = (row, col, num) => {
        for (let i = 0; i < 9; i++) {
            if (grid[row][i] === num || grid[i][col] === num) return false;
        }
        const boxRowStart = row - (row % 3);
        const boxColStart = col - (col % 3);
        for (let r = boxRowStart; r < boxRowStart + 3; r++) {
            for (let c = boxColStart; c < boxColStart + 3; c++) {
                if (grid[r][c] === num) return false;
            }
        }
        return true;
    };

    const [row, col] = findEmpty();
    if (row === -1) return null;

    for (let num = 1; num <= 9; num++) {
        const strNum = num.toString();
        if (isValid(row, col, strNum)) {
            return { row, col, value: strNum };
        }
    }
    return null;
};

function App() {
    const [grid, setGrid] = useState(initialGrid);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [solvedGrid, setSolvedGrid] = useState(null);
    const [hint, setHint] = useState('');
    const inputRefs = useRef(Array(9).fill(null).map(() => Array(9).fill(null)));

    const handleChange = (e, rowIdx, colIdx) => {
        const value = e.target.value;
        if (!/^[1-9]?$/.test(value)) return;

        const newGrid = grid.map(row => [...row]);
        newGrid[rowIdx][colIdx] = value;
        setGrid(newGrid);

        // Move focus to the next cell
        if (value !== '') {
            const nextCol = colIdx + 1;
            const nextRow = nextCol === 9 ? rowIdx + 1 : rowIdx;
            const nextColInRow = nextCol % 9;
            if (nextRow < 9) {
                inputRefs.current[nextRow][nextColInRow].focus();
            }
        }
    };

    const validate = () => {
        if (isValid(grid)) {
            setSuccess('Valid Sudoku grid');
            setError('');
            setSolvedGrid(null);
        } else {
            setError('Invalid Sudoku grid');
            setSuccess('');
            setSolvedGrid(null);
        }
    };

    const solve = () => {
        if (!isValid(grid)) {
            setError('Invalid Sudoku grid');
            setSuccess('');
            setSolvedGrid(null);
        } else {
            setError('');
            setSuccess('');
            const result = solveSudoku(grid.map(row => [...row]));
            setSolvedGrid(result);
        }
    };

    const clearGrid = () => {
        setGrid(initialGrid);
        setSolvedGrid(null);
        setError('');
        setHint('');
        setSuccess('');
    };

    const provideHint = () => {
        if (isValid(grid)) {
            const hintResult = getHint(grid);
            if (hintResult) {
                const newGrid = grid.map(row => [...row]);
                newGrid[hintResult.row][hintResult.col] = hintResult.value;
                setGrid(newGrid);
                setHint(`Hint: Row ${hintResult.row + 1}, Col ${hintResult.col + 1} - ${hintResult.value}`);
            } else {
                setHint('No hint available');
            }
        } else {
            setHint('Invalid Sudoku grid');
        }
    };

    return (
        <div className="App">
            <h1>Sudoku Solver</h1>
            <div className="container">
                <div className="grid">
                    {grid.map((row, rIdx) => row.map((value, cIdx) => (
                        <input
                            key={`${rIdx}-${cIdx}`}
                            type="text"
                            value={value}
                            onChange={(e) => handleChange(e, rIdx, cIdx)}
                            className="cell"
                            ref={el => inputRefs.current[rIdx][cIdx] = el}
                        />
                    )))}
                </div>
                <div className="buttons">
                    <button onClick={validate}>Validate</button>
                    <button onClick={solve}>Solve</button>
                    <button onClick={provideHint}>Hint</button>
                    <button onClick={clearGrid}>Clear</button>
                </div>
            </div>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            {hint && <div className="hint">{hint}</div>}
            {solvedGrid && (
                <div className="solved-grid">
                    <h2>Solved Sudoku:</h2>
                    <div className="grid">
                        {solvedGrid.map((row, rIdx) => row.map((value, cIdx) => (
                            <div
                                key={`${rIdx}-${cIdx}`}
                                className="cell solved"
                            >
                                {value}
                            </div>
                        )))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;