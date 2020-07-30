'use strict';

// class FormCode extends React.Component {
//   render() {

//     return <button onClick={() => this.setState({ liked: true })}>Like</button>;
//   }
// }

class FormCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
    };
  }
  onChange = (e) => {
    const value = e.target.value;
    this.setState({
      code: value,
    });
  };
  onClick = (e) => {
    e.preventDefault();
    console.log('click ', this.state.code);
  };

  render() {
    const { code } = this.state;
    return (
      <div>
        <input value={code} type="text" name="code" onChange={this.onChange} />
        <button onClick={this.onClick} />
      </div>
    );
  }
}

ReactDOM.render(<FormCode />, document.getElementById('react_container'));
console.log('guty');
