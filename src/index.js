import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={'square' + (props.winningSquare ? ' winner' : '')}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        onClick={() => this.props.onClick(i)}
        value={this.props.squares[i]}
        winningSquare={this.props.row && this.props.row.includes(i)}
      />
    );
  }

  render() {
    const rows = [...Array(3).keys()]
      .map((i) => <div
        className='board-row'
        key={i}
      >{
        [...Array(3).keys()]
        .map((j) => this.renderSquare(3 * i + j))
      }</div>);
    return (
      <div>{rows}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        idx: -1,
      }],
      isAscending: true,
      moveNumber: 0,
      xIsNext: true,
    };
  }

  changeOrder() {
    this.setState({
      isAscending: !this.state.isAscending,
    });
  }

  getMoves() {
    const moves = this.state.history.map((data, move) => {
      const text = 'Go to ' + (move ? 'move #' + move + ' at (' + this.idxToLoc(data.idx) + ')': 'game start');
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={move === this.state.moveNumber ? 'move' : undefined}
          >
            {text}
          </button>
        </li>
      );
    });

    return this.state.isAscending ? moves : moves.reverse();
  }

  getPlayer() {
    return this.state.xIsNext ? 'X' : 'O';
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.moveNumber + 1);
    const squares = history[history.length - 1].squares.slice();
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    squares[i] = this.getPlayer();
    this.setState({
      history: history.concat([{
        squares: squares,
        idx: i,
      }]),
      moveNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  idxToLoc(i) {
    return [i % 3, Math.floor(i / 3)].map(x => x + 1);
  }

  jumpTo(move) {
    this.setState({
      moveNumber: move,
      xIsNext: !(move % 2),
    });
  }

  render() {
    const history = this.state.history;
    const squares = history[this.state.moveNumber].squares;
    const winner = calculateWinner(squares);

    const status = winner ?
      'Winner ' + winner.name :
      (this.state.moveNumber === 9 ?
        'Draw!' :
        'Next player: ' + this.getPlayer());

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
            row={winner ? winner.row: undefined}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.getMoves()}</ol>
          <div><button onClick={() => this.changeOrder()}>Change Order</button></div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {name: squares[a], row: [a, b, c]};
    }
  }
  return null;
}