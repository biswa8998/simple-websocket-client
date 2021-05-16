import React, { Suspense } from "react";
import "./App.css";

const Headline = React.lazy(() => import("./Headline"));

function Square(props) {
  const backgroundColor = props.doBold ? "#cecece" : "#fff";
  return (
    <button
      style={{ backgroundColor: backgroundColor }}
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

function CreateRow(props) {
  const squares = Array(props.multiplier)
    .fill(null)
    .map((p, q) => props.renderSquare(props.index * props.multiplier + q));
  return <div className="board-row">{squares}</div>;
}

class Board extends React.Component {
  renderSquare = i => {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        doBold={this.props.currentSelected - 1 === i}
        key={`k${i}`}
      />
    );
  };

  render() {
    const rows = Array(this.props.rows)
      .fill(null)
      .map((i, o) => (
        <CreateRow
          renderSquare={this.renderSquare}
          multiplier={this.props.rows}
          index={o}
          key={`b${o}`}
        />
      ));

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          row: null,
          col: null
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      sortDir: true // ascending
    };

    this.doBold = false;
  }

  getRowCol = i => {
    const location = [
      [1, 1],
      [1, 2],
      [1, 3],
      [2, 1],
      [2, 2],
      [2, 3],
      [3, 1],
      [3, 2],
      [3, 3]
    ];

    return location[i];
  };

  getCurrentItem = (row, col) => {
    const location = {
      "11": 1,
      "12": 2,
      "13": 3,
      "21": 4,
      "22": 5,
      "23": 6,
      "31": 7,
      "32": 8,
      "33": 9
    };

    return location[`${row}${col}`];
  };

  handleClick = i => {
    this.doBold = false;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = this.state.sortDir
      ? history[history.length - 1]
      : history[0];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";

    const stepNumberValue = history.length;
    const [row, col] = this.getRowCol(i);
    const newHistory = history.concat([
      {
        squares: squares,
        row: row,
        col: col
      }
    ]);

    this.setState({
      history: newHistory,
      stepNumber: stepNumberValue,
      xIsNext: !this.state.xIsNext
    });
  };

  jumpTo = step => {
    this.doBold = true;
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  };

  sortMoves = () => {
    const reverseHistory = Object.assign([], this.state.history);
    reverseHistory.reverse();
    this.setState({
      sortDir: !this.state.sortDir,
      history: reverseHistory
    });
  };

  render() {
    const history = this.state.history;

    console.log(history);

    const current = this.state.sortDir
      ? history[this.state.stepNumber]
      : history[0];
    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const currentSelected = this.doBold
      ? this.getCurrentItem(current.row, current.col)
      : null;

    const moves = history.map((step, move) => {
      const desc = move
        ? `Go to move #${
            this.state.sortDir ? move : history.length - move
          }. Row: ${step.row} Col:${step.col}`
        : "Go to game start";
      return (
        <li key={move}>
          <button
            onClick={() =>
              this.jumpTo(this.state.sortDir ? move : history.length - move)
            }
          >
            {desc}
          </button>
        </li>
      );
    });

    return (
      <div className="game">
        {/* <div className="game-board">
          <Board
            currentSelected={currentSelected}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            rows={3}
          />
        </div>
        <div className="game-info">
          <button onClick={this.sortMoves}>
            {this.state.sortDir ? "DESC" : "ASC"}
          </button>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div> */}
        <Suspense fallback={<div>Loading...</div>}>
          <Headline title="This is headline." />
        </Suspense>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const App = Game;

export default App;
